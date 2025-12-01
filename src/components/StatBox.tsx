import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatBoxProps {
  icon: LucideIcon | string;
  number: string;
  label: string;
}

export default function StatBox({ icon, number, label }: StatBoxProps) {
  const IconComponent = typeof icon === 'string' ? null : icon;
  
  return (
    <div className="bg-white rounded-lg p-6 text-center shadow hover:shadow-lg transition">
      <div className="mb-4">
        {IconComponent ? (
          <IconComponent className="w-12 h-12 text-purple-600 mx-auto" />
        ) : (
          <div className="text-4xl">{icon as ReactNode}</div>
        )}
      </div>
      <div className="text-3xl font-bold text-purple-600">{number}</div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  );
}
