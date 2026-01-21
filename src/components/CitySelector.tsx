import { useState, useMemo } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import citiesData from '../data/cities.json';

interface City {
  name: string;
  postalCode: string;
  timezone: string;
  country: string;
}

interface CitySelectorProps {
  value?: string;
  timezone?: string;
  country?: string;
  onChange: (city: string, timezone: string, country: string) => void;
}

export function CitySelector({ value, timezone, country, onChange }: CitySelectorProps) {
  const [search, setSearch] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const cities = citiesData as City[];

  const filteredCities = useMemo(() => {
    if (!search) return cities.slice(0, 10);

    const searchLower = search.toLowerCase();
    return cities
      .filter((city) => {
        const nameMatch = city.name.toLowerCase().includes(searchLower);
        const postalMatch = city.postalCode.includes(search);
        return nameMatch || postalMatch;
      })
      .slice(0, 10);
  }, [search, cities]);

  const handleSelect = (city: City) => {
    setSearch(city.name);
    onChange(city.name, city.timezone, city.country);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCities.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredCities[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Ville
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une ville..."
          className="w-full pl-10 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
        />
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredCities.map((city, index) => (
            <button
              key={`${city.name}-${city.postalCode}`}
              type="button"
              onClick={() => handleSelect(city)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                index === selectedIndex ? 'bg-gray-700' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === filteredCities.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{city.name}</div>
                  <div className="text-sm text-gray-400">
                    {city.postalCode} • {city.country}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{city.timezone}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {timezone && (
        <div className="mt-2 text-sm text-gray-400">
          Fuseau horaire: <span className="text-yellow-500">{timezone}</span>
        </div>
      )}
    </div>
  );
}
