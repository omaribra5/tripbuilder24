import { useState } from 'react';
import { LANGUAGES } from '@/lib/i18n';
import { useLanguage } from '@/lib/LanguageContext';
import { ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, chooseLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors duration-150 shadow-sm"
      >
        <span className="text-base leading-none">{current?.flag}</span>
        <span className="hidden sm:inline">{current?.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] bg-white rounded-xl shadow-lg border border-slate-200 z-50 min-w-[160px] overflow-hidden py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { chooseLanguage(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors duration-100 ${
                lang.code === language ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} from '@/lib/i18n';
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
        className="flex items-center gap-2 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-md rounded-full px-4 py-2 text-sm font-semibold transition-all"
      >
        <Globe className="w-4 h-4 text-indigo-600" />
        <span className="text-base">{current?.flag}</span>
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