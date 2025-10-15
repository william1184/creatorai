'use client';
import HistoryModal from '@/components/create/HistoryModal';
import Step1Form from '@/components/create/Step1Form';
import Step2Prompt from '@/components/create/Step2Prompt';
import Step3Image from '@/components/create/Step3Image';
import Step4Preview from '@/components/create/Step4Preview';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Create() {
  const locale = useLocale();
  const t = useTranslations('HomePage');

  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState('instagram'); // Default to Instagram
  const [themeInput, setThemeInput] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [finalImageUrl, setFinalImageUrl] = useState(''); // URL da imagem com logo
  const [logo, setLogo] = useState(null);
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
        body: JSON.stringify({
          description: themeInput,
          platform: platform,
          company_name: companyName,
          category: category
        }),
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

  const handleGeneratePrompt = async (e) => {
    if (e) e.preventDefault();
    setStep(2);
    setLoading(true);
    setError('');
    setGeneratedImagePrompt('');

    try {
      const res = await fetch('/api/generative/image/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: generatedText || themeInput, platform: platform }),
      });

      const response = await res.json();
      if (res.ok) {
        setGeneratedImagePrompt(response.data.imagePrompt);
      } else {
        throw new Error(response.error || 'Failed to generate image prompt');
      }
    } catch (error) {
      setError(error.message);
      setStep(1); // Go back to step 1 on error
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setStep(3);
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
        body: JSON.stringify({ imagePrompt: generatedImagePrompt, imageId: imageId }),
      });
      const response = await res.json();
      if (res.ok) {
        const imageId = response.data.imageId;
        // Constrói a URL para a rota GET que irá buscar a imagem pelo ID
        const imageUrl = `/api/generative/image?id=${imageId}`;
        setGeneratedImageUrl(imageUrl);
      } else {
        throw new Error(response.error || 'Failed to generate image');
      }
    } catch (error) {
      setError(error.message);
      setStep(2); // Go back to prompt step on error
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptImage = () => {
    const imageToSave = finalImageUrl || generatedImageUrl;
    const newItem = {
      id: uuidv4(),
      theme: themeInput,
      text: generatedText,
      imagePrompt: generatedImagePrompt,
      imageUrl: imageToSave,
      platform: platform,
      timestamp: new Date().toISOString(),
    };
    // Adiciona ao histórico se não for uma duplicata exata da última entrada
    if (!history.some(item => item.imageUrl === newItem.imageUrl)) {
      const updatedHistory = [newItem, ...history.slice(0, 49)]; // Limita o histórico a 50 itens
      setHistory(updatedHistory);
      localStorage.setItem('aiContentHistory', JSON.stringify(updatedHistory));
    }
    setStep(4);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
    if (step === 4) setFinalImageUrl(''); // Limpa a imagem final ao voltar da preview
  };


  const handleReset = () => {
    setStep(1);
    setPlatform('instagram');
    setThemeInput('');
    setCompanyName('');
    setCategory('');
    setGeneratedText('');
    setGeneratedImagePrompt('');
    setGeneratedImageUrl('');
    setFinalImageUrl('');
    setLogo(null);
    setLoading(false);
    setError('');
    setShowHistory(false);
  };

  const handleLoadFromHistory = (item) => {
    setPlatform(item.platform);
    setThemeInput(item.theme);
    setGeneratedText(item.text);
    setGeneratedImagePrompt(item.imagePrompt);
    setFinalImageUrl(item.imageUrl); // Carrega a imagem final (pode ter logo)
    setStep(4);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
      setHistory([]);
      localStorage.removeItem('aiContentHistory');
      setShowHistory(false);
    }
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <HistoryModal
          show={showHistory}
          history={history}
          onClose={() => setShowHistory(false)}
          onLoadItem={handleLoadFromHistory}
          onClearHistory={handleClearHistory}
        />

        {/* Step 1: Theme */}
        {step === 1 && (
          <Step1Form
            platform={platform}
            setPlatform={setPlatform}
            themeInput={themeInput}
            setThemeInput={setThemeInput}
            companyName={companyName}
            setCompanyName={setCompanyName}
            category={category}
            setCategory={setCategory}
            handleThemeSubmit={handleThemeSubmit}
            loading={loading}
            generatedText={generatedText}
            handleAcceptTheme={handleGeneratePrompt}
            onShowHistory={() => setShowHistory(true)}
          />
        )}

        {/* Step 2: Image Prompt Generation */}
        {step === 2 && (
          <Step2Prompt
            loading={loading}
            generatedImagePrompt={generatedImagePrompt}
            handleGenerateImage={handleGenerateImage}
            handleGeneratePrompt={handleGeneratePrompt}
            handleBack={handleBack}
          />
        )}

        {/* Step 3: Image Generation */}
        {step === 3 && (
          <Step3Image
            loading={loading}
            generatedImageUrl={generatedImageUrl}
            handleAcceptImage={handleAcceptImage}
            handleGenerateImage={handleGenerateImage}
            logo={logo}
            setLogo={setLogo}
            setFinalImageUrl={setFinalImageUrl}
            handleBack={handleBack}
          />
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <Step4Preview
            generatedImageUrl={finalImageUrl || generatedImageUrl}
            generatedText={generatedText}
            handleSocialShare={handleSocialShare}
            copiedPlatform={copiedPlatform}
            handleBack={handleBack}
            handleReset={handleReset}
          />
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