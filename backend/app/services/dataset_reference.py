from pathlib import Path
from typing import Any

import pandas as pd


# Resolve the repository root from this file:
#
# backend/app/services/dataset_reference.py
#       ↑
# parents[3] → clinical-lab-analyzer
#
PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_PATH = (
    PROJECT_ROOT
    / "test_data"
    / "kaggle"
    / "lab_test_results_public.csv"
)


class DatasetReferenceService:
    """
    Loads laboratory reference information from the supplied
    Kaggle laboratory dataset.

    The dataset is used as a reference-data source.
    The application's deterministic classifier remains responsible
    for assigning severity.
    """

    def __init__(self, dataset_path: Path = DATASET_PATH):
        self.dataset_path = dataset_path
        self._references: dict[str, dict[str, Any]] = {}

        self._load_dataset()

    @staticmethod
    def _normalize_test_name(test_name: str) -> str:
        return " ".join(
            test_name.strip().lower().split()
        )

    def _load_dataset(self) -> None:
        """
        Load and index the dataset by normalized test name.
        """

        if not self.dataset_path.exists():
            raise FileNotFoundError(
                f"Laboratory dataset not found: "
                f"{self.dataset_path}"
            )

        dataframe = pd.read_csv(self.dataset_path)

        required_columns = {
            "Test_Name",
            "Result",
            "Unit",
            "Reference_Range",
            "Min_Reference",
            "Max_Reference",
        }

        missing_columns = (
            required_columns - set(dataframe.columns)
        )

        if missing_columns:
            raise ValueError(
                "Laboratory dataset is missing required columns: "
                + ", ".join(sorted(missing_columns))
            )

        for _, row in dataframe.iterrows():
            test_name = str(row["Test_Name"]).strip()

            if not test_name:
                continue

            normalized_name = self._normalize_test_name(
                test_name
            )

            minimum = row["Min_Reference"]
            maximum = row["Max_Reference"]

            self._references[normalized_name] = {
                "test_name": test_name,
                "unit": str(row["Unit"]).strip(),
                "reference_range": str(
                    row["Reference_Range"]
                ).strip(),
                "minimum": (
                    float(minimum)
                    if pd.notna(minimum)
                    else None
                ),
                "maximum": (
                    float(maximum)
                    if pd.notna(maximum)
                    else None
                ),
                "is_numeric": (
                    pd.notna(minimum)
                    and pd.notna(maximum)
                ),
            }

    def get_reference(
        self,
        test_name: str,
    ) -> dict[str, Any] | None:
        """
        Retrieve reference information for a test.
        """

        normalized_name = self._normalize_test_name(
            test_name
        )

        return self._references.get(normalized_name)

    def list_tests(self) -> list[str]:
        """
        Return all laboratory test names available
        in the dataset.
        """

        return [
            reference["test_name"]
            for reference in self._references.values()
        ]


dataset_reference_service = DatasetReferenceService()