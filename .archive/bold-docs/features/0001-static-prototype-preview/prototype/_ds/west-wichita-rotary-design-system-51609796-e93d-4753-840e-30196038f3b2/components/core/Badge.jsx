import React from 'react';

/**
 * Badge — small status/category pill, e.g. "New member", "Volunteer hours logged", "RSVP'd".
 */
export function Badge({ tone = 'azure', children }) {
  const tones = {
    azure: { background: '#e6f0fb', color: 'var(--royal-blue)' },
    gold: { background: '#fef3de', color: '#8a5c07' },
    grass: { background: '#e3f5ea', color: 'var(--grass)' },
    cranberry: { background: '#fbe4ee', color: 'var(--cranberry)' },
    neutral: { background: 'var(--mist)', color: 'var(--charcoal)' },
  };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 'var(--text-xs)',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      padding: '4px 10px',
      borderRadius: 'var(--r-pill)',
      ...tones[tone],
    }}>
      {children}
    </span>
  );
}
