import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useAccount } from "../context/AccountContext.jsx";
import { normalizeEmail } from "../lib/account.js";

export function Login() {
  const { t } = useLanguage();
  const { accounts, signIn } = useAccount();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = normalizeEmail(formData.get("email"));
    if (email && accounts[email]) {
      signIn(email);
      setError(false);
      navigate("/account");
    } else {
      setError(true);
    }
  }

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.loginTitle")}</h1>
      <p className="section-lede">{t("sections.loginIntro")}</p>
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label className="field full">
            {t("labels.email")}
            <input name="email" type="email" autoComplete="email" placeholder={t("placeholders.email")} required />
          </label>
        </div>
        <div className="form-actions">
          <button className="button gold" type="submit">
            {t("labels.signIn")}
          </button>
        </div>
        <p className="privacy-note login-notice">{t("labels.previewLoginNotice")}</p>
        {error && <div className="status-panel warning">{t("labels.unknownAccount")}</div>}
      </form>
    </section>
  );
}
