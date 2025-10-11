'use client';
import { FaBolt, FaLightbulb, FaMagic, FaSyncAlt } from 'react-icons/fa';

export default function Home() {
  const benefits = [
    { icon: FaMagic, title: "Automação Inteligente", description: "Deixe a IA criar textos e imagens perfeitas para você." },
    { icon: FaLightbulb, title: "Criatividade Ilimitada", description: "Explore novas ideias e estilos para seus posts." },
    { icon: FaBolt, title: "Economia de Tempo", description: "Gere conteúdo de alta qualidade em segundos, não horas." },
    { icon: FaSyncAlt, title: "Consistência de Marca", description: "Mantenha uma voz e visual consistentes em todas as redes." },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-800 dark:text-white">
            Crie conteúdo para redes sociais <br />
            <span className="text-blue-500">mais rápido e de forma mais inteligente.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Nossa IA gera textos e imagens otimizados para engajamento, permitindo que você foque no que realmente importa: seu negócio.
          </p>
          <a
            href="/create" // Assuming the tool is at /create
            className="mt-8 inline-block bg-blue-600 text-white font-bold text-lg py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comece a Criar Agora
          </a>
        </section>

        {/* Benefits Section */}
        <section className="w-full max-w-5xl py-16 animate-fade-in-delay">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <div className="text-blue-500 text-4xl mb-4">
                  <benefit.icon />
                </div>
                <h3 className="text-xl font-bold text-zinc-800 dark:text-white">{benefit.title}</h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 animate-fade-in-delay-2">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-800 dark:text-white">Pronto para otimizar seu conteúdo?</h2>
          <a
            href="/create" // Assuming the tool is at /create
            className="mt-8 inline-block bg-blue-600 text-white font-bold text-xl py-4 px-10 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Experimente de Graça
          </a>
        </section>
      </main>
    </div>
  );
}