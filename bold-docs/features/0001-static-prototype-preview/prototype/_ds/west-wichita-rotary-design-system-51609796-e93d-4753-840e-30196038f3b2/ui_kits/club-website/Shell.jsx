import React from 'react';

/**
 * SiteHeader — shared nav bar across the club website UI kit.
 */
function SiteHeader({ active, onNav }) {
  const links = ['Home', 'Events', 'Membership'];
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px', borderBottom: '3px solid var(--rotary-gold)', background: 'var(--white)',
    }}>
      <img src="../../assets/logos/WestWichitaRotary.png" alt="Rotary Club of West Wichita" style={{ height: 48 }} />
      <nav style={{ display: 'flex', gap: 24 }}>
        {links.map(l => (
          <a key={l} onClick={() => onNav(l)} style={{
            cursor: 'pointer', textDecoration: 'none', fontFamily: 'var(--font-body)',
            fontWeight: 700, fontSize: 'var(--text-sm)',
            color: active === l ? 'var(--azure)' : 'var(--charcoal)',
          }}>{l}</a>
        ))}
      </nav>
    </header>
  );
}

/**
 * SiteFooter — shared footer across the club website UI kit.
 */
function SiteFooter() {
  return (
    <footer style={{ background: 'var(--mist)', padding: '32px 40px', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--charcoal)' }}>
      Rotary Club of West Wichita — Service Above Self
      <br />
      <img src="../../assets/logos/WestWichitaRotary.png" alt="" style={{ height: 40, marginTop: 8 }} />
    </footer>
  );
}

window.SiteHeader = SiteHeader;
window.SiteFooter = SiteFooter;
