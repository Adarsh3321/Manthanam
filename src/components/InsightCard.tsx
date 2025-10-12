import { LucideIcon } from 'lucide-react';

type InsightCardProps = {
  icon: LucideIcon;
  title: string;
  value: string;
  color: string;
  description: string;
};

export default function InsightCard({ icon: Icon, title, value, color, description }: InsightCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1 capitalize">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
