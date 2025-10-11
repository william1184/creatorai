"use client";
import { Link, usePathname } from "@/i18n/routing"; // Adicionado usePathname
import { useEffect, useRef, useState } from "react"; // Adicionado useState, useEffect, useRef

// Ícone de seta para baixo para o botão do dropdown
const ChevronDownIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 inline ml-2 -mr-1" // Margens ajustadas para melhor alinhamento
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

const SelectLanguage = ({locale}) => {
    const pathname = usePathname(); // Obtém o pathname atual (sem o prefixo do locale)
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref para detectar cliques fora do dropdown

    const options = [
        { label: 'English (US)', value: 'en-US' }, // Nomes encurtados para exibição
        { label: 'Português (BR)', value: 'pt-BR' },
        { label: 'Español (AR)', value: 'es-AR' },
        { label: 'Español (UY)', value: 'es-UY' },
        { label: 'Español (CL)', value: 'es-CL' },
    ];

    const currentOption = options.find(option => option.value === locale) || options[0];

    // Efeito para fechar o dropdown ao clicar fora dele
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]); // Re-executa o efeito quando isOpen muda

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    // Estilo do botão para se adequar a um header (pode ser ajustado)
                    className="inline-flex items-center justify-center rounded-md px-2 py-2 bg-gray-700/75 text-sm font-medium text-white hover:bg-gray-600/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    id="options-menu"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-labelledby="options-menu"
                    title="Change language"                    
                >
                    {currentOption.value.toUpperCase()}
                    <ChevronDownIcon />
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                >
                    <div className="py-1 " role="none">
                        {options.map((localeItem) => (
                            <div key={localeItem.value}>
                                <Link
                                    title={localeItem.label}
                                    href={pathname} // Navega para o mesmo path
                                    locale={localeItem.value} // Com o novo locale
                                    className={`block px-4 py-2 text-sm ${localeItem.value === locale ? 'font-bold text-indigo-600 bg-indigo-50' : 'text-gray-700'} hover:bg-gray-100 hover:text-gray-900`}
                                    role="menuitem"
                                    onClick={() => setIsOpen(false)} // Fecha o dropdown ao selecionar
                                >
                                    {localeItem.value.toUpperCase()}
                                </Link>
                            </div>

                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectLanguage;