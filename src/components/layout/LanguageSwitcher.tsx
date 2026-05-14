import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageOption {
  code: "en" | "uz";
  label: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English" },
  { code: "uz", label: "O'zbek" },
];

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const current = (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);

  const changeLanguage = (lng: LanguageOption["code"]) => {
    void i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("language")}>
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem]">
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        {LANGUAGES.map((lng) => {
          const active = current === lng.code;
          return (
            <DropdownMenuItem
              key={lng.code}
              onSelect={() => changeLanguage(lng.code)}
              className="flex items-center justify-between"
            >
              <span>{lng.label}</span>
              {active && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
