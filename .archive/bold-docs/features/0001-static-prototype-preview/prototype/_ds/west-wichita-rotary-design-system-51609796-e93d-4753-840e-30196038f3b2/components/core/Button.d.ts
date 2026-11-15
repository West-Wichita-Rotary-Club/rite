import { ReactNode } from 'react';

/**
 * @startingPoint section="Components" subtitle="Primary, gold, outline & ghost buttons" viewport="700x180"
 */
export interface ButtonProps {
  /** Visual treatment. `primary` (Azure) for main actions, `gold` for donate/celebratory CTAs, `outline`/`ghost` for secondary actions. */
  variant?: 'primary' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  /** Renders as an <a> when provided, otherwise a <button>. */
  href?: string;
  disabled?: boolean;
  children: ReactNode;
}
