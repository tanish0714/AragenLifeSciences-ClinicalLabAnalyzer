from app.services.dataset_reference import dataset_reference_service


print("=== DATASET REFERENCE SERVICE ===")

print(
    "Available tests:",
    len(dataset_reference_service.list_tests()),
)

print("\nHemoglobin:")
print(
    dataset_reference_service.get_reference(
        "Hemoglobin"
    )
)

print("\nFerritin:")
print(
    dataset_reference_service.get_reference(
        "Ferritin"
    )
)

print("\nProtein (Strip):")
print(
    dataset_reference_service.get_reference(
        "Protein (Strip)"
    )
)