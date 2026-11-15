import React from 'react';

/**
 * HomeScreen — club homepage: hero, weekly meeting/service/membership cards, Areas of Focus strip.
 */
function HomeScreen({ Card, Button, onNav }) {
  return (
    <div>
      <div style={{ background: 'var(--royal-blue)', color: 'var(--white)', padding: '64px 40px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--rotary-gold)', fontSize: 'var(--text-sm)', marginBottom: 8 }}>Service Above Self</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', fontSize: 'var(--text-3xl)', lineHeight: 1.05, maxWidth: '18ch', margin: 0 }}>Neighbors serving neighbors in West Wichita</h1>
        <p style={{ maxWidth: '60ch', fontSize: 'var(--text-lg)', marginTop: 16, color: '#dce6f5', fontFamily: 'var(--font-body)' }}>
          We meet weekly, fund local service projects, and support Rotary International's global causes — polio eradication, clean water, and youth exchange.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
          <Button variant="gold" onClick={() => onNav('Membership')}>Become a member</Button>
          <Button variant="outline" href="#" onClick={(e) => { e.preventDefault(); onNav('Events'); }} style={{ borderColor: 'var(--white)', color: 'var(--white)' }}>See upcoming events</Button>
        </div>
      </div>

      <section style={{ padding: '56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--royal-blue)', fontSize: 'var(--text-2xl)', marginBottom: 24 }}>Get involved</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <Card title="Weekly Meeting">Thursdays at noon — join us for fellowship, service updates, and guest speakers.</Card>
          <Card title="Community Service" accent="azure">Track hours and sign up for upcoming volunteer projects around Wichita.</Card>
          <Card title="Membership">Learn about joining West Wichita Rotary and getting involved locally.</Card>
        </div>
      </section>

      <section style={{ padding: '0 40px 56px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--royal-blue)', fontSize: 'var(--text-2xl)', marginBottom: 8 }}>Rotary's Areas of Focus</h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--charcoal)', maxWidth: '65ch', marginBottom: 16 }}>
          Every project we take on ties back to one of Rotary International's seven official Areas of Focus.
        </p>
        <img src="../../assets/icons/areas-of-focus.png" alt="Rotary's Areas of Focus" style={{ width: '100%' }} />
      </section>
    </div>
  );
}

window.HomeScreen = HomeScreen;
