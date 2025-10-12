import Image from 'next/image';

const SocialPreview = ({ platform, imageUrl, text }) => {
  const previews = {
    instagram: (
      <div id="preview-instagram" className="bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg w-full text-black dark:text-white font-sans">
        <div className="flex items-center p-2 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 bg-zinc-300 rounded-full"></div>
          <div className="ml-2 text-sm font-semibold">seu_usuario</div>
        </div>
        <Image src={imageUrl} alt="Preview do post" width={500} height={500} className="w-full h-auto aspect-square object-cover" />
        <div className="p-2 flex items-center space-x-4 text-2xl">
          <span>♡</span><span>💬</span><span>➢</span>
        </div>
        <div className="px-3 pb-3 text-sm">
          <div className="font-bold">1,234 likes</div>
          <p className="whitespace-pre-wrap mt-1">
            <span className="font-bold">seu_usuario</span> {text}
          </p>
        </div>
      </div>
    ),
    facebook: (
      <div id="preview-facebook" className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg w-full text-zinc-800 dark:text-zinc-200 font-sans">
        <div className="flex items-center p-3">
          <div className="w-10 h-10 bg-zinc-300 rounded-full"></div>
          <div className="ml-2">
            <div className="font-bold">Sua Página</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">Agora mesmo</div>
          </div>
        </div>
        <p className="px-3 pb-2 whitespace-pre-wrap text-sm">{text}</p>
        <Image src={imageUrl} alt="Preview do post" width={500} height={300} className="w-full h-auto" />
        <div className="flex justify-around p-2 border-t border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-semibold">
          <div>👍 Curtir</div>
          <div>💬 Comentar</div>
          <div>➢ Compartilhar</div>
        </div>
      </div>
    ),
    linkedin: (
      <div id="preview-linkedin" className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg w-full text-zinc-800 dark:text-zinc-200 font-sans">
        <div className="flex items-center p-3">
          <div className="w-12 h-12 bg-zinc-300 rounded-full"></div>
          <div className="ml-2">
            <div className="font-bold">Seu Nome</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">10.000 seguidores</div>
          </div>
        </div>
        <p className="px-3 pb-2 whitespace-pre-wrap text-sm">{text}</p>
        <Image src={imageUrl} alt="Preview do post" width={500} height={300} className="w-full h-auto" />
        <div className="flex justify-around p-2 border-t border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-semibold">
          <div>👍 Recomendar</div>
          <div>💬 Comentar</div>
          <div>🔁 Republicar</div>
          <div>➢ Enviar</div>
        </div>
      </div>
    ),
  };
  return previews[platform] || null;
};

export default SocialPreview;