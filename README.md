# ClinicalAI — Clinical Lab Results Analyzer

Explainable AI-powered laboratory result analysis built with React, FastAPI, MCP, LangChain, and Google Gemini.

ClinicalAI is a full-stack GenAI application that analyzes laboratory test results, classifies them into **Normal, Warning, or Critical** severity levels, prioritizes results by severity, and generates clear AI-powered explanations with suggested next steps.

The system combines **deterministic clinical reference-range classification** with **generative AI explanations**, keeping the severity decision transparent while using an LLM where it adds the most value.

## ✨ Overview


<img width="831" height="500" alt="Screenshot 2026-05-16 171602" src="https://github.com/user-attachments/assets/7ca5b822-8719-4021-8ed0-3b5f367b0fdb" />


Laboratory reports often contain multiple measurements that can be difficult to interpret quickly.

ClinicalAI provides a structured workflow:

Laboratory Results
        │
        ▼
   FastAPI Backend
        │
        ▼
   MCP Reference Lookup
        │
        ▼
Deterministic Classification
        │
        ├───────────────┐
        ▼               │
    Severity            │
  Normal/Warning/       │
     Critical           │
        │               │
        ▼               │
     Priority           │
      Routing           │
        │               │
        ▼               │
   MCP Lab Context      │
        │               │
        ▼               │
   Google Gemini        │
        │               │
        ▼               │
Explanation + Next Step │
        │               │
        └───────┬───────┘
                ▼
          React Frontend


The application supports both:
<img width="1255" height="836" alt="Screenshot 2026-09-02 155301" src="https://github.com/user-attachments/assets/72f3ab66-3525-4e99-b20e-224db57066e4" />
<img width="1255" height="836" alt="Screenshot 2026-09-02 155301" src="https://github.com/user-attachments/assets/11927018-e0fe-49c9-a47a-e986d28653e6" />

<img width="1485" height="792" alt="Screenshot 2026-09-02 155120" src="https://github.com/user-attachments/assets/3379e31d-9a7d-4a79-8e8d-f08496ad602d" />

* Manual laboratory result entry
* CSV laboratory result upload

## 🎯 Key Features

### Laboratory Analysis

* Analyze multiple laboratory results in a single request
* Compare numeric values against configured reference ranges
* Classify results as:

  * 🔴 Critical
  * 🟡 Warning
  * 🟢 Normal
* Prioritize results using severity-based routing
* Generate an AI explanation for every analyzed result
* Generate a suggested next step for every result

### AI & Explainability

* Google Gemini-powered explanations
* LangChain integration for LLM orchestration
* Structured AI output using Pydantic schemas
* AI does not determine the severity
* Deterministic application logic determines severity
* AI explains the already-classified result
* Prompt constraints prevent the model from changing the assigned severity
* Patient-friendly explanations
* Medical safety disclaimer included in the interface

### MCP Integration

<img width="536" height="741" alt="Screenshot 2026-09-02 155348" src="https://github.com/user-attachments/assets/c2d38851-a0f4-4426-b660-4cd738b93257" />
<img width="1255" height="836" alt="Screenshot 2026-09-02 155301" src="https://github.com/user-attachments/assets/249c88c8-4fc1-4fdc-ad50-f20c1b5eb4be" />


The backend uses an MCP server for laboratory-related tool communication.

Implemented MCP tools include:

* `lookup_reference_range`
* `create_lab_context`

The MCP layer provides the agent with structured laboratory reference information and context.

### Frontend

* Responsive React interface
* Dark grey professional UI
* Severity-based visual indicators
* Summary dashboard
* Result filtering
* Expandable result cards
* AI explanation panels
* CSV upload
* Loading states
* Error handling
* Mobile-responsive layout
* Smooth navigation and UI animations


## 🏗️ Architecture

ClinicalAI separates **decision logic** from **generative AI**.

### High-Level Architecture

<img width="536" height="741" alt="Screenshot 2026-09-02 155348" src="https://github.com/user-attachments/assets/9ecd1a38-2eb3-4af5-8ac6-ec82d599315c" />


┌─────────────────────────────────────────────────────┐
│                    React Frontend                   │
│                                                     │
│  Manual Input ───────┐                              │
│                      │                              │
│  CSV Upload ─────────┤                              │
│                      ▼                              │
│               API Service Layer                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       │ HTTP
                       ▼
┌─────────────────────────────────────────────────────┐
│                  FastAPI Backend                    │
│                                                     │
│                 API Routes                          │
│                      │                              │
│                      ▼                              │
│               Analysis Agent                        │
│                      │                              │
│          ┌───────────┴───────────┐                  │
│          ▼                       ▼                  │
│   MCP Reference Lookup     Deterministic Classifier │
│          │                       │                  │
│          ▼                       ▼                  │
│      Dataset                 Severity               │
│      Reference              Classification          │
│                                  │                  │
│                                  ▼                  │
│                           Severity Router            │
│                                  │                  │
│                                  ▼                  │
│                            MCP Context              │
│                                  │                  │
│                                  ▼                  │
│                         LangChain + Gemini          │
│                                  │                  │
│                                  ▼                  │
│                      Explanation + Next Step       │
└─────────────────────────────────────────────────────┘


## 🧠 Agent Workflow

The analysis pipeline follows three primary stages:

### 1. Classify

The application retrieves the applicable laboratory reference range and compares the measured value against it.

Classification is deterministic:

```text
Value
  │
  ├── Critical threshold crossed
  │        └──► Critical
  │
  ├── Outside reference range
  │        └──► Warning
  │
  └── Within reference range
           └──► Normal
```

This separation is intentional: the LLM is not responsible for deciding whether a laboratory result is Critical, Warning, or Normal.

---

### 2. Route

Results are prioritized before AI explanation:


Critical
   ↓
Warning
   ↓
Normal


This allows the frontend to surface the most important results first.

The backend also generates a summary containing:

```json
{
  "total": 3,
  "critical": 1,
  "warning": 1,
  "normal": 1
}
```

---

### 3. Explain

Once classification and routing are complete, the system sends the structured laboratory context to Google Gemini through LangChain.

Gemini generates:

```text
Explanation
+
Suggested Next Step
```

The AI is instructed to:

* Preserve the application-assigned severity
* Avoid diagnosing the patient
* Avoid inventing reference ranges
* Avoid inventing patient information
* Explain results in understandable language
* Provide an appropriate next step
* Communicate limitations clearly

---

# 🔌 MCP Architecture

ClinicalAI includes an MCP server responsible for laboratory-related tool communication.

### MCP Tools

#### `lookup_reference_range`

Retrieves structured reference information for a laboratory test.

Example:

```json
{
  "test_name": "Ferritin",
  "found": true,
  "source": "kaggle_dataset",
  "reference_range": "15-150",
  "unit": "ug/L",
  "minimum": 15,
  "maximum": 150,
  "is_numeric": true
}
```

#### `create_lab_context`

Builds structured context that can be supplied to the AI explanation layer.

Example:

```json
{
  "test_name": "Ferritin",
  "measured_value": 10,
  "unit": "ug/L",
  "reference_range": "15-150",
  "severity": "Warning",
  "classification": "Below reference range"
}
```

### Why MCP?

MCP creates a clear boundary between the analysis agent and laboratory-related tools.

This makes the architecture easier to extend with additional tools or data sources in the future without coupling the AI layer directly to every implementation detail.

---

# 📊 Dataset

The project uses the required Kaggle dataset:

**Laboratory Test Results – Anonymized Dataset**

The dataset is used as the primary reference source for supported laboratory test ranges.

The integrated dataset contains **27 laboratory tests** and includes fields such as:

* Test name
* Result
* Unit
* Reference range
* Minimum reference
* Maximum reference
* Status
* Comment
* Recommended follow-up

The application loads the dataset through a dedicated reference service and exposes the reference information through MCP.

---

# 🧪 Classification Strategy

The system uses deterministic reference-range comparison rather than asking the LLM to make the severity decision.

For numeric tests:

                 ┌────────────────────┐
                 │ Laboratory Result  │
                 └─────────┬──────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ Reference Range    │
                 └─────────┬──────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
       Critical Threshold?      Within Range?
                │                     │
              Yes                    Yes
                │                     │
                ▼                     ▼
            Critical               Normal
                                     
                    No
                     │
                     ▼
                   Warning


The application-defined critical thresholds are implementation thresholds for this demonstration and should not be interpreted as universal clinical diagnostic rules.

---

# 🤖 AI Explanation Layer

The AI layer uses:

* **Google Gemini**
* **LangChain**
* **Pydantic structured output**

The response schema is intentionally small and predictable:

```python
class AIExplanation(BaseModel):
    explanation: str
    next_step: str
```

This allows the frontend to consistently render:

1. What the result means
2. What the user can consider doing next

The severity remains controlled by deterministic backend logic.

---

# 🖥️ Frontend

The frontend is built with:

* React
* JavaScript
* Tailwind CSS
* Lucide React

### Main UI Sections

```text
Navbar
   │
Hero Section
   │
Laboratory Input
   ├── Manual Entry
   └── CSV Upload
   │
Summary Cards
   ├── Critical
   ├── Warning
   └── Normal
   │
Results Display
   │
Result Cards
   ├── Measurement
   ├── Reference Range
   ├── Classification
   ├── AI Explanation
   └── Suggested Next Step
   │
Explainable AI Section
   │
Footer
```

The interface is designed to remain usable across desktop, tablet, and mobile screen sizes.

---

# 🔗 API

## Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "clinical-lab-analyzer"
}
```

---

## Analyze Laboratory Results

```http
POST /analyze_labs
```

Request:

```json
{
  "results": [
    {
      "test_name": "Hemoglobin",
      "value": 10,
      "unit": "g/dL"
    },
    {
      "test_name": "Ferritin",
      "value": 10,
      "unit": "ug/L"
    }
  ]
}
```

Response:

```json
{
  "results": [
    {
      "test_name": "Hemoglobin",
      "value": 10,
      "unit": "g/dL",
      "reference_range": "12-15",
      "severity": "Warning",
      "classification": "Below reference range",
      "explanation": "...",
      "next_step": "..."
    }
  ],
  "summary": {
    "total": 1,
    "critical": 0,
    "warning": 1,
    "normal": 0
  }
}
```

---

## Analyze CSV

```http
POST /analyze_csv
```

The endpoint accepts a CSV file containing:

```csv
test_name,value,unit
Hemoglobin,14,g/dL
Ferritin,10,ug/L
Creatinine,0.9,mg/dL
```

The backend validates the CSV, converts it into the internal laboratory request model, and sends it through the same analysis pipeline.

---

# 📁 Project Structure

```text
clinical-lab-analyzer/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   ├── gemini.py
│   │   │   ├── prompts.py
│   │   │   └── schemas.py
│   │   │
│   │   ├── api/
│   │   │   └── routes.py
│   │   │
│   │   ├── mcp/
│   │   │   ├── client.py
│   │   │   ├── server.py
│   │   │   └── tools.py
│   │   │
│   │   ├── models/
│   │   │   ├── lab.py
│   │   │   └── response.py
│   │   │
│   │   ├── services/
│   │   │   ├── agent.py
│   │   │   ├── classifier.py
│   │   │   ├── csv_parser.py
│   │   │   ├── dataset_reference.py
│   │   │   └── router.py
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── test_data/
│   │   ├── normal.csv
│   │   ├── warning.csv
│   │   ├── critical.csv
│   │   └── kaggle/
│   │       └── lab_test_results_public.csv
│   │
│   ├── tests/
│   │   ├── test_classifier.py
│   │   ├── test_csv_parser.py
│   │   └── test_mcp.py
│   │
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# ⚙️ Tech Stack

| Layer              | Technology          |
| ------------------ | ------------------- |
| Frontend           | React               |
| Styling            | Tailwind CSS        |
| Icons              | Lucide React        |
| Backend            | FastAPI             |
| Validation         | Pydantic            |
| AI Framework       | LangChain           |
| LLM                | Google Gemini       |
| Agent Tools        | MCP                 |
| Dataset Processing | Pandas              |
| Testing            | Pytest              |
| API Server         | Uvicorn             |
| Language           | Python + JavaScript |

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Python 3.10+
* Node.js 18+
* npm
* A Google Gemini API key

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd clinical-lab-analyzer
```

---

## 2. Backend Setup

```bash
cd backend
```

Create a virtual environment:

### Windows

```powershell
python -m venv venv
.\venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Gemini

Create:

```text
backend/.env
```

Add:

```env
GEMINI_API_KEY=your_gemini_api_key
```

> **Never commit `.env` or expose your API key publicly.**

---

## 4. Start the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/health
```

---

## 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

---

# 🧪 Testing

The project includes backend tests covering:

### Classification

* Normal laboratory result
* Warning laboratory result
* Critical laboratory result

### MCP

* Dataset reference lookup
* Unknown test handling

### CSV Parser

* Valid CSV
* Empty CSV
* Missing required columns
* Non-numeric values

Run:

```bash
cd backend
pytest -q
```

---

## 🧬 End-to-End Test Scenarios

Three synthetic CSV files are included for demonstration:

### Normal

```text
test_data/normal.csv
```

Expected:

```text
Normal results
```

### Warning

```text
test_data/warning.csv
```

Expected:

```text
Warning results
```

### Critical

```text
test_data/critical.csv
```

Expected:

```text
Critical results
```

These files are synthetic demonstration inputs and are **not medical guidance**.

---

# 🔐 Safety & Limitations

ClinicalAI is an AI-assisted laboratory result interpretation demonstration.

It is **not a medical diagnostic system**.

The application:

* Does not diagnose diseases
* Does not replace healthcare professionals
* Does not determine treatment
* Does not use the LLM to make the primary severity decision
* Uses configured reference ranges and application-defined demonstration thresholds
* Provides informational explanations and suggested follow-up steps

Clinical decisions should always be made by an appropriately qualified healthcare professional.

---

# 🔮 Future Improvements

Potential production extensions include:

* Authentication and role-based access
* Persistent patient/report history
* PDF laboratory report extraction
* OCR for scanned reports
* Additional laboratory datasets
* More robust reference-range normalization
* Patient-specific reference ranges
* Audit logging
* Model observability and tracing
* Streaming AI explanations
* Cloud deployment
* Automated CI/CD
* Comprehensive integration and end-to-end testing
* Multi-language explanations

---

# 📌 Design Principles

ClinicalAI was designed around four principles:

### 01 — Deterministic First

Safety-relevant severity classification is handled by explicit application logic rather than delegated entirely to an LLM.

### 02 — AI Where It Adds Value

Generative AI is used for natural-language explanation and suggested next steps.

### 03 — Tool-Based Context

Laboratory reference information is exposed through MCP tools rather than tightly coupling the AI layer to the underlying dataset implementation.

### 04 — Explainability

Every analyzed result is presented with its measured value, reference range, classification, AI explanation, and suggested next step.

---

# 👨‍💻 Development Workflow

The project was developed incrementally with separate milestones for:

```text
Frontend
   ↓
Deterministic Classification
   ↓
MCP Integration
   ↓
Dataset Integration
   ↓
Gemini + LangChain
   ↓
CSV Ingestion
   ↓
Testing
   ↓
Full-Stack Integration
   ↓
Final Documentation
```

Each major implementation milestone was committed separately to maintain a clear development history.

---

# ⚠️ Disclaimer

**ClinicalAI is built for demonstration and educational purposes only.**

Laboratory reference ranges and application-defined severity thresholds may vary by laboratory, methodology, population, and clinical context. AI-generated explanations should not be treated as medical advice or diagnosis.

---

## Built With

**React · FastAPI · MCP · LangChain · Google Gemini · Pandas · Pydantic · Tailwind CSS**

---

### Project Status

**Complete — ready for demonstration and evaluation.**
