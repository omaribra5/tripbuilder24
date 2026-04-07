import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function Autocomplete({ value, onChange, onSelect, placeholder, fetchSuggestions, renderItem, className }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange?.(val);

    clearTimeout(debounceRef.current);
    if (val.length < 2) { setSuggestions([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await fetchSuggestions(val);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 350);
  };

  const handleSelect = (item) => {
    const label = renderItem(item).label;
    setQuery(label);
    setSuggestions([]);
    setOpen(false);
    onSelect(item);
  };

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      <div className="relative">
        <Input
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item, i) => {
            const { label, sublabel } = renderItem(item);
            return (
              <button
                key={i}
                className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b last:border-b-0 border-gray-100"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(item); }}
              >
                <div className="text-sm font-medium text-gray-900">{label}</div>
                {sublabel && <div className="text-xs text-muted-foreground">{sublabel}</div>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}