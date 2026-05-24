import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useLanguage();
  const nextLanguage = availableLanguages.find((item) => item.code !== language)?.code ?? 'en';

  return (
    <Button variant="secondary" size="sm" onClick={() => setLanguage(nextLanguage)} className="px-3">
      <Languages className="h-4 w-4" />
      <span>{language.toUpperCase()}</span>
    </Button>
  );
}

