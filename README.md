# LinguaNext 🔤

> LSTM-powered next-word prediction for English and Roman Urdu.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0-orange)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![React](https://img.shields.io/badge/React-18-61DAFB)

## What It Does

LinguaNext predicts the next word as you type — supporting both English
and Roman Urdu, with automatic language detection. Click any suggestion
to append it and keep typing, just like a mobile keyboard.

## Why This Project

Most NLP demos only support English. Roman Urdu is spoken by 200M+
people but severely underrepresented in NLP tooling. This project
explores what sequence modeling looks like for a low-resource,
informal language written in Latin script.

## Architecture

User Input → Language Detection → LSTM Inference → Top-3 Predictions

- **Model:** Word-level LSTM (2 layers, 512 hidden dim, 256 embedding dim)
- **English:** Trained on WikiText-2 (~30K sentences)
- **Roman Urdu:** Trained on social media corpus (~13K sentences)
- **Sequence length:** 10 tokens
- **Training:** 25 epochs, Adam optimizer, CrossEntropy loss

## Tech Stack

| Layer     | Tech                    |
|-----------|-------------------------|
| Model     | PyTorch                 |
| Backend   | FastAPI + Uvicorn       |
| Frontend  | React + Tailwind CSS    |
| Language Detection | Rule-based + langdetect |

## Results

| Model      | Final Loss | Perplexity |
|------------|------------|------------|
| English    | 4.190      | 66.02      |
| Roman Urdu | 2.831      | 16.97      |

## Run Locally

### Backend
```bash
python -m venv venv
venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Project Structure
linguanext/
├── data/
│ ├── raw/ # Source corpora
│ └── processed/ # Saved vocabularies
├── notebooks/ # Training pipeline (documented)
├── model/
│ ├── saved/ # Trained .pth files
├── backend/ # FastAPI app
└── frontend/ # React UI

## What I Learned

- Why LSTMs struggle with long-range dependencies (motivation for Transformers)
- Word-level vs character-level tradeoffs
- Serving PyTorch models via REST API
- Handling low-resource, code-switched language data