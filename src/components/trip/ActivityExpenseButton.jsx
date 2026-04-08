import { useState } from 'react';
import { Euro, Check, X } from 'lucide-react';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF'];

export default function ActivityExpenseButton({ actName, expenses = [], currency = 'EUR', onSave }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [cur, setCur] = useState(currency);
  const [note, setNote] = useState('');

  const total = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  const handleAdd = () => {
    if (!amount) return;
    const entry = { amount: parseFloat(amount), currency: cur, note, date: new Date().toISOString().split('T')[0], label: actName };
    onSave([...expenses, entry]);
    setAmount(''); setNote(''); setOpen(false);
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
          total > 0
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <Euro className="w-3 h-3" />
        {total > 0 ? `${total.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}` : 'Spesa'}
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border rounded-2xl shadow-xl p-3 min-w-[240px] space-y-2">
          <p className="text-xs font-bold text-gray-700 truncate">💶 {actName}</p>
          <div className="flex gap-1.5">
            <input
              type="number"
              min="0"
              step="0.01"
              autoFocus
              className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="Importo"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
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
            placeholder="Nota (opzionale)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {expenses.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {expenses.length} spesa/e · Totale: {total.toLocaleString('it-IT', { minimumFractionDigits: 2 })} {currency}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAdd} className="flex-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg py-1.5 hover:bg-indigo-700 flex items-center justify-center gap-1">
              <Check className="w-3 h-3" /> Aggiungi
            </button>
            <button onClick={() => setOpen(false)} className="bg-gray-100 text-gray-600 text-xs rounded-lg px-3 py-1.5 hover:bg-gray-200">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}