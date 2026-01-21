import { Clock } from 'lucide-react';
import { useLocalTime } from '../hooks/useLocalTime';

interface LocalTimeDisplayProps {
  timezone: string;
  city: string;
}

export function LocalTimeDisplay({ timezone, city }: LocalTimeDisplayProps) {
  const time = useLocalTime(timezone);

  return (
    <div className="flex items-center space-x-2 text-gray-400 text-sm">
      <Clock className="w-4 h-4" />
      <span>
        Heure locale à {city}: <span className="text-yellow-500 font-medium">{time}</span>
      </span>
    </div>
  );
}
