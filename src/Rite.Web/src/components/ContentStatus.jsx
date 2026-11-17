import { useLanguage } from "../i18n.jsx";

// Shared loading/error presentation for every content surface — each page
// renders this instead of its real content while `useContent`'s status is
// not yet "ready".
export function ContentStatus({ status, error }) {
  const { t } = useLanguage();

  if (status === "loading") {
    return <p className="loading-note">{t("labels.loading")}</p>;
  }

  if (status === "error") {
    return (
      <p className="error-note" role="alert">
        {t("labels.loadError")} {error?.message}
      </p>
    );
  }

  return null;
}
