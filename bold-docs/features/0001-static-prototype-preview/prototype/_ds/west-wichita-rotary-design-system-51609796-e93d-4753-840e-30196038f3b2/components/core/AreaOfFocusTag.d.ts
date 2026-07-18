/**
 * Intentional addition — Rotary's seven Areas of Focus are an official, well-defined taxonomy
 * (see assets/icons/areas-of-focus.png) used throughout club materials to categorize service
 * projects; no generic "Tag" component from the source covers this, so this is a purpose-built
 * variant rather than a generic tag.
 * @startingPoint section="Components" subtitle="Official Areas of Focus category tag" viewport="700x140"
 */
export interface AreaOfFocusTagProps {
  area: 'peace' | 'disease' | 'water' | 'economic' | 'environment' | 'education' | 'maternal';
}
