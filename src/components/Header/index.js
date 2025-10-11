'use client'

import SelectLanguage from '@/components/SelectLanguage'
import Link from 'next/link'

const AppHeader = ({ metadata, locale }) => {

  return (
    <header className="w-full py-4 relative z-40"> 
      <nav className="relative flex items-center justify-center max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <span className="text-3xl font-semibold whitespace-nowrap text-white"> 
            {metadata.title}
          </span>
        </Link>

        <div className="absolute right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 z-30"> 
          <SelectLanguage locale={locale} />
        </div>
      </nav>
    </header>
  )
}

export default AppHeader