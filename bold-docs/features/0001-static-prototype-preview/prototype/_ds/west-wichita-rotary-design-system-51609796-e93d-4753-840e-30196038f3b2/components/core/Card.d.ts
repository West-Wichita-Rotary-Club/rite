import { ReactNode } from 'react';

/**
 * @startingPoint section="Components" subtitle="Gold-banded content card for meetings & projects" viewport="700x220"
 */
export interface CardProps {
  title?: string;
  /** Top accent band color. `gold` is the default club signature; `azure` for secondary emphasis; `none` for a flat card. */
  accent?: 'gold' | 'azure' | 'none';
  bandless?: boolean;
  children: ReactNode;
}
