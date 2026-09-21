import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PetCard from '../components/PetCard';
import { api } from '../services/api';

export default function Pets() {
  const [filters, setFilters] = useState({ search: '', species: '', size: '', gender: '', page: 0, pageSize: 9 });
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = (query = filters) => { setLoading(true); setError(''); api.pets(query).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  useEffect(() => { if (localStorage.getItem('jp_token')) api.favorites().then(x => setFavorites(new Set(x.map(p => p.id)))).catch(() => {}); }, []);
  const change = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 0 }));
  const toggle = async id => { try { if (favorites.has(id)) { await api.removeFavorite(id); setFavorites(s => { const n = new Set(s); n.delete(id); return n; }); } else { await api.addFavorite(id); setFavorites(s => new Set(s).add(id)); } } catch (e) { setError(e.message); } };
  const token = localStorage.getItem('jp_token');
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-jp-orange">Directory</p><h1 className="mt-2 text-5xl font-black tracking-tight text-jp-green">Find a pet</h1><p className="mt-2 text-stone-500">{data.totalElements || 0} profiles in the directory</p></div>
      <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-[2fr_repeat(3,1fr)_auto]">
        <input className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 outline-none ring-jp-orange focus:ring-2" value={filters.search} onChange={e => change('search', e.target.value)} placeholder="Search name or breed" />
        <select className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-jp-orange" value={filters.species} onChange={e => change('species', e.target.value)}><option value="">Any species</option><option value="DOG">Dogs</option><option value="CAT">Cats</option></select>
        <select className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-jp-orange" value={filters.size} onChange={e => change('size', e.target.value)}><option value="">Any size</option><option value="SMALL">Small</option><option value="MEDIUM">Medium</option><option value="LARGE">Large</option></select>
        <select className="rounded-xl border border-stone-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-jp-orange" value={filters.gender} onChange={e => change('gender', e.target.value)}><option value="">Any gender</option><option value="MALE">Male</option><option value="FEMALE">Female</option></select>
        <button className="rounded-xl bg-jp-orange px-5 py-2.5 font-bold text-white hover:bg-orange-700" onClick={() => load(filters)}>Search</button>
      </div>
      {error && <div className="my-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-800">{error}</div>}
      {loading ? <div className="grid min-h-72 place-items-center text-stone-500">Loading pets…</div> : data.content?.length ? <>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.content.map(p => <PetCard key={p.id} pet={p} favorite={favorites.has(p.id)} onFavorite={token ? toggle : undefined} />)}</div>
        <div className="mt-8 flex items-center justify-center gap-5">
          <button className="rounded-lg border border-stone-300 bg-white px-4 py-2 disabled:opacity-40" disabled={filters.page <= 0} onClick={() => { const next = { ...filters, page: filters.page - 1 }; setFilters(next); load(next); }}>Previous</button>
          <span className="text-sm text-stone-600">Page {filters.page + 1} of {Math.max(data.totalPages, 1)}</span>
          <button className="rounded-lg border border-stone-300 bg-white px-4 py-2 disabled:opacity-40" disabled={filters.page + 1 >= data.totalPages} onClick={() => { const next = { ...filters, page: filters.page + 1 }; setFilters(next); load(next); }}>Next</button>
        </div>
      </> : <div className="grid min-h-72 place-items-center text-center text-stone-500">No pets match those filters.</div>}
    </section>
  );
}
