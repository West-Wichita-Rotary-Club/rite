import React from 'react';

/**
 * Callout — full-width banner for announcements, deadlines, and donation drives. Solid Royal
 * Blue fill echoes the brand-sheet hero treatment (bold color block + gold rule).
 */
export function Callout({ eyebrow, title, children, tone = 'royalBlue' }) {
  const tones = {
    royalBlue: { background: 'var(--royal-blue)', color: 'var(--white)', body: '#dce6f5' },
    cranberry: { background: 'var(--cranberry)', color: 'var(--white)', body: '#fde6ef' },
  };
  const t = tones[tone];
  return (
    <div style={{
      background: t.background,
      color: t.color,
      padding: 'var(--sp-lg) var(--sp-xl)',
      borderRadius: 'var(--r-md)',
      borderBottom: '3px solid var(--rotary-gold)',
    }}>
      {eyebrow && (
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-display)', fontSize: 'var(--text-sm)', color: 'var(--rotary-gold)',
          marginBottom: 'var(--sp-sm)',
        }}>{eyebrow}</div>
      )}
      {title && (
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase',
          fontSize: 'var(--text-xl)', lineHeight: 'var(--leading-tight)', marginBottom: 'var(--sp-sm)',
        }}>{title}</div>
      )}
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: t.body, maxWidth: '60ch' }}>
        {children}
      </div>
    </div>
  );
}
