type FilterProps = {
    value: string;
    onChange: (value: string) => void;
  };
  
  export default function Filter({ value, onChange }: FilterProps) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      >
        <option value="All">All</option>
        <option value="Book">Book</option>
        <option value="DVD">DVD</option>
        <option value="CD">CD</option>
        <option value="Magazine">Magazine</option>
      </select>
    );
  }