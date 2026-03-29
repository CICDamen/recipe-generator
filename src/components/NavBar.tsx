import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe, BookOpen, Home, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  { code: "en", label: "🇬🇧 English" },
  { code: "nl", label: "🇳🇱 Nederlands" },
];

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-orange-100 shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/">
          <Button
            variant={location.pathname === "/" ? "default" : "ghost"}
            size="sm"
            className={location.pathname === "/" ? "bg-orange-500 hover:bg-orange-600 text-white" : "text-gray-600 hover:text-orange-600"}
          >
            <Home className="h-4 w-4 mr-1" />
            {t('home', 'Home')}
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/recipes">
            <Button
              variant={location.pathname === "/recipes" ? "default" : "ghost"}
              size="sm"
              className={location.pathname === "/recipes" ? "bg-orange-500 hover:bg-orange-600 text-white" : "text-gray-600 hover:text-orange-600"}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              {t('recentRecipes', 'Recent Recipes')}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={LANGUAGES.find(l => l.code === i18n.language)?.label ?? "Select language"} className="text-gray-600 hover:text-orange-600">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {LANGUAGES.map(lang => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className="cursor-pointer"
                >
                  <span className="flex-1">{lang.label}</span>
                  {i18n.language === lang.code && <Check className="h-4 w-4 ml-2 text-orange-500" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
