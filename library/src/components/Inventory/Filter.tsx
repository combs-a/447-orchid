type FilterProps = {
    value: string;
    onChange: (value: string) => void;
  };
  
  export default function Filter({ value, onChange }: FilterProps) {
    const options = ["All", "Book", "DVD", "CD", "Magazine"]; // Use item type names directly
  
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-4 py-2 rounded"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }