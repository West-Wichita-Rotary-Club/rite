import React from 'react';

const EVENTS = [
  { date: 'JUL 17', title: 'Weekly Meeting — Guest Speaker: City Water Dept.', area: 'water', rsvp: true },
  { date: 'JUL 24', title: 'Weekly Meeting — Club Assembly', area: 'economic', rsvp: false },
  { date: 'AUG 02', title: 'Backpack Drive for West Wichita Elementary', area: 'education', rsvp: false },
  { date: 'AUG 14', title: 'Weekly Meeting — New Member Induction', area: 'peace', rsvp: false },
];

/**
 * EventsScreen — upcoming meetings/projects list with RSVP toggling and Areas of Focus tags.
 */
function EventsScreen({ Card, Badge, AreaOfFocusTag, Button, rsvps, onToggleRsvp }) {
  return (
    <section style={{ padding: '56px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--rotary-gold)', fontSize: 'var(--text-sm)', marginBottom: 8 }}>Service Above Self</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--royal-blue)', fontSize: 'var(--text-2xl)', margin: '0 0 24px' }}>Upcoming events</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {EVENTS.map(ev => {
          const attending = !!rsvps[ev.title];
          return (
            <Card key={ev.title} bandless>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--azure)', fontSize: 'var(--text-lg)', minWidth: 70 }}>{ev.date}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--charcoal)', fontSize: 'var(--text-base)', marginBottom: 6 }}>{ev.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <AreaOfFocusTag area={ev.area} />
                    {attending && <Badge tone="grass">RSVP'd</Badge>}
                  </div>
                </div>
                <Button variant={attending ? 'outline' : 'primary'} size="sm" onClick={() => onToggleRsvp(ev.title)}>
                  {attending ? 'Cancel RSVP' : 'RSVP'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

window.EventsScreen = EventsScreen;
