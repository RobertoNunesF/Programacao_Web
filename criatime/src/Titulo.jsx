export default function Titulo({ termoBusca = "", setTermoBusca }) {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-600 rounded-full border-4 border-slate-700 flex items-center justify-center relative shadow-inner after:content-[''] after:w-3 after:h-3 after:bg-white after:border-2 after:border-slate-700 after:rounded-full after:absolute"></div>
        <h1 className="text-xl font-black text-slate-700 tracking-wider uppercase">Pokémon Team Builder</h1>
      </div>

      {typeof setTermoBusca === "function" && (
        <div className="w-full md:w-96">
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Pesquise por nome ou tipo (ex: Fire, Water)..."
            className="w-full p-2 rounded-xl border border-gray-300 bg-slate-50 text-sm shadow-inner focus:outline-none focus:border-blue-500 text-gray-700"
          />
        </div>
      )}

      <nav className="flex flex-wrap justify-center md:justify-end gap-3">
        <a href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
          Home
        </a>
        <a href="/Inclusao" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
          Novo Time
        </a>
        <a href="/Pesquisa" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
          Pesquisa de Times
        </a>
      </nav>
    </header>
  );
}
