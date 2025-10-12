export default function Step1Form({
  platform,
  setPlatform,
  themeInput,
  setThemeInput,
  handleThemeSubmit,
  loading,
  generatedText,
  handleAcceptTheme,
  onShowHistory
}) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">Gerador de Conteúdo</h1>
        <p className="text-zinc-500 mt-2">Comece descrevendo sua ideia e nós cuidamos do resto.</p>
        <button type="button" onClick={onShowHistory} className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Ver Histórico</button>
      </div>
      <form onSubmit={handleThemeSubmit} className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg space-y-6">
        <div>
          <label className="block text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-3">1. Escolha a plataforma</label>
          <div className="flex justify-center gap-2">
            {['instagram', 'facebook', 'linkedin'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`px-5 py-2 rounded-lg font-semibold capitalize transition-all duration-200 ${
                  platform === p
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >{p}</button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="themeInput" className="block text-lg font-semibold text-zinc-700 dark:text-zinc-200 mb-3">2. Descreva o tema do seu post</label>
          <textarea
            id="themeInput"
            className="w-full p-3 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            value={themeInput}
            onChange={(e) => setThemeInput(e.target.value)}
            placeholder="Ex: Dicas para uma vida mais saudável e produtiva"
            rows="4"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400" disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Texto'}
        </button>
        {generatedText && (
          <div className="mt-6 p-6 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg animate-fade-in-fast">
            <h3 className="font-bold text-zinc-800 dark:text-white">Texto Sugerido:</h3>
            <p className="whitespace-pre-wrap mt-2 text-zinc-700 dark:text-zinc-300">{generatedText}</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button type="button" onClick={handleAcceptTheme} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Aceitar e Gerar Imagem</button>
              <button type="submit" className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded-lg" disabled={loading}>Gerar Novamente</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}