import { cn } from "@/lib/utils";

interface RadioItemProps {
  value: string;
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RadioItem({
  value,
  label,
  checked,
  onChange,
}: RadioItemProps) {
  return (
    <label className={cn(label && "flex items-center gap-3", "cursor-pointer")}>
      <div className="relative">
        <input
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`
              w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
              ${
                checked
                  ? "border-indigo-500 bg-white"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }
            `}
        >
          {checked && (
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 transition-all duration-200"></div>
          )}
        </div>
      </div>
      {label && (
        <span className="font-normal text-sm text-black leading-0">
          {label}
        </span>
      )}
    </label>
  );
}
