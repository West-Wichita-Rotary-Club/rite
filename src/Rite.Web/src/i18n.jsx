import { createContext, useContext, useMemo, useState } from "react";

// Trimmed from docs/js/i18n.js's `copy` dictionary to the seven in-scope
// content surfaces (history, stories, alumni, resources, FAQ, schools,
// impact) plus shared chrome, plus the account/login/register/claim/memory
// copy ported from docs/js/i18n.js's `account`/`claim`/`memor*` keys — that
// mocked UI now lives here directly instead of only on the legacy preview.
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
        "The exchange-teacher counts below are only the direct travelers. Outbound teachers each lead a full seminar for Panamanian teachers of English — so the value of RITE multiplies well past the people who got on a plane, reaching the seminar attendees and, through them, their own students.",
      registerTitle: "Create your account",
      registerIntro:
        "Your account is created and saved on the RITE server. Claim status, memories, and photos you add after signing in currently stay only in this browser.",
      loginTitle: "Sign in",
      loginIntro: "Enter the email and password you used to register.",
      accountTitle: "Your account",
      accountIntro:
        "Your profile is saved on the RITE server. Claim status and memories you add below currently stay only in this browser.",
      dashboardSummaryTitle: "At a glance",
      claimTitle: "Claim your alumni status",
      claimIntro:
        "Declare your country and the roles you held in different years. This claim is browser-local and pending review — it never changes the public directory.",
      memoriesComposerTitle: "Share a memory"
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
      notFound: "Not found.",
      role: "I am...",
      fullName: "Full name",
      email: "Email",
      password: "Password",
      country: "Country",
      city: "City",
      languages: "Languages",
      years: "RITE exchange year(s)",
      bio: "Short biography",
      registerButton: "Create account",
      signIn: "Sign in",
      signOut: "Sign out",
      myAccount: "My account",
      register: "Register",
      invalidCredentials: "Invalid email or password.",
      invalidEmail: "Enter a valid email address.",
      weakPassword: "Password must be at least 8 characters.",
      duplicateAccount: "This email already has an account. Sign in instead.",
      registerError: "Something went wrong creating your account. Try again.",
      previewLoginNotice: "Keep your password private — this account is real and persists on the server.",
      storageUnavailableNotice:
        "Claim and memory features need browser storage, which isn't available right now (for example, in some private-browsing modes).",
      saveDetails: "Save details",
      detailsSaved: "Details saved.",
      dashboardClaimStatusLabel: "Claim status",
      dashboardClaimStatusNone: "Not claimed",
      dashboardMemoriesLabel: "Memories shared",
      dashboardCompletenessLabel: "Profile completeness",
      pendingReviewBadge: "Pending review",
      claimCountryLabel: "Country",
      claimRoleLabel: "Role",
      claimYearFromLabel: "Year",
      claimYearToLabel: "Through year (optional)",
      claimAddRow: "Add another role/year",
      claimRemoveRow: "Remove",
      claimRangeError:
        "Enter a role and a year between 1996 and now; the through-year can't be before the start year.",
      claimMatchTitle: "Is one of these you?",
      claimMatchNone: "None of these — self-declare instead",
      claimSelfDeclareNameLabel: "Your name for this claim",
      claimSaveButton: "Save claim",
      claimEditButton: "Edit claim",
      claimWithdrawButton: "Withdraw claim",
      claimNoneYet: "You haven't claimed alumni status yet.",
      claimSavedNotice: "Claim saved. It stays pending review and never changes the public directory.",
      claimWithdrawnNotice: "Claim withdrawn.",
      memoryTitleLabel: "Memory title",
      memoryTextLabel: "Your story",
      memoryPhotosLabel: "Photos (optional)",
      memorySaveButton: "Save memory",
      memoryEditButton: "Edit",
      memoryDeleteButton: "Delete",
      memoryNoneYet: "You haven't shared any memories yet.",
      memoryPhotoCapReached: "Each memory can hold up to 3 photos.",
      memoryCapReached: "Each account can hold up to 10 memories in this preview.",
      memoryNonImageFile: "Only image files can be attached as photos.",
      memoryStorageFull: "This browser's preview storage is full. Remove a photo or memory before adding more.",
      clearDataButton: "Sign out and clear browser data",
      clearDataConfirm: "This signs you out and removes your claim and memories from this browser. Continue?",
      cancelButton: "Cancel"
    },
    placeholders: {
      name: "e.g. Maria Camarena",
      email: "name@example.org",
      password: "At least 8 characters",
      city: "e.g. Wichita",
      languages: "Spanish, English",
      years: "2019",
      bio: "A few sentences about your RITE experience"
    },
    footerTitle: "Rotary Intercountry Teacher Exchange",
    footerSub: "A program of Rotary District 5680, Wichita, Kansas, with partners in Panama and Argentina"
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
        "Las cifras de docentes de intercambio a continuacion son solo quienes viajaron directamente. Cada docente de envio dirige un seminario completo para docentes panamenos de ingles — el valor de RITE se multiplica mucho mas alla de quienes subieron a un avion, llegando a los asistentes del seminario y, a traves de ellos, a sus propios estudiantes.",
      registerTitle: "Cree su cuenta",
      registerIntro:
        "Su cuenta se crea y guarda en el servidor de RITE. El estado de reclamo, las memorias y las fotos que agregue despues de iniciar sesion permanecen por ahora solo en este navegador.",
      loginTitle: "Iniciar sesion",
      loginIntro: "Ingrese el correo y la contrasena con los que se registro.",
      accountTitle: "Su cuenta",
      accountIntro:
        "Su perfil se guarda en el servidor de RITE. El estado de reclamo y las memorias que agregue abajo permanecen por ahora solo en este navegador.",
      dashboardSummaryTitle: "De un vistazo",
      claimTitle: "Reclame su estatus de exalumno",
      claimIntro:
        "Declare su pais y los roles que tuvo en distintos anos. Este reclamo es local al navegador y queda pendiente de revision; nunca cambia el directorio publico.",
      memoriesComposerTitle: "Comparta una memoria"
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
      notFound: "No encontrado.",
      role: "Soy...",
      fullName: "Nombre completo",
      email: "Correo electronico",
      password: "Contrasena",
      country: "Pais",
      city: "Ciudad",
      languages: "Idiomas",
      years: "Ano(s) de intercambio RITE",
      bio: "Biografia breve",
      registerButton: "Crear cuenta",
      signIn: "Iniciar sesion",
      signOut: "Cerrar sesion",
      myAccount: "Mi cuenta",
      register: "Registrarse",
      invalidCredentials: "Correo electronico o contrasena invalidos.",
      invalidEmail: "Ingrese un correo electronico valido.",
      weakPassword: "La contrasena debe tener al menos 8 caracteres.",
      duplicateAccount: "Este correo ya tiene una cuenta. Inicie sesion en su lugar.",
      registerError: "Ocurrio un error al crear su cuenta. Intente de nuevo.",
      previewLoginNotice: "Mantenga su contrasena privada: esta cuenta es real y permanece en el servidor.",
      storageUnavailableNotice:
        "Las funciones de reclamo y memorias necesitan almacenamiento del navegador, que no esta disponible ahora mismo (por ejemplo, en algunos modos de navegacion privada).",
      saveDetails: "Guardar datos",
      detailsSaved: "Datos guardados.",
      dashboardClaimStatusLabel: "Estado del reclamo",
      dashboardClaimStatusNone: "Sin reclamo",
      dashboardMemoriesLabel: "Memorias compartidas",
      dashboardCompletenessLabel: "Perfil completo",
      pendingReviewBadge: "Pendiente de revision",
      claimCountryLabel: "Pais",
      claimRoleLabel: "Rol",
      claimYearFromLabel: "Ano",
      claimYearToLabel: "Hasta el ano (opcional)",
      claimAddRow: "Agregar otro rol/ano",
      claimRemoveRow: "Quitar",
      claimRangeError:
        "Ingrese un rol y un ano entre 1996 y ahora; el ano final no puede ser anterior al ano inicial.",
      claimMatchTitle: "Es usted alguno de estos?",
      claimMatchNone: "Ninguno de estos: declararme por mi cuenta",
      claimSelfDeclareNameLabel: "Su nombre para este reclamo",
      claimSaveButton: "Guardar reclamo",
      claimEditButton: "Editar reclamo",
      claimWithdrawButton: "Retirar reclamo",
      claimNoneYet: "Todavia no ha reclamado estatus de exalumno.",
      claimSavedNotice: "Reclamo guardado. Queda pendiente de revision y nunca cambia el directorio publico.",
      claimWithdrawnNotice: "Reclamo retirado.",
      memoryTitleLabel: "Titulo de la memoria",
      memoryTextLabel: "Su historia",
      memoryPhotosLabel: "Fotos (opcional)",
      memorySaveButton: "Guardar memoria",
      memoryEditButton: "Editar",
      memoryDeleteButton: "Eliminar",
      memoryNoneYet: "Todavia no ha compartido memorias.",
      memoryPhotoCapReached: "Cada memoria puede tener hasta 3 fotos.",
      memoryCapReached: "Cada cuenta puede tener hasta 10 memorias en esta vista previa.",
      memoryNonImageFile: "Solo se pueden adjuntar archivos de imagen como fotos.",
      memoryStorageFull: "El almacenamiento de vista previa de este navegador esta lleno. Elimine una foto o memoria antes de agregar mas.",
      clearDataButton: "Cerrar sesion y borrar datos del navegador",
      clearDataConfirm: "Esto cierra su sesion y elimina su reclamo y memorias de este navegador. Continuar?",
      cancelButton: "Cancelar"
    },
    placeholders: {
      name: "p. ej. Maria Camarena",
      email: "nombre@example.org",
      password: "Al menos 8 caracteres",
      city: "p. ej. Wichita",
      languages: "espanol, ingles",
      years: "2019",
      bio: "Unas pocas oraciones sobre su experiencia con RITE"
    },
    footerTitle: "Intercambio Internacional de Docentes de Rotary",
    footerSub: "Un programa del Distrito 5680 de Rotary, Wichita, Kansas, con socios en Panama y Argentina"
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
