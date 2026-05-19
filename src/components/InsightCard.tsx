import { LucideIcon } from 'lucide-react';

type InsightCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  color: string;
  description: string;
  className?: string;
};

export default function InsightCard({ icon: Icon, title, value, color, description, className = '' }: InsightCardProps) {
  return (
    <div className={`flex flex-col justify-center py-4 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-slate-500" />
        <p className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">{title}</p>
      </div>
      <h3 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter capitalize mb-2">{value}</h3>
      <p className="text-sm text-slate-400 font-medium">{description}</p>
    </div>
  );
}
