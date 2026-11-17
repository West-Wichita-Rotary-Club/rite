import { createContext, useContext, useMemo, useState } from "react";

// Trimmed from docs/js/i18n.js's `copy` dictionary to the seven in-scope
// content surfaces (history, stories, alumni, resources, FAQ, schools,
// impact) plus shared chrome. Account/login/register/claim/memory-composer
// copy is intentionally left out — that UI stays mocked/static in docs/
// per this PS's scope.
const copy = {
  en: {
    siteSub: "Intercountry Teacher Exchange",
    motto: "Service Above Self",
    heroTitle: "Teach. Learn. Connect.",
    heroBody:
      "RITE brings teachers, schools, Rotary clubs, and host families together across Kansas, Panama, and Argentina to exchange practical teaching strategies and build lasting relationships.",
    heroPrimary: "See the history",
    heroSecondary: "Read the stories",
    nav: {
      home: "Home",
      history: "History",
      stories: "Stories",
      directory: "Alumni",
      schools: "Schools & Clubs",
      resources: "Resources",
      faq: "FAQ",
      impact: "Impact"
    },
    sections: {
      historyTitle: "Three decades of teacher-to-teacher connection",
      historyIntro:
        "RITE began in 1996 through the vision of Ralph and Armida Hight and a partnership between the Rotary Club of West Wichita and the Rotary Club of West Sedgwick County-Sunrise. What began as a local Rotary initiative became a durable network linking educators and families across the United States, Panama, and Argentina.",
      storiesTitle: "Story archive",
      storiesIntro: "Sourced, permission-vetted stories from teachers, host families, and Rotary leaders.",
      directoryTitle: "Alumni network",
      directoryIntro: "A privacy-safe preview of the member directory and where-are-they-now experience.",
      schoolsTitle: "Schools and clubs",
      schoolsIntro: "Partner schools and Rotary clubs document cooperation, hosting history, and institutional continuity.",
      resourcesTitle: "Curriculum and replication resources",
      resourcesIntro:
        "The seminar's practical English-teaching toolkit, host-family orientation, and replication guide — free and public.",
      faqTitle: "Frequently asked questions",
      faqIntro:
        "Answers drawn from official Rotary sources and the RITE program's own research. Items still awaiting committee confirmation say so plainly.",
      impactTitle: "One teacher can reach hundreds of students",
      impactIntro:
        "The exchange-teacher counts below are only the direct travelers. Outbound teachers each lead a full seminar for Panamanian teachers of English — so the value of RITE multiplies well past the people who got on a plane, reaching the seminar attendees and, through them, their own students."
    },
    filters: {
      all: "All",
      panama: "Panama",
      argentina: "Argentina",
      usa: "United States"
    },
    roles: {
      teacher: "Teacher",
      host: "Host family",
      leader: "Rotary leader",
      coordinator: "Coordinator",
      school: "School administrator"
    },
    schoolTypes: {
      school: "Partner school",
      club: "Rotary club"
    },
    labels: {
      partnerSince: "Partner since",
      teachersHosted: "Teachers hosted",
      countryFilter: "Country",
      functionFilter: "Community role",
      participationYears: "Participation years",
      viewProfile: "View profile",
      backToDirectory: "Back to alumni",
      backToSchools: "Back to schools and clubs",
      memories: "Memories",
      pictures: "Pictures",
      suggestions: "Suggestions",
      noMemories: "No reviewed memories have been added yet.",
      noPictures: "No reviewed pictures have been added yet.",
      noSuggestions: "No suggestions have been added yet.",
      noResults: "No profiles match these filters yet.",
      asOfLabel: "As of",
      loading: "Loading...",
      loadError: "This content could not be loaded. Confirm the API is running and reachable.",
      notFound: "Not found."
    },
    footerTitle: "Rotary Intercountry Teacher Exchange",
    footerSub: "A program of Rotary District 5680, Wichita, Kansas, with partners in Panama and Argentina",
    mockBanner:
      "Production preview: history, stories, alumni, resources, FAQ, schools, and impact data here come live from the RITE API. Account, login, and registration still live on the legacy static preview.",
    legacyPreviewCta: "Legacy static preview"
  },
  es: {
    siteSub: "Intercambio Internacional de Docentes",
    motto: "Dar de Si antes de Pensar en Si",
    heroTitle: "Ensenar. Aprender. Conectar.",
    heroBody:
      "RITE reune a docentes, escuelas, clubes rotarios y familias anfitrionas de Kansas, Panama y Argentina para intercambiar estrategias practicas de ensenanza y construir relaciones duraderas.",
    heroPrimary: "Ver la historia",
    heroSecondary: "Leer historias",
    nav: {
      home: "Inicio",
      history: "Historia",
      stories: "Historias",
      directory: "Exalumnos",
      schools: "Escuelas y clubes",
      resources: "Recursos",
      faq: "Preguntas frecuentes",
      impact: "Impacto"
    },
    sections: {
      historyTitle: "Tres decadas de conexion entre docentes",
      historyIntro:
        "RITE comenzo en 1996 gracias a la vision de Ralph y Armida Hight y una alianza entre el Club Rotario de West Wichita y el Club Rotario de West Sedgwick County-Sunrise. Lo que empezo como una iniciativa rotaria local se convirtio en una red duradera que conecta educadores y familias en Estados Unidos, Panama y Argentina.",
      storiesTitle: "Archivo de historias",
      storiesIntro: "Historias basadas en fuentes y con permisos verificados de docentes, familias anfitrionas y lideres rotarios.",
      directoryTitle: "Red de exalumnos",
      directoryIntro: "Vista previa segura del directorio de miembros y la seccion donde estan ahora.",
      schoolsTitle: "Escuelas y clubes",
      schoolsIntro: "Escuelas asociadas y clubes rotarios documentan cooperacion, hospedaje y continuidad institucional.",
      resourcesTitle: "Curriculo y recursos de replicacion",
      resourcesIntro:
        "El repertorio practico de ensenanza de ingles del seminario, la orientacion para familias anfitrionas y la guia de replicacion — gratis y publicos.",
      faqTitle: "Preguntas frecuentes",
      faqIntro:
        "Respuestas basadas en fuentes oficiales de Rotary y en la propia investigacion del programa RITE. Los temas que aun esperan confirmacion del comite lo indican claramente.",
      impactTitle: "Un docente puede llegar a cientos de estudiantes",
      impactIntro:
        "Las cifras de docentes de intercambio a continuacion son solo quienes viajaron directamente. Cada docente de envio dirige un seminario completo para docentes panamenos de ingles — el valor de RITE se multiplica mucho mas alla de quienes subieron a un avion, llegando a los asistentes del seminario y, a traves de ellos, a sus propios estudiantes."
    },
    filters: {
      all: "Todos",
      panama: "Panama",
      argentina: "Argentina",
      usa: "Estados Unidos"
    },
    roles: {
      teacher: "Docente",
      host: "Familia anfitriona",
      leader: "Lider rotario",
      coordinator: "Coordinador",
      school: "Administrador escolar"
    },
    schoolTypes: {
      school: "Escuela asociada",
      club: "Club rotario"
    },
    labels: {
      partnerSince: "Socio desde",
      teachersHosted: "Docentes recibidos",
      countryFilter: "Pais",
      functionFilter: "Rol comunitario",
      participationYears: "Anos de participacion",
      viewProfile: "Ver perfil",
      backToDirectory: "Volver a exalumnos",
      backToSchools: "Volver a escuelas y clubes",
      memories: "Memorias",
      pictures: "Fotos",
      suggestions: "Sugerencias",
      noMemories: "Todavia no hay memorias revisadas.",
      noPictures: "Todavia no hay fotos revisadas.",
      noSuggestions: "Todavia no hay sugerencias.",
      noResults: "Ningun perfil coincide con estos filtros todavia.",
      asOfLabel: "Al",
      loading: "Cargando...",
      loadError: "No se pudo cargar este contenido. Confirme que la API este activa y accesible.",
      notFound: "No encontrado."
    },
    footerTitle: "Intercambio Internacional de Docentes de Rotary",
    footerSub: "Un programa del Distrito 5680 de Rotary, Wichita, Kansas, con socios en Panama y Argentina",
    mockBanner:
      "Vista previa de produccion: la historia, historias, exalumnos, recursos, preguntas frecuentes, escuelas y datos de impacto provienen en vivo de la API de RITE. Cuenta, inicio de sesion y registro siguen en la vista previa estatica anterior.",
    legacyPreviewCta: "Vista previa estatica anterior"
  }
};

function readPath(lang, path) {
  return path.split(".").reduce((value, key) => value?.[key], copy[lang]);
}

export function localize(value, lang) {
  return value && typeof value === "object" ? value[lang] ?? value.en : value;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return window.localStorage.getItem("rite-lang") === "es" ? "es" : "en";
    } catch {
      return "en";
    }
  });

  const value = useMemo(
    () => ({
      lang,
      setLang: (next) => {
        setLang(next);
        try {
          window.localStorage.setItem("rite-lang", next);
        } catch {
          // Private-browsing modes may block storage; language just won't persist.
        }
      },
      t: (path) => readPath(lang, path),
      localize: (localizedValue) => localize(localizedValue, lang)
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
