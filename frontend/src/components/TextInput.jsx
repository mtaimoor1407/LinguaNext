export default function TextInput({ value, onChange, onKeyDown, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={4}
      className="w-full p-4 border border-gray-300 rounded-xl text-gray-800
                 text-base resize-none focus:outline-none focus:ring-2
                 focus:ring-indigo-400 focus:border-transparent transition-all
                 shadow-sm placeholder-gray-400"
    />
  );
}