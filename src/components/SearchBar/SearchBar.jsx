function SearchBar({ searchTerm, onSearchChange, selectedGenre, onGenreChange, genres }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl shadow-lg border border-slate-100 -mt-6 mx-4 sm:mx-auto max-w-4xl relative z-10">
      <div className="flex-1 relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-3.5 px-4 pl-12 bg-slate-50 border-2 border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
        />
      </div>
      <div className="relative">
        <select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="w-full sm:w-auto appearance-none py-3.5 px-5 pr-12 bg-slate-50 border-2 border-transparent rounded-xl text-slate-700 font-medium cursor-pointer focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
