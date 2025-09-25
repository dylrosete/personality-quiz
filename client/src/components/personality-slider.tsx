import { Slider } from "@/components/ui/slider";

interface PersonalitySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  testId: string;
}

export function PersonalitySlider({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
  testId,
}: PersonalitySliderProps) {
  return (
    <div className="space-y-4" data-testid={`slider-${testId}`}>
      <div className="flex justify-between items-center">
        <label className="text-lg font-semibold">{label}</label>
        <span className="text-primary font-bold" data-testid={`value-${testId}`}>
          {value}
        </span>
      </div>
      <div className="slider-container">
        <Slider
          value={[value]}
          onValueChange={(newValue) => onChange(newValue[0])}
          max={100}
          min={0}
          step={1}
          className="w-full"
          data-testid={`input-${testId}`}
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );
}
