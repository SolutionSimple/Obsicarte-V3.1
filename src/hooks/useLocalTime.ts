import { useState, useEffect } from 'react';

export function useLocalTime(timezone: string) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('fr-FR', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setTime(formatter.format(now));
      } catch (error) {
        console.error('Error formatting time:', error);
        setTime('--:--');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [timezone]);

  return time;
}
