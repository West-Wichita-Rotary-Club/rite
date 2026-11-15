import React from 'react';

const AOF_COLORS = {
  peace: '#17458f',
  disease: '#e02927',
  water: '#00a2e0',
  economic: '#00adbb',
  environment: '#009739',
  education: '#ff7600',
  maternal: '#901f93',
};

const AOF_LABELS = {
  peace: 'Peacebuilding & Conflict Prevention',
  disease: 'Disease Prevention & Treatment',
  water: 'Water, Sanitation & Hygiene',
  economic: 'Community Economic Development',
  environment: 'Environment',
  education: 'Basic Education & Literacy',
  maternal: 'Maternal & Child Health',
};

/**
 * AreaOfFocusTag — labels a club project by one of Rotary's seven official Areas of Focus,
 * using each area's official color (matched to the Areas of Focus icon set in assets/icons/).
 */
export function AreaOfFocusTag({ area }) {
  const color = AOF_COLORS[area] || 'var(--charcoal)';
  return (
    <span style={{
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
      padding: '4px 12px 4px 8px',
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {AOF_LABELS[area] || area}
    </span>
  );
}
