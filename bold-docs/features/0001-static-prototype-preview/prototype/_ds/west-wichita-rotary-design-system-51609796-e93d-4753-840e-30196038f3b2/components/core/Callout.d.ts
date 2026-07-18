import { ReactNode } from 'react';

/**
 * @startingPoint section="Components" subtitle="Bold announcement banner with gold rule" viewport="700x220"
 */
export interface CalloutProps {
  eyebrow?: string;
  title?: string;
  tone?: 'royalBlue' | 'cranberry';
  children: ReactNode;
}
