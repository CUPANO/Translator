import { useState, useRef, useEffect } from 'react'
import { languages } from '../languagesData'

interface TranslatorAppProps {
  onClose: () => void
}

const TranslatorApp: React.FC<TranslatorAppProps> = ({ onClose }) => {
  const [selectedLanguageFrom, setSelectedLanguageFrom] = useState<string>('en')
  const [selectedLanguageTo, setSelectedLanguageTo] = useState<string>('en')
  const [showLanguages, setShowLanguages] = useState<boolean>(false)
  const [currentLanguageSelection, setCurrentLanguageSelection] = useState<'from' | 'to' | null>(null)
  const [inputText, setInputText] = useState<string>('')
  const [translatedText, setTranslatedText] = useState<string>('')
  const [charCount, setCharCount] = useState<number>(0)

  const maxChars = 200
  const dropdownRef = useRef<HTMLDivElement>(null)

  const getLanguageName = (code: keyof typeof languages | string): string => {
    return languages[code as keyof typeof languages] ?? code.toUpperCase()
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowLanguages(false)
    }
  }

  useEffect(() => {
    if (showLanguages) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLanguages])

  const handleLanguageClick = (type: 'from' | 'to') => {
    setCurrentLanguageSelection(type)
    setShowLanguages(true)
  }

  const handleLanguagesSelect = (languageCode: string) => {
    if (currentLanguageSelection === 'from') {
      setSelectedLanguageFrom(languageCode)
    } else if (currentLanguageSelection === 'to') {
      setSelectedLanguageTo(languageCode)
    }
    setShowLanguages(false)
  }

  const handleSwapLanguages = () => {
    setSelectedLanguageFrom(selectedLanguageTo)
    setSelectedLanguageTo(selectedLanguageFrom)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= maxChars) {
      setInputText(value)
      setCharCount(value.length)
    }
  }

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setTranslatedText('')
      return
    }

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          inputText,
        )}&langpair=${selectedLanguageFrom}|${selectedLanguageTo}`,
      )
      const data = await response.json()
      setTranslatedText(data.responseData.translatedText)
    } catch (error) {
      console.error('Translation failed:', error)
      setTranslatedText('Error occurred during translation.')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTranslate()
    }
  }

  return (
    <div className="w-full flex flex-col gap-y-4 justify-center items-center px-6 sm:px-8 pt-12 pb-6 relative">
      <button className="absolute top-4 right-4" onClick={onClose}>
        <i className="fa-solid fa-xmark text-xl text-gray-300"></i>
      </button>

      <div className="w-full min-h-20 flex justify-center items-center px-4 bg-gradient-to-r from-[#b6f492] to-[#338b93] text-gray-700 rounded-lg">
        <div className="language cursor-pointer" onClick={() => handleLanguageClick('from')}>
          {getLanguageName(selectedLanguageFrom)}
        </div>
        <i
          className="fa-solid fa-arrows-rotate text-2xl mx-8 cursor-pointer"
          onClick={handleSwapLanguages}
        ></i>
        <div className="language cursor-pointer" onClick={() => handleLanguageClick('to')}>
          {getLanguageName(selectedLanguageTo)}
        </div>
      </div>

      {showLanguages && (
        <div
          className="w-[calc(100%-4rem)] h-[calc(100%-9rem)] bg-gradient-to-r from-[#b6f492] to-[#338b93] absolute top-32 left-8 z-10 rounded shadow-lg p-4 overflow-y-scroll scrollbar-hide"
          ref={dropdownRef}
        >
          <ul>
            {Object.entries(languages).map(([code, name]) => (
              <li
                key={code}
                className="cursor-pointer hover:bg-[#10646b] transition duration-200 p-2 rounded"
                onClick={() => handleLanguagesSelect(code)}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full relative">
        <textarea
          className="textarea text-gray-200"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        ></textarea>
        <div className="absolute bottom-2 right-4 text-gray-400">
          {charCount}/{maxChars}
        </div>
      </div>

      <button
        className="w-12 h-12 bg-gradient-to-r from-[#b6f492] to-[#338b93] rounded-full text-2xl text-gray-600 flex justify-center items-center active:translate-y-[1px]"
        onClick={handleTranslate}
      >
        <i className="fa-solid fa-chevron-down"></i>
      </button>

      <div className="w-full">
        <textarea
          className="textarea text-[#b6f492]"
          value={translatedText}
          readOnly
        ></textarea>
      </div>
    </div>
  )
}

export default TranslatorApp
