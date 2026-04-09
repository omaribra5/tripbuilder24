import { useState, useRef, useEffect } from 'react';
import { Euro, Check, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF'];

export default function ActivityExpenseButton({ actName, expenses = [], currency = 'EUR', onSave }) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [cur, setCur] = useState(currency);
  const [note, setNote] = useState('');
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const total = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  const handleOpen = (e) => {
    e.stopPropagation();
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!e.target.closest('[data-expense-popup]') && !e.target.closest('[data-expense-btn]')) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!amount) return;
    const entry = { amount: parseFloat(amount), currency: cur, note, date: new Date().toISOString().split('T')[0], label: actName };
    onSave([...expenses, entry]);
    setAmount(''); setNote(''); setOpen(false);
  };

  return (
    <>
      <button
        ref={btnRef}
        data-expense-btn
        onClick={handleOpen}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
          total > 0
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Euro className="w-3 h-3" />
        {total > 0 ? `${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}` : t(language, 'activity_expense_btn')}
      </button>

      {open && createPortal(
        <div
          data-expense-popup
          style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="bg-white border rounded-2xl shadow-2xl p-3 min-w-[250px] space-y-2"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-bold text-gray-700 truncate">💶 {actName}</p>
          <div className="flex gap-1.5">
            <input
              type="number"
              min="0"
              step="0.01"
              autoFocus
              className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder={t(language, 'activity_expense_amount')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd(e)}
            />
            <select
              className="border rounded-lg px-1.5 py-1.5 text-sm focus:outline-none"
              value={cur}
              onChange={(e) => setCur(e.target.value)}
            >
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <input
            className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder={t(language, 'activity_expense_note')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {expenses.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {expenses.length} {t(language, 'activity_expense_count')} · {t(language, 'activity_expense_total')}: {total.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg py-1.5 hover:bg-indigo-700 flex items-center justify-center gap-1"
            >
              <Check className="w-3 h-3" /> {t(language, 'activity_expense_add')}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="bg-gray-100 text-gray-600 text-xs rounded-lg px-3 py-1.5 hover:bg-gray-200"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}