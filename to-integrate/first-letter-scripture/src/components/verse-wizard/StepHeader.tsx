interface StepHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export function StepHeader({ title, subtitle, breadcrumb }: StepHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <p className="text-xs text-[#999] font-medium mb-2">{breadcrumb}</p>
      )}
      <h2 className="text-xl font-bold text-[#1a1a1a] mb-1">{title}</h2>
      {subtitle && (
        <p className="text-sm text-[#666]">{subtitle}</p>
      )}
    </div>
  );
}
