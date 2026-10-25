# LinguaNext

**LSTM next-word prediction for English and Roman Urdu**, with a PyTorch model, FastAPI backend, and React interface. Type a phrase and select a suggested word to continue writing.

Roman Urdu is Urdu written using the Latin alphabet. This project explores word-level sequence modeling for informal text alongside an English model.

## Model and inference

| Setting | Value |
| --- | --- |
| Model | Word-level LSTM |
| Embedding dimension | 256 |
| Hidden dimension | 512 |
| Recurrent layers | 2 |
| Dropout | 0.3 in the backend model definition |
| Input context | Last 10 tokens, left-padded for shorter inputs |
| Default suggestions | Top 3 words |

The backend uses a small Roman Urdu keyword set for automatic language selection. The API also accepts an explicit language choice. The detector is a heuristic and can misclassify short or code-switched text.

## Recorded experiments

The original project documentation describes English training with WikiText-2 and Roman Urdu training with a social-media corpus, using Adam and cross-entropy loss for 25 epochs.

| Model | Recorded final loss | Recorded perplexity |
| --- | ---: | ---: |
| English | 4.190 | 66.02 |
| Roman Urdu | 2.831 | 16.97 |

The original result table does not identify whether these values come from training, validation, or held-out testing. They are preserved as recorded values and should not be presented as verified test performance until the evaluation split and calculation are documented.

Perplexities across different languages, corpora, and vocabularies are not directly comparable measures of model quality.

## Required artifacts

Before starting the backend, provide the matching trained weights and vocabularies at these paths:

- `model/saved/english_lstm.pth`
- `model/saved/roman_urdu_lstm.pth`
- `data/processed/english_vocab.json`
- `data/processed/roman_urdu_vocab.json`

The vocabulary JSON files must contain `word2idx` and `idx2word`. The backend currently constructs each model with a vocabulary size of 5,000, so model dimensions, vocabulary indices, and checkpoints must match.

The backend loads these artifacts at startup. It cannot start successfully without them. Refer to `notebooks/` for the training work; artifact acquisition and exact training-data provenance still need to be documented for full reproduction.

## Run locally

```bash
git clone https://github.com/mtaimoor1407/LinguaNext.git
cd LinguaNext
python -m venv .venv
```

Activate with `.venv\Scripts\activate` on Windows or `source .venv/bin/activate` on macOS/Linux.

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend URL printed by Vite, normally [localhost:5173](http://localhost:5173). Keep the backend running.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /` | Service status |
| `GET /health` | Health and inference device |
| `POST /predict` | Next-word suggestions |
| `POST /detect-language` | Rule-based language selection |

The backend uses CUDA when available and otherwise runs on CPU.

## Limitations and next evaluation

Word-level models struggle with unseen words and spelling variation. The current cleaning rule keeps Latin letters and spaces, removing punctuation, digits, and Native Urdu characters. Short context and keyword-based language selection limit long-range and mixed-language predictions.

A stronger evaluation should document corpus provenance, preprocessing, vocabulary construction, deduplication, data splits, and random seeds, then report held-out perplexity and top-1/top-3 accuracy against a simple n-gram baseline.

**Tools:** Python, PyTorch, FastAPI, React, Tailwind CSS.
