import { useLanguage } from "../i18n.jsx";

// Implements this PS's docs/ fate decision: docs/ is kept live as a fallback
// for the mocked account/login/registration UI only (out of scope here), so
// this banner tells visitors that content surfaces are now live from the
// real API and points back to that legacy preview for the rest.
const LEGACY_PREVIEW_URL = "https://west-wichita-rotary-club.github.io/rite/";

export function MockBanner() {
  const { t } = useLanguage();

  return (
    <div className="mock-banner">
      <div className="section">
        <span className="mock-dot" aria-hidden="true"></span>
        <span>{t("mockBanner")}</span>
        <a href={LEGACY_PREVIEW_URL}>{t("legacyPreviewCta")}</a>
      </div>
    </div>
  );
}
