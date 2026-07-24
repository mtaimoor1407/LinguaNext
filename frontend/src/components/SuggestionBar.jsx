export default function SuggestionBar({ suggestions, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex gap-2 mt-4">
        {[1, 2, 3].map(i => (
          <div key={i}
            className="h-10 rounded-xl bg-white/10 animate-pulse"
            style={{ width: `${60 + i * 15}px` }}
          />
        ))}
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {suggestions.map((word, i) => (
        <button
          key={i}
          onClick={() => onSelect(word)}
          style={{
            animationDelay: `${i * 60}ms`,
            animationFillMode: "both"
          }}
          className="animate-bounce-in px-5 py-2 rounded-xl text-sm font-medium
                     bg-white/10 text-white border border-white/20
                     hover:bg-violet-600 hover:border-violet-400
                     transition-all duration-150 backdrop-blur-sm"
        >
          {word}
        </button>
      ))}
    </div>
  );
}