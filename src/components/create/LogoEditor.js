'use client';
import { useEffect, useRef, useState } from 'react';
import { FaArrowsAlt, FaSearchPlus, FaSearchMinus, FaRegSun, FaSun } from 'react-icons/fa';

export default function LogoEditor({ baseImage, logo, setLogo, onMerge }) {
  const [logoPosition, setLogoPosition] = useState({ x: 206, y: 206 }); // Posição central inicial aproximada
  const [logoSize, setLogoSize] = useState(100);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const canvasRef = useRef(null);
  const logoImageRef = useRef(new Image());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Carrega a imagem do logo no logoImageRef sempre que o 'logo' (Data URL) mudar
  useEffect(() => {
    if (logo) {
      logoImageRef.current.src = logo;
      // O onload é definido aqui para redesenhar quando a imagem do logo carregar.
      // Isso é importante caso a imagem venha de cache e o onload em handleLogoUpload não dispare.
      logoImageRef.current.onload = () => {
        drawImages();
      };
    }
  }, [logo]);

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target.result);
        // Centraliza o logo recém-carregado
        const tempImg = new Image();
        tempImg.src = event.target.result;
        tempImg.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            const aspectRatio = tempImg.width / tempImg.height;
            const newX = (canvas.width - logoSize) / 2;
            const newY = (canvas.height - (logoSize / aspectRatio)) / 2;
            setLogoPosition({ x: newX, y: newY });
          }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getLogoBoundingBox = () => {
    const logoImg = logoImageRef.current;
    if (!logoImg.src) return null;
    const aspectRatio = logoImg.width / logoImg.height;
    const logoHeight = logoSize / aspectRatio;
    return {
      x: logoPosition.x,
      y: logoPosition.y,
      width: logoSize,
      height: logoHeight,
    };
  };

  const handlePointerDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const logoBox = getLogoBoundingBox();
    if (logoBox && x >= logoBox.x && x <= logoBox.x + logoBox.width && y >= logoBox.y && y <= logoBox.y + logoBox.height) {
      setIsDragging(true);
      setDragStart({
        x: x - logoPosition.x,
        y: y - logoPosition.y,
      });
      canvas.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (isDragging) {
      setLogoPosition({
        x: mouseX - dragStart.x,
        y: mouseY - dragStart.y,
      });
    } else {
      // Altera o cursor se o mouse estiver sobre o logo
      const logoBox = getLogoBoundingBox();
      if (logoBox && mouseX >= logoBox.x && mouseX <= logoBox.x + logoBox.width && mouseY >= logoBox.y && mouseY <= logoBox.y + logoBox.height) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.cursor = 'default';
    }
  };

  const drawImages = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const base = new Image();
    base.crossOrigin = "anonymous";
    base.src = baseImage;
    base.onload = () => {
      canvas.width = base.width;
      canvas.height = base.height;
      ctx.drawImage(base, 0, 0);

      if (logo) {
        ctx.globalAlpha = logoOpacity; // Aplica a opacidade
        const logoImg = logoImageRef.current;
        // Se a imagem do logo ainda não carregou, o onload dela vai chamar o redraw
        if (logoImg.complete) { // Se a imagem já estiver carregada
            const aspectRatio = logoImg.width / logoImg.height;
            const logoHeight = logoSize / aspectRatio;
            ctx.drawImage(logoImg, logoPosition.x, logoPosition.y, logoSize, logoHeight);
        }
        ctx.globalAlpha = 1; // Reseta a opacidade para o padrão
      }
    };
  };

  useEffect(() => {
    drawImages();
  }, [baseImage, logo, logoPosition, logoSize, logoOpacity]); // Redesenha a cada mudança

  const handleMerge = () => {
    const canvas = canvasRef.current;
    onMerge(canvas.toDataURL('image/png'));
  };

  return (
    <div className="space-y-4 my-4">
      <div>
        <label htmlFor="logo-upload" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Adicionar Logo
        </label>
        <input
          id="logo-upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleLogoUpload}
          className="mt-1 block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {logo && (
        <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-800/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className='flex-grow'>
              <label htmlFor="logo-size" className="block text-sm font-medium text-center sm:text-left">
                Ajustar Tamanho
              </label>
              <div className="flex items-center gap-2 mt-1">
                <FaSearchMinus />
                <input
                  id="logo-size"
                  type="range"
                  min="20"
                  max="400"
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                />
                <FaSearchPlus />
              </div>
            </div>
            <div className='flex-grow'>
              <label htmlFor="logo-opacity" className="block text-sm font-medium text-center sm:text-left">
                Transparência
              </label>
              <div className="flex items-center gap-2 mt-1">
                <FaRegSun />
                <input
                  id="logo-opacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={logoOpacity}
                  onChange={(e) => setLogoOpacity(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                />
                <FaSun />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400"><FaArrowsAlt className="inline mr-1" /> Arraste o logo sobre a imagem para posicionar.</p>
          <button
            onClick={handleMerge}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Aplicar Logo e Continuar
          </button>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-[512px] aspect-square">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg shadow-md"
          width={512}
          height={512}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp} // Cancela o drag se o mouse sair do canvas
        />
      </div>
    </div>
  );
}