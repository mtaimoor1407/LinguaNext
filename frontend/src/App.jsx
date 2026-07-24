import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TextInput from "./components/TextInput";
import SuggestionBar from "./components/SuggestionBar";

const API = "http://127.0.0.1:8000";

export default function App() {
  const [text, setText]               = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [language, setLanguage]       = useState("auto");
  const [temperature, setTemperature] = useState(1.0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [detectedLang, setDetectedLang] = useState(null);

  const isUrduMode = detectedLang === "roman_urdu" ||
                     (language === "roman_urdu" && detectedLang === null);

  const fetchPredictions = useCallback(async (inputText) => {
    if (!inputText.trim() || inputText.trim().split(" ").length < 2) {
      setSuggestions([]);
      setDetectedLang(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      let lang = language;
      if (language === "auto") {
        const res = await axios.post(`${API}/detect-language`, { text: inputText });
        lang = res.data.language;
        setDetectedLang(lang);
      }

      const res = await axios.post(`${API}/predict`, {
        text: inputText,
        language: lang,
        top_k: 3,
        temperature: parseFloat(temperature),
      });
      setSuggestions(res.data.predictions);
    } catch {
      setError("Could not reach the server. Make sure the backend is running.");
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [language, temperature]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPredictions(text), 500);
    return () => clearTimeout(timer);
  }, [text, fetchPredictions]);

  const handleSelect = (word) => {
    setText(prev => prev.trimEnd() + " " + word);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      handleSelect(suggestions[0]);
    }
  };

  const accent = isUrduMode ? "#F59E0B" : "#7C3AED";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
         style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)" }}>

      {/* Card */}
      <div className="w-full max-w-lg">

        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", color: "white" }}
              className="text-4xl font-bold tracking-tight">
            Lingua<span style={{ color: accent }} className="transition-colors duration-500">Next</span>
          </h1>
          <p className="text-white/40 text-sm mt-2 tracking-wide">
            Next word prediction · English & Roman Urdu
          </p>
        </div>

        {/* Language pill toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 gap-1">
            {["auto", "english", "roman_urdu"].map(lang => (
              <button
                key={lang}
                onClick={() => { setLanguage(lang); setDetectedLang(null); }}
                className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: language === lang ? accent : "transparent",
                  color: language === lang ? "white" : "rgba(255,255,255,0.4)",
                }}
              >
                {lang === "auto" ? "Auto" : lang === "english" ? "🇬🇧 English" : "🇵🇰 Roman Urdu"}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="relative rounded-2xl overflow-hidden"
             style={{ background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${text ? accent + "60" : "rgba(255,255,255,0.1)"}`,
                      transition: "border-color 0.3s" }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing here..."
            rows={4}
            className="w-full bg-transparent text-white placeholder-white/20
                       text-base p-5 resize-none focus:outline-none"
          />

          {/* Bottom bar inside card */}
          <div className="px-5 pb-4">
            <SuggestionBar
              suggestions={suggestions}
              onSelect={handleSelect}
              loading={loading}
            />
          </div>

          {/* Clear button */}
          {text && (
            <button
              onClick={() => { setText(""); setSuggestions([]); setDetectedLang(null); }}
              className="absolute top-3 right-3 text-white/20 hover:text-white/60
                         text-lg transition-colors leading-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab hint */}
        <p className="text-white/20 text-xs mt-2 text-center">
          Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/40">Tab</kbd> to accept first suggestion
        </p>

        {/* Detected language chip */}
        {detectedLang && language === "auto" && (
          <div className="flex justify-center mt-3">
            <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: accent + "20", color: accent }}>
              Detected: {detectedLang === "roman_urdu" ? "Roman Urdu" : "English"}
            </span>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20
                        rounded-xl px-4 py-3 text-center">
            {error}
          </p>
        )}

        {/* Advanced toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAdvanced(p => !p)}
            className="text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            {showAdvanced ? "Hide" : "Advanced"} {showAdvanced ? "▲" : "▼"}
          </button>

          {showAdvanced && (
            <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-4 text-left">
              <label className="text-xs text-white/40 font-medium block mb-2">
                Creativity — {parseFloat(temperature).toFixed(1)}
                <span className="ml-2 text-white/20">
                  (low = safe, high = creative)
                </span>
              </label>
              <input
                type="range" min="0.5" max="2.0" step="0.1"
                value={temperature}
                onChange={e => setTemperature(e.target.value)}
                className="w-full accent-violet-500"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}