import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Book', 'Chapter', 'Verses', 'Review'];

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="relative px-4">
      {/* Progress Line */}
      <div className="absolute top-5 left-8 right-8 h-[2px] bg-border">
        <div 
          className="h-full bg-foreground transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="relative flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`
                relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                font-semibold text-xs transition-all duration-300
                ${step < currentStep
                  ? 'bg-foreground text-background'
                  : step === currentStep
                    ? 'bg-foreground text-background'
                    : 'bg-card border-2 border-border text-muted-foreground'
                }
              `}
            >
              {step < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                step
              )}
            </div>
            <span className={`
              text-[10px] font-medium mt-2 transition-colors duration-300 uppercase tracking-wider
              ${step === currentStep ? 'text-foreground' : 'text-muted-foreground'}
            `}>
              {stepLabels[step - 1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
