import { FaShareAlt } from 'react-icons/fa';
import SocialPreview from './SocialPreview';

export default function Step3Preview({ generatedImageUrl, generatedText, handleSocialShare, copiedPlatform, handleBack, handleReset }) {
  const platforms = ['instagram', 'facebook', 'linkedin'];

  return (
    <div className="w-full text-center animate-fade-in">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Preview do Post</h1>
      <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
        {platforms.map(platform => (
          <div key={platform} className="flex-shrink-0 w-full sm:w-96 snap-center flex flex-col items-center px-2">
            <h2 className="text-zinc-700 dark:text-zinc-300 font-semibold capitalize mb-2">{platform}</h2>
            <div className="w-full max-w-sm mx-auto">
              <SocialPreview platform={platform} imageUrl={generatedImageUrl} text={generatedText} />
            </div>
            <div className="mt-4 flex gap-2">
              {platform === 'instagram' ? (
                <button onClick={() => handleSocialShare('instagram')} className="bg-pink-100 hover:bg-pink-200 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400 dark:hover:bg-pink-900 font-bold py-1 px-3 rounded-md text-sm">
                  {copiedPlatform === 'instagram' ? 'Copiado!' : 'Copiar Texto'}
                </button>
              ) : (
                <button onClick={() => handleSocialShare(platform)} className="bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 dark:hover:bg-blue-900 font-bold py-1 px-3 rounded-md text-sm flex items-center gap-1.5">
                  <FaShareAlt />
                  {copiedPlatform === platform ? 'Texto Copiado!' : 'Compartilhar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={handleBack} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded-lg">Voltar</button>
        <button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Criar Novo</button>
      </div>
    </div>
  );
}