export default function ModelInfoPanel({ language, predictionCount }) {
  return (
    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
      <p className="font-semibold text-gray-800 mb-2">⚙️ Model Info</p>
      <div className="grid grid-cols-2 gap-y-1">
        <span>Architecture</span>      <span className="text-gray-800 font-medium">2-Layer LSTM</span>
        <span>Embedding dim</span>     <span className="text-gray-800 font-medium">256</span>
        <span>Hidden dim</span>        <span className="text-gray-800 font-medium">512</span>
        <span>Sequence length</span>   <span className="text-gray-800 font-medium">10 tokens</span>
        <span>Active language</span>   <span className="text-gray-800 font-medium capitalize">
                                         {language === "roman_urdu" ? "Roman Urdu" : "English"}
                                       </span>
        <span>Predictions made</span>  <span className="text-gray-800 font-medium">{predictionCount}</span>
      </div>
    </div>
  );
}