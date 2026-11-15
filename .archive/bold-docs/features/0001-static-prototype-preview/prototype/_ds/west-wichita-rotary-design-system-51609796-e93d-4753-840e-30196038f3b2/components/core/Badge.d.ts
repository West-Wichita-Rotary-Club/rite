import { ReactNode } from 'react';

/**
 * @startingPoint section="Components" subtitle="Status & category pill" viewport="700x120"
 */
export interface BadgeProps {
  tone?: 'azure' | 'gold' | 'grass' | 'cranberry' | 'neutral';
  children: ReactNode;
}
