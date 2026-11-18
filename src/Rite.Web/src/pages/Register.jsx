import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n.jsx";
import { useAccount } from "../context/AccountContext.jsx";
import { normalizeEmail } from "../lib/account.js";

const COUNTRIES = ["United States", "Panama", "Argentina", "Mexico"];
const ROLES = ["teacher", "host", "leader", "coordinator", "school"];

const ERROR_KEYS = {
  "invalid-email": "invalidEmail",
  "weak-password": "weakPassword",
  "duplicate-email": "duplicateAccount"
};

export function Register() {
  const { t } = useLanguage();
  const { register } = useAccount();
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(formData.entries());
    fields.email = normalizeEmail(fields.email);

    setSubmitting(true);
    const result = await register(fields);
    setSubmitting(false);

    if (!result.ok) {
      setNotice(t(`labels.${ERROR_KEYS[result.error] || "registerError"}`));
      return;
    }
    navigate("/account");
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
            {t("labels.password")}
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder={t("placeholders.password")}
              minLength={8}
              required
            />
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
          <button className="button gold" type="submit" disabled={submitting}>
            {t("labels.registerButton")}
          </button>
        </div>
        <p className="privacy-note login-notice">{t("labels.previewLoginNotice")}</p>
        {notice && <div className="status-panel warning">{notice}</div>}
      </form>
    </section>
  );
}
