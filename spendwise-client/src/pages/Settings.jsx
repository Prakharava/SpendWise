import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const DEFAULT_PREFS = {
  theme: 'system', // 'light' | 'dark' | 'system'
  currency: 'INR', // 'INR' | 'USD' | 'EUR'
  analyticsRange: '6m', // '3m' | '6m' | '12m' | 'all'
};

function applyTheme(theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = theme === 'dark' || (theme === 'system' && prefersDark);
  root.classList.toggle('dark', !!dark);
}

export default function Settings() {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('preferences');
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...DEFAULT_PREFS, ...parsed };
        setPrefs(merged);
        applyTheme(merged.theme);
      } else {
        applyTheme(DEFAULT_PREFS.theme);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    if (key === 'theme') {
      // Apply immediately for live feedback
      applyTheme(value);
    }
  };

  // Ensure theme stays in sync if prefs.theme changes elsewhere
  useEffect(() => {
    applyTheme(prefs.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.theme]);

  const handleSave = () => {
    setSaving(true);
    try {
      localStorage.setItem('preferences', JSON.stringify(prefs));
      applyTheme(prefs.theme);
      toast.success('Preferences saved');
    } catch (e) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Appearance */}
      <section className="bg-white dark:bg-gray-800 shadow rounded-lg border border-transparent dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Appearance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Customize how SpendWise looks on your device.</p>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Theme</label>
            <select
              value={prefs.theme}
              onChange={handleChange('theme')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use your OS setting or force light/dark.</p>
          </div>
        </div>
      </section>

      {/* Finance */}
      <section className="bg-white dark:bg-gray-800 shadow rounded-lg border border-transparent dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Finance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Default currency and analytics range.</p>
        </div>
        <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
            <select
              value={prefs.currency}
              onChange={handleChange('currency')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Used for formatting totals in the UI.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
