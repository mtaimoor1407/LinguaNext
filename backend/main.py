import torch
import sys
import os

sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from schemas import PredictRequest, PredictResponse
from utils import load_vocab, detect_language, make_prediction

# ── paths ──────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR  = os.path.join(BASE_DIR, "model", "saved")
VOCAB_DIR  = os.path.join(BASE_DIR, "data", "processed")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── model class (must match training definition) ───────────────
import torch.nn as nn

class LSTMLanguageModel(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_layers, dropout=0.3):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.lstm      = nn.LSTM(embed_dim, hidden_dim, num_layers,
                                  batch_first=True, dropout=dropout)
        self.dropout   = nn.Dropout(dropout)
        self.fc        = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x):
        embedded = self.dropout(self.embedding(x))
        out, _   = self.lstm(embedded)
        out      = self.dropout(out[:, -1, :])
        return self.fc(out)

# ── load vocabs ────────────────────────────────────────────────
en_word2idx, en_idx2word = load_vocab(os.path.join(VOCAB_DIR, "english_vocab.json"))
ru_word2idx, ru_idx2word = load_vocab(os.path.join(VOCAB_DIR, "roman_urdu_vocab.json"))

EN_VOCAB_SIZE = len(en_word2idx)
RU_VOCAB_SIZE = len(ru_word2idx)

print(f"English vocab size: {EN_VOCAB_SIZE}")
print(f"Roman Urdu vocab size: {RU_VOCAB_SIZE}")

# ── load models ────────────────────────────────────────────────
en_model = LSTMLanguageModel(5000, 256, 512, 2).to(DEVICE)
en_model.load_state_dict(torch.load(
    os.path.join(MODEL_DIR, "english_lstm.pth"), map_location=DEVICE))
en_model.eval()

ru_model = LSTMLanguageModel(5000, 256, 512, 2).to(DEVICE)
ru_model.load_state_dict(torch.load(
    os.path.join(MODEL_DIR, "roman_urdu_lstm.pth"), map_location=DEVICE))
ru_model.eval()

print("✅ Both models loaded.")

# ── FastAPI app ────────────────────────────────────────────────
app = FastAPI(title="LinguaNext API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── routes ─────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "LinguaNext API is running"}

@app.get("/health")
def health():
    return {"status": "ok", "device": str(DEVICE)}

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="Input text cannot be empty.")

    lang = req.language if req.language in ["english", "roman_urdu"] else detect_language(req.text)

    if lang == "english":
        words = make_prediction(en_model, en_word2idx, en_idx2word,
                                req.text, req.top_k, req.temperature, device=DEVICE)
    else:
        words = make_prediction(ru_model, ru_word2idx, ru_idx2word,
                                req.text, req.top_k, req.temperature, device=DEVICE)

    return PredictResponse(
        predictions=words,
        detected_language=lang,
        input_text=req.text
    )

@app.post("/detect-language")
def detect_lang(payload: dict):
    text = payload.get("text", "")
    return {"language": detect_language(text)}