import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";

const NAV_ITEMS = [
  { to: "/", key: "home" },
  { to: "/history", key: "history" },
  { to: "/stories", key: "stories" },
  { to: "/alumni", key: "directory" },
  { to: "/schools", key: "schools" },
  { to: "/resources", key: "resources" },
  { to: "/faq", key: "faq" },
  { to: "/impact", key: "impact" }
];

export function Header() {
  const { t, lang, setLang } = useLanguage();

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="brand">
          <div className="brand-mark">
            <span className="brand-title">RITE</span>
            <span className="brand-subtitle">{t("siteSub")}</span>
          </div>
        </NavLink>
        <nav className="nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => `nav-button${isActive ? " active" : ""}`}
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <div className="language-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={`lang-button${lang === "en" ? " active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-button${lang === "es" ? " active" : ""}`}
              onClick={() => setLang("es")}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
