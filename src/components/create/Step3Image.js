import Image from 'next/image';
import { Fragment } from 'react';

export default function Step2Image({ loading, generatedImageUrl, handleAcceptImage, handleBack, handleGenerateImage }) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center animate-fade-in">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Gerando sua Imagem</h1>
      <div className="mt-6 p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
        {loading && <p className="text-zinc-500">Aguarde, a criatividade está a todo vapor...</p>}
        {generatedImageUrl && (
          <Fragment>
            <h3 className="font-bold text-zinc-800 dark:text-white">Imagem Gerada:</h3>
            <Image src={generatedImageUrl} alt="Imagem gerada por IA" width={512} height={512} className="mx-auto my-4 max-w-full h-auto rounded-lg shadow-md" />
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={handleAcceptImage} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Aceitar e Ver Preview</button>
              <button onClick={handleGenerateImage} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded-lg" disabled={loading}>Gerar Outra Imagem</button>
              <button onClick={handleBack} className="bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-bold py-2 px-4 rounded-lg">Voltar</button>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}