import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useAccount } from "../context/AccountContext.jsx";

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
  const { account, signOut } = useAccount();
  const navigate = useNavigate();

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
          {account ? (
            <>
              <NavLink to="/account" className="button ghost">
                {account.name || account.email}
              </NavLink>
              <button
                type="button"
                className="button gold"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                {t("labels.signOut")}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="button ghost">
                {t("labels.signIn")}
              </NavLink>
              <NavLink to="/register" className="button gold">
                {t("labels.register")}
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
