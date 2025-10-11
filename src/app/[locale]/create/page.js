'use client';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Fragment, useEffect, useState } from 'react';
import { FaSave, FaShareAlt } from 'react-icons/fa'; // Importando ícones do FontAwesome
import { v4 as uuidv4 } from 'uuid';

export default function Create() {
  const locale = useLocale();
  const t = useTranslations('HomePage');

  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState('instagram'); // Default to Instagram
  const [themeInput, setThemeInput] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedPlatform, setCopiedPlatform] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Carrega o histórico do localStorage ao iniciar
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('aiContentHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
    }
  }, []);

  const handleThemeSubmit = async (e) => {
    e.preventDefault();
    if (!themeInput.trim()) return;
    setLoading(true);
    setError('');
    setGeneratedText('');    
    
    try {
      const res = await fetch('/api/generative/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: themeInput, platform: platform }),
      });

      const response = await res.json();
      if (res.ok) {
        setGeneratedText(response.data.text);
      } else {
        throw new Error(response.message || 'Failed to generate theme');
      }
    } catch (error) {
      console.error('Error generating theme:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTheme = async () => {
    setStep(2);
    setLoading(true);
    setError('');
    setGeneratedImageUrl('');
    try {
      let imageId = uuidv4();

      const res = await fetch('/api/generative/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia o texto e a platforma para gerar um prompt de imagem otimizado
        body: JSON.stringify({ description: generatedText || themeInput, platform: platform, imageId: imageId }),
      });
      const response = await res.json();
      if (res.ok) {
        const imageId = response.data.imageId;
        // Constrói a URL para a rota GET que irá buscar a imagem pelo ID
        const imageUrl = `/api/generative/image?id=${imageId}`;
        setGeneratedImageUrl(imageUrl);
      } else {
        throw new Error(response.error || 'Failed to generate image prompt');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptImage = () => {
    const newItem = {
      id: uuidv4(),
      theme: themeInput,
      text: generatedText,
      imageUrl: generatedImageUrl,
      platform: platform,
      timestamp: new Date().toISOString(),
    };
    // Adiciona ao histórico se não for uma duplicata exata da última entrada
    if (!history.some(item => item.imageUrl === newItem.imageUrl)) {
      const updatedHistory = [newItem, ...history.slice(0, 49)]; // Limita o histórico a 50 itens
      setHistory(updatedHistory);
      localStorage.setItem('aiContentHistory', JSON.stringify(updatedHistory));
    }
    setStep(3);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };


  const handleReset = () => {
    setStep(1);
    setPlatform('instagram');
    setThemeInput('');
    setGeneratedText('');
    setGeneratedImageUrl('');
    setLoading(false);
    setError('');
    setShowHistory(false);
  };

  const handleLoadFromHistory = (item) => {
    setPlatform(item.platform);
    setThemeInput(item.theme);
    setGeneratedText(item.text);
    setGeneratedImageUrl(item.imageUrl);
    setStep(3);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setHistory([]);
      localStorage.removeItem('aiContentHistory');
      setShowHistory(false);
    }
  };

  const createCanvasFromPreview = async (platform) => {
    const element = document.getElementById(`preview-${platform}`);
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    return canvas.toDataURL('image/png');
  };

  const handleSocialShare = async (platform) => {
    // Copia o texto para a área de transferência
    await navigator.clipboard.writeText(generatedText);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(''), 2000); // Limpa a mensagem após 2 segundos

    // A URL da imagem que será compartilhada. Precisa ser uma URL pública.
    const publicImageUrl = `${window.location.origin}${generatedImageUrl}`;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        // O Facebook não permite pré-preencher o texto, então informamos o usuário que o texto foi copiado.
        alert('Texto copiado! Cole no post do Facebook.');
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicImageUrl)}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'linkedin':
        // O LinkedIn também não permite pré-preencher o texto facilmente via URL.
        alert('Texto copiado! Cole no post do LinkedIn.');
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicImageUrl)}`;
        window.open(shareUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'instagram':
        // Instagram não tem uma API de compartilhamento web para posts no feed.
        // A melhor experiência é guiar o usuário.
        alert('Texto copiado! Salve a imagem e cole o texto no seu post do Instagram.');
        break;
      default:
        // Fallback para o compartilhamento nativo do navegador
        shareImage(platform);
    }
  };

  const shareImage = async (platform) => {
    try {
      const image = await createCanvasFromPreview(platform);
      if (!image) return;
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const saveImage = async (platform) => {
    try {
      const image = await createCanvasFromPreview(platform);
      if (!image) return;

      const link = document.createElement('a');
      link.href = image;
      link.download = `${platform}-post.png`;
      link.click();
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  // Componente para renderizar os previews das redes sociais
  const SocialPreview = ({ platform, imageUrl, text }) => {
    const previews = {
      instagram: (
        <div id="preview-instagram" className="bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg w-full text-black dark:text-white font-sans">
          {/* Header */}
          <div className="flex items-center p-2 border-b border-zinc-200 dark:border-zinc-800">
            <div className="w-8 h-8 bg-zinc-300 rounded-full"></div>
            <div className="ml-2 text-sm font-semibold">seu_usuario</div>
          </div>
          {/* Image */}
          <Image src={imageUrl} alt="Preview do post" className="w-full h-auto aspect-square object-cover" />
          {/* Actions */}
          <div className="p-2 flex items-center space-x-4 text-2xl">
            <span>♡</span><span>💬</span><span>➢</span>
          </div>
          {/* Likes & Text */}
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
          {/* Header */}
          <div className="flex items-center p-3">
            <div className="w-10 h-10 bg-zinc-300 rounded-full"></div>
            <div className="ml-2">
              <div className="font-bold">Sua Página</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Agora mesmo</div>
            </div>
          </div>
          {/* Text */}
          <p className="px-3 pb-2 whitespace-pre-wrap text-sm">{text}</p>
          {/* Image */}
          <Image src={imageUrl} alt="Preview do post" className="w-full h-auto" />
          {/* Reactions */}
          <div className="flex justify-around p-2 border-t border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 text-sm font-semibold">
            <div>👍 Curtir</div>
            <div>💬 Comentar</div>
            <div>➢ Compartilhar</div>
          </div>
        </div>
      ),
      linkedin: (
        <div id="preview-linkedin" className="bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg w-full text-zinc-800 dark:text-zinc-200 font-sans">
          {/* Header */}
          <div className="flex items-center p-3">
            <div className="w-12 h-12 bg-zinc-300 rounded-full"></div>
            <div className="ml-2">
              <div className="font-bold">Seu Nome</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">10.000 seguidores</div>
            </div>
          </div>
          {/* Text */}
          <p className="px-3 pb-2 whitespace-pre-wrap text-sm">{text}</p>
          {/* Image */}
          <Image src={imageUrl} alt="Preview do post" className="w-full h-auto" />
          {/* Actions */}
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col">
              <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Histórico de Criações</h2>
              <div className="flex-grow overflow-y-auto space-y-3 pr-2 -mr-2">
                {history.length > 0 ? (
                  history.map(item => (
                    <div key={item.id} onClick={() => handleLoadFromHistory(item)} className="flex items-center gap-4 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <Image src={item.imageUrl} alt={item.theme} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                      <div className="text-left flex-grow overflow-hidden">
                        <p className="font-semibold text-zinc-700 dark:text-zinc-200 truncate">{item.theme}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500 text-center py-8">Nenhum item no histórico.</p>
                )}
              </div>
              <div className="mt-6 flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-700">
                <button type="button" onClick={() => setShowHistory(false)} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded-lg transition-colors">Fechar</button>
                {history.length > 0 && (
                  <button type="button" onClick={handleClearHistory} className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900 font-bold py-2 px-4 rounded-lg transition-colors">Limpar Histórico</button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Theme */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">Gerador de Conteúdo</h1>
              <p className="text-zinc-500 mt-2">Comece descrevendo sua ideia e nós cuidamos do resto.</p>
              <button type="button" onClick={() => setShowHistory(true)} className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Ver Histórico</button>
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
        )}

        {/* Step 2: Image Generation */}
        {step === 2 && (
          <div className="w-full max-w-2xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Gerando sua Imagem</h1>
            <div className="mt-6 p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
              {loading && <p className="text-zinc-500">Aguarde, a criatividade está a todo vapor...</p>}
              {generatedImageUrl && (
                <Fragment>
                  <h3 className="font-bold text-zinc-800 dark:text-white">Imagem Gerada:</h3>
                  <Image src={generatedImageUrl} alt="Imagem gerada por IA" className="mx-auto my-4 max-w-full h-auto rounded-lg shadow-md" />
                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <button onClick={handleAcceptImage} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Aceitar e Ver Preview</button>
                    <button onClick={handleAcceptTheme} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded-lg" disabled={loading}>Gerar Outra Imagem</button>
                    <button onClick={handleBack} className="bg-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-bold py-2 px-4 rounded-lg">Voltar</button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Preview */}
        {step === 3 && (
          <div className="w-full text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-4">Preview do Post</h1>
            <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
              {['instagram', 'facebook', 'linkedin'].map(platform => (
                <div key={platform} className="flex-shrink-0 w-full sm:w-96 snap-center flex flex-col items-center px-2">
                  <h2 className="text-zinc-700 dark:text-zinc-300 font-semibold capitalize mb-2">{platform}</h2>
                  <div className="w-full max-w-sm mx-auto">
                    <SocialPreview platform={platform} imageUrl={generatedImageUrl} text={generatedText} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => saveImage(platform)} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-1 px-3 rounded-md text-sm flex items-center gap-1.5"><FaSave /> Salvar</button>
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
        )}

        {error && (
          <div className="mt-6 max-w-2xl mx-auto p-4 bg-red-100 text-red-700 border border-red-200 rounded-lg text-center animate-fade-in">
            <strong>Erro:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}