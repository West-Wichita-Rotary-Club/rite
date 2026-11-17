import { state } from "./state.js";
import { t, localize, copy } from "./i18n.js";
import {
  schools,
  palette,
  getStories,
  getResources,
  getFaqs,
  getMilestones,
  getImpactMetrics,
  getProgramPhases,
  filterByAudience
} from "./content.js";
import { setView, setAlumniProfile, isNavActive } from "./router.js";
import {
  currentAccount,
  mockApi,
  normalizeEmail,
  createAccount,
  updateAccount,
  deleteAccount,
  signIn,
  signOut,
  StorageBudgetError,
  blankClaimDraft,
  blankParticipationRow,
  blankMemoryDraft,
  validateParticipationRow,
  downscalePhoto,
  profileCompleteness,
  CLAIM_ROLES,
  MAX_PHOTOS_PER_MEMORY,
  MAX_MEMORIES_PER_MEMBER
} from "./account.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderClaimBadge(claimStatus) {
  if (claimStatus === "partly_verified_official") {
    return `<span class="pending-badge">${escapeHtml(t("labels.partlyVerifiedBadge"))}</span>`;
  }
  return "";
}

export function render() {
  document.documentElement.lang = state.lang;
  document.getElementById("app").innerHTML = `
    ${renderHeader()}
    <main>
      ${renderMockBanner()}
      ${state.view === "home" ? renderHome() : ""}
      ${state.view === "about" ? renderAboutView() : ""}
      ${state.view === "participate" ? renderParticipateView() : ""}
      ${state.view === "community" ? renderCommunityView() : ""}
      ${state.view === "history" ? renderHistory() : ""}
      ${state.view === "faq" ? renderFaqView() : ""}
      ${state.view === "stories" ? renderStories() : ""}
      ${state.view === "directory" ? renderDirectory() : ""}
      ${state.view === "alumniProfile" ? renderAlumniProfilePage() : ""}
      ${state.view === "schools" ? renderSchools() : ""}
      ${state.view === "resources" ? renderResources() : ""}
      ${state.view === "register" ? renderRegister() : ""}
      ${state.view === "login" ? renderLogin() : ""}
      ${state.view === "account" ? renderAccount() : ""}
      ${renderFeedback()}
    </main>
    ${renderFooter()}
  `;
  bindEvents();
}

function renderHeader() {
  const nav = ["about", "participate", "community"];
  return `
    <header class="site-header">
      <div class="header-inner">
        <button class="brand brand-home" data-view="home" aria-label="RITE home">
          <img src="assets/WestWichitaRotary.png" alt="Rotary Club of West Wichita">
          <span class="brand-mark">
            <span class="brand-title">RITE</span>
            <span class="brand-subtitle">${escapeHtml(t("siteSub"))}</span>
          </span>
        </button>
        <nav class="nav" aria-label="Primary">
          ${nav.map((item) => `<button class="nav-button ${isNavActive(item) ? "active" : ""}" data-view="${item}">${escapeHtml(t(`nav.${item}`))}</button>`).join("")}
        </nav>
        <div class="header-actions">
          <div class="language-toggle" aria-label="Language">
            <button class="lang-button ${state.lang === "en" ? "active" : ""}" data-lang="en">EN</button>
            <button class="lang-button ${state.lang === "es" ? "active" : ""}" data-lang="es">ES</button>
          </div>
          ${renderHeaderAccountActions()}
        </div>
      </div>
    </header>
  `;
}

function renderHeaderAccountActions() {
  const account = currentAccount();
  if (!account) {
    return `
      <button class="button ghost" data-view="login">${escapeHtml(t("labels.signIn"))}</button>
      <button class="button gold" data-view="register">${escapeHtml(t("join"))}</button>
    `;
  }
  return `
    <button class="button ghost" data-view="account">${escapeHtml(account.name || account.email)}</button>
    <button class="button gold" data-action="sign-out">${escapeHtml(t("labels.signOut"))}</button>
  `;
}

// ps-007 docs/ fate decision: this folder stays live, scoped to the
// mocked account/login/registration/claim/memory UI that PS left out of
// scope, with every other surface pointing visitors at the real site.
const PRODUCTION_SITE_URL = "https://rite-app.makeboldspark.com";

function renderMockBanner() {
  return `
    <div class="mock-banner">
      <div class="section">
        <span class="mock-dot" aria-hidden="true"></span>
        <span>${escapeHtml(t("mock"))}</span>
        <a href="${PRODUCTION_SITE_URL}">${escapeHtml(t("liveSiteCta"))}</a>
      </div>
    </div>
    ${state.storageAvailable ? "" : `
      <div class="mock-banner warning">
        <div class="section">
          <span class="mock-dot" aria-hidden="true"></span>
          <span>${escapeHtml(t("labels.storageUnavailableNotice"))}</span>
        </div>
      </div>
    `}
  `;
}

function renderHome() {
  return `
    <section class="hero">
      <div class="hero-inner">
        <div>
          <p class="eyebrow">${escapeHtml(t("heroEducationLabel"))}</p>
          <h1>${escapeHtml(t("heroTitle"))}</h1>
          <p>${escapeHtml(t("heroBody"))}</p>
          <div class="hero-actions">
            <button class="button gold" data-view="about">${escapeHtml(t("heroPrimary"))}</button>
            <button class="button outline" data-view="stories">${escapeHtml(t("heroSecondary"))}</button>
          </div>
        </div>
        <div class="hero-panel">
          <img src="assets/RITE-Hero-Graphic.jpg" alt="${escapeHtml(t("areasAlt"))}">
        </div>
      </div>
    </section>
    <section class="section">
      <h2 class="section-title">${escapeHtml(t("audience.cardsTitle"))}</h2>
      <p class="section-lede">${escapeHtml(t("audience.cardsIntro"))}</p>
      ${renderAudienceCards()}
    </section>
    <section class="section">
      <h2 class="section-title">${escapeHtml(t("homeTitle"))}</h2>
      <p class="section-lede">${escapeHtml(t("homeIntro"))}</p>
      ${renderImpactStatsGrid(true)}
    </section>
    <section class="section">
      <h2 class="section-title">${escapeHtml(t("sections.storiesTitle"))}</h2>
      <div class="card-grid">
        ${getStories().slice(0, 3).map(renderStoryCard).join("")}
      </div>
    </section>
  `;
}

function renderAudienceCards() {
  const cards = [
    { key: "recruit", view: "participate", titleKey: "audience.recruitTitle", bodyKey: "audience.recruitBody", ctaKey: "audience.recruitCta", band: "gold" },
    { key: "alumni", view: "community", titleKey: "audience.alumniTitle", bodyKey: "audience.alumniBody", ctaKey: "audience.alumniCta", band: "royal" },
    { key: "active", view: "community", titleKey: "audience.activeTitle", bodyKey: "audience.activeBody", ctaKey: "audience.activeCta", band: "turquoise" }
  ];
  return `
    <div class="card-grid audience-cards">
      ${cards.map((card) => `
        <article class="card ${card.band} audience-card">
          <h3 class="card-title">${escapeHtml(t(card.titleKey))}</h3>
          <p>${escapeHtml(t(card.bodyKey))}</p>
          <div class="form-actions">
            <button class="button ghost" data-view="${card.view}">${escapeHtml(t(card.ctaKey))}</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderImpactStatsGrid(compact) {
  if (state.impactLoadStatus === "loading") {
    return `<div class="status-panel">${escapeHtml(t("labels.loadingImpact"))}</div>`;
  }
  if (state.impactLoadStatus === "error" || !state.impactContent) {
    return `<div class="status-panel warning">${escapeHtml(t("labels.impactLoadError"))}</div>`;
  }
  const metrics = compact ? getImpactMetrics().slice(0, 4) : getImpactMetrics();
  return `
    <div class="stats-grid">
      ${metrics.map((metric) => `
        <article class="stat-card">
          <div class="stat-number">${escapeHtml(metric.value)}</div>
          <div class="stat-label">${escapeHtml(localize(metric.label))}</div>
          <div class="stat-asof">${escapeHtml(t("labels.asOfLabel"))}: ${escapeHtml(localize(metric.asOf))}</div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAboutSubnav(active) {
  const items = [
    { view: "about", key: "about" },
    { view: "history", key: "history" },
    { view: "faq", key: "faq" }
  ];
  return `
    <div class="child-nav" aria-label="${escapeHtml(t("audience.subnavLabel"))}">
      ${items.map((item) => `
        <button class="child-nav-button ${active === item.key ? "active" : ""}" data-view="${item.view}">
          ${escapeHtml(t(`nav.${item.key}`))}
        </button>
      `).join("")}
    </div>
  `;
}

function renderParticipateSubnav(active) {
  const items = [
    { view: "participate", key: "participate" },
    { view: "schools", key: "schools" }
  ];
  return `
    <div class="child-nav" aria-label="${escapeHtml(t("audience.subnavLabel"))}">
      ${items.map((item) => `
        <button class="child-nav-button ${active === item.key ? "active" : ""}" data-view="${item.view}">
          ${escapeHtml(t(`nav.${item.key}`))}
        </button>
      `).join("")}
    </div>
  `;
}

function renderCommunitySubnav(active) {
  const items = [
    { view: "community", key: "community" },
    { view: "directory", key: "directory" },
    { view: "resources", key: "resources" }
  ];
  return `
    <div class="child-nav" aria-label="${escapeHtml(t("audience.subnavLabel"))}">
      ${items.map((item) => `
        <button class="child-nav-button ${active === item.key ? "active" : ""}" data-view="${item.view}">
          ${escapeHtml(t(`nav.${item.key}`))}
        </button>
      `).join("")}
    </div>
  `;
}

function renderAboutView() {
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("about.landingTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("about.landingIntro"))}</p>
      ${renderAboutSubnav("about")}

      <h2 class="card-title">${escapeHtml(t("about.whyTitle"))}</h2>
      <p>${escapeHtml(t("about.whyBody"))}</p>

      <h2 class="card-title">${escapeHtml(t("about.howTitle"))}</h2>
      <p>${escapeHtml(t("about.howIntro"))}</p>
      ${renderProgramCycle()}

      <h2 class="card-title">${escapeHtml(t("about.impactTitle"))}</h2>
      <p>${escapeHtml(t("about.impactIntro"))}</p>
      ${renderImpactStatsGrid(false)}
      <div class="form-actions">
        <button class="button ghost" data-view="history">${escapeHtml(t("about.seeFullHistory"))}</button>
        <button class="button ghost" data-view="faq">${escapeHtml(t("about.seeFaq"))}</button>
      </div>
    </section>
  `;
}

function renderProgramCycle() {
  if (state.programCycleLoadStatus === "loading") {
    return `<div class="status-panel">${escapeHtml(t("labels.loadingProgramCycle"))}</div>`;
  }
  if (state.programCycleLoadStatus === "error" || !state.programCycleContent) {
    return `<div class="status-panel warning">${escapeHtml(t("labels.programCycleLoadError"))}</div>`;
  }
  return `
    <div class="timeline">
      ${getProgramPhases().map((phase) => `
        <article class="timeline-card">
          <div class="timeline-year">${escapeHtml(localize(phase.period))}</div>
          <div>
            <h3 class="card-title">${escapeHtml(localize(phase.title))}</h3>
            <p>${escapeHtml(localize(phase.body))}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderHistory() {
  if (state.timelineLoadStatus === "loading") {
    return `<section class="section"><div class="status-panel">${escapeHtml(t("labels.loadingTimeline"))}</div></section>`;
  }
  if (state.timelineLoadStatus === "error" || !state.timelineContent) {
    return `<section class="section"><div class="status-panel warning">${escapeHtml(t("labels.timelineLoadError"))}</div></section>`;
  }
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.historyTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.historyIntro"))}</p>
      ${renderAboutSubnav("history")}
      <div class="timeline">
        ${getMilestones().map((item) => `
          <article class="timeline-card">
            <div class="timeline-year">${escapeHtml(item.year)}</div>
            <div>
              <h2 class="card-title">${escapeHtml(localize(item.title))}</h2>
              <p>${escapeHtml(localize(item.body))}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderFaqView() {
  if (state.faqLoadStatus === "loading") {
    return `<section class="section"><div class="status-panel">${escapeHtml(t("labels.loadingFaq"))}</div></section>`;
  }
  if (state.faqLoadStatus === "error" || !state.faqContent) {
    return `<section class="section"><div class="status-panel warning">${escapeHtml(t("labels.faqLoadError"))}</div></section>`;
  }
  const generalFaqs = getFaqs().filter((faq) => !faq.id.startsWith("host-faq"));
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.faqTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.faqIntro"))}</p>
      ${renderAboutSubnav("faq")}
      ${renderFaqList(generalFaqs)}
    </section>
  `;
}

function renderFaqList(faqs) {
  return `
    <div class="faq-list">
      ${faqs.map((faq) => `
        <article class="faq-item">
          <h3 class="card-title">${escapeHtml(localize(faq.question))}</h3>
          <p>${escapeHtml(localize(faq.answer))}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderStories() {
  if (state.storiesLoadStatus === "loading") {
    return `<section class="section"><div class="status-panel">${escapeHtml(t("labels.loadingStories"))}</div></section>`;
  }
  if (state.storiesLoadStatus === "error" || !state.storiesContent) {
    return `<section class="section"><div class="status-panel warning">${escapeHtml(t("labels.storiesLoadError"))}</div></section>`;
  }
  const filtered = getStories().filter((story) => state.storyFilter === "all" || story.country === state.storyFilter);
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.storiesTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.storiesIntro"))}</p>
      ${renderFilters("storyFilter", state.storyFilter)}
      <div class="card-grid">
        ${filtered.map(renderStoryCard).join("")}
      </div>
    </section>
  `;
}

function renderStoryCard(story) {
  return `
    <article class="card ${story.band}">
      <p class="meta">${escapeHtml(localize(story.tag))} · ${escapeHtml(story.year)}</p>
      <h2 class="card-title">${escapeHtml(localize(story.title))}</h2>
      <p>${escapeHtml(localize(story.excerpt))}</p>
      <p class="meta">${escapeHtml(story.author)} · ${escapeHtml(localize(story.role))}</p>
    </article>
  `;
}

function renderParticipateView() {
  const participateStories = filterByAudience(getStories(), "recruiting");
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("participate.landingTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("participate.landingIntro"))}</p>
      ${renderParticipateSubnav("participate")}

      <h2 class="card-title">${escapeHtml(t("participate.teacherTitle"))}</h2>
      <p>${escapeHtml(t("participate.teacherBody"))}</p>
      <div class="form-actions">
        <button class="button gold" data-view="register">${escapeHtml(t("participate.registerCta"))}</button>
      </div>

      <h2 class="card-title">${escapeHtml(t("participate.hostTitle"))}</h2>
      <p>${escapeHtml(t("participate.hostBody"))}</p>
      <div class="form-actions">
        <button class="button gold" data-view="register">${escapeHtml(t("participate.hostCta"))}</button>
      </div>
      <h3 class="card-title">${escapeHtml(t("participate.hostFaqTitle"))}</h3>
      ${renderHostFaqList()}

      <h2 class="card-title">${escapeHtml(t("participate.volunteerTitle"))}</h2>
      <p>${escapeHtml(t("participate.volunteerBody"))}</p>
      <div class="form-actions">
        <button class="button ghost" data-view="schools">${escapeHtml(t("participate.seeSchools"))}</button>
      </div>

      <h2 class="card-title">${escapeHtml(t("participate.storiesTitle"))}</h2>
      <p>${escapeHtml(t("participate.storiesIntro"))}</p>
      <div class="card-grid">
        ${participateStories.map(renderStoryCard).join("")}
      </div>
      <div class="form-actions">
        <button class="button ghost" data-view="stories">${escapeHtml(t("participate.seeAllStories"))}</button>
      </div>

      <div class="form-card audience-cta">
        <h2 class="form-title">${escapeHtml(t("participate.supportTitle"))}</h2>
        <p>${escapeHtml(t("participate.supportBody"))}</p>
        ${renderSupportForm()}
      </div>
    </section>
  `;
}

function renderHostFaqList() {
  if (state.faqLoadStatus !== "ready" || !state.faqContent) {
    return "";
  }
  const hostFaqs = getFaqs().filter((faq) => faq.id.startsWith("host-faq"));
  return renderFaqList(hostFaqs);
}

function renderSupportForm() {
  return `
    <form class="form-card" id="support-form">
      <h2 class="form-title">${escapeHtml(t("labels.supportIntro"))}</h2>
      <div class="form-grid">
        <label class="field">
          ${escapeHtml(t("labels.fullName"))}
          <input name="name" autocomplete="name" placeholder="${escapeHtml(t("placeholders.name"))}">
        </label>
        <label class="field">
          ${escapeHtml(t("labels.email"))}
          <input name="email" type="email" autocomplete="email" placeholder="${escapeHtml(t("placeholders.email"))}">
        </label>
        <label class="field full">
          ${escapeHtml(t("labels.supportWay"))}
          <select name="way">
            ${Object.keys(copy[state.lang].labels.supportWays).map((key) => `<option value="${key}">${escapeHtml(t(`labels.supportWays.${key}`))}</option>`).join("")}
          </select>
        </label>
        <label class="field full">
          ${escapeHtml(t("labels.supportMessage"))}
          <textarea name="message"></textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="button gold" type="submit">${escapeHtml(t("labels.supportSubmit"))}</button>
        <span class="privacy-note">${escapeHtml(t("labels.noNetwork"))}</span>
      </div>
      <div id="support-status" class="status-panel ${state.supportNotice ? "" : "hidden"}">
        ${escapeHtml(state.supportNotice)}
      </div>
    </form>
  `;
}

function renderCommunityView() {
  const communityStories = filterByAudience(getStories(), "alumni").concat(filterByAudience(getStories(), "active"))
    .filter((story, index, arr) => arr.findIndex((s) => s.id === story.id) === index);
  const activeResources = filterByAudience(getResources(), "active");
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("community.landingTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("community.landingIntro"))}</p>
      ${renderCommunitySubnav("community")}

      <h2 class="card-title">${escapeHtml(t("community.cohortTitle"))}</h2>
      <p>${escapeHtml(t("community.cohortBody"))}</p>

      <h2 class="card-title">${escapeHtml(t("sections.storiesTitle"))}</h2>
      <div class="card-grid">
        ${communityStories.map(renderStoryCard).join("")}
      </div>
      <div class="form-actions">
        <button class="button gold" data-view="directory">${escapeHtml(t("community.directoryCta"))}</button>
        <button class="button ghost" data-view="register">${escapeHtml(t("community.storyCta"))}</button>
      </div>

      <h2 class="card-title">${escapeHtml(t("community.currentTitle"))}</h2>
      <p class="privacy-note">${escapeHtml(t("community.currentBody"))}</p>
      <div class="resource-grid">
        ${renderResourceCards(activeResources)}
      </div>
      <div id="resource-status" class="status-panel hidden"></div>
      <div class="form-actions">
        <button class="button ghost" data-view="resources">${escapeHtml(t("community.resourcesCta"))}</button>
      </div>

      <div class="form-card audience-cta">
        <h2 class="form-title">${escapeHtml(t("community.currentUnlockTitle"))}</h2>
        <p>${escapeHtml(t("community.currentUnlockBody"))}</p>
        <div class="form-actions">
          <button class="button gold" data-view="register">${escapeHtml(t("community.currentUnlockCta"))}</button>
        </div>
      </div>
    </section>
  `;
}

function renderDirectory() {
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.directoryTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.directoryIntro"))}</p>
      ${renderCommunitySubnav("directory")}
      <p class="privacy-note">${escapeHtml(t("labels.private"))}</p>
      ${renderAlumniDirectoryContent()}
    </section>
  `;
}

function renderAlumniDirectoryContent() {
  if (state.alumniLoadStatus === "loading") {
    return `<div class="status-panel">${escapeHtml(t("labels.loadingAlumni"))}</div>`;
  }

  if (state.alumniLoadStatus === "error" || !state.alumniContent) {
    return `<div class="status-panel warning">${escapeHtml(t("labels.alumniLoadError"))}</div>`;
  }

  return `
    ${renderAlumniFilters(state.alumniContent)}
    ${renderAlumniGroups(state.alumniContent)}
  `;
}

function renderAlumniFilters(content) {
  return `
    <div class="directory-filter-panel">
      <div>
        <p class="filter-label">${escapeHtml(t("labels.countryFilter"))}</p>
        <div class="filters" aria-label="${escapeHtml(t("labels.countryFilter"))}">
          ${renderAlumniFilterButton("directoryCountryFilter", "all", t("filters.all"), state.directoryCountryFilter)}
          ${Object.entries(content.countries || {}).map(([key, country]) => (
            renderAlumniFilterButton("directoryCountryFilter", key, localize(country.label), state.directoryCountryFilter)
          )).join("")}
        </div>
      </div>
      <div>
        <p class="filter-label">${escapeHtml(t("labels.functionFilter"))}</p>
        <div class="filters" aria-label="${escapeHtml(t("labels.functionFilter"))}">
          ${renderAlumniFilterButton("directoryFunctionFilter", "all", t("filters.all"), state.directoryFunctionFilter)}
          ${Object.entries(content.functions || {}).map(([key, item]) => (
            renderAlumniFilterButton("directoryFunctionFilter", key, localize(item.label), state.directoryFunctionFilter)
          )).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderAlumniFilterButton(kind, value, label, selected) {
  return `
    <button class="filter-button ${selected === value ? "active" : ""}" data-filter-kind="${kind}" data-filter="${escapeHtml(value)}">
      ${escapeHtml(label)}
    </button>
  `;
}

function renderAlumniGroups(content) {
  const profiles = (content.profiles || []).filter((profile) => (
    state.directoryCountryFilter === "all" || profile.country === state.directoryCountryFilter
  ));
  const functionEntries = Object.entries(content.functions || {}).filter(([key]) => (
    state.directoryFunctionFilter === "all" || state.directoryFunctionFilter === key
  ));
  const groups = functionEntries.map(([key, item]) => {
    const groupedProfiles = profiles.filter((profile) => getProfileRoles(profile).includes(key));
    if (!groupedProfiles.length) {
      return "";
    }
    return `
      <section class="directory-group" aria-labelledby="directory-group-${escapeHtml(key)}">
        <div class="directory-group-heading">
          <h2 id="directory-group-${escapeHtml(key)}">${escapeHtml(localize(item.label))}</h2>
          <p>${escapeHtml(localize(item.summary))}</p>
        </div>
        <div class="card-grid">
          ${groupedProfiles.map((profile) => renderAlumniProfile(profile, content)).join("")}
        </div>
      </section>
    `;
  }).join("");

  return groups || `<div class="status-panel">${escapeHtml(t("labels.noAlumniResults"))}</div>`;
}

function renderAlumniProfile(profile, content) {
  return `
    <article class="profile-card ${getProfileBand(profile)}">
      <div class="profile-heading">
        <div class="avatar" aria-hidden="true">${escapeHtml(initials(profile.name))}</div>
        <div>
          <h3 class="card-title">${escapeHtml(profile.name)} ${renderClaimBadge(profile.claimStatus)}</h3>
          <p class="meta">${escapeHtml(localize(profile.place))} · ${escapeHtml(getCountryLabel(profile.country, content))}</p>
        </div>
      </div>
      ${renderFunctionBadges(profile, content)}
      <p>${escapeHtml(localize(profile.summary))}</p>
      <div class="year-block">
        <p class="meta">${escapeHtml(t("labels.participationYears"))}</p>
        ${renderYearList(profile)}
      </div>
      <div class="profile-card-actions">
        <a class="button ghost profile-link" href="#alumni/${encodeURIComponent(profile.id)}" data-profile-id="${escapeHtml(profile.id)}">${escapeHtml(t("labels.viewProfile"))}</a>
      </div>
    </article>
  `;
}

function renderAlumniProfilePage() {
  const content = state.alumniContent;
  if (state.alumniLoadStatus === "loading") {
    return `<section class="section"><div class="status-panel">${escapeHtml(t("labels.loadingAlumni"))}</div></section>`;
  }

  if (state.alumniLoadStatus === "error" || !content) {
    return `<section class="section"><div class="status-panel warning">${escapeHtml(t("labels.alumniLoadError"))}</div></section>`;
  }

  const profile = findAlumniProfile(state.selectedAlumniId, content);
  if (!profile) {
    return `
      <section class="section">
        <button class="button ghost" data-view="directory">${escapeHtml(t("labels.backToDirectory"))}</button>
        <div class="status-panel">${escapeHtml(t("labels.noAlumniResults"))}</div>
      </section>
    `;
  }

  return `
    <section class="section profile-page">
      <button class="button ghost" data-view="directory">${escapeHtml(t("labels.backToDirectory"))}</button>
      <div class="profile-page-header ${getProfileBand(profile)}">
        <div class="avatar large" aria-hidden="true">${escapeHtml(initials(profile.name))}</div>
        <div>
          <h1 class="section-title">${escapeHtml(profile.name)} ${renderClaimBadge(profile.claimStatus)}</h1>
          <p class="section-lede">${escapeHtml(localize(profile.place))} · ${escapeHtml(getCountryLabel(profile.country, content))}</p>
          ${renderFunctionBadges(profile, content)}
        </div>
      </div>
      <div class="profile-page-grid">
        <article class="profile-panel">
          <h2>${escapeHtml(t("labels.participationYears"))}</h2>
          ${renderYearList(profile)}
          <p>${escapeHtml(localize(profile.summary))}</p>
          <p class="privacy-note">${escapeHtml(t("labels.futureProfileNote"))}</p>
        </article>
        ${renderProfileCollection("memories", memoriesForProfilePage(profile), renderMemoryItem)}
        ${renderProfileCollection("pictures", picturesForProfilePage(profile), renderPictureItem)}
        ${renderProfileCollection("suggestions", profile.suggestions, renderSuggestionItem)}
      </div>
    </section>
  `;
}

function renderProfileCollection(kind, items, itemRenderer) {
  const fallbackKey = {
    memories: "noMemories",
    pictures: "noPictures",
    suggestions: "noSuggestions"
  }[kind];

  return `
    <article class="profile-panel">
      <h2>${escapeHtml(t(`labels.${kind}`))}</h2>
      ${items && items.length ? items.map(itemRenderer).join("") : `<p class="empty-note">${escapeHtml(t(`labels.${fallbackKey}`))}</p>`}
    </article>
  `;
}

function renderMemoryItem(item) {
  return `
    <div class="profile-content-item">
      <h3>${escapeHtml(localize(item.title))} ${item.pending ? `<span class="pending-badge">${escapeHtml(t("labels.pendingReviewBadge"))}</span>` : ""}</h3>
      <p>${escapeHtml(localize(item.body))}</p>
    </div>
  `;
}

function renderPictureItem(item) {
  return `
    <div class="profile-content-item picture-placeholder">
      ${item.src ? `
        <img class="profile-photo" src="${escapeHtml(item.src)}" alt="${escapeHtml(localize(item.caption))}">
      ` : `
        <div class="picture-frame" aria-hidden="true">${escapeHtml(item.year || "")}</div>
      `}
      <p>${escapeHtml(localize(item.caption))} ${item.pending ? `<span class="pending-badge">${escapeHtml(t("labels.pendingReviewBadge"))}</span>` : ""}</p>
    </div>
  `;
}

function memberClaimedProfileId() {
  const account = currentAccount();
  return account && account.claim && account.claim.matchedProfileId ? account.claim.matchedProfileId : null;
}

function memoriesForProfilePage(profile) {
  const reviewed = profile.memories || [];
  if (memberClaimedProfileId() !== profile.id) {
    return reviewed;
  }
  const account = currentAccount();
  const pendingMemories = (account.memories || []).map((memory) => ({
    title: { en: memory.title, es: memory.title },
    body: { en: memory.text, es: memory.text },
    pending: true
  }));
  return reviewed.concat(pendingMemories);
}

function picturesForProfilePage(profile) {
  const reviewed = profile.pictures || [];
  if (memberClaimedProfileId() !== profile.id) {
    return reviewed;
  }
  const account = currentAccount();
  const pendingPictures = (account.memories || []).reduce((acc, memory) => (
    acc.concat((memory.photos || []).map((src) => ({
      src,
      caption: { en: memory.title, es: memory.title },
      pending: true
    })))
  ), []);
  return reviewed.concat(pendingPictures);
}

function renderSuggestionItem(item) {
  return `
    <div class="profile-content-item">
      <p>${escapeHtml(localize(item.text))}</p>
    </div>
  `;
}

function findAlumniProfile(profileId, content) {
  return (content.profiles || []).find((profile) => profile.id === profileId);
}

function getProfileRoles(profile) {
  const roles = (profile.participation || []).map((record) => record.role);
  return Array.from(new Set(roles));
}

function getProfileYearTokens(profile) {
  const tokens = [];
  (profile.participation || []).forEach((record) => {
    if (record.range) {
      tokens.push(`${record.range.start}–${record.range.end}`);
    } else if (record.years) {
      record.years.forEach((year) => tokens.push(String(year)));
    }
  });
  return Array.from(new Set(tokens));
}

function renderFunctionBadges(profile, content) {
  return `
    <div class="function-badges">
      ${getProfileRoles(profile).map((key) => `
        <span class="function-badge ${escapeHtml(key)}">${escapeHtml(localize(content.functions[key].label))}</span>
      `).join("")}
    </div>
  `;
}

function renderYearList(profile) {
  const tokens = getProfileYearTokens(profile);
  if (!tokens.length) {
    return `<p class="year-note">${escapeHtml(localize(profile.participationYearNote) || "")}</p>`;
  }

  return `
    <div class="year-list">
      ${tokens.map((token) => `<span class="year-pill">${escapeHtml(token)}</span>`).join("")}
    </div>
  `;
}

function getProfileBand(profile) {
  const primaryFunction = getProfileRoles(profile)[0];
  return {
    leader: palette.royal,
    host: palette.gold,
    teacher: palette.turquoise
  }[primaryFunction] || palette.azure;
}

function getCountryLabel(countryKey, content) {
  const country = content.countries && content.countries[countryKey];
  return country ? localize(country.label) : countryKey;
}

function candidateProfilesForClaim(country, role, content) {
  if (!content) {
    return [];
  }
  return (content.profiles || []).filter((profile) => (
    profile.country === country && getProfileRoles(profile).includes(role)
  ));
}

function renderSchools() {
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.schoolsTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.schoolsIntro"))}</p>
      ${renderParticipateSubnav("schools")}
      <div class="card-grid">
        ${schools.map((school) => `
          <article class="card ${school.band}">
            <p class="meta">${escapeHtml(school.type === "school" ? "School" : "Rotary Club")}</p>
            <h2 class="card-title">${escapeHtml(school.name)}</h2>
            <p class="meta">${escapeHtml(school.place)}</p>
            <div class="school-metrics">
              <div class="school-metric"><strong>${escapeHtml(school.since)}</strong><span>${escapeHtml(t("labels.partnerSince"))}</span></div>
              <div class="school-metric"><strong>${escapeHtml(school.hosted)}</strong><span>${escapeHtml(t("labels.teachersHosted"))}</span></div>
            </div>
            <p>${escapeHtml(localize(school.desc))}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderResources() {
  if (state.resourcesLoadStatus === "loading") {
    return `<section class="section"><div class="status-panel">${escapeHtml(t("labels.loadingResources"))}</div></section>`;
  }
  if (state.resourcesLoadStatus === "error" || !state.resourcesContent) {
    return `<section class="section"><div class="status-panel warning">${escapeHtml(t("labels.resourcesLoadError"))}</div></section>`;
  }
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.resourcesTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.resourcesIntro"))}</p>
      ${renderCommunitySubnav("resources")}
      <div class="resource-grid">
        ${renderResourceCards(getResources())}
      </div>
      <div id="resource-status" class="status-panel hidden"></div>
    </section>
  `;
}

function renderResourceCards(items) {
  return items.map((resource, index) => `
    <article class="card ${index % 3 === 1 ? "azure" : index % 3 === 2 ? "turquoise" : ""}">
      <p class="meta">${escapeHtml(t("labels.noNetwork"))}</p>
      <h2 class="card-title">${escapeHtml(localize(resource.title))}</h2>
      <p>${escapeHtml(localize(resource.body))}</p>
      <div class="form-actions">
        <button class="button ghost" data-resource="${escapeHtml(localize(resource.title))}">${escapeHtml(t("labels.resourceSubmit"))}</button>
      </div>
    </article>
  `).join("");
}

function renderRegister() {
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.registerTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.registerIntro"))}</p>
      <form class="form-card" id="register-form">
        <h2 class="form-title">${escapeHtml(t("labels.interestIntro"))}</h2>
        <div class="form-grid">
          <label class="field">
            ${escapeHtml(t("labels.fullName"))}
            <input name="name" autocomplete="name" placeholder="${escapeHtml(t("placeholders.name"))}">
          </label>
          <label class="field">
            ${escapeHtml(t("labels.email"))}
            <input name="email" type="email" autocomplete="email" placeholder="${escapeHtml(t("placeholders.email"))}">
          </label>
          <label class="field">
            ${escapeHtml(t("labels.involvement"))}
            <select name="role">
              ${Object.keys(copy[state.lang].roles).map((role) => `<option value="${role}">${escapeHtml(t(`roles.${role}`))}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            ${escapeHtml(t("labels.country"))}
            <select name="country">
              <option>United States</option>
              <option>Panama</option>
              <option>Argentina</option>
              <option>Mexico</option>
            </select>
          </label>
          <label class="field">
            ${escapeHtml(t("labels.city"))}
            <input name="city" placeholder="${escapeHtml(t("placeholders.city"))}">
          </label>
          <label class="field">
            ${escapeHtml(t("labels.languages"))}
            <input name="languages" placeholder="${escapeHtml(t("placeholders.languages"))}">
          </label>
          <label class="field">
            ${escapeHtml(t("labels.years"))}
            <input name="years" placeholder="${escapeHtml(t("placeholders.years"))}">
          </label>
          <label class="field full">
            ${escapeHtml(t("labels.bio"))}
            <textarea name="bio" placeholder="${escapeHtml(t("placeholders.bio"))}"></textarea>
          </label>
        </div>
        <div class="form-actions">
          <button class="button gold" type="submit">${escapeHtml(t("labels.expressInterest"))}</button>
          <span class="privacy-note">${escapeHtml(t("labels.noNetwork"))}</span>
        </div>
        <p class="privacy-note login-notice">${escapeHtml(t("labels.previewLoginNotice"))}</p>
        <div id="register-status" class="status-panel ${state.accountNotice ? "" : "hidden"}">
          ${escapeHtml(state.accountNotice)}
        </div>
      </form>
    </section>
  `;
}

function renderAccount() {
  const account = currentAccount();
  if (!account) {
    return `
      <section class="section">
        <div class="status-panel warning">${escapeHtml(t("labels.unknownAccount"))}</div>
      </section>
    `;
  }
  return `
    <section class="section account-page">
      <h1 class="section-title">${escapeHtml(t("sections.accountTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.accountIntro"))}</p>
      ${renderDashboardSummary(account)}
      ${renderAccountDetailsForm(account)}
      ${renderClaimSection(account)}
      ${renderMemoriesSection(account)}
      <div class="account-danger">
        <button class="button ghost" type="button" data-action="clear-data">${escapeHtml(t("labels.clearDataButton"))}</button>
      </div>
    </section>
  `;
}

function renderDashboardSummary(account) {
  const claimStatusLabel = account.claim ? t("labels.pendingReviewBadge") : t("labels.dashboardClaimStatusNone");
  const memoriesCount = (account.memories || []).length;
  const completeness = profileCompleteness(account);
  return `
    <section class="dashboard-summary" aria-label="${escapeHtml(t("sections.dashboardSummaryTitle"))}">
      <h2 class="form-title">${escapeHtml(t("sections.dashboardSummaryTitle"))}</h2>
      <div class="stats-grid dashboard-summary-grid">
        <article class="stat-card">
          <div class="stat-number">${escapeHtml(claimStatusLabel)}</div>
          <div class="stat-label">${escapeHtml(t("labels.dashboardClaimStatusLabel"))}</div>
        </article>
        <article class="stat-card">
          <div class="stat-number">${memoriesCount}</div>
          <div class="stat-label">${escapeHtml(t("labels.dashboardMemoriesLabel"))}</div>
        </article>
        <article class="stat-card">
          <div class="stat-number">${completeness}%</div>
          <div class="stat-label">${escapeHtml(t("labels.dashboardCompletenessLabel"))}</div>
        </article>
      </div>
    </section>
  `;
}

function renderAccountDetailsForm(account) {
  return `
    <form class="form-card" id="details-form">
      <h2 class="form-title">${escapeHtml(t("labels.fullName"))}</h2>
      <div class="form-grid">
        <label class="field">
          ${escapeHtml(t("labels.role"))}
          <select name="role">
            ${Object.keys(copy[state.lang].roles).map((role) => `<option value="${role}" ${account.role === role ? "selected" : ""}>${escapeHtml(t(`roles.${role}`))}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          ${escapeHtml(t("labels.fullName"))}
          <input name="name" autocomplete="name" value="${escapeHtml(account.name)}">
        </label>
        <label class="field">
          ${escapeHtml(t("labels.country"))}
          <input name="country" value="${escapeHtml(account.country)}">
        </label>
        <label class="field">
          ${escapeHtml(t("labels.city"))}
          <input name="city" value="${escapeHtml(account.city)}">
        </label>
        <label class="field">
          ${escapeHtml(t("labels.languages"))}
          <input name="languages" value="${escapeHtml(account.languages)}">
        </label>
        <label class="field">
          ${escapeHtml(t("labels.years"))}
          <input name="years" value="${escapeHtml(account.years)}">
        </label>
        <label class="field full">
          ${escapeHtml(t("labels.bio"))}
          <textarea name="bio">${escapeHtml(account.bio)}</textarea>
        </label>
      </div>
      <div class="form-actions">
        <button class="button gold" type="submit">${escapeHtml(t("labels.saveDetails"))}</button>
        ${state.accountNotice ? `<span class="privacy-note">${escapeHtml(state.accountNotice)}</span>` : ""}
      </div>
    </form>
  `;
}

function renderClaimSection(account) {
  if (state.claimEditing) {
    return renderClaimForm(account);
  }
  if (!account.claim) {
    return `
      <article class="profile-panel">
        <h2>${escapeHtml(t("sections.claimTitle"))}</h2>
        <p>${escapeHtml(t("labels.claimNoneYet"))}</p>
        <div class="form-actions">
          <button class="button gold" type="button" data-action="claim-start">${escapeHtml(t("sections.claimTitle"))}</button>
        </div>
      </article>
    `;
  }
  return `
    <article class="profile-panel">
      <h2>${escapeHtml(t("sections.claimTitle"))}</h2>
      <p class="meta">${escapeHtml(getCountryLabel(account.claim.country, state.alumniContent))} <span class="pending-badge">${escapeHtml(t("labels.pendingReviewBadge"))}</span></p>
      ${renderClaimHistory(account.claim)}
      <p class="meta">${account.claim.matchedProfileId ? escapeHtml(findAlumniProfile(account.claim.matchedProfileId, state.alumniContent)?.name || "") : escapeHtml(account.claim.selfDeclaredName)}</p>
      <div class="form-actions">
        <button class="button ghost" type="button" data-action="claim-edit">${escapeHtml(t("labels.claimEditButton"))}</button>
        <button class="button ghost" type="button" data-action="claim-withdraw">${escapeHtml(t("labels.claimWithdrawButton"))}</button>
      </div>
    </article>
  `;
}

function renderClaimHistory(claim) {
  const sorted = claim.participation.slice().sort((a, b) => a.yearFrom - b.yearFrom);
  return `
    <div class="year-list">
      ${sorted.map((row) => `
        <span class="year-pill">${escapeHtml(t(`roles.${row.role}`))} · ${escapeHtml(row.yearTo && row.yearTo !== row.yearFrom ? `${row.yearFrom}–${row.yearTo}` : row.yearFrom)}</span>
      `).join("")}
    </div>
  `;
}

function renderClaimForm(account) {
  const draft = state.claimDraft || blankClaimDraft(account.claim);
  const content = state.alumniContent;
  const draftRoles = draft.participation.map((row) => row.role).filter(Boolean);
  const candidates = draft.country && draftRoles.length
    ? draftRoles.reduce((acc, role) => acc.concat(candidateProfilesForClaim(draft.country, role, content)), [])
      .filter((profile, index, arr) => arr.findIndex((p) => p.id === profile.id) === index)
    : [];

  return `
    <form class="form-card" id="claim-form">
      <h2 class="form-title">${escapeHtml(t("sections.claimTitle"))}</h2>
      <p class="section-lede">${escapeHtml(t("sections.claimIntro"))}</p>
      <div class="form-grid">
        <label class="field">
          ${escapeHtml(t("labels.claimCountryLabel"))}
          <select name="country" id="claim-country">
            <option value="">-</option>
            ${Object.entries((content && content.countries) || {}).map(([key, country]) => `
              <option value="${escapeHtml(key)}" ${draft.country === key ? "selected" : ""}>${escapeHtml(localize(country.label))}</option>
            `).join("")}
          </select>
        </label>
      </div>
      <div id="claim-rows">
        ${draft.participation.map((row, index) => renderClaimRow(row, index, content)).join("")}
      </div>
      <div class="form-actions">
        <button class="button ghost" type="button" data-action="claim-add-row">${escapeHtml(t("labels.claimAddRow"))}</button>
      </div>
      ${candidates.length ? `
        <div class="claim-match">
          <p class="filter-label">${escapeHtml(t("labels.claimMatchTitle"))}</p>
          ${candidates.map((profile) => `
            <label class="field claim-match-option">
              <input type="radio" name="matchedProfileId" value="${escapeHtml(profile.id)}" ${draft.matchedProfileId === profile.id ? "checked" : ""}>
              ${escapeHtml(profile.name)}
            </label>
          `).join("")}
          <label class="field claim-match-option">
            <input type="radio" name="matchedProfileId" value="" ${draft.matchedProfileId ? "" : "checked"}>
            ${escapeHtml(t("labels.claimMatchNone"))}
          </label>
        </div>
      ` : ""}
      <label class="field full">
        ${escapeHtml(t("labels.claimSelfDeclareNameLabel"))}
        <input name="selfDeclaredName" value="${escapeHtml(draft.selfDeclaredName)}">
      </label>
      <div id="claim-error" class="status-panel warning ${state.claimError ? "" : "hidden"}">${escapeHtml(t("labels.claimRangeError"))}</div>
      <div class="form-actions">
        <button class="button gold" type="submit">${escapeHtml(t("labels.claimSaveButton"))}</button>
        <button class="button ghost" type="button" data-action="claim-cancel">${escapeHtml(t("labels.cancelButton"))}</button>
      </div>
    </form>
  `;
}

function renderClaimRow(row, index, content) {
  return `
    <div class="form-grid claim-row" data-row-index="${index}">
      <label class="field">
        ${escapeHtml(t("labels.claimRoleLabel"))}
        <select name="role" data-row-field="role" data-row-index="${index}">
          <option value="">-</option>
          ${CLAIM_ROLES.map((role) => `
            <option value="${role}" ${row.role === role ? "selected" : ""}>${escapeHtml(content && content.functions ? localize(content.functions[role].label) : role)}</option>
          `).join("")}
        </select>
      </label>
      <label class="field">
        ${escapeHtml(t("labels.claimYearFromLabel"))}
        <input type="number" data-row-field="yearFrom" data-row-index="${index}" value="${escapeHtml(row.yearFrom)}">
      </label>
      <label class="field">
        ${escapeHtml(t("labels.claimYearToLabel"))}
        <input type="number" data-row-field="yearTo" data-row-index="${index}" value="${escapeHtml(row.yearTo)}">
      </label>
      <div class="form-actions">
        <button class="button ghost" type="button" data-action="claim-remove-row" data-row-index="${index}">${escapeHtml(t("labels.claimRemoveRow"))}</button>
      </div>
    </div>
  `;
}

function renderMemoriesSection(account) {
  const memories = account.memories || [];
  return `
    <article class="profile-panel">
      <h2>${escapeHtml(t("labels.memories"))}</h2>
      ${memories.length ? memories.map((memory) => renderAccountMemoryItem(memory)).join("") : `<p class="empty-note">${escapeHtml(t("labels.memoryNoneYet"))}</p>`}
      ${state.memoryDraft ? renderMemoryComposer() : renderMemoryComposerToggle(memories.length)}
    </article>
  `;
}

function renderAccountMemoryItem(memory) {
  return `
    <div class="profile-content-item">
      <h3>${escapeHtml(memory.title)} <span class="pending-badge">${escapeHtml(t("labels.pendingReviewBadge"))}</span></h3>
      <p>${escapeHtml(memory.text)}</p>
      ${memory.photos.length ? `
        <div class="memory-photo-row">
          ${memory.photos.map((src) => `<img class="memory-photo-thumb" src="${src}" alt="">`).join("")}
        </div>
      ` : ""}
      <div class="form-actions">
        <button class="button ghost" type="button" data-action="memory-edit" data-memory-id="${escapeHtml(memory.id)}">${escapeHtml(t("labels.memoryEditButton"))}</button>
        <button class="button ghost" type="button" data-action="memory-delete" data-memory-id="${escapeHtml(memory.id)}">${escapeHtml(t("labels.memoryDeleteButton"))}</button>
      </div>
    </div>
  `;
}

function renderMemoryComposerToggle(memoryCount) {
  if (memoryCount >= MAX_MEMORIES_PER_MEMBER) {
    return `<p class="empty-note">${escapeHtml(t("labels.memoryCapReached"))}</p>`;
  }
  return `
    <div class="form-actions">
      <button class="button gold" type="button" data-action="memory-start">${escapeHtml(t("sections.memoriesComposerTitle"))}</button>
    </div>
  `;
}

function renderMemoryComposer() {
  const draft = state.memoryDraft;
  return `
    <form class="form-card" id="memory-form">
      <h2 class="form-title">${escapeHtml(t("sections.memoriesComposerTitle"))}</h2>
      <div class="form-grid">
        <label class="field full">
          ${escapeHtml(t("labels.memoryTitleLabel"))}
          <input name="title" value="${escapeHtml(draft.title)}" required>
        </label>
        <label class="field full">
          ${escapeHtml(t("labels.memoryTextLabel"))}
          <textarea name="text" required>${escapeHtml(draft.text)}</textarea>
        </label>
        <label class="field full">
          ${escapeHtml(t("labels.memoryPhotosLabel"))}
          <input type="file" id="memory-photo-input" accept="image/*" multiple>
        </label>
      </div>
      ${draft.photos.length ? `
        <div class="memory-photo-row">
          ${draft.photos.map((src, index) => `
            <span class="memory-photo-draft">
              <img class="memory-photo-thumb" src="${src}" alt="">
              <button class="button ghost" type="button" data-action="memory-remove-photo" data-photo-index="${index}">×</button>
            </span>
          `).join("")}
        </div>
      ` : ""}
      <div id="memory-photo-error" class="status-panel warning ${state.memoryPhotoError ? "" : "hidden"}">${escapeHtml(state.memoryPhotoError)}</div>
      <div class="form-actions">
        <button class="button gold" type="submit">${escapeHtml(t("labels.memorySaveButton"))}</button>
        <button class="button ghost" type="button" data-action="memory-cancel">${escapeHtml(t("labels.cancelButton"))}</button>
      </div>
    </form>
  `;
}

function renderLogin() {
  return `
    <section class="section">
      <h1 class="section-title">${escapeHtml(t("sections.loginTitle"))}</h1>
      <p class="section-lede">${escapeHtml(t("sections.loginIntro"))}</p>
      <form class="form-card" id="login-form">
        <div class="form-grid">
          <label class="field full">
            ${escapeHtml(t("labels.email"))}
            <input name="email" type="email" autocomplete="email" placeholder="${escapeHtml(t("placeholders.email"))}" required>
          </label>
        </div>
        <div class="form-actions">
          <button class="button gold" type="submit">${escapeHtml(t("labels.signIn"))}</button>
        </div>
        <p class="privacy-note login-notice">${escapeHtml(t("labels.previewLoginNotice"))}</p>
        <div id="login-status" class="status-panel warning ${state.loginError ? "" : "hidden"}">
          ${escapeHtml(t("labels.unknownAccount"))}
        </div>
      </form>
    </section>
  `;
}

function renderFilters(kind, selected) {
  return `
    <div class="filters" aria-label="Filters">
      ${["all", "panama", "argentina", "usa"].map((filter) => `
        <button class="filter-button ${selected === filter ? "active" : ""}" data-filter-kind="${kind}" data-filter="${filter}">
          ${escapeHtml(t(`filters.${filter}`))}
        </button>
      `).join("")}
    </div>
  `;
}

function renderBuildInfo() {
  if (state.buildInfoLoadStatus !== "ready" || !state.buildInfo || !state.buildInfo.builtAt) {
    return "";
  }
  const builtAt = new Date(state.buildInfo.builtAt);
  if (Number.isNaN(builtAt.getTime())) {
    return "";
  }
  const formatted = new Intl.DateTimeFormat(state.lang === "es" ? "es" : "en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(builtAt);
  return ` · ${escapeHtml(t("labels.builtLabel"))}: ${escapeHtml(formatted)}`;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <strong>${escapeHtml(t("footerTitle"))}</strong>
          <p>${escapeHtml(t("footerSub"))}</p>
        </div>
        <p>${escapeHtml(t("motto"))} · ${escapeHtml(t("labels.noNetwork"))}${renderBuildInfo()}</p>
      </div>
    </footer>
  `;
}

function renderFeedback() {
  return `
    <section class="feedback-strip" aria-labelledby="feedback-title">
      <div class="feedback-inner">
        <div>
          <h2 id="feedback-title">${escapeHtml(t("feedbackTitle"))}</h2>
          <p>${escapeHtml(t("feedbackBody"))}</p>
        </div>
        <a class="button feedback-link" href="https://github.com/West-Wichita-Rotary-Club/rite/issues">
          ${escapeHtml(t("feedbackLink"))}
        </a>
      </div>
    </section>
  `;
}

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("");
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lang = button.dataset.lang;
      render();
    });
  });

  document.querySelectorAll("[data-filter-kind]").forEach((button) => {
    button.addEventListener("click", () => {
      state[button.dataset.filterKind] = button.dataset.filter;
      render();
    });
  });

  document.querySelectorAll("[data-profile-id]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setAlumniProfile(link.dataset.profileId);
    });
  });

  document.querySelectorAll("[data-resource]").forEach((button) => {
    button.addEventListener("click", async () => {
      const result = await mockApi.submitResource(button.dataset.resource);
      const status = document.getElementById("resource-status");
      status.classList.remove("hidden");
      status.textContent = `${t("labels.resourceSubmit")} ${result.title}`;
    });
  });

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const fields = Object.fromEntries(formData.entries());
      await mockApi.submitProfile(fields);
      const email = normalizeEmail(fields.email);
      if (!email || !state.storageAvailable) {
        state.accountNotice = t("labels.submitted");
      } else if (state.accounts[email]) {
        state.accountNotice = t("labels.duplicateAccount");
      } else {
        try {
          createAccount(email, fields);
          signIn(email);
          state.accountNotice = t("labels.submitted");
        } catch (error) {
          if (!(error instanceof StorageBudgetError)) {
            throw error;
          }
          state.accountNotice = t("labels.memoryStorageFull");
        }
      }
      render();
    });
  }

  const supportForm = document.getElementById("support-form");
  if (supportForm) {
    supportForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(supportForm);
      const fields = Object.fromEntries(formData.entries());
      await mockApi.submitSupportInterest(fields);
      state.supportNotice = t("labels.supportSubmitted");
      render();
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = normalizeEmail(formData.get("email"));
      if (email && state.accounts[email]) {
        signIn(email);
        state.loginError = false;
        setView("account");
      } else {
        state.loginError = true;
        render();
      }
    });
  }

  document.querySelectorAll('[data-action="sign-out"]').forEach((button) => {
    button.addEventListener("click", () => {
      signOut();
      setView("home");
    });
  });

  bindAccountEvents();
}

function bindAccountEvents() {
  const account = currentAccount();
  if (!account) {
    return;
  }

  const detailsForm = document.getElementById("details-form");
  if (detailsForm) {
    detailsForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(detailsForm);
      const fields = Object.fromEntries(formData.entries());
      updateAccount(account.email, (existing) => ({ ...existing, ...fields }));
      state.accountNotice = t("labels.detailsSaved");
      render();
    });
  }

  document.querySelectorAll('[data-action="claim-start"], [data-action="claim-edit"]').forEach((button) => {
    button.addEventListener("click", () => {
      state.claimDraft = blankClaimDraft(account.claim);
      state.claimEditing = true;
      state.claimError = false;
      render();
    });
  });

  document.querySelectorAll('[data-action="claim-cancel"]').forEach((button) => {
    button.addEventListener("click", () => {
      state.claimEditing = false;
      state.claimDraft = null;
      state.claimError = false;
      render();
    });
  });

  document.querySelectorAll('[data-action="claim-withdraw"]').forEach((button) => {
    button.addEventListener("click", () => {
      updateAccount(account.email, (existing) => ({ ...existing, claim: null }));
      state.accountNotice = t("labels.claimWithdrawnNotice");
      render();
    });
  });

  document.querySelectorAll('[data-action="claim-add-row"]').forEach((button) => {
    button.addEventListener("click", () => {
      state.claimDraft.participation.push(blankParticipationRow());
      render();
    });
  });

  document.querySelectorAll('[data-action="claim-remove-row"]').forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.rowIndex);
      state.claimDraft.participation.splice(index, 1);
      if (!state.claimDraft.participation.length) {
        state.claimDraft.participation.push(blankParticipationRow());
      }
      render();
    });
  });

  document.querySelectorAll("[data-row-field]").forEach((input) => {
    input.addEventListener("change", () => {
      const index = Number(input.dataset.rowIndex);
      state.claimDraft.participation[index][input.dataset.rowField] = input.value;
      render();
    });
  });

  const claimCountrySelect = document.getElementById("claim-country");
  if (claimCountrySelect) {
    claimCountrySelect.addEventListener("change", () => {
      state.claimDraft.country = claimCountrySelect.value;
      state.claimDraft.matchedProfileId = "";
      render();
    });
  }

  const claimForm = document.getElementById("claim-form");
  if (claimForm) {
    claimForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const draft = state.claimDraft;
      const invalid = draft.participation.some((row) => validateParticipationRow(row));
      if (!draft.country || !draft.participation.length || invalid) {
        state.claimError = true;
        render();
        return;
      }
      const formData = new FormData(claimForm);
      const matchedProfileId = formData.get("matchedProfileId") || "";
      const selfDeclaredName = formData.get("selfDeclaredName") || "";
      const claim = {
        country: draft.country,
        participation: draft.participation.map((row) => ({ ...row })),
        matchedProfileId,
        selfDeclaredName
      };
      try {
        updateAccount(account.email, (existing) => ({ ...existing, claim }));
        state.claimEditing = false;
        state.claimDraft = null;
        state.claimError = false;
        state.accountNotice = t("labels.claimSavedNotice");
      } catch (error) {
        if (!(error instanceof StorageBudgetError)) {
          throw error;
        }
        state.accountNotice = t("labels.memoryStorageFull");
      }
      render();
    });
  }

  document.querySelectorAll('[data-action="memory-start"]').forEach((button) => {
    button.addEventListener("click", () => {
      state.memoryDraft = blankMemoryDraft(null);
      state.memoryPhotoError = "";
      render();
    });
  });

  document.querySelectorAll('[data-action="memory-edit"]').forEach((button) => {
    button.addEventListener("click", () => {
      const memory = account.memories.find((item) => item.id === button.dataset.memoryId);
      state.memoryDraft = blankMemoryDraft(memory);
      state.memoryPhotoError = "";
      render();
    });
  });

  document.querySelectorAll('[data-action="memory-cancel"]').forEach((button) => {
    button.addEventListener("click", () => {
      state.memoryDraft = null;
      state.memoryPhotoError = "";
      render();
    });
  });

  document.querySelectorAll('[data-action="memory-delete"]').forEach((button) => {
    button.addEventListener("click", () => {
      updateAccount(account.email, (existing) => ({
        ...existing,
        memories: existing.memories.filter((item) => item.id !== button.dataset.memoryId)
      }));
      render();
    });
  });

  document.querySelectorAll('[data-action="memory-remove-photo"]').forEach((button) => {
    button.addEventListener("click", () => {
      state.memoryDraft.photos.splice(Number(button.dataset.photoIndex), 1);
      render();
    });
  });

  const photoInput = document.getElementById("memory-photo-input");
  if (photoInput) {
    photoInput.addEventListener("change", async () => {
      const files = Array.from(photoInput.files || []);
      state.memoryPhotoError = "";
      for (const file of files) {
        if (state.memoryDraft.photos.length >= MAX_PHOTOS_PER_MEMORY) {
          state.memoryPhotoError = t("labels.memoryPhotoCapReached");
          break;
        }
        try {
          const dataUrl = await downscalePhoto(file);
          state.memoryDraft.photos.push(dataUrl);
        } catch (_error) {
          state.memoryPhotoError = t("labels.memoryNonImageFile");
        }
      }
      render();
    });
  }

  const memoryForm = document.getElementById("memory-form");
  if (memoryForm) {
    memoryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(memoryForm);
      const draft = state.memoryDraft;
      const isNew = !draft.id;
      if (isNew && account.memories.length >= MAX_MEMORIES_PER_MEMBER) {
        state.memoryPhotoError = t("labels.memoryCapReached");
        render();
        return;
      }
      const memory = {
        id: draft.id || `memory-${Date.now()}-${Math.round(Math.random() * 1000)}`,
        title: formData.get("title") || "",
        text: formData.get("text") || "",
        photos: draft.photos.slice()
      };
      try {
        updateAccount(account.email, (existing) => ({
          ...existing,
          memories: isNew
            ? existing.memories.concat(memory)
            : existing.memories.map((item) => (item.id === memory.id ? memory : item))
        }));
        state.memoryDraft = null;
        state.memoryPhotoError = "";
      } catch (error) {
        if (!(error instanceof StorageBudgetError)) {
          throw error;
        }
        state.memoryPhotoError = t("labels.memoryStorageFull");
      }
      render();
    });
  }

  const clearDataButton = document.querySelector('[data-action="clear-data"]');
  if (clearDataButton) {
    clearDataButton.addEventListener("click", () => {
      if (!window.confirm(t("labels.clearDataConfirm"))) {
        return;
      }
      deleteAccount(account.email);
      signOut();
      setView("home");
    });
  }
}
