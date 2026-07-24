import re
import json
import torch

def clean_text(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def load_vocab(path: str):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    word2idx = {k: int(v) for k, v in data["word2idx"].items()}
    idx2word = {int(k): v for k, v in data["idx2word"].items()}
    return word2idx, idx2word

def detect_language(text: str) -> str:
    roman_urdu_words = {
        "hai", "ho", "ka", "ki", "ke", "ko", "se", "ne", "kya",
        "nahi", "hain", "bhi", "aur", "yaar", "karo", "tha", "thi",
        "mera", "tera", "ap", "tum", "hum", "yeh", "woh", "ek",
        "main", "mein", "raha", "rahi", "gaya", "agar", "lekin"
    }
    words = set(text.lower().split())
    matches = words.intersection(roman_urdu_words)
    return "roman_urdu" if len(matches) >= 1 else "english"

def make_prediction(model, word2idx, idx2word, text, top_k=3, temperature=1.0,
                    seq_len=10, device="cpu"):
    model.eval()

    vocab_size = len(word2idx)
    unk_idx = word2idx.get("<UNK>", 1)
    pad_idx = word2idx.get("<PAD>", 0)

    cleaned = clean_text(text).split()
    tokens = []
    for w in cleaned:
        idx = word2idx.get(w, unk_idx)
        # safety clamp — index must be within vocab range
        idx = min(idx, vocab_size - 1)
        tokens.append(idx)

    if len(tokens) == 0:
        return ["the", "hai", "ka"][:top_k]

    if len(tokens) < seq_len:
        tokens = [pad_idx] * (seq_len - len(tokens)) + tokens
    else:
        tokens = tokens[-seq_len:]

    # final safety check on all token indices
    tokens = [min(t, vocab_size - 1) for t in tokens]

    x = torch.tensor([tokens], dtype=torch.long).to(device)

    with torch.no_grad():
        logits = model(x) / temperature
        probs  = torch.softmax(logits, dim=-1).squeeze()

    top_indices = torch.topk(probs, min(top_k * 5, vocab_size)).indices.tolist()

    results = []
    for i in top_indices:
        word = idx2word.get(i, "")
        if word and word not in ["<UNK>", "<PAD>", "unk", ""]:
            results.append(word)
        if len(results) == top_k:
            break

    fallback = ["the", "hai", "ka", "is", "ko"]
    while len(results) < top_k:
        results.append(fallback[len(results)])

    return results