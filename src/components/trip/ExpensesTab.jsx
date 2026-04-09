import { useState, useMemo } from 'react';
import { PlusCircle, Trash2, Wallet, TrendingUp, Tag, Calendar, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/LanguageContext';
import { t } from '@/lib/i18n';

const CATEGORY_KEYS = [
  { value: 'cibo', labelKey: 'cat_food', color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { value: 'trasporto', labelKey: 'cat_transport', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { value: 'alloggio', labelKey: 'cat_accommodation', color: 'bg-purple-50 text-purple-600 border-purple-200' },
  { value: 'attrazione', labelKey: 'cat_attraction', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { value: 'shopping', labelKey: 'cat_shopping', color: 'bg-pink-50 text-pink-600 border-pink-200' },
  { value: 'altro', labelKey: 'cat_other', color: 'bg-slate-50 text-slate-600 border-slate-200' },
];

const CURRENCIES = ['EUR', 'USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];

function AddExpenseForm({ onAdd, defaultCurrency, language }) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('altro');
  const [currency, setCurrency] = useState(defaultCurrency || 'EUR');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim() || !amount) return;
    onAdd({ id: Date.now().toString(), label: label.trim(), amount: parseFloat(amount), category, currency, date, note });
    setLabel(''); setAmount(''); setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        <PlusCircle className="w-4 h-4 text-indigo-500" /> {t(language, 'expense_add')}
      </h3>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          placeholder={t(language, 'expense_desc_placeholder')}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-28 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          placeholder={t(language, 'expense_amount_placeholder')}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          className="border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="flex gap-2 flex-wrap">
        {CATEGORY_KEYS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(c.value)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-150 ${c.color} ${category === c.value ? 'ring-2 ring-indigo-300 ring-offset-1' : ''}`}
          >
            {t(language, c.labelKey)}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="date"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          placeholder={t(language, 'expense_note_placeholder')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg transition-colors duration-150">
        {t(language, 'expense_add_btn')}
      </button>
    </form>
  );
}

function BudgetHeader({ trip, onSaveBudget, language }) {
  const [editing, setEditing] = useState(false);
  const [limit, setLimit] = useState(trip.budget_limit || '');
  const [currency, setCurrency] = useState(trip.budget_currency || 'EUR');

  const handleSave = () => {
    onSaveBudget(parseFloat(limit) || null, currency);
    setEditing(false);
  };

  return (
    <div className="bg-slate-900 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-400">{t(language, 'expense_trip_budget')}</span>
        <button onClick={() => setEditing(!editing)} className="text-slate-400 hover:text-white transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {editing ? (
        <div className="flex gap-2 items-center mt-2">
          <input
            type="number"
            min="0"
            className="flex-1 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none bg-white"
            placeholder={t(language, 'expense_total_budget_placeholder')}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <select
            className="rounded-lg px-2 py-1.5 text-sm text-slate-900 focus:outline-none bg-white"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={handleSave} className="bg-white/10 hover:bg-white/20 rounded-md p-1.5 transition-colors"><Check className="w-4 h-4" /></button>
          <button onClick={() => setEditing(false)} className="bg-white/10 hover:bg-white/20 rounded-md p-1.5 transition-colors"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <p className="text-2xl font-bold tracking-tight">
          {trip.budget_limit ? `${trip.budget_limit.toLocaleString()} ${trip.budget_currency || 'EUR'}` : t(language, 'expense_no_limit')}
        </p>
      )}
    </div>
  );
}

export default function ExpensesTab({ trip, onSave }) {
  const { language } = useLanguage();
  const currency = trip.budget_currency || 'EUR';

  const categoryStyle = (cat) => CATEGORY_KEYS.find((c) => c.value === cat)?.color || 'bg-gray-100 text-gray-700';
  const categoryLabel = (cat) => t(language, CATEGORY_KEYS.find((c) => c.value === cat)?.labelKey || 'cat_other');

  const activityExpenses = useMemo(() => {
    const raw = trip.activity_expenses || {};
    return Object.entries(raw).flatMap(([actName, entries]) =>
      (entries || []).map((e) => ({ ...e, label: e.label || actName, _source: 'activity', _actName: actName }))
    );
  }, [trip.activity_expenses]);

  const extraExpenses = trip.extra_expenses || [];

  const allExpenses = useMemo(() => {
    return [...activityExpenses.map((e) => ({ ...e, _type: 'activity' })), ...extraExpenses.map((e) => ({ ...e, _type: 'extra' }))].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [activityExpenses, extraExpenses]);

  const total = allExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const byCategory = CATEGORY_KEYS.map((cat) => ({
    ...cat,
    label: t(language, cat.labelKey),
    sum: allExpenses.filter((e) => e.category === cat.value).reduce((s, e) => s + (parseFloat(e.amount) || 0), 0),
  })).filter((c) => c.sum > 0);

  const handleAddExtra = (expense) => onSave({ extra_expenses: [...extraExpenses, expense] });
  const handleDeleteExtra = (id) => onSave({ extra_expenses: extraExpenses.filter((e) => e.id !== id) });
  const handleDeleteActivity = (actName, idx) => {
    const raw = trip.activity_expenses || {};
    const updated = { ...raw, [actName]: (raw[actName] || []).filter((_, i) => i !== idx) };
    onSave({ activity_expenses: updated });
  };
  const handleSaveBudget = (limit, cur) => onSave({ budget_limit: limit, budget_currency: cur });

  const remaining = trip.budget_limit ? trip.budget_limit - total : null;
  const progress = trip.budget_limit ? Math.min((total / trip.budget_limit) * 100, 100) : 0;

  return (
    <div className="space-y-4">
      <BudgetHeader trip={trip} onSaveBudget={handleSaveBudget} language={language} />

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Wallet className="w-3 h-3" /> {t(language, 'expense_total_spent')}</p>
          <p className="text-xl font-bold text-slate-900">{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</p>
          <p className="text-xs text-slate-400 mt-1">{allExpenses.length} {t(language, 'expense_entries')}</p>
        </div>
        <div className={`rounded-xl border p-4 ${remaining !== null && remaining < 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
          <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {t(language, 'expense_remaining')}</p>
          {remaining !== null ? (
            <>
              <p className={`text-xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
              </p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${progress > 90 ? 'bg-red-500' : progress > 70 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 mt-1">{t(language, 'expense_set_budget')}</p>
          )}
        </div>
      </div>

      {byCategory.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-indigo-500" /> {t(language, 'expense_by_category')}</h3>
          <div className="space-y-2">
            {byCategory.map((cat) => (
              <div key={cat.value} className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${cat.color} min-w-[90px]`}>{cat.label}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${total > 0 ? (cat.sum / total) * 100 : 0}%` }} />
                </div>
                <span className="text-sm font-semibold text-slate-800 w-20 text-right">{cat.sum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AddExpenseForm onAdd={handleAddExtra} defaultCurrency={currency} language={language} />

      {allExpenses.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-500" /> {t(language, 'expense_all')}</h3>
          <div className="space-y-1">
            {allExpenses.map((exp, i) => (
              <div key={exp.id || i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded border ${categoryStyle(exp.category)} shrink-0`}>{categoryLabel(exp.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{exp.label}</p>
                  {(exp.note || exp.date) && (
                    <p className="text-xs text-slate-400">{exp.date} {exp.note && `· ${exp.note}`}</p>
                  )}
                </div>
                <span className="font-semibold text-sm text-slate-900 shrink-0">{parseFloat(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {exp.currency || currency}</span>
                <button
                  onClick={() => exp._type === 'extra' ? handleDeleteExtra(exp.id) : handleDeleteActivity(exp._actName, (trip.activity_expenses?.[exp._actName] || []).findIndex((e) => e === trip.activity_expenses?.[exp._actName]?.find((x) => x.amount === exp.amount && x.date === exp.date && x.note === exp.note)))}
                  className="text-slate-300 hover:text-red-500 transition-colors duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}