import { useState } from 'react';
import { LANGUAGES } from '@/lib/i18n';
import { useLanguage } from '@/lib/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, chooseLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-full px-3 py-1.5 text-sm font-medium transition-all"
      >
        <Globe className="w-4 h-4" />
        <span>{current?.flag}</span>
        <span>{current?.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border z-50 min-w-[160px] overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { chooseLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${
                lang.code === language ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}