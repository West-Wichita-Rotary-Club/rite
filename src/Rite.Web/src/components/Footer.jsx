import { useLanguage } from "../i18n.jsx";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <p>{t("footerTitle")}</p>
          <p>{t("footerSub")}</p>
        </div>
      </div>
    </footer>
  );
}
