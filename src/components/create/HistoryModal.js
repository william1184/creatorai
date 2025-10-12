import Image from 'next/image';

export default function HistoryModal({ show, history, onClose, onLoadItem, onClearHistory }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in-fast">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[85vh] flex flex-col">
        <h2 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4">Histórico de Criações</h2>
        <div className="flex-grow overflow-y-auto space-y-3 pr-2 -mr-2">
          {history.length > 0 ? (
            history.map(item => (
              <div key={item.id} onClick={() => onLoadItem(item)} className="flex items-center gap-4 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <Image src={item.imageUrl} alt={item.theme} width={64} height={64} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
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
          <button type="button" onClick={onClose} className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded-lg transition-colors">Fechar</button>
          {history.length > 0 && (
            <button type="button" onClick={onClearHistory} className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900 font-bold py-2 px-4 rounded-lg transition-colors">Limpar Histórico</button>
          )}
        </div>
      </div>
    </div>
  );
}