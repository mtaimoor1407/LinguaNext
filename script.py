import json

# Fix English vocab — truncate to 5000
with open("data/processed/english_vocab.json", "r") as f:
    en_data = json.load(f)

en_word2idx = en_data["word2idx"]
# keep only entries with index < 5000
en_word2idx_fixed = {w: i for w, i in en_word2idx.items() if i < 5000}
en_idx2word_fixed = {str(i): w for w, i in en_word2idx_fixed.items()}

with open("data/processed/english_vocab.json", "w") as f:
    json.dump({"word2idx": en_word2idx_fixed, "idx2word": en_idx2word_fixed}, f)

print(f"English vocab fixed: {len(en_word2idx_fixed)} words")

# Fix Roman Urdu vocab — truncate to 5000
with open("data/processed/roman_urdu_vocab.json", "r") as f:
    ru_data = json.load(f)

ru_word2idx = ru_data["word2idx"]
ru_word2idx_fixed = {w: i for w, i in ru_word2idx.items() if i < 5000}
ru_idx2word_fixed = {str(i): w for w, i in ru_word2idx_fixed.items()}

with open("data/processed/roman_urdu_vocab.json", "w") as f:
    json.dump({"word2idx": ru_word2idx_fixed, "idx2word": ru_idx2word_fixed}, f)

print(f"Roman Urdu vocab fixed: {len(ru_word2idx_fixed)} words")