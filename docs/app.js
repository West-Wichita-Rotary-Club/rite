(function () {
  const STORE_KEY = "rite-preview-submissions";
  const ALUMNI_CONTENT_URL = "content/alumni.json";
  const STORIES_CONTENT_URL = "content/stories.json";
  const RESOURCES_CONTENT_URL = "content/resources.json";

  const state = {
    lang: "en",
    view: "home",
    storyFilter: "all",
    directoryCountryFilter: "all",
    directoryFunctionFilter: "all",
    selectedStoryId: "s1",
    selectedAlumniId: "",
    alumniContent: null,
    alumniLoadStatus: "loading",
    storiesContent: null,
    storiesLoadStatus: "loading",
    resourcesContent: null,
    resourcesLoadStatus: "loading",
    submissions: readSubmissions()
  };

  const palette = {
    azure: "azure",
    royal: "royal",
    gold: "gold",
    turquoise: "turquoise",
    cranberry: "cranberry"
  };

  const copy = {
    en: {
      siteSub: "Inter-country Teacher Exchange",
      join: "Join the community",
      mock: "Static preview: all API, login, registration, and submission behavior is mocked locally. No data leaves this page.",
      motto: "Service Above Self",
      heroEducationLabel: "What is RITE?",
      heroTitle: "Teachers cross borders. Classrooms open up.",
      heroBody: "The Rotary Inter-country Teacher Exchange (RITE) sends Wichita teachers to partner classrooms in Panama and Argentina, and welcomes their teachers here in return. This preview explains how it works, who's part of it, and how you can join.",
      heroPrimary: "See how it works",
      heroSecondary: "Read the stories",
      homeTitle: "From archive to community platform",
      homeIntro: "This static preview demonstrates the future public experience while the production .NET API, SQLite database, and React app are still being built.",
      stats: ["Inbound and outbound teachers since 1996", "Teachers received from Panama", "Teachers received from Argentina", "Years of partnership"],
      areasAlt: "Rotary Areas of Focus",
      nav: {
        history: "History",
        stories: "Stories",
        directory: "Alumni",
        schools: "Schools & Clubs",
        resources: "Resources",
        register: "Register"
      },
      sections: {
        historyTitle: "A living history",
        historyIntro: "Six milestones tell the RITE story from a kitchen-table idea to a three-country community of educators.",
        historyTimeline: "Timeline",
        storiesTitle: "Story archive",
        storiesIntro: "Approved public stories from teachers, host families, and Rotary leaders. Publication is modeled as editor-reviewed even in this mock preview.",
        directoryTitle: "Alumni network",
        directoryIntro: "A privacy-safe preview of the future member directory and where-are-they-now experience.",
        schoolsTitle: "Schools and clubs",
        schoolsIntro: "Partner schools and Rotary clubs document cooperation, hosting history, and institutional continuity.",
        resourcesTitle: "Curriculum and replication resources",
        resourcesIntro: "Mocked resource cards show the future repository for lesson plans, training modules, ESL videos, and replication guides.",
        registerTitle: "Join the RITE community",
        registerIntro: "This form simulates the future registration workflow. Submitted preview data is stored only in this browser."
      },
      filters: {
        all: "All",
        panama: "Panama",
        argentina: "Argentina",
        usa: "United States"
      },
      labels: {
        partnerSince: "Partner since",
        teachersHosted: "Teachers hosted",
        private: "Preview privacy: contact details are hidden until a future editor approves membership.",
        role: "I am...",
        fullName: "Full name",
        email: "Email",
        country: "Country",
        city: "City",
        languages: "Languages",
        years: "RITE exchange year(s)",
        bio: "Short biography",
        submit: "Submit mock request",
        submitted: "Mock request received. In production, an editor would review this profile before directory access or story submission opens.",
        resourceSubmit: "Mock resource queued for editor review.",
        noNetwork: "Local mock API",
        countryFilter: "Country",
        functionFilter: "Community role",
        participationYears: "Participation years",
        loadingAlumni: "Loading static alumni content...",
        alumniLoadError: "Alumni content could not be loaded. Serve the docs folder with a static web server to preview JSON-driven content.",
        noAlumniResults: "No profiles match these filters yet.",
        viewProfile: "View profile",
        backToDirectory: "Back to alumni",
        memories: "Memories",
        pictures: "Pictures",
        suggestions: "Suggestions",
        futureProfileNote: "Profile pages are static placeholders for reviewed memories, photos, and contribution suggestions.",
        noMemories: "No reviewed memories have been added yet.",
        noPictures: "No reviewed pictures have been added yet.",
        noSuggestions: "No suggestions have been added yet.",
        loadingStories: "Loading static story content...",
        storiesLoadError: "Story content could not be loaded. Serve the docs folder with a static web server to preview JSON-driven content.",
        loadingResources: "Loading static resource content...",
        resourcesLoadError: "Resource content could not be loaded. Serve the docs folder with a static web server to preview JSON-driven content.",
        interestIntro: "Tell us about your interest",
        involvement: "How would you like to be involved?",
        expressInterest: "Express interest"
      },
      roles: {
        teacher: "Teacher",
        host: "Host family",
        leader: "Rotary leader",
        coordinator: "Coordinator",
        school: "School administrator"
      },
      placeholders: {
        name: "e.g. Maria Camarena",
        email: "name@example.org",
        city: "e.g. Wichita",
        languages: "Spanish, English",
        years: "2019",
        bio: "Your connection to RITE in one or two sentences"
      },
      audience: {
        cardsTitle: "Find your path in RITE",
        cardsIntro: "However you're connected to the exchange, start here.",
        subnavLabel: "Audience sections",
        recruitNavLabel: "About RITE",
        alumniNavLabel: "Alumni",
        activeNavLabel: "Current participants",
        recruitTitle: "New here? Start with the program",
        recruitBody: "Learn what RITE is, see the impact, and find out how to teach abroad, host a teacher, or partner your school or club.",
        recruitCta: "Learn about RITE",
        alumniTitle: "RITE alumni",
        alumniBody: "Find your community by country and role, revisit your profile, and reconnect with fellow teachers, hosts, and leaders.",
        alumniCta: "Go to the alumni network",
        activeTitle: "Current participants",
        activeBody: "Free public resources for teachers, host families, and coordinators right now, enhanced further once you're part of the program.",
        activeCta: "See participant resources",
        recruitLandingTitle: "What is RITE?",
        recruitLandingIntro: "The Rotary Inter-country Teacher Exchange connects classrooms in Wichita, Panama, and Argentina. Here's how it works and how to get involved.",
        recruitHowTitle: "How the exchange works",
        recruitHowBody: "Teachers, host families, Rotary clubs, and partner schools work together each year to send and welcome educators across three countries.",
        seeFullTimeline: "See the full timeline",
        recruitImpactTitle: "Stories from the exchange",
        seeAllStories: "Read all stories",
        recruitSchoolsTitle: "Partner schools and clubs",
        recruitSchoolsBody: "Schools and Rotary clubs in Wichita, Panama, and Argentina make the exchange possible year after year.",
        seeSchools: "See schools and clubs",
        recruitResourcesTitle: "Replication and education resources",
        seeAllResources: "See all resources",
        recruitCtaTitle: "Interested in joining RITE?",
        recruitCtaBody: "Tell us how you'd like to be involved, as a teacher, a host family, a school, or a club, and we'll follow up. This preview's interest form is fully mocked; no data leaves this page.",
        recruitCtaButton: "Express interest",
        alumniLandingTitle: "RITE alumni network",
        alumniLandingIntro: "Explore alumni by country and by community role, and revisit your own profile.",
        alumniDirectoryCta: "Browse the alumni directory",
        alumniStoryCta: "Share your story",
        activeLandingTitle: "Resources for current participants",
        activeLandingIntro: "Free public resources that can be enhanced by your participation.",
        activeFreeNote: "These resources are free and public. Joining RITE as a teacher, host, or coordinator unlocks more: training modules, scheduling tools, and direct coordinator support.",
        activeUnlockTitle: "Want more than the free resources?",
        activeUnlockBody: "Join the RITE community to unlock training modules, scheduling tools, and direct coordinator support.",
        activeUnlockCta: "Express interest"
      },
      footerTitle: "Rotary Inter-country Teacher Exchange",
      footerSub: "A program of Rotary District 5680, Wichita, Kansas, with partners in Panama and Argentina",
      feedbackTitle: "Help shape this preview",
      feedbackBody: "Reviewers can request changes, report gaps, or suggest story and archive improvements in the project issue tracker.",
      feedbackLink: "Leave feedback on GitHub"
    },
    es: {
      siteSub: "Intercambio Internacional de Docentes",
      join: "Unirse a la comunidad",
      mock: "Vista previa estatica: API, inicio de sesion, registro y envios son simulados localmente. Ningun dato sale de esta pagina.",
      motto: "Dar de Si antes de Pensar en Si",
      heroEducationLabel: "Que es RITE?",
      heroTitle: "Docentes cruzan fronteras. Las aulas se abren.",
      heroBody: "El Intercambio Internacional de Docentes de Rotary (RITE) envia docentes de Wichita a aulas asociadas en Panama y Argentina, y recibe a sus docentes aqui a cambio. Esta vista previa explica como funciona, quien participa y como puede unirse.",
      heroPrimary: "Vea como funciona",
      heroSecondary: "Leer historias",
      homeTitle: "Del archivo a una plataforma comunitaria",
      homeIntro: "Esta vista previa estatica muestra la futura experiencia publica mientras se construyen la API .NET, la base SQLite y la aplicacion React.",
      stats: ["Docentes enviados y recibidos desde 1996", "Docentes recibidos de Panama", "Docentes recibidos de Argentina", "Anos de alianza"],
      areasAlt: "Areas de enfoque de Rotary",
      nav: {
        history: "Historia",
        stories: "Historias",
        directory: "Exalumnos",
        schools: "Escuelas",
        resources: "Recursos",
        register: "Registro"
      },
      sections: {
        historyTitle: "Una historia viva",
        historyIntro: "Seis hitos cuentan la historia de RITE, desde una idea inicial hasta una comunidad educativa de tres paises.",
        historyTimeline: "Linea de tiempo",
        storiesTitle: "Archivo de historias",
        storiesIntro: "Historias publicas aprobadas de docentes, familias anfitrionas y lideres rotarios. La publicacion se modela con revision editorial.",
        directoryTitle: "Red de exalumnos",
        directoryIntro: "Vista previa segura del futuro directorio privado y la seccion donde estan ahora.",
        schoolsTitle: "Escuelas y clubes",
        schoolsIntro: "Escuelas asociadas y clubes rotarios documentan cooperacion, hospedaje y continuidad institucional.",
        resourcesTitle: "Curriculo y recursos de replicacion",
        resourcesIntro: "Tarjetas simuladas muestran el futuro repositorio de planes de clase, modulos, videos ESL y guias de replicacion.",
        registerTitle: "Unirse a la comunidad RITE",
        registerIntro: "Este formulario simula el futuro registro. Los datos se guardan solo en este navegador."
      },
      filters: {
        all: "Todos",
        panama: "Panama",
        argentina: "Argentina",
        usa: "Estados Unidos"
      },
      labels: {
        partnerSince: "Socio desde",
        teachersHosted: "Docentes recibidos",
        private: "Privacidad de vista previa: los datos de contacto se ocultan hasta aprobacion editorial futura.",
        role: "Soy...",
        fullName: "Nombre completo",
        email: "Correo electronico",
        country: "Pais",
        city: "Ciudad",
        languages: "Idiomas",
        years: "Ano(s) de intercambio RITE",
        bio: "Biografia breve",
        submit: "Enviar solicitud simulada",
        submitted: "Solicitud simulada recibida. En produccion, un editor revisaria este perfil antes de abrir directorio o envio de historias.",
        resourceSubmit: "Recurso simulado enviado a revision editorial.",
        noNetwork: "API local simulada",
        countryFilter: "Pais",
        functionFilter: "Rol comunitario",
        participationYears: "Anos de participacion",
        loadingAlumni: "Cargando contenido estatico de exalumnos...",
        alumniLoadError: "No se pudo cargar el contenido de exalumnos. Sirva la carpeta docs con un servidor web estatico para ver contenido basado en JSON.",
        noAlumniResults: "Ningun perfil coincide con estos filtros todavia.",
        viewProfile: "Ver perfil",
        backToDirectory: "Volver a exalumnos",
        memories: "Memorias",
        pictures: "Fotos",
        suggestions: "Sugerencias",
        futureProfileNote: "Las paginas de perfil son espacios estaticos para memorias, fotos y sugerencias revisadas.",
        noMemories: "Todavia no hay memorias revisadas.",
        noPictures: "Todavia no hay fotos revisadas.",
        noSuggestions: "Todavia no hay sugerencias.",
        loadingStories: "Cargando contenido estatico de historias...",
        storiesLoadError: "No se pudo cargar el contenido de historias. Sirva la carpeta docs con un servidor web estatico para ver contenido basado en JSON.",
        loadingResources: "Cargando contenido estatico de recursos...",
        resourcesLoadError: "No se pudo cargar el contenido de recursos. Sirva la carpeta docs con un servidor web estatico para ver contenido basado en JSON.",
        interestIntro: "Cuentenos su interes",
        involvement: "Como le gustaria participar?",
        expressInterest: "Expresar interes"
      },
      roles: {
        teacher: "Docente",
        host: "Familia anfitriona",
        leader: "Lider rotario",
        coordinator: "Coordinador",
        school: "Administrador escolar"
      },
      placeholders: {
        name: "p. ej. Maria Camarena",
        email: "nombre@example.org",
        city: "p. ej. Wichita",
        languages: "espanol, ingles",
        years: "2019",
        bio: "Su vinculo con RITE en una o dos frases"
      },
      audience: {
        cardsTitle: "Encuentre su camino en RITE",
        cardsIntro: "Sin importar como esta conectado con el intercambio, comience aqui.",
        subnavLabel: "Secciones por audiencia",
        recruitNavLabel: "Sobre RITE",
        alumniNavLabel: "Exalumnos",
        activeNavLabel: "Participantes actuales",
        recruitTitle: "Nuevo aqui? Comience con el programa",
        recruitBody: "Conozca que es RITE, vea su impacto y descubra como ensenar en el extranjero, hospedar a un docente o asociar su escuela o club.",
        recruitCta: "Conocer RITE",
        alumniTitle: "Exalumnos de RITE",
        alumniBody: "Encuentre su comunidad por pais y por rol, revise su perfil y reconectese con otros docentes, anfitriones y lideres.",
        alumniCta: "Ir a la red de exalumnos",
        activeTitle: "Participantes actuales",
        activeBody: "Recursos publicos gratuitos para docentes, familias anfitrionas y coordinadores ahora mismo, ampliados una vez que forme parte del programa.",
        activeCta: "Ver recursos para participantes",
        recruitLandingTitle: "Que es RITE?",
        recruitLandingIntro: "El Intercambio Internacional de Docentes de Rotary conecta aulas de Wichita, Panama y Argentina. Asi funciona y asi puede participar.",
        recruitHowTitle: "Como funciona el intercambio",
        recruitHowBody: "Docentes, familias anfitrionas, clubes rotarios y escuelas asociadas trabajan juntos cada ano para enviar y recibir educadores en tres paises.",
        seeFullTimeline: "Ver la linea de tiempo completa",
        recruitImpactTitle: "Historias del intercambio",
        seeAllStories: "Leer todas las historias",
        recruitSchoolsTitle: "Escuelas y clubes asociados",
        recruitSchoolsBody: "Escuelas y clubes rotarios en Wichita, Panama y Argentina hacen posible el intercambio ano tras ano.",
        seeSchools: "Ver escuelas y clubes",
        recruitResourcesTitle: "Recursos de replicacion y educacion",
        seeAllResources: "Ver todos los recursos",
        recruitCtaTitle: "Interesado en unirse a RITE?",
        recruitCtaBody: "Cuentenos como le gustaria participar, como docente, familia anfitriona, escuela o club, y le contactaremos. El formulario de interes de esta vista previa es totalmente simulado; ningun dato sale de esta pagina.",
        recruitCtaButton: "Expresar interes",
        alumniLandingTitle: "Red de exalumnos de RITE",
        alumniLandingIntro: "Explore a los exalumnos por pais y por rol comunitario, y revise su propio perfil.",
        alumniDirectoryCta: "Explorar el directorio de exalumnos",
        alumniStoryCta: "Compartir su historia",
        activeLandingTitle: "Recursos para participantes actuales",
        activeLandingIntro: "Recursos publicos gratuitos que se amplian con su participacion.",
        activeFreeNote: "Estos recursos son gratuitos y publicos. Unirse a RITE como docente, anfitrion o coordinador desbloquea mas: modulos de capacitacion, herramientas de programacion y apoyo directo de coordinacion.",
        activeUnlockTitle: "Quiere mas que los recursos gratuitos?",
        activeUnlockBody: "Unase a la comunidad RITE para desbloquear modulos de capacitacion, herramientas de programacion y apoyo directo de coordinacion.",
        activeUnlockCta: "Expresar interes"
      },
      footerTitle: "Intercambio Internacional de Docentes de Rotary",
      footerSub: "Un programa del Distrito 5680 de Rotary, Wichita, Kansas, con socios en Panama y Argentina",
      feedbackTitle: "Ayude a mejorar esta vista previa",
      feedbackBody: "Los revisores pueden pedir cambios, reportar vacios o sugerir mejoras para historias y archivo en el registro de incidencias del proyecto.",
      feedbackLink: "Enviar comentarios en GitHub"
    }
  };

  const milestones = [
    {
      year: "1996",
      title: { en: "The founding", es: "La fundacion" },
      body: {
        en: "Ralph and Armida Hight launch the exchange in Rotary District 5680, connecting Wichita classrooms with Latin America.",
        es: "Ralph y Armida Hight inician el intercambio en el Distrito 5680, conectando aulas de Wichita con America Latina."
      }
    },
    {
      year: "1996-2001",
      title: { en: "The Mexico era", es: "La era de Mexico" },
      body: {
        en: "The first five years send 13 Wichita teachers to Mexico and establish classroom immersion plus host-family hospitality.",
        es: "Los primeros cinco anos envian 13 docentes de Wichita a Mexico y establecen inmersion en aula con hospitalidad familiar."
      }
    },
    {
      year: "2001-present",
      title: { en: "Panama and Argentina expansion", es: "Expansion a Panama y Argentina" },
      body: {
        en: "The program shifts to Panama and later Argentina, welcoming 39 Panamanian and 45 Argentinian inbound teachers.",
        es: "El programa se traslada a Panama y luego Argentina, recibiendo 39 docentes panamenos y 45 argentinos."
      }
    },
    {
      year: "2010",
      title: { en: "Leadership continuity", es: "Continuidad del liderazgo" },
      body: {
        en: "Coordination transitions to Dalia Hale and Shelli Kadel, preserving deep relationships among schools, clubs, and families.",
        es: "La coordinacion pasa a Dalia Hale y Shelli Kadel, preservando relaciones profundas entre escuelas, clubes y familias."
      }
    },
    {
      year: "2020-2023",
      title: { en: "Pandemic and recovery", es: "Pandemia y recuperacion" },
      body: {
        en: "Travel pauses during COVID-19, then the inbound program resumes in 2023.",
        es: "Los viajes se pausan durante COVID-19 y el programa de recepcion se reanuda en 2023."
      }
    },
    {
      year: "2026",
      title: { en: "Digital archive preview", es: "Vista previa del archivo digital" },
      body: {
        en: "RITE approaches 30 years with a public static preview for the future community archive.",
        es: "RITE se acerca a 30 anos con una vista previa publica del futuro archivo comunitario."
      }
    }
  ];

  const schools = [
    { type: "school", band: palette.azure, name: "Pleasant Valley Middle School", place: "Wichita, Kansas", since: "2004", hosted: "11", desc: { en: "Host school for ESL co-teaching, cultural assemblies, and pen-pal projects.", es: "Escuela anfitriona para ESL, asambleas culturales y correspondencia." } },
    { type: "school", band: palette.turquoise, name: "Instituto Panamericano", place: "Panama City, Panama", since: "2006", hosted: "9", desc: { en: "Long-standing partner sending bilingual educators to Wichita.", es: "Socio de larga data que envia docentes bilingues a Wichita." } },
    { type: "school", band: palette.cranberry, name: "Escuela Normal Superior de Mendoza", place: "Mendoza, Argentina", since: "2009", hosted: "8", desc: { en: "Teacher-training institution represented in Argentina's RITE cohorts.", es: "Institucion de formacion docente representada en cohortes argentinas." } },
    { type: "club", band: palette.gold, name: "Rotary Club of West Wichita", place: "Wichita, Kansas", since: "1996", hosted: "30+", desc: { en: "Founding club stewarding host families, travel support, and this archive.", es: "Club fundador que custodia familias anfitrionas, viajes y este archivo." } }
  ];

  const mockApi = {
    submitProfile(payload) {
      return new Promise((resolve) => {
        window.setTimeout(() => {
          state.submissions.unshift({
            type: "profile",
            name: payload.name || "Preview member",
            role: payload.role,
            createdAt: new Date().toISOString()
          });
          writeSubmissions(state.submissions);
          resolve({ ok: true });
        }, 250);
      });
    },
    submitResource(title) {
      return new Promise((resolve) => {
        window.setTimeout(() => resolve({ ok: true, title }), 180);
      });
    }
  };

  function readSubmissions() {
    try {
      return JSON.parse(window.localStorage.getItem(STORE_KEY) || "[]");
    } catch (_error) {
      return [];
    }
  }

  function writeSubmissions(items) {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(items.slice(0, 12)));
  }

  async function loadAlumniContent() {
    try {
      const response = await window.fetch(ALUMNI_CONTENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Alumni content returned ${response.status}`);
      }
      state.alumniContent = await response.json();
      state.alumniLoadStatus = "ready";
    } catch (_error) {
      state.alumniLoadStatus = "error";
    }
    render();
  }

  async function loadStoriesContent() {
    try {
      const response = await window.fetch(STORIES_CONTENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Story content returned ${response.status}`);
      }
      state.storiesContent = await response.json();
      state.storiesLoadStatus = "ready";
    } catch (_error) {
      state.storiesLoadStatus = "error";
    }
    render();
  }

  async function loadResourcesContent() {
    try {
      const response = await window.fetch(RESOURCES_CONTENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Resource content returned ${response.status}`);
      }
      state.resourcesContent = await response.json();
      state.resourcesLoadStatus = "ready";
    } catch (_error) {
      state.resourcesLoadStatus = "error";
    }
    render();
  }

  function getAudiences(item) {
    return item.audiences && item.audiences.length ? item.audiences : ["recruiting"];
  }

  function filterByAudience(items, audience) {
    return items.filter((item) => getAudiences(item).includes(audience));
  }

  function getStories() {
    return (state.storiesContent && state.storiesContent.stories) || [];
  }

  function getResources() {
    return (state.resourcesContent && state.resourcesContent.resources) || [];
  }

  function t(path) {
    return path.split(".").reduce((value, key) => value[key], copy[state.lang]);
  }

  function localize(value) {
    return value && typeof value === "object" ? value[state.lang] || value.en : value;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setView(view) {
    state.view = view;
    if (view !== "alumniProfile" && window.location.hash.startsWith("#alumni/")) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }

  function setAlumniProfile(profileId) {
    state.selectedAlumniId = profileId;
    state.view = "alumniProfile";
    window.location.hash = `alumni/${encodeURIComponent(profileId)}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }

  function applyHashRoute() {
    const match = window.location.hash.match(/^#alumni\/(.+)$/);
    if (!match) {
      return;
    }
    state.selectedAlumniId = decodeURIComponent(match[1]);
    state.view = "alumniProfile";
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }

  function render() {
    document.documentElement.lang = state.lang;
    document.getElementById("app").innerHTML = `
      ${renderHeader()}
      <main>
        ${renderMockBanner()}
        ${state.view === "home" ? renderHome() : ""}
        ${state.view === "recruit" ? renderRecruitView() : ""}
        ${state.view === "alumniLanding" ? renderAlumniLandingView() : ""}
        ${state.view === "activeLanding" ? renderActiveLandingView() : ""}
        ${state.view === "history" ? renderHistory() : ""}
        ${state.view === "stories" ? renderStories() : ""}
        ${state.view === "directory" ? renderDirectory() : ""}
        ${state.view === "alumniProfile" ? renderAlumniProfilePage() : ""}
        ${state.view === "schools" ? renderSchools() : ""}
        ${state.view === "resources" ? renderResources() : ""}
        ${state.view === "register" ? renderRegister() : ""}
        ${renderFeedback()}
      </main>
      ${renderFooter()}
    `;
    bindEvents();
  }

  function renderHeader() {
    const nav = ["history", "stories", "schools", "resources"];
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
            <button class="button gold" data-view="register">${escapeHtml(t("join"))}</button>
          </div>
        </div>
      </header>
    `;
  }

  function isNavActive(item) {
    if (item === "history") {
      return state.view === "history" || state.view === "directory" || state.view === "alumniProfile";
    }
    return state.view === item;
  }

  function renderMockBanner() {
    return `
      <div class="mock-banner">
        <div class="section">
          <span class="mock-dot" aria-hidden="true"></span>
          <span>${escapeHtml(t("mock"))}</span>
        </div>
      </div>
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
              <button class="button gold" data-view="recruit">${escapeHtml(t("heroPrimary"))}</button>
              <button class="button outline" data-view="stories">${escapeHtml(t("heroSecondary"))}</button>
            </div>
          </div>
          <div class="hero-panel">
            <img src="assets/areas-of-focus.png" alt="${escapeHtml(t("areasAlt"))}">
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
        <div class="stats-grid">
          ${["97+", "39", "45", "30"].map((num, index) => `
            <article class="stat-card">
              <div class="stat-number">${num}</div>
              <div class="stat-label">${escapeHtml(copy[state.lang].stats[index])}</div>
            </article>
          `).join("")}
        </div>
      </section>
      <section class="section">
        <h2 class="section-title">${escapeHtml(t("sections.storiesTitle"))}</h2>
        <div class="card-grid">
          ${getStories().slice(0, 3).map(renderStoryCard).join("")}
        </div>
      </section>
    `;
  }

  function renderAudienceCards(activeAudience) {
    const cards = [
      { key: "recruit", view: "recruit", titleKey: "audience.recruitTitle", bodyKey: "audience.recruitBody", ctaKey: "audience.recruitCta", band: "gold" },
      { key: "alumni", view: "alumniLanding", titleKey: "audience.alumniTitle", bodyKey: "audience.alumniBody", ctaKey: "audience.alumniCta", band: "royal" },
      { key: "active", view: "activeLanding", titleKey: "audience.activeTitle", bodyKey: "audience.activeBody", ctaKey: "audience.activeCta", band: "turquoise" }
    ];
    return `
      <div class="card-grid audience-cards">
        ${cards.map((card) => `
          <article class="card ${card.band} audience-card ${activeAudience === card.key ? "current" : ""}">
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

  function renderHistory() {
    return `
      <section class="section">
        <h1 class="section-title">${escapeHtml(t("sections.historyTitle"))}</h1>
        <p class="section-lede">${escapeHtml(t("sections.historyIntro"))}</p>
        ${renderHistorySubnav("timeline")}
        <div class="timeline">
          ${milestones.map((item) => `
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

  function renderAudienceSubnav(active) {
    const items = [
      { view: "recruit", key: "recruit" },
      { view: "alumniLanding", key: "alumni" },
      { view: "activeLanding", key: "active" }
    ];
    return `
      <div class="child-nav" aria-label="${escapeHtml(t("audience.subnavLabel"))}">
        ${items.map((item) => `
          <button class="child-nav-button ${active === item.key ? "active" : ""}" data-view="${item.view}">
            ${escapeHtml(t(`audience.${item.key}NavLabel`))}
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderRecruitView() {
    const recruitStories = filterByAudience(getStories(), "recruiting");
    const recruitResources = filterByAudience(getResources(), "recruiting");
    const highlightMilestones = [milestones[0], milestones[2], milestones[5]].filter(Boolean);
    return `
      <section class="section">
        <h1 class="section-title">${escapeHtml(t("audience.recruitLandingTitle"))}</h1>
        <p class="section-lede">${escapeHtml(t("audience.recruitLandingIntro"))}</p>
        ${renderAudienceSubnav("recruit")}

        <h2 class="card-title">${escapeHtml(t("audience.recruitHowTitle"))}</h2>
        <p>${escapeHtml(t("audience.recruitHowBody"))}</p>
        <div class="timeline">
          ${highlightMilestones.map((item) => `
            <article class="timeline-card">
              <div class="timeline-year">${escapeHtml(item.year)}</div>
              <div>
                <h3 class="card-title">${escapeHtml(localize(item.title))}</h3>
                <p>${escapeHtml(localize(item.body))}</p>
              </div>
            </article>
          `).join("")}
        </div>
        <div class="form-actions">
          <button class="button ghost" data-view="history">${escapeHtml(t("audience.seeFullTimeline"))}</button>
        </div>

        <h2 class="card-title">${escapeHtml(t("audience.recruitImpactTitle"))}</h2>
        <div class="card-grid">
          ${recruitStories.map(renderStoryCard).join("")}
        </div>
        <div class="form-actions">
          <button class="button ghost" data-view="stories">${escapeHtml(t("audience.seeAllStories"))}</button>
        </div>

        <h2 class="card-title">${escapeHtml(t("audience.recruitSchoolsTitle"))}</h2>
        <p>${escapeHtml(t("audience.recruitSchoolsBody"))}</p>
        <div class="form-actions">
          <button class="button ghost" data-view="schools">${escapeHtml(t("audience.seeSchools"))}</button>
        </div>

        <h2 class="card-title">${escapeHtml(t("audience.recruitResourcesTitle"))}</h2>
        <div class="resource-grid">
          ${renderResourceCards(recruitResources)}
        </div>
        <div class="form-actions">
          <button class="button ghost" data-view="resources">${escapeHtml(t("audience.seeAllResources"))}</button>
        </div>

        <div class="form-card audience-cta">
          <h2 class="form-title">${escapeHtml(t("audience.recruitCtaTitle"))}</h2>
          <p>${escapeHtml(t("audience.recruitCtaBody"))}</p>
          <div class="form-actions">
            <button class="button gold" data-view="register">${escapeHtml(t("audience.recruitCtaButton"))}</button>
          </div>
        </div>
      </section>
    `;
  }

  function renderAlumniLandingView() {
    const alumniStories = filterByAudience(getStories(), "alumni");
    return `
      <section class="section">
        <h1 class="section-title">${escapeHtml(t("audience.alumniLandingTitle"))}</h1>
        <p class="section-lede">${escapeHtml(t("audience.alumniLandingIntro"))}</p>
        ${renderAudienceSubnav("alumni")}

        <div class="form-actions">
          <button class="button gold" data-view="directory">${escapeHtml(t("audience.alumniDirectoryCta"))}</button>
          <button class="button ghost" data-view="register">${escapeHtml(t("audience.alumniStoryCta"))}</button>
        </div>

        <h2 class="card-title">${escapeHtml(t("sections.storiesTitle"))}</h2>
        <div class="card-grid">
          ${alumniStories.map(renderStoryCard).join("")}
        </div>
      </section>
    `;
  }

  function renderActiveLandingView() {
    if (state.resourcesLoadStatus === "loading") {
      return `<section class="section"><div class="status-panel">${escapeHtml(t("labels.loadingResources"))}</div></section>`;
    }
    if (state.resourcesLoadStatus === "error" || !state.resourcesContent) {
      return `<section class="section"><div class="status-panel warning">${escapeHtml(t("labels.resourcesLoadError"))}</div></section>`;
    }
    const activeResources = filterByAudience(getResources(), "active");
    return `
      <section class="section">
        <h1 class="section-title">${escapeHtml(t("audience.activeLandingTitle"))}</h1>
        <p class="section-lede">${escapeHtml(t("audience.activeLandingIntro"))}</p>
        ${renderAudienceSubnav("active")}

        <p class="privacy-note">${escapeHtml(t("audience.activeFreeNote"))}</p>
        <div class="resource-grid">
          ${renderResourceCards(activeResources)}
        </div>
        <div id="resource-status" class="status-panel hidden"></div>

        <div class="form-card audience-cta">
          <h2 class="form-title">${escapeHtml(t("audience.activeUnlockTitle"))}</h2>
          <p>${escapeHtml(t("audience.activeUnlockBody"))}</p>
          <div class="form-actions">
            <button class="button gold" data-view="register">${escapeHtml(t("audience.activeUnlockCta"))}</button>
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
        ${renderHistorySubnav("directory")}
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
      const groupedProfiles = profiles.filter((profile) => (profile.functions || []).includes(key));
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
            <h3 class="card-title">${escapeHtml(profile.name)}</h3>
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
            <h1 class="section-title">${escapeHtml(profile.name)}</h1>
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
          ${renderProfileCollection("memories", profile.memories, renderMemoryItem)}
          ${renderProfileCollection("pictures", profile.pictures, renderPictureItem)}
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
        <h3>${escapeHtml(localize(item.title))}</h3>
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
        <p>${escapeHtml(localize(item.caption))}</p>
      </div>
    `;
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

  function renderFunctionBadges(profile, content) {
    return `
      <div class="function-badges">
        ${(profile.functions || []).map((key) => `
          <span class="function-badge ${escapeHtml(key)}">${escapeHtml(localize(content.functions[key].label))}</span>
        `).join("")}
      </div>
    `;
  }

  function renderYearList(profile) {
    if (!profile.participationYears || !profile.participationYears.length) {
      return `<p class="year-note">${escapeHtml(localize(profile.participationYearNote) || "")}</p>`;
    }

    return `
      <div class="year-list">
        ${profile.participationYears.map((year) => `<span class="year-pill">${escapeHtml(year)}</span>`).join("")}
      </div>
    `;
  }

  function getProfileBand(profile) {
    const primaryFunction = (profile.functions || [])[0];
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

  function renderSchools() {
    return `
      <section class="section">
        <h1 class="section-title">${escapeHtml(t("sections.schoolsTitle"))}</h1>
        <p class="section-lede">${escapeHtml(t("sections.schoolsIntro"))}</p>
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
        <div class="resource-grid">
          ${renderResourceCards(getResources())}
        </div>
        <div id="resource-status" class="status-panel hidden"></div>
      </section>
    `;
  }

  function renderResourceCards(items) {
    return items.map((resource, index) => `
      <article class="card ${index === 1 ? "azure" : index === 2 ? "turquoise" : ""}">
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
          <div id="register-status" class="status-panel ${state.submissions.length ? "" : "hidden"}">
            ${state.submissions.length ? escapeHtml(t("labels.submitted")) : ""}
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

  function renderHistorySubnav(active) {
    return `
      <div class="child-nav" aria-label="History sections">
        <button class="child-nav-button ${active === "timeline" ? "active" : ""}" data-view="history">
          ${escapeHtml(t("sections.historyTimeline"))}
        </button>
        <button class="child-nav-button ${active === "directory" ? "active" : ""}" data-view="directory">
          ${escapeHtml(t("nav.directory"))}
        </button>
      </div>
    `;
  }

  function renderFooter() {
    return `
      <footer class="footer">
        <div class="footer-inner">
          <div>
            <strong>${escapeHtml(t("footerTitle"))}</strong>
            <p>${escapeHtml(t("footerSub"))}</p>
          </div>
          <p>${escapeHtml(t("motto"))} · ${escapeHtml(t("labels.noNetwork"))}</p>
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
        await mockApi.submitProfile(Object.fromEntries(formData.entries()));
        const status = document.getElementById("register-status");
        status.classList.remove("hidden");
        status.textContent = t("labels.submitted");
        registerForm.reset();
      });
    }
  }

  window.addEventListener("hashchange", applyHashRoute);
  applyHashRoute();
  render();
  loadAlumniContent();
  loadStoriesContent();
  loadResourcesContent();
}());
