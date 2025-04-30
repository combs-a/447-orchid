type AdvSearchOptions = {
    value: string;
    onChange: (value: string) => void;
  };
  
  export default function sort({ value, onChange }: AdvSearchOptions) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      >
        <option value="Sear">A-Z</option>
        <option value="Z-A">Z-A</option>
        <option value="Newest">Newest</option>
        <option value="Oldest">Oldest</option>
      </select>
    );
  }