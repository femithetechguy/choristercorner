interface StatBoxProps {
  icon: string;
  number: string;
  label: string;
}

export default function StatBox({ icon, number, label }: StatBoxProps) {
  return (
    <div className="bg-white rounded-lg p-6 text-center shadow hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <div className="text-3xl font-bold text-purple-600">{number}</div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  );
}
