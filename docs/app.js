(function () {
  const STORE_KEY = "rite-preview-submissions";
  const ACCOUNTS_KEY = "rite-preview-accounts";
  const SESSION_KEY = "rite-preview-session";
  const ALUMNI_CONTENT_URL = "content/alumni.json";
  const STORIES_CONTENT_URL = "content/stories.json";
  const RESOURCES_CONTENT_URL = "content/resources.json";
  const FAQ_CONTENT_URL = "content/faq.json";
  const TIMELINE_CONTENT_URL = "content/timeline.json";
  const IMPACT_CONTENT_URL = "content/impact.json";
  const PROGRAM_CYCLE_CONTENT_URL = "content/program-cycle.json";
  const FEATURE_STORAGE_BUDGET = 3 * 1000 * 1000;
  const PHOTO_MAX_DIMENSION = 1024;
  const MAX_PHOTOS_PER_MEMORY = 3;
  const MAX_MEMORIES_PER_MEMBER = 10;
  const MIN_PARTICIPATION_YEAR = 1996;
  const CLAIM_ROLES = ["leader", "host", "teacher"];

  class StorageBudgetError extends Error {}

  const state = {
    lang: "en",
    view: "home",
    storyFilter: "all",
    directoryCountryFilter: "all",
    directoryFunctionFilter: "all",
    selectedStoryId: "s4",
    selectedAlumniId: "",
    alumniContent: null,
    alumniLoadStatus: "loading",
    storiesContent: null,
    storiesLoadStatus: "loading",
    resourcesContent: null,
    resourcesLoadStatus: "loading",
    faqContent: null,
    faqLoadStatus: "loading",
    timelineContent: null,
    timelineLoadStatus: "loading",
    impactContent: null,
    impactLoadStatus: "loading",
    programCycleContent: null,
    programCycleLoadStatus: "loading",
    submissions: readSubmissions(),
    storageAvailable: detectStorageAvailable(),
    accounts: {},
    session: null,
    loginError: false,
    accountNotice: "",
    supportNotice: "",
    claimEditing: false,
    claimDraft: null,
    claimError: false,
    memoryEditingId: null,
    memoryDraft: null,
    memoryPhotoError: ""
  };
  state.accounts = readAccounts();
  state.session = readSession();

  const palette = {
    azure: "azure",
    royal: "royal",
    gold: "gold",
    turquoise: "turquoise",
    cranberry: "cranberry"
  };

  const copy = {
    en: {
      siteSub: "Intercountry Teacher Exchange",
      join: "Join the community",
      mock: "Static preview: all API, login, registration, and submission behavior is mocked locally. No data leaves this page.",
      motto: "Service Above Self",
      heroEducationLabel: "Teach. Learn. Connect.",
      heroTitle: "Teach. Learn. Connect.",
      heroBody: "RITE brings teachers, schools, Rotary clubs, and host families together across Kansas, Panama, and Argentina to exchange practical teaching strategies and build lasting relationships.",
      heroPrimary: "See how it works",
      heroSecondary: "Read the stories",
      homeTitle: "More than a trip. More than a seminar.",
      homeIntro: "RITE is a reciprocal educator exchange. Teachers from Panama and Argentina spend about four weeks in the Wichita area, living with host families and visiting schools. Wichita-area educators travel to Panama to share resources and lead a practical seminar. Both groups return home with new strategies and relationships they keep building.",
      stats: ["Teachers received from Panama", "Teachers received from Argentina", "Teachers sent to Mexico, 1996-2001", "Teachers sent to Panama since 2001"],
      areasAlt: "RITE: Teach. Learn. Connect. — connecting educators in Wichita, Panama, and Argentina",
      nav: {
        about: "About RITE",
        participate: "Participate",
        community: "Community",
        history: "History",
        faq: "FAQ",
        stories: "Stories",
        directory: "Alumni",
        schools: "Schools & Clubs",
        resources: "Resources",
        register: "Register"
      },
      sections: {
        historyTitle: "Three decades of teacher-to-teacher connection",
        historyIntro: "RITE began in 1996 through the vision of Ralph and Armida Hight and a partnership between the Rotary Club of West Wichita and the Rotary Club of West Sedgwick County-Sunrise. What began as a local Rotary initiative became a durable network linking educators and families across the United States, Panama, and Argentina.",
        historyTimeline: "Timeline",
        storiesTitle: "Story archive",
        storiesIntro: "Sourced, permission-vetted stories from teachers, host families, and Rotary leaders.",
        directoryTitle: "Alumni network",
        directoryIntro: "A privacy-safe preview of the future member directory and where-are-they-now experience.",
        schoolsTitle: "Schools and clubs",
        schoolsIntro: "Partner schools and Rotary clubs document cooperation, hosting history, and institutional continuity.",
        resourcesTitle: "Curriculum and replication resources",
        resourcesIntro: "The seminar's practical English-teaching toolkit, host-family orientation, and replication guide — free and public.",
        registerTitle: "Join the RITE community",
        registerIntro: "This form simulates the future registration workflow. Submitted preview data is stored only in this browser.",
        loginTitle: "Sign in to the preview",
        loginIntro: "Enter the email you used to register. This is a preview convenience, not real security — anyone using this browser can see the same mock data.",
        accountTitle: "Your preview account",
        accountIntro: "Everything here is mock and stored only in this browser, to help gather feedback on the future member experience.",
        claimTitle: "Claim your alumni status",
        claimIntro: "Declare your country and the roles you held in different years. This claim is browser-local and pending review — it never changes the public directory.",
        memoriesComposerTitle: "Share a memory",
        faqTitle: "Frequently asked questions",
        faqIntro: "Answers drawn from official Rotary sources and the RITE program's own research. Items still awaiting committee confirmation say so plainly."
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
        loadingFaq: "Loading static FAQ content...",
        faqLoadError: "FAQ content could not be loaded. Serve the docs folder with a static web server to preview JSON-driven content.",
        loadingTimeline: "Loading static timeline content...",
        timelineLoadError: "Timeline content could not be loaded. Serve the docs folder with a static web server to preview JSON-driven content.",
        loadingImpact: "Loading static impact content...",
        impactLoadError: "Impact content could not be loaded. Serve the docs folder with a static web server to preview JSON-driven content.",
        loadingProgramCycle: "Loading static program-cycle content...",
        programCycleLoadError: "Program-cycle content could not be loaded. Serve the docs folder with a static web server to preview JSON-driven content.",
        interestIntro: "Tell us about your interest",
        involvement: "How would you like to be involved?",
        expressInterest: "Express interest",
        signIn: "Sign in",
        signOut: "Sign out",
        myAccount: "My account",
        unknownAccount: "No preview account found for this email in this browser. Register first.",
        duplicateAccount: "This email already has a preview account in this browser. Sign in instead.",
        previewLoginNotice: "This is a preview simulation. Sign-in is a mock convenience, not real security, data stays in this browser only, and anyone else using this browser can see the same mock data.",
        storageUnavailableNotice: "The mock account/login preview needs browser storage, which isn't available right now (for example, in some private-browsing modes). The rest of this preview still works.",
        saveDetails: "Save details",
        detailsSaved: "Details saved in this browser.",
        pendingReviewBadge: "Pending review",
        partlyVerifiedBadge: "Partly verified",
        asOfLabel: "As of",
        claimCountryLabel: "Country",
        claimRoleLabel: "Role",
        claimYearFromLabel: "Year",
        claimYearToLabel: "Through year (optional)",
        claimAddRow: "Add another role/year",
        claimRemoveRow: "Remove",
        claimRangeError: "Enter a role and a year between 1996 and now; the through-year can't be before the start year.",
        claimMatchTitle: "Is one of these you?",
        claimMatchNone: "None of these — self-declare instead",
        claimSelfDeclareNameLabel: "Your name for this preview claim",
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
        clearDataButton: "Clear my preview data",
        clearDataConfirm: "This removes your preview account, claim, and memories from this browser. Continue?",
        cancelButton: "Cancel",
        supportIntro: "Tell us how you'd like to support RITE",
        supportWay: "How would you like to help?",
        supportMessage: "Anything else you'd like us to know?",
        supportSubmit: "Send interest",
        supportSubmitted: "Thanks — this is a mock submission. In production, a RITE committee contact would follow up about supporting the program.",
        supportWays: {
          conversation: "Start a conversation about funding",
          volunteer: "Volunteer my time",
          sponsor: "Sponsor a supply or seminar cost",
          other: "Something else"
        }
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
        subnavLabel: "Sections",
        recruitNavLabel: "About RITE",
        alumniNavLabel: "Alumni",
        activeNavLabel: "Current participants",
        recruitTitle: "New here? Start with the program",
        recruitBody: "Learn what RITE is, see the impact, and find out how to teach abroad, host a teacher, or partner your school or club.",
        recruitCta: "Learn about RITE",
        alumniTitle: "RITE alumni",
        alumniBody: "Find your community by country and role, revisit your profile, and reconnect with fellow teachers, hosts, and leaders.",
        alumniCta: "Go to the community",
        activeTitle: "Current participants",
        activeBody: "Free public resources for teachers, host families, and coordinators right now, enhanced further once you're part of the program.",
        activeCta: "See participant resources"
      },
      about: {
        landingTitle: "More than a trip. More than a seminar.",
        landingIntro: "RITE is a reciprocal educator exchange connecting Wichita, Panama, and Argentina. Here's what RITE is, how the exchange works, its impact, and its history.",
        whyTitle: "Why RITE matters",
        whyBody: "A good teaching idea can reach far beyond one classroom. RITE gives educators the time, tools, and relationships to test new approaches, learn from colleagues in another country, and return home ready to share what works. Living with host families and taking part in school and community life turns professional development into genuine cultural understanding.",
        howTitle: "How the exchange works",
        howIntro: "RITE runs two connected annual programs: an inbound immersion experience in the Wichita area and an outbound educator exchange in Panama.",
        seeFullHistory: "See the full history",
        impactTitle: "One teacher can reach hundreds of students",
        impactIntro: "The exchange-teacher counts below are only the direct travelers. Outbound teachers each lead a full seminar for Panamanian teachers of English — so the value of RITE multiplies well past the people who got on a plane, reaching the seminar attendees and, through them, their own students.",
        seeFaq: "See frequently asked questions"
      },
      participate: {
        landingTitle: "Teach. Learn. Connect.",
        landingIntro: "However you'd like to be involved — as a teacher, a host family, a volunteer, or a supporter — start here.",
        teacherTitle: "For teachers",
        teacherBody: "RITE focuses on classroom reality: mixed proficiency, limited time, different learning needs, and resources that vary from school to school. Inbound teachers from Panama and Argentina spend about four weeks in the Wichita area; Wichita-area teachers travel to Panama to share resources and lead a practical seminar. The value reaches far beyond the travelers themselves: outbound teachers lead a full seminar for Panamanian teachers of English, whose own students then benefit too.",
        hostTitle: "Open your home. Expand your world.",
        hostBody: "Host families are at the heart of the inbound RITE experience. A visiting teacher does not only observe schools; they experience Wichita through the people who live here. Hosting creates space for everyday conversation, shared meals, cultural discovery, and friendships that can last for years. Families do not need to plan an elaborate vacation — dinner together, a school event, a grocery trip, a Rotary meeting, or an evening conversation are often the most valuable experiences.",
        hostCta: "Ask about hosting a RITE teacher",
        hostFaqTitle: "Host family questions",
        volunteerTitle: "Volunteer, sponsor, or partner your school",
        volunteerBody: "Rotary members, schools, and community volunteers make RITE possible every year — serving on the committee, arranging school visits, providing transportation, or helping assemble teaching resources.",
        seeSchools: "See schools and clubs",
        storiesTitle: "What participating looks like",
        storiesIntro: "Real people, drawn from the exchange — evidence of what participating in RITE actually looks like.",
        seeAllStories: "Read all stories",
        supportTitle: "Support RITE",
        supportBody: "Interested in supporting RITE — through a financial gift, sponsoring a specific cost, or another kind of help? This starts a conversation; it isn't a donation or payment form, and it makes no commitment about deductibility or a specific giving vehicle.",
        registerCta: "Express interest as a teacher or host"
      },
      community: {
        landingTitle: "The RITE community",
        landingIntro: "Teachers from Panama and Argentina arrive each year as a cohort — a team that learns, grows, and builds relationships together with host families, Wichita teachers, and program leaders, alongside three decades of alumni, host families, and Rotary leaders.",
        cohortTitle: "A cohort, not just individuals",
        cohortBody: "The 2026 inbound teachers didn't just complete four individual placements — they experienced Wichita together, as a team, alongside the host families, Wichita teachers, and program leaders who welcomed them.",
        directoryCta: "Browse the alumni directory",
        resourcesCta: "See curriculum and toolkit resources",
        currentTitle: "For current participants",
        currentBody: "Free public resources for teachers, host families, and coordinators right now, enhanced further once you're part of the program.",
        currentUnlockTitle: "Want more than the free resources?",
        currentUnlockBody: "Join the RITE community to unlock training modules, scheduling tools, and direct coordinator support.",
        currentUnlockCta: "Express interest",
        storyCta: "Share your story"
      },
      footerTitle: "Rotary Intercountry Teacher Exchange",
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
      heroEducationLabel: "Ensenar. Aprender. Conectar.",
      heroTitle: "Ensenar. Aprender. Conectar.",
      heroBody: "RITE reune a docentes, escuelas, clubes rotarios y familias anfitrionas de Kansas, Panama y Argentina para intercambiar estrategias practicas de ensenanza y construir relaciones duraderas.",
      heroPrimary: "Vea como funciona",
      heroSecondary: "Leer historias",
      homeTitle: "Mas que un viaje. Mas que un seminario.",
      homeIntro: "RITE es un intercambio educativo reciproco. Docentes de Panama y Argentina pasan unas cuatro semanas en el area de Wichita, viviendo con familias anfitrionas y visitando escuelas. Educadores del area de Wichita viajan a Panama para compartir recursos y dirigir un seminario practico. Ambos grupos regresan con nuevas estrategias y relaciones que siguen construyendo.",
      stats: ["Docentes recibidos de Panama", "Docentes recibidos de Argentina", "Docentes enviados a Mexico, 1996-2001", "Docentes enviados a Panama desde 2001"],
      areasAlt: "RITE: Ensenar. Aprender. Conectar. — conectando educadores en Wichita, Panama y Argentina",
      nav: {
        about: "Sobre RITE",
        participate: "Participar",
        community: "Comunidad",
        history: "Historia",
        faq: "Preguntas frecuentes",
        stories: "Historias",
        directory: "Exalumnos",
        schools: "Escuelas",
        resources: "Recursos",
        register: "Registro"
      },
      sections: {
        historyTitle: "Tres decadas de conexion entre docentes",
        historyIntro: "RITE comenzo en 1996 gracias a la vision de Ralph y Armida Hight y una alianza entre el Club Rotario de West Wichita y el Club Rotario de West Sedgwick County-Sunrise. Lo que empezo como una iniciativa rotaria local se convirtio en una red duradera que conecta educadores y familias en Estados Unidos, Panama y Argentina.",
        historyTimeline: "Linea de tiempo",
        storiesTitle: "Archivo de historias",
        storiesIntro: "Historias basadas en fuentes y con permisos verificados de docentes, familias anfitrionas y lideres rotarios.",
        directoryTitle: "Red de exalumnos",
        directoryIntro: "Vista previa segura del futuro directorio privado y la seccion donde estan ahora.",
        schoolsTitle: "Escuelas y clubes",
        schoolsIntro: "Escuelas asociadas y clubes rotarios documentan cooperacion, hospedaje y continuidad institucional.",
        resourcesTitle: "Curriculo y recursos de replicacion",
        resourcesIntro: "El repertorio practico de ensenanza de ingles del seminario, la orientacion para familias anfitrionas y la guia de replicacion — gratis y publicos.",
        registerTitle: "Unirse a la comunidad RITE",
        registerIntro: "Este formulario simula el futuro registro. Los datos se guardan solo en este navegador.",
        loginTitle: "Iniciar sesion en la vista previa",
        loginIntro: "Ingrese el correo con el que se registro. Esto es una conveniencia de vista previa, no seguridad real: cualquier persona que use este navegador puede ver los mismos datos simulados.",
        accountTitle: "Su cuenta de vista previa",
        accountIntro: "Todo aqui es simulado y se guarda solo en este navegador, para ayudar a recopilar comentarios sobre la futura experiencia de miembros.",
        claimTitle: "Reclame su estatus de exalumno",
        claimIntro: "Declare su pais y los roles que tuvo en distintos anos. Este reclamo es local al navegador y queda pendiente de revision; nunca cambia el directorio publico.",
        memoriesComposerTitle: "Comparta una memoria",
        faqTitle: "Preguntas frecuentes",
        faqIntro: "Respuestas basadas en fuentes oficiales de Rotary y en la propia investigacion del programa RITE. Los temas que aun esperan confirmacion del comite lo indican claramente."
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
        loadingFaq: "Cargando preguntas frecuentes...",
        faqLoadError: "No se pudieron cargar las preguntas frecuentes. Sirva la carpeta docs con un servidor web estatico.",
        loadingTimeline: "Cargando la linea de tiempo...",
        timelineLoadError: "No se pudo cargar la linea de tiempo. Sirva la carpeta docs con un servidor web estatico.",
        loadingImpact: "Cargando las estadisticas de impacto...",
        impactLoadError: "No se pudieron cargar las estadisticas de impacto. Sirva la carpeta docs con un servidor web estatico.",
        loadingProgramCycle: "Cargando el ciclo del programa...",
        programCycleLoadError: "No se pudo cargar el ciclo del programa. Sirva la carpeta docs con un servidor web estatico.",
        interestIntro: "Cuentenos su interes",
        involvement: "Como le gustaria participar?",
        expressInterest: "Expresar interes",
        signIn: "Iniciar sesion",
        signOut: "Cerrar sesion",
        myAccount: "Mi cuenta",
        unknownAccount: "No se encontro una cuenta de vista previa para este correo en este navegador. Registrese primero.",
        duplicateAccount: "Este correo ya tiene una cuenta de vista previa en este navegador. Inicie sesion en su lugar.",
        previewLoginNotice: "Esto es una simulacion de vista previa. El inicio de sesion es una conveniencia simulada, no seguridad real, los datos se guardan solo en este navegador, y cualquier otra persona que use este navegador puede ver los mismos datos simulados.",
        storageUnavailableNotice: "La simulacion de cuenta/inicio de sesion necesita almacenamiento del navegador, que no esta disponible ahora mismo (por ejemplo, en algunos modos de navegacion privada). El resto de esta vista previa sigue funcionando.",
        saveDetails: "Guardar datos",
        detailsSaved: "Datos guardados en este navegador.",
        pendingReviewBadge: "Pendiente de revision",
        partlyVerifiedBadge: "Parcialmente verificado",
        asOfLabel: "Al",
        claimCountryLabel: "Pais",
        claimRoleLabel: "Rol",
        claimYearFromLabel: "Ano",
        claimYearToLabel: "Hasta el ano (opcional)",
        claimAddRow: "Agregar otro rol/ano",
        claimRemoveRow: "Quitar",
        claimRangeError: "Ingrese un rol y un ano entre 1996 y ahora; el ano final no puede ser anterior al ano inicial.",
        claimMatchTitle: "Es usted alguno de estos?",
        claimMatchNone: "Ninguno de estos: declararme por mi cuenta",
        claimSelfDeclareNameLabel: "Su nombre para este reclamo de vista previa",
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
        clearDataButton: "Borrar mis datos de vista previa",
        clearDataConfirm: "Esto elimina su cuenta, reclamo y memorias de vista previa de este navegador. Continuar?",
        cancelButton: "Cancelar",
        supportIntro: "Cuentenos como le gustaria apoyar a RITE",
        supportWay: "Como le gustaria ayudar?",
        supportMessage: "Algo mas que le gustaria contarnos?",
        supportSubmit: "Enviar interes",
        supportSubmitted: "Gracias — este es un envio simulado. En produccion, un contacto del comite de RITE haria seguimiento sobre como apoyar el programa.",
        supportWays: {
          conversation: "Iniciar una conversacion sobre financiamiento",
          volunteer: "Ofrecer mi tiempo como voluntario",
          sponsor: "Patrocinar un insumo o costo del seminario",
          other: "Otra cosa"
        }
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
        subnavLabel: "Secciones",
        recruitNavLabel: "Sobre RITE",
        alumniNavLabel: "Exalumnos",
        activeNavLabel: "Participantes actuales",
        recruitTitle: "Nuevo aqui? Comience con el programa",
        recruitBody: "Conozca que es RITE, vea su impacto y descubra como ensenar en el extranjero, hospedar a un docente o asociar su escuela o club.",
        recruitCta: "Conocer RITE",
        alumniTitle: "Exalumnos de RITE",
        alumniBody: "Encuentre su comunidad por pais y por rol, revise su perfil y reconectese con otros docentes, anfitriones y lideres.",
        alumniCta: "Ir a la comunidad",
        activeTitle: "Participantes actuales",
        activeBody: "Recursos publicos gratuitos para docentes, familias anfitrionas y coordinadores ahora mismo, ampliados una vez que forme parte del programa.",
        activeCta: "Ver recursos para participantes"
      },
      about: {
        landingTitle: "Mas que un viaje. Mas que un seminario.",
        landingIntro: "RITE es un intercambio educativo reciproco que conecta Wichita, Panama y Argentina. Aqui esta que es RITE, como funciona el intercambio, su impacto y su historia.",
        whyTitle: "Por que RITE importa",
        whyBody: "Una buena idea de ensenanza puede llegar mucho mas alla de un aula. RITE brinda a los educadores el tiempo, las herramientas y las relaciones para probar nuevos enfoques, aprender de colegas en otro pais y regresar listos para compartir lo que funciona. Vivir con familias anfitrionas y participar en la vida escolar y comunitaria convierte el desarrollo profesional en verdadera comprension cultural.",
        howTitle: "Como funciona el intercambio",
        howIntro: "RITE opera dos programas anuales conectados: una experiencia de inmersion de recepcion en el area de Wichita y un intercambio educativo de envio en Panama.",
        seeFullHistory: "Ver la historia completa",
        impactTitle: "Un docente puede llegar a cientos de estudiantes",
        impactIntro: "Las cifras de docentes de intercambio a continuacion son solo quienes viajaron directamente. Cada docente de envio dirige un seminario completo para docentes panamenos de ingles — el valor de RITE se multiplica mucho mas alla de quienes subieron a un avion, llegando a los asistentes del seminario y, a traves de ellos, a sus propios estudiantes.",
        seeFaq: "Ver preguntas frecuentes"
      },
      participate: {
        landingTitle: "Ensenar. Aprender. Conectar.",
        landingIntro: "Sin importar como le gustaria participar — como docente, familia anfitriona, voluntario o patrocinador — comience aqui.",
        teacherTitle: "Para docentes",
        teacherBody: "RITE se centra en la realidad del aula: niveles mixtos, tiempo limitado, necesidades de aprendizaje distintas y recursos que varian de escuela a escuela. Los docentes de recepcion de Panama y Argentina pasan unas cuatro semanas en el area de Wichita; los docentes del area de Wichita viajan a Panama para compartir recursos y dirigir un seminario practico. El valor llega mucho mas alla de quienes viajan: los docentes de envio dirigen un seminario completo para docentes panamenos de ingles, cuyos propios estudiantes tambien se benefician.",
        hostTitle: "Abra su hogar. Amplie su mundo.",
        hostBody: "Las familias anfitrionas son el corazon de la experiencia de recepcion de RITE. Un docente visitante no solo observa escuelas; vive Wichita a traves de las personas que viven aqui. Hospedar crea espacio para la conversacion cotidiana, comidas compartidas, descubrimiento cultural y amistades que pueden durar anos. Las familias no necesitan planear unas vacaciones elaboradas — una cena juntos, un evento escolar, una compra, una reunion rotaria o una conversacion nocturna suelen ser las experiencias mas valiosas.",
        hostCta: "Preguntar sobre hospedar a un docente de RITE",
        hostFaqTitle: "Preguntas para familias anfitrionas",
        volunteerTitle: "Sea voluntario, patrocine o asocie su escuela",
        volunteerBody: "Los miembros de Rotary, las escuelas y los voluntarios de la comunidad hacen posible RITE cada ano — sirviendo en el comite, coordinando visitas escolares, brindando transporte o ayudando a preparar recursos de ensenanza.",
        seeSchools: "Ver escuelas y clubes",
        storiesTitle: "Como se ve participar",
        storiesIntro: "Personas reales del intercambio: evidencia de como se ve realmente participar en RITE.",
        seeAllStories: "Leer todas las historias",
        supportTitle: "Apoyar a RITE",
        supportBody: "Le interesa apoyar a RITE — con una contribucion financiera, patrocinando un costo especifico u otro tipo de ayuda? Esto inicia una conversacion; no es un formulario de donacion o pago, y no implica ningun compromiso sobre deducibilidad o un vehiculo especifico de aportacion.",
        registerCta: "Expresar interes como docente o anfitrion"
      },
      community: {
        landingTitle: "La comunidad RITE",
        landingIntro: "Los docentes de Panama y Argentina llegan cada ano como una cohorte — un equipo que aprende, crece y construye relaciones junto a familias anfitrionas, docentes de Wichita y lideres del programa, junto a tres decadas de exalumnos, familias anfitrionas y lideres rotarios.",
        cohortTitle: "Una cohorte, no solo individuos",
        cohortBody: "Los docentes de recepcion de 2026 no solo completaron cuatro colocaciones individuales: vivieron Wichita juntos, como equipo, junto a las familias anfitrionas, docentes de Wichita y lideres del programa que los recibieron.",
        directoryCta: "Explorar el directorio de exalumnos",
        resourcesCta: "Ver recursos de curriculo y herramientas",
        currentTitle: "Para participantes actuales",
        currentBody: "Recursos publicos gratuitos para docentes, familias anfitrionas y coordinadores ahora mismo, ampliados una vez que forme parte del programa.",
        currentUnlockTitle: "Quiere mas que los recursos gratuitos?",
        currentUnlockBody: "Unase a la comunidad RITE para desbloquear modulos de capacitacion, herramientas de programacion y apoyo directo de coordinacion.",
        currentUnlockCta: "Expresar interes",
        storyCta: "Compartir su historia"
      },
      footerTitle: "Intercambio Internacional de Docentes de Rotary",
      footerSub: "Un programa del Distrito 5680 de Rotary, Wichita, Kansas, con socios en Panama y Argentina",
      feedbackTitle: "Ayude a mejorar esta vista previa",
      feedbackBody: "Los revisores pueden pedir cambios, reportar vacios o sugerir mejoras para historias y archivo en el registro de incidencias del proyecto.",
      feedbackLink: "Enviar comentarios en GitHub"
    }
  };

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
    },
    submitSupportInterest(payload) {
      return new Promise((resolve) => {
        window.setTimeout(() => {
          state.submissions.unshift({
            type: "support-interest",
            name: payload.name || "Preview supporter",
            way: payload.way,
            createdAt: new Date().toISOString()
          });
          writeSubmissions(state.submissions);
          resolve({ ok: true });
        }, 220);
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

  function detectStorageAvailable() {
    try {
      const testKey = "__rite_storage_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function readAccounts() {
    if (!state.storageAvailable) {
      return {};
    }
    try {
      return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "{}");
    } catch (_error) {
      return {};
    }
  }

  function writeAccounts(accounts) {
    const size = JSON.stringify(accounts).length;
    if (size > FEATURE_STORAGE_BUDGET) {
      throw new StorageBudgetError();
    }
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  function readSession() {
    if (!state.storageAvailable) {
      return null;
    }
    try {
      return window.localStorage.getItem(SESSION_KEY) || null;
    } catch (_error) {
      return null;
    }
  }

  function writeSession(email) {
    if (email) {
      window.localStorage.setItem(SESSION_KEY, email);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }

  function currentAccount() {
    return state.session ? state.accounts[state.session] || null : null;
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function createAccount(email, fields) {
    const account = {
      email,
      name: fields.name || "",
      role: fields.role || "",
      country: fields.country || "",
      city: fields.city || "",
      languages: fields.languages || "",
      years: fields.years || "",
      bio: fields.bio || "",
      createdAt: new Date().toISOString(),
      claim: null,
      memories: []
    };
    const accounts = { ...state.accounts, [email]: account };
    writeAccounts(accounts);
    state.accounts = accounts;
    return account;
  }

  function updateAccount(email, updater) {
    const existing = state.accounts[email];
    if (!existing) {
      return;
    }
    const updated = updater({ ...existing });
    const accounts = { ...state.accounts, [email]: updated };
    writeAccounts(accounts);
    state.accounts = accounts;
  }

  function deleteAccount(email) {
    const accounts = { ...state.accounts };
    delete accounts[email];
    writeAccounts(accounts);
    state.accounts = accounts;
  }

  function signIn(email) {
    state.session = email;
    writeSession(email);
  }

  function signOut() {
    state.session = null;
    writeSession(null);
  }

  function downscalePhoto(file) {
    return new Promise((resolve, reject) => {
      if (!file.type || file.type.indexOf("image/") !== 0) {
        reject(new Error("not-an-image"));
        return;
      }
      const reader = new window.FileReader();
      reader.onerror = () => reject(new Error("read-failed"));
      reader.onload = () => {
        const img = new window.Image();
        img.onerror = () => reject(new Error("decode-failed"));
        img.onload = () => {
          const scale = Math.min(1, PHOTO_MAX_DIMENSION / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function currentYear() {
    return new Date().getFullYear();
  }

  function validateParticipationRow(row) {
    const from = parseInt(row.yearFrom, 10);
    const to = row.yearTo ? parseInt(row.yearTo, 10) : from;
    if (!row.role || !CLAIM_ROLES.includes(row.role)) {
      return "role";
    }
    if (!Number.isInteger(from) || from < MIN_PARTICIPATION_YEAR || from > currentYear()) {
      return "range";
    }
    if (!Number.isInteger(to) || to < from || to > currentYear()) {
      return "range";
    }
    return null;
  }

  function participationYearsFromRow(row) {
    const from = parseInt(row.yearFrom, 10);
    const to = row.yearTo ? parseInt(row.yearTo, 10) : from;
    return from === to ? [from] : [from, to];
  }

  function candidateProfilesForClaim(country, role, content) {
    if (!content) {
      return [];
    }
    return (content.profiles || []).filter((profile) => (
      profile.country === country && getProfileRoles(profile).includes(role)
    ));
  }

  function blankParticipationRow() {
    return { role: "", yearFrom: "", yearTo: "" };
  }

  function blankClaimDraft(existingClaim) {
    if (existingClaim) {
      return {
        country: existingClaim.country,
        participation: existingClaim.participation.map((row) => ({ ...row })),
        matchedProfileId: existingClaim.matchedProfileId || "",
        selfDeclaredName: existingClaim.selfDeclaredName || ""
      };
    }
    return {
      country: "",
      participation: [blankParticipationRow()],
      matchedProfileId: "",
      selfDeclaredName: ""
    };
  }

  function blankMemoryDraft(existingMemory) {
    if (existingMemory) {
      return {
        id: existingMemory.id,
        title: existingMemory.title,
        text: existingMemory.text,
        photos: existingMemory.photos.slice()
      };
    }
    return { id: null, title: "", text: "", photos: [] };
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

  async function loadFaqContent() {
    try {
      const response = await window.fetch(FAQ_CONTENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`FAQ content returned ${response.status}`);
      }
      state.faqContent = await response.json();
      state.faqLoadStatus = "ready";
    } catch (_error) {
      state.faqLoadStatus = "error";
    }
    render();
  }

  async function loadTimelineContent() {
    try {
      const response = await window.fetch(TIMELINE_CONTENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Timeline content returned ${response.status}`);
      }
      state.timelineContent = await response.json();
      state.timelineLoadStatus = "ready";
    } catch (_error) {
      state.timelineLoadStatus = "error";
    }
    render();
  }

  async function loadImpactContent() {
    try {
      const response = await window.fetch(IMPACT_CONTENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Impact content returned ${response.status}`);
      }
      state.impactContent = await response.json();
      state.impactLoadStatus = "ready";
    } catch (_error) {
      state.impactLoadStatus = "error";
    }
    render();
  }

  async function loadProgramCycleContent() {
    try {
      const response = await window.fetch(PROGRAM_CYCLE_CONTENT_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Program-cycle content returned ${response.status}`);
      }
      state.programCycleContent = await response.json();
      state.programCycleLoadStatus = "ready";
    } catch (_error) {
      state.programCycleLoadStatus = "error";
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

  function getFaqs() {
    return (state.faqContent && state.faqContent.faqs) || [];
  }

  function getMilestones() {
    return (state.timelineContent && state.timelineContent.milestones) || [];
  }

  function getImpactMetrics() {
    return (state.impactContent && state.impactContent.metrics) || [];
  }

  function getProgramPhases() {
    return (state.programCycleContent && state.programCycleContent.phases) || [];
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

  function renderClaimBadge(claimStatus) {
    if (claimStatus === "partly_verified_official") {
      return `<span class="pending-badge">${escapeHtml(t("labels.partlyVerifiedBadge"))}</span>`;
    }
    return "";
  }

  const OLD_VIEW_ALIASES = {
    recruit: "participate",
    alumniLanding: "community",
    activeLanding: "community"
  };

  function setView(view) {
    state.view = OLD_VIEW_ALIASES[view] || view;
    if (state.view !== "alumniProfile" && window.location.hash.startsWith("#alumni/")) {
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

  function isNavActive(item) {
    if (item === "about") {
      return ["about", "history", "faq"].includes(state.view);
    }
    if (item === "participate") {
      return ["participate", "schools"].includes(state.view);
    }
    if (item === "community") {
      return ["community", "directory", "resources", "alumniProfile", "stories"].includes(state.view);
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
        ${renderAccountDetailsForm(account)}
        ${renderClaimSection(account)}
        ${renderMemoriesSection(account)}
        <div class="account-danger">
          <button class="button ghost" type="button" data-action="clear-data">${escapeHtml(t("labels.clearDataButton"))}</button>
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

  window.addEventListener("hashchange", applyHashRoute);
  applyHashRoute();
  render();
  loadAlumniContent();
  loadStoriesContent();
  loadResourcesContent();
  loadFaqContent();
  loadTimelineContent();
  loadImpactContent();
  loadProgramCycleContent();
}());
