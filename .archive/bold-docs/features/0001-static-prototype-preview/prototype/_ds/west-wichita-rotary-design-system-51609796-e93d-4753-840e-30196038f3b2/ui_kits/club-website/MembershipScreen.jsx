import React from 'react';

/**
 * MembershipScreen — join-the-club pitch with a simple interactive interest form.
 */
function MembershipScreen({ Callout, Card, Button, submitted, onSubmit }) {
  return (
    <div>
      <div style={{ padding: '56px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <Callout eyebrow="Service Above Self" title="Join West Wichita Rotary">
          Meet local business and community leaders, take on service projects that matter, and connect with Rotary's global network of clubs.
        </Callout>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 32 }}>
          <Card title="Weekly Fellowship">Thursdays at noon, in person — guest speakers, updates, and connection.</Card>
          <Card title="Local Impact" accent="azure">Backpack drives, scholarships, and hands-on volunteer projects around Wichita.</Card>
          <Card title="Global Network">Access to Rotary International's programs — Youth Exchange, polio eradication, and more.</Card>
        </div>

        <div style={{ marginTop: 40, maxWidth: 480 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, textTransform: 'uppercase', color: 'var(--royal-blue)', fontSize: 'var(--text-xl)', marginBottom: 16 }}>Request an invitation</h2>
          {submitted ? (
            <Card accent="azure" title="Thank you!">A membership chair will reach out within a week to invite you to a meeting.</Card>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input required placeholder="Full name" style={inputStyle} />
              <input required type="email" placeholder="Email address" style={inputStyle} />
              <Button variant="primary" type="submit">Request an invitation</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', padding: '10px 14px',
  border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', color: 'var(--charcoal)',
};

window.MembershipScreen = MembershipScreen;
