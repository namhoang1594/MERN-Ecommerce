import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = Infinity,
  size = "md",
  disabled = false,
}: QuantitySelectorProps) {
  //Input validation with debounce
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    //Validate and update
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    //Ensure valid value on blur
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    }
  };

  const handleDecrease = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  const buttonSize = size === "sm" ? "w-8 h-8" : "w-9 h-9";
  const inputWidth = size === "sm" ? "w-12" : "w-16";

  return (
    <div className="flex items-center border rounded-md">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`${buttonSize} rounded-r-none border-r`}
        onClick={handleDecrease}
        disabled={disabled || value <= min}
      >
        <Minus className="w-4 h-4" />
      </Button>

      <input
        type="text"
        className={`${inputWidth} text-center border-0 focus:outline-none focus:ring-0 py-2`}
        value={inputValue}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
      />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={`${buttonSize} rounded-l-none border-l`}
        onClick={handleIncrease}
        disabled={disabled || value >= max}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}
