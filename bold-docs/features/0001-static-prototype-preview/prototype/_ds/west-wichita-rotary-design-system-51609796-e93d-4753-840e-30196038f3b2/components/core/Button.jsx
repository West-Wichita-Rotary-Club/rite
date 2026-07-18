import React from 'react';

/**
 * Button — primary call-to-action control for the club site (register, donate, learn more).
 */
export function Button({ variant = 'primary', size = 'md', href, disabled, children, ...rest }) {
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
    transition: 'background-color 120ms ease, color 120ms ease, border-color 120ms ease',
  };

  const variants = {
    primary: { background: 'var(--azure)', color: 'var(--white)' },
    gold: { background: 'var(--rotary-gold)', color: 'var(--charcoal)' },
    outline: { background: 'transparent', borderColor: 'var(--royal-blue)', color: 'var(--royal-blue)' },
    ghost: { background: 'transparent', borderColor: 'transparent', color: 'var(--azure)' },
  };

  const style = { ...base, ...variants[variant] };
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} disabled={!href ? disabled : undefined} style={style} {...rest}>
      {children}
    </Tag>
  );
}
