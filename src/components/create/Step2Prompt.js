import { Fragment } from 'react';

export default function Step2Prompt({ loading, generatedImagePrompt, handleGenerateImage, handleGeneratePrompt, handleBack }) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-fade-in">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Prompt para Imagem</h1>
      <div className="mt-6 p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
        {loading && <p className="text-zinc-500">Gerando prompt...</p>}
        {generatedImagePrompt && (
          <Fragment>
            <h3 className="font-bold text-zinc-800 dark:text-white">Prompt Gerado:</h3>
            <p className="whitespace-pre-wrap mt-2 text-left text-sm p-4 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg font-mono">{generatedImagePrompt}</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={handleGenerateImage} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Aprovar e Gerar Imagem</button>
              <button onClick={handleGeneratePrompt} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded-lg" disabled={loading}>Gerar Novo Prompt</button>
              <button onClick={handleBack} className="bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-bold py-2 px-4 rounded-lg">Voltar</button>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}