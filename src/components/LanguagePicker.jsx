import { useState } from 'react';
import { LANGUAGES } from '@/lib/i18n';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguagePicker() {
  const { chooseLanguage } = useLanguage();
  const [selected, setSelected] = useState('it');

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
            <Globe className="w-7 h-7 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose your language</h2>
        <p className="text-sm text-muted-foreground mb-6">Scegli la lingua / Choisissez la langue</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-left font-medium text-sm ${
                selected === lang.code
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-indigo-300 text-gray-700'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        <Button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 text-base font-semibold"
          onClick={() => chooseLanguage(selected)}
        >
          Continua / Continue
        </Button>
      </div>
    </div>
  );
}