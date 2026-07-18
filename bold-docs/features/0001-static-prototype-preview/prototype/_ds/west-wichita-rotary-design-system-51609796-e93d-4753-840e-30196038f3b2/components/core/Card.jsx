import React from 'react';

/**
 * Card — content container with a signature Rotary Gold top band, used for meeting info,
 * service project summaries, and membership blurbs.
 */
export function Card({ title, children, accent = 'gold', bandless = false }) {
  const bandColor = {
    gold: 'var(--rotary-gold)',
    azure: 'var(--azure)',
    none: 'transparent',
  }[accent];

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      background: 'var(--color-surface)',
    }}>
      {!bandless && <div style={{ height: 6, background: bandColor }} />}
      <div style={{ padding: 'var(--sp-lg)' }}>
        {title && (
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-display)',
            fontSize: 'var(--text-lg)',
            color: 'var(--color-heading)',
            margin: '0 0 var(--sp-sm) 0',
          }}>{title}</h3>
        )}
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
