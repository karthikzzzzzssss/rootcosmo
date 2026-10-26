import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowLeft,
  Download,
  Loader2,
  CalendarDays,
  Tag,
  Sparkles,
  ShoppingBag,
  Search,
  Clock,
  Lock,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { exportWorkbook, downloadBlob, buildExportFilename, fmtDate } from '../lib/exportExcel';
import type { Appointment, Category, Product, Treatment } from '../types';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const APPOINTMENTS_ENDPOINT = API_URL ? `${API_URL}/api/appointments` : '/api/appointments';

interface AdminViewProps {
  onExit: () => void;
}

type Tab = 'appointments' | 'categories' | 'treatments' | 'products';

const STATUS_STYLES: Record<Appointment['status'], string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function AdminView({ onExit }: AdminViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('appointments');
  const [query, setQuery] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem('rc_admin_token');
    } catch {
      return null;
    }
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!adminToken) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError('');

      // Appointments hold patient PII, so they are served only by the API
      // (service-role key) behind the admin token. The catalog tables are
      // public read-only and are safe to fetch with the anon key.
      const [apptRes, cats, treats, prods] = await Promise.all([
        fetch(APPOINTMENTS_ENDPOINT, { headers: { 'x-admin-token': adminToken } }),
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('treatments').select('*').order('created_at', { ascending: true }),
        supabase.from('products').select('*').order('created_at', { ascending: true }),
      ]);

      if (cancelled) return;

      if (apptRes.status === 401 || apptRes.status === 403) {
        try {
          sessionStorage.removeItem('rc_admin_token');
        } catch {
          /* ignore */
        }
        setAdminToken(null);
        setAuthError('Incorrect password, or your session has expired. Please sign in again.');
        setLoading(false);
        return;
      }

      let appts: Appointment[] = [];
      let apptOk = apptRes.ok;
      if (apptRes.ok) {
        try {
          const json = await apptRes.json();
          appts = json.data ?? [];
        } catch {
          apptOk = false;
        }
      }

      if (!apptOk || cats.error || treats.error || prods.error) {
        setLoadError('Could not load all data. Please try again.');
      }
      setAppointments(appts);
      setCategories(cats.data ?? []);
      setTreatments(treats.data ?? []);
      setProducts(prods.data ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [adminToken]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const pw = password.trim();
    if (!pw) return;
    try {
      sessionStorage.setItem('rc_admin_token', pw);
    } catch {
      /* ignore */
    }
    setAuthError('');
    setAdminToken(pw);
    setPassword('');
  };

  const stats = useMemo(
    () => [
      {
        label: 'Appointments',
        value: appointments.length,
        icon: CalendarDays,
        tab: 'appointments' as Tab,
      },
      { label: 'Categories', value: categories.length, icon: Tag, tab: 'categories' as Tab },
      { label: 'Treatments', value: treatments.length, icon: Sparkles, tab: 'treatments' as Tab },
      { label: 'Products', value: products.length, icon: ShoppingBag, tab: 'products' as Tab },
    ],
    [appointments, categories, treatments, products],
  );

  const handleExport = async () => {
    setExporting(true);
    setExportError('');
    try {
      const blob = await exportWorkbook({ appointments, categories, treatments, products });
      downloadBlob(blob, buildExportFilename());
    } catch {
      setExportError('Could not generate the spreadsheet. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    if (!query.trim()) return appointments;
    const q = query.toLowerCase();
    return appointments.filter(
      (a) =>
        a.patient_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        (a.treatment_name ?? '').toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q),
    );
  }, [appointments, query]);

  if (!adminToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b0fa8 100%)' }}
          >
            <Lock size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Admin sign in</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Enter the admin password to manage appointments.
          </p>
          {authError && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-3 py-2 rounded-lg">
              {authError}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
          />
          <button
            type="submit"
            className="mt-4 w-full text-white text-sm font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6d28d9 0%, #5b0fa8 100%)' }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={onExit}
            className="mt-3 w-full text-gray-500 text-sm py-2 hover:text-gray-700"
          >
            Back to site
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin top bar */}
      <header
        className="sticky top-0 z-40 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #5b0fa8 0%, #6d28d9 60%, #4a0080 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} /> Back to site
            </button>
            <div className="hidden sm:block h-6 w-px bg-white/20" />
            <h1 className="hidden sm:block text-white font-bold text-lg">Admin Dashboard</h1>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting || loading}
            className="flex items-center gap-2 bg-yellow-400 text-black font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-yellow-300 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {exporting ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loadError && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">
            {loadError}
          </div>
        )}
        {exportError && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-lg">
            {exportError}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => setActiveTab(s.tab)}
                className={`bg-white rounded-xl border p-5 text-left transition-all duration-200 hover:shadow-md ${
                  activeTab === s.tab ? 'border-purple-400 ring-2 ring-purple-100' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(109, 40, 217, 0.08)' }}
                  >
                    <Icon size={20} className="text-purple-700" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
                  {s.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-gray-200 overflow-x-auto hide-scrollbar">
          {(
            [
              { id: 'appointments', label: 'Appointments' },
              { id: 'categories', label: 'Categories' },
              { id: 'treatments', label: 'Treatments' },
              { id: 'products', label: 'Products' },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === t.id
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 size={32} className="animate-spin mb-3" />
            <p className="text-sm">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'appointments' && (
              <AppointmentsTable rows={filteredAppointments} query={query} setQuery={setQuery} />
            )}
            {activeTab === 'categories' && <CategoriesTable rows={categories} />}
            {activeTab === 'treatments' && <TreatmentsTable rows={treatments} />}
            {activeTab === 'products' && <ProductsTable rows={products} />}
          </>
        )}

        <p className="mt-8 text-xs text-gray-400 flex items-center gap-1.5">
          <Clock size={12} /> Exported spreadsheets reflect the live database at the moment of
          download.
        </p>
      </main>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-16 text-center text-gray-400">
      <p className="text-sm">{label}</p>
    </div>
  );
}

function AppointmentsTable({
  rows,
  query,
  setQuery,
}: {
  rows: Appointment[];
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div>
      <div className="relative max-w-sm mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, phone, treatment, status"
          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      {rows.length === 0 ? (
        <EmptyState label={query.trim() ? 'No appointments match your search.' : 'No appointments yet.'} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Treatment</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Booked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((a) => (
                  <tr key={a.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{a.patient_name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>{a.email}</div>
                      <div className="text-xs text-gray-400">{a.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.treatment_name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      <div>{a.appointment_date}</div>
                      <div className="text-xs text-gray-400">{a.appointment_time}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLES[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(a.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriesTable({ rows }: { rows: Category[] }) {
  if (rows.length === 0) return <EmptyState label="No categories found." />;
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Services</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.slug}</td>
                <td className="px-4 py-3 text-gray-600">{c.service_count}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(c.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TreatmentsTable({ rows }: { rows: Treatment[] }) {
  if (rows.length === 0) return <EmptyState label="No treatments found." />;
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((t) => (
              <tr key={t.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                <td className="px-4 py-3 text-gray-600">{t.category_name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">₹{Number(t.price).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {t.is_premier && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Premier
                      </span>
                    )}
                    {t.is_popular && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                        Popular
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(t.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsTable({ rows }: { rows: Product[] }) {
  if (rows.length === 0) return <EmptyState label="No products found." />;
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.category || '—'}</td>
                <td className="px-4 py-3 text-gray-600">₹{Number(p.price).toFixed(2)}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{fmtDate(p.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
