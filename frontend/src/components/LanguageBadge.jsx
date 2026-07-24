export default function LanguageBadge({ language }) {
  const isUrdu = language === "roman_urdu";
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
      isUrdu ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
    }`}>
      {isUrdu ? "🇵🇰 Roman Urdu" : "🇬🇧 English"}
    </span>
  );
}