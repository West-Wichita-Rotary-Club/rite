/* @ds-bundle: {"format":4,"namespace":"WestWichitaRotaryDesignSystem_516097","components":[{"name":"AreaOfFocusTag","sourcePath":"components/core/AreaOfFocusTag.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Callout","sourcePath":"components/core/Callout.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"}],"sourceHashes":{"components/core/AreaOfFocusTag.jsx":"3f31e54172fc","components/core/Badge.jsx":"7f11e368890d","components/core/Button.jsx":"3211e67a025e","components/core/Callout.jsx":"38c1fc4c5e4f","components/core/Card.jsx":"cff564514b12","ui_kits/club-website/EventsScreen.jsx":"7271c6749bf8","ui_kits/club-website/HomeScreen.jsx":"b0998835d7fa","ui_kits/club-website/MembershipScreen.jsx":"ebd18d753c8b","ui_kits/club-website/Shell.jsx":"74433ba413b2"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WestWichitaRotaryDesignSystem_516097 = window.WestWichitaRotaryDesignSystem_516097 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/AreaOfFocusTag.jsx
try { (() => {
const AOF_COLORS = {
  peace: '#17458f',
  disease: '#e02927',
  water: '#00a2e0',
  economic: '#00adbb',
  environment: '#009739',
  education: '#ff7600',
  maternal: '#901f93'
};
const AOF_LABELS = {
  peace: 'Peacebuilding & Conflict Prevention',
  disease: 'Disease Prevention & Treatment',
  water: 'Water, Sanitation & Hygiene',
  economic: 'Community Economic Development',
  environment: 'Environment',
  education: 'Basic Education & Literacy',
  maternal: 'Maternal & Child Health'
};

/**
 * AreaOfFocusTag — labels a club project by one of Rotary's seven official Areas of Focus,
 * using each area's official color (matched to the Areas of Focus icon set in assets/icons/).
 */
function AreaOfFocusTag({
  area
}) {
  const color = AOF_COLORS[area] || 'var(--charcoal)';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'var(--text-xs)',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      color,
      border: `1.5px solid ${color}`,
      borderRadius: 'var(--r-pill)',
      padding: '4px 12px 4px 8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: color,
      flexShrink: 0
    }
  }), AOF_LABELS[area] || area);
}
Object.assign(__ds_scope, { AreaOfFocusTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/AreaOfFocusTag.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
/**
 * Badge — small status/category pill, e.g. "New member", "Volunteer hours logged", "RSVP'd".
 */
function Badge({
  tone = 'azure',
  children
}) {
  const tones = {
    azure: {
      background: '#e6f0fb',
      color: 'var(--royal-blue)'
    },
    gold: {
      background: '#fef3de',
      color: '#8a5c07'
    },
    grass: {
      background: '#e3f5ea',
      color: 'var(--grass)'
    },
    cranberry: {
      background: '#fbe4ee',
      color: 'var(--cranberry)'
    },
    neutral: {
      background: 'var(--mist)',
      color: 'var(--charcoal)'
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--text-xs)',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      padding: '4px 10px',
      borderRadius: 'var(--r-pill)',
      ...tones[tone]
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary call-to-action control for the club site (register, donate, learn more).
 */
function Button({
  variant = 'primary',
  size = 'md',
  href,
  disabled,
  children,
  ...rest
}) {
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
    padding: size === 'sm' ? '8px 16px' : '12px 24px',
    borderRadius: 'var(--r-sm)',
    border: '2px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'inline-block',
    textDecoration: 'none',
    lineHeight: 1.2,
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease'
  };
  const variants = {
    primary: {
      background: 'var(--azure)',
      color: 'var(--white)'
    },
    gold: {
      background: 'var(--rotary-gold)',
      color: 'var(--charcoal)'
    },
    outline: {
      background: 'transparent',
      borderColor: 'var(--royal-blue)',
      color: 'var(--royal-blue)'
    },
    ghost: {
      background: 'transparent',
      borderColor: 'transparent',
      color: 'var(--azure)'
    }
  };
  const style = {
    ...base,
    ...variants[variant]
  };
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: !href ? disabled : undefined,
    style: style
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Callout.jsx
try { (() => {
/**
 * Callout — full-width banner for announcements, deadlines, and donation drives. Solid Royal
 * Blue fill echoes the brand-sheet hero treatment (bold color block + gold rule).
 */
function Callout({
  eyebrow,
  title,
  children,
  tone = 'royalBlue'
}) {
  const tones = {
    royalBlue: {
      background: 'var(--royal-blue)',
      color: 'var(--white)',
      body: '#dce6f5'
    },
    cranberry: {
      background: 'var(--cranberry)',
      color: 'var(--white)',
      body: '#fde6ef'
    }
  };
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.background,
      color: t.color,
      padding: 'var(--sp-lg) var(--sp-xl)',
      borderRadius: 'var(--r-md)',
      borderBottom: '3px solid var(--rotary-gold)'
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-display)',
      fontSize: 'var(--text-sm)',
      color: 'var(--rotary-gold)',
      marginBottom: 'var(--sp-sm)'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: 'var(--text-xl)',
      lineHeight: 'var(--leading-tight)',
      marginBottom: 'var(--sp-sm)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-base)',
      color: t.body,
      maxWidth: '60ch'
    }
  }, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Callout.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
/**
 * Card — content container with a signature Rotary Gold top band, used for meeting info,
 * service project summaries, and membership blurbs.
 */
function Card({
  title,
  children,
  accent = 'gold',
  bandless = false
}) {
  const bandColor = {
    gold: 'var(--rotary-gold)',
    azure: 'var(--azure)',
    none: 'transparent'
  }[accent];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      background: 'var(--color-surface)'
    }
  }, !bandless && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: bandColor
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--sp-lg)'
    }
  }, title && /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-display)',
      fontSize: 'var(--text-lg)',
      color: 'var(--color-heading)',
      margin: '0 0 var(--sp-sm) 0'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text)'
    }
  }, children)));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/club-website/EventsScreen.jsx
try { (() => {
const EVENTS = [{
  date: 'JUL 17',
  title: 'Weekly Meeting — Guest Speaker: City Water Dept.',
  area: 'water',
  rsvp: true
}, {
  date: 'JUL 24',
  title: 'Weekly Meeting — Club Assembly',
  area: 'economic',
  rsvp: false
}, {
  date: 'AUG 02',
  title: 'Backpack Drive for West Wichita Elementary',
  area: 'education',
  rsvp: false
}, {
  date: 'AUG 14',
  title: 'Weekly Meeting — New Member Induction',
  area: 'peace',
  rsvp: false
}];

/**
 * EventsScreen — upcoming meetings/projects list with RSVP toggling and Areas of Focus tags.
 */
function EventsScreen({
  Card,
  Badge,
  AreaOfFocusTag,
  Button,
  rsvps,
  onToggleRsvp
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '56px 40px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      color: 'var(--rotary-gold)',
      fontSize: 'var(--text-sm)',
      marginBottom: 8
    }
  }, "Service Above Self"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      color: 'var(--royal-blue)',
      fontSize: 'var(--text-2xl)',
      margin: '0 0 24px'
    }
  }, "Upcoming events"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, EVENTS.map(ev => {
    const attending = !!rsvps[ev.title];
    return /*#__PURE__*/React.createElement(Card, {
      key: ev.title,
      bandless: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        color: 'var(--azure)',
        fontSize: 'var(--text-lg)',
        minWidth: 70
      }
    }, ev.date), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        color: 'var(--charcoal)',
        fontSize: 'var(--text-base)',
        marginBottom: 6
      }
    }, ev.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(AreaOfFocusTag, {
      area: ev.area
    }), attending && /*#__PURE__*/React.createElement(Badge, {
      tone: "grass"
    }, "RSVP'd"))), /*#__PURE__*/React.createElement(Button, {
      variant: attending ? 'outline' : 'primary',
      size: "sm",
      onClick: () => onToggleRsvp(ev.title)
    }, attending ? 'Cancel RSVP' : 'RSVP')));
  })));
}
window.EventsScreen = EventsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/club-website/EventsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/club-website/HomeScreen.jsx
try { (() => {
/**
 * HomeScreen — club homepage: hero, weekly meeting/service/membership cards, Areas of Focus strip.
 */
function HomeScreen({
  Card,
  Button,
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--royal-blue)',
      color: 'var(--white)',
      padding: '64px 40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      color: 'var(--rotary-gold)',
      fontSize: 'var(--text-sm)',
      marginBottom: 8
    }
  }, "Service Above Self"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      textTransform: 'uppercase',
      fontSize: 'var(--text-3xl)',
      lineHeight: 1.05,
      maxWidth: '18ch',
      margin: 0
    }
  }, "Neighbors serving neighbors in West Wichita"), /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: '60ch',
      fontSize: 'var(--text-lg)',
      marginTop: 16,
      color: '#dce6f5',
      fontFamily: 'var(--font-body)'
    }
  }, "We meet weekly, fund local service projects, and support Rotary International's global causes \u2014 polio eradication, clean water, and youth exchange."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "gold",
    onClick: () => onNav('Membership')
  }, "Become a member"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('Events');
    },
    style: {
      borderColor: 'var(--white)',
      color: 'var(--white)'
    }
  }, "See upcoming events"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '56px 40px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      color: 'var(--royal-blue)',
      fontSize: 'var(--text-2xl)',
      marginBottom: 24
    }
  }, "Get involved"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Weekly Meeting"
  }, "Thursdays at noon \u2014 join us for fellowship, service updates, and guest speakers."), /*#__PURE__*/React.createElement(Card, {
    title: "Community Service",
    accent: "azure"
  }, "Track hours and sign up for upcoming volunteer projects around Wichita."), /*#__PURE__*/React.createElement(Card, {
    title: "Membership"
  }, "Learn about joining West Wichita Rotary and getting involved locally."))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 40px 56px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      color: 'var(--royal-blue)',
      fontSize: 'var(--text-2xl)',
      marginBottom: 8
    }
  }, "Rotary's Areas of Focus"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--charcoal)',
      maxWidth: '65ch',
      marginBottom: 16
    }
  }, "Every project we take on ties back to one of Rotary International's seven official Areas of Focus."), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/icons/areas-of-focus.png",
    alt: "Rotary's Areas of Focus",
    style: {
      width: '100%'
    }
  })));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/club-website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/club-website/MembershipScreen.jsx
try { (() => {
/**
 * MembershipScreen — join-the-club pitch with a simple interactive interest form.
 */
function MembershipScreen({
  Callout,
  Card,
  Button,
  submitted,
  onSubmit
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '56px 40px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Callout, {
    eyebrow: "Service Above Self",
    title: "Join West Wichita Rotary"
  }, "Meet local business and community leaders, take on service projects that matter, and connect with Rotary's global network of clubs."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Weekly Fellowship"
  }, "Thursdays at noon, in person \u2014 guest speakers, updates, and connection."), /*#__PURE__*/React.createElement(Card, {
    title: "Local Impact",
    accent: "azure"
  }, "Backpack drives, scholarships, and hands-on volunteer projects around Wichita."), /*#__PURE__*/React.createElement(Card, {
    title: "Global Network"
  }, "Access to Rotary International's programs \u2014 Youth Exchange, polio eradication, and more.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      textTransform: 'uppercase',
      color: 'var(--royal-blue)',
      fontSize: 'var(--text-xl)',
      marginBottom: 16
    }
  }, "Request an invitation"), submitted ? /*#__PURE__*/React.createElement(Card, {
    accent: "azure",
    title: "Thank you!"
  }, "A membership chair will reach out within a week to invite you to a meeting.") : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      onSubmit();
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("input", {
    required: true,
    placeholder: "Full name",
    style: inputStyle
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "email",
    placeholder: "Email address",
    style: inputStyle
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    type: "submit"
  }, "Request an invitation")))));
}
const inputStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-sm)',
  padding: '10px 14px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--r-sm)',
  color: 'var(--charcoal)'
};
window.MembershipScreen = MembershipScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/club-website/MembershipScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/club-website/Shell.jsx
try { (() => {
/**
 * SiteHeader — shared nav bar across the club website UI kit.
 */
function SiteHeader({
  active,
  onNav
}) {
  const links = ['Home', 'Events', 'Membership'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 40px',
      borderBottom: '3px solid var(--rotary-gold)',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/WestWichitaRotary.png",
    alt: "Rotary Club of West Wichita",
    style: {
      height: 48
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    onClick: () => onNav(l),
    style: {
      cursor: 'pointer',
      textDecoration: 'none',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--text-sm)',
      color: active === l ? 'var(--azure)' : 'var(--charcoal)'
    }
  }, l))));
}

/**
 * SiteFooter — shared footer across the club website UI kit.
 */
function SiteFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--mist)',
      padding: '32px 40px',
      textAlign: 'center',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--text-xs)',
      color: 'var(--charcoal)'
    }
  }, "Rotary Club of West Wichita \u2014 Service Above Self", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logos/WestWichitaRotary.png",
    alt: "",
    style: {
      height: 40,
      marginTop: 8
    }
  }));
}
window.SiteHeader = SiteHeader;
window.SiteFooter = SiteFooter;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/club-website/Shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AreaOfFocusTag = __ds_scope.AreaOfFocusTag;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Card = __ds_scope.Card;

})();
