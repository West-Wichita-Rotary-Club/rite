import { useState } from "react";
import { useLanguage } from "../i18n.jsx";
import { useAccount } from "../context/AccountContext.jsx";
import { normalizeEmail } from "../lib/account.js";

const COUNTRIES = ["United States", "Panama", "Argentina", "Mexico"];
const ROLES = ["teacher", "host", "leader", "coordinator", "school"];

export function Register() {
  const { t } = useLanguage();
  const { accounts, storageAvailable, register } = useAccount();
  const [notice, setNotice] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(formData.entries());
    const email = normalizeEmail(fields.email);
    if (!email || !storageAvailable) {
      setNotice(t("labels.storageUnavailableNotice"));
      return;
    }
    if (accounts[email]) {
      setNotice(t("labels.duplicateAccount"));
      return;
    }
    register(email, fields);
    setNotice(t("labels.detailsSaved"));
  }

  return (
    <section className="section">
      <h1 className="section-title">{t("sections.registerTitle")}</h1>
      <p className="section-lede">{t("sections.registerIntro")}</p>
      <form className="form-card" onSubmit={handleSubmit}>
        <h2 className="form-title">{t("labels.fullName")}</h2>
        <div className="form-grid">
          <label className="field">
            {t("labels.fullName")}
            <input name="name" autoComplete="name" placeholder={t("placeholders.name")} />
          </label>
          <label className="field">
            {t("labels.email")}
            <input name="email" type="email" autoComplete="email" placeholder={t("placeholders.email")} required />
          </label>
          <label className="field">
            {t("labels.role")}
            <select name="role" defaultValue={ROLES[0]}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {t(`roles.${role}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("labels.country")}
            <select name="country" defaultValue={COUNTRIES[0]}>
              {COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </label>
          <label className="field">
            {t("labels.city")}
            <input name="city" placeholder={t("placeholders.city")} />
          </label>
          <label className="field">
            {t("labels.languages")}
            <input name="languages" placeholder={t("placeholders.languages")} />
          </label>
          <label className="field">
            {t("labels.years")}
            <input name="years" placeholder={t("placeholders.years")} />
          </label>
          <label className="field full">
            {t("labels.bio")}
            <textarea name="bio" placeholder={t("placeholders.bio")} />
          </label>
        </div>
        <div className="form-actions">
          <button className="button gold" type="submit">
            {t("labels.registerButton")}
          </button>
          <span className="privacy-note">{t("labels.noNetwork")}</span>
        </div>
        <p className="privacy-note login-notice">{t("labels.previewLoginNotice")}</p>
        {notice && <div className="status-panel">{notice}</div>}
      </form>
    </section>
  );
}
