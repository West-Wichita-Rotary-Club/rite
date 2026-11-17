import { Link } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";

export function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <h1 className="section-title">{t("labels.notFound")}</h1>
      <Link className="button" to="/">
        {t("nav.home")}
      </Link>
    </section>
  );
}
