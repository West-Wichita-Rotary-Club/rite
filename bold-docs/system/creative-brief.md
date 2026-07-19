# RITE Website Creative Brief

Product Owner TL;DR: This is the creative direction for the RITE Community Archive and Storytelling Platform - vision, messaging, brand personality, visual direction, information architecture, and content strategy for a bilingual site that explains RITE, preserves its history, and lets the Wichita/Panama/Argentina community contribute stories and media. It complements `product.md` (scope and roadmap), `design-system.md` (brand tokens and components), `architecture.md` (technical direction), and `privacy-and-governance.md` (consent and review workflow) - see those for system-level detail this brief assumes.

## Alignment Resolution Log (2026-07-19)

This brief was checked against what is actually ratified and built (`backbone.md`, `product.md`, `privacy-and-governance.md`, and feature `0003-three-audience-experience`, ratified 2026-07-18). Four conflicts surfaced and were resolved by the product owner:

1. **Information architecture (§14).** The three-audience front-door model (alumni / active / recruiting) - the site's actual, most recently ratified navigation structure - stays primary. This brief's topic-based page list (What Is RITE?, Our Story, Exchanges, Partners, Resources, etc.) is content organized *within* that structure and the existing topic nav (History/Stories/Schools & Clubs/Resources), not a replacement top-level nav. See the note at the top of §14.
2. **Editorial roles (§20).** This brief's six-role model (Contributor, Reviewer, Translator, Historian/Archivist, Publisher, Administrator) is now the ratified target, replacing the prior four-role model. `privacy-and-governance.md` has been updated to match.
3. **Contribution model (§19).** The no-account "Quick Contribution" path is approved to build, extending what feature `0003-mock-registration-login` shipped (account-only contribution). It needs its own feature spec before implementation - not yet scheduled.
4. **Persona scope (§8).** This brief's eight audience segments are content/messaging lenses, not new account types. The five ratified registration personas in `backbone.md` principle 5 (Teachers, Host families, Rotary leaders, Coordinators, School administrators) are unchanged.

## Project Name

**RITE Community Archive and Storytelling Platform**

**RITE** stands for **Rotary Inter-country Teacher Exchange**.

## Project Sponsor

West Wichita Rotary Club
International Service Committee
Wichita, Kansas

## Project Vision

Create a world-class bilingual digital platform that explains what the RITE program is, preserves its history, celebrates the people who made it possible, and enables participants to contribute stories, photographs, documents, memories, and updates.

The website should become the trusted digital home of the RITE community across Wichita, Panama, and Argentina.

It should educate first-time visitors, strengthen the existing international community, preserve institutional knowledge, and provide a foundation for the program's next generation.

---

# 1. Executive Summary

For approximately 30 years, the Rotary Inter-country Teacher Exchange has connected educators, schools, Rotary clubs, host families, and communities in Wichita, Panama, and Argentina.

Teachers travel across borders to observe classrooms, exchange teaching methods, experience different cultures, build professional relationships, and return home with new ideas that influence their students, schools, and communities.

The program has been sustained by a small group of dedicated leaders, strong relationships with school systems, international Rotary partnerships, host families, and generations of participating teachers.

Despite its long history and significant personal impact, the program currently lacks a comprehensive public destination where people can:

* Understand what RITE is
* Learn how the different exchanges operate
* Explore its history
* Hear directly from participants
* Find current updates
* Share memories and archival material
* Preserve photographs and documents
* Connect with the broader RITE community
* Learn how similar programs might be developed elsewhere

The RITE website will address that gap.

The platform must not feel like a conventional organizational website or an administrative portal. It should feel like a living documentary, an international community archive, and an invitation to participate.

---

# 2. Core Purpose

The primary purpose of the home page is to clearly and quickly explain:

> **What is RITE, and why does it matter?**

A first-time visitor should understand the core program within 30 seconds.

The website should communicate that RITE is built around three connected ideas:

## Teach

Educators share classroom practices, teaching methods, professional knowledge, and practical resources.

## Learn

Participants observe different educational systems, experience other cultures, and develop new professional and personal perspectives.

## Connect

Teachers, students, families, schools, Rotary clubs, and communities form relationships that continue long after an individual exchange ends.

This may be represented through the recurring message:

> **Teach. Learn. Connect.**

---

# 3. Product Vision Statement

> Create a bilingual digital home for the RITE community where visitors can understand the program, participants can preserve and share their experiences, and future generations can continue the relationships and lessons built over three decades.

---

# 4. Brand Promise

> RITE brings educators together across borders so they can learn from one another, strengthen their schools, and create lasting international relationships.

---

# 5. Core Message

The primary public message should be:

> **Teachers Crossing Borders**

Supporting message:

> RITE connects educators in Wichita, Panama, and Argentina through professional learning, cultural exchange, and lasting friendship.

The message should be supported by a simple three-stage explanation:

## 1. Learn Together

Teachers share ideas, teaching strategies, classroom practices, and educational innovations.

## 2. Live the Exchange

Participants visit classrooms, experience new cultures, stay with local families, and build meaningful relationships.

## 3. Carry It Forward

Teachers return home with ideas, resources, and relationships that continue to influence students, schools, and communities.

---

# 6. Strategic Objectives

The website should accomplish six strategic objectives.

## Objective 1: Explain the Program

Provide a clear, concise, and visually engaging explanation of what RITE is.

The site must make sense to someone who has never heard of Rotary or an international teacher exchange.

## Objective 2: Preserve the History

Capture the origin, evolution, milestones, relationships, and institutional knowledge that have sustained the program for approximately 30 years.

## Objective 3: Center Participant Voices

Tell the story primarily through teachers, founders, host families, school leaders, Rotary members, and community partners.

## Objective 4: Build a Living Community Archive

Allow participants and supporters to contribute stories, photographs, videos, documents, updates, and historical information.

## Objective 5: Support Continuity

Preserve the practices, relationships, lessons, and leadership knowledge needed to sustain the program beyond its founding generation.

## Objective 6: Enable Replication

Document the program's operating model and lessons so interested Rotary clubs and educational organizations can understand what would be required to develop a similar exchange.

---

# 7. Success Definition

The project will be successful when:

* A new visitor can explain the purpose of RITE after visiting the home page.
* Participants recognize the site as an authentic representation of their shared experience.
* Founders and long-term organizers feel that the program's legacy is being preserved respectfully.
* Teachers and host families actively submit stories and materials.
* English- and Spanish-speaking users receive an equally credible experience.
* The site becomes the authoritative source for RITE history, updates, and participant stories.
* Future leaders can understand how and why the program has endured.
* Interested Rotary clubs can learn from the Wichita, Panama, and Argentina experience.
* Content can continue to grow without requiring a developer for every update.

---

# 8. Primary Audiences

**Resolved (2026-07-19):** these eight segments are content and messaging lenses - who a page, story, or CTA should speak to - not new account types. The system's five ratified registration personas (`backbone.md` principle 5: Teachers, Host families, Rotary leaders, Coordinators, School administrators) are unchanged. Several segments below map directly onto one of those five (e.g. Prospective Teachers and Past Participants are both facets of Teachers); Founders and Program Leaders, Rotary Members and Clubs, and Donors and Community Supporters describe people the site should address in content even though they are not themselves a registration persona.

## First-Time Visitors

People who have heard about RITE and want to understand what it is.

Their primary question is:

> What does this program actually do?

## Prospective Teachers

Educators considering participation.

Their primary questions are:

* What is the experience like?
* What is expected of me?
* How are teachers selected?
* What will I learn?
* What happens after the exchange?

## Past Participants

Teachers from Wichita, Panama, and Argentina who have participated in the program.

Their primary goals are:

* Find people and memories
* Share their stories
* Upload photographs
* Update their profiles
* Explain how the experience affected their work and lives

## Host Families

Individuals and families who hosted visiting teachers.

Their primary goals are:

* Share personal memories
* Understand hosting expectations
* Celebrate relationships formed through the program
* Encourage future hosts

## Founders and Program Leaders

People responsible for creating and sustaining the program.

Their primary goals are:

* Preserve an accurate history
* Document important relationships
* Explain critical success factors
* Prepare the next generation of leadership

## School Leaders and Educators

District leaders, administrators, principals, and teachers who support participation.

Their primary questions are:

* What is the educational value?
* How does the exchange benefit schools?
* What commitments are required?
* How is the program governed?

## Rotary Members and Clubs

Rotarians who want to understand or support the program.

Their primary goals are:

* Learn about the service model
* Understand international partnerships
* Support program continuity
* Explore replication

## Donors and Community Supporters

People who may contribute money, supplies, services, hosting, or volunteer time.

Their primary questions are:

* What impact does the program create?
* How are resources used?
* How can I help?

---

# 9. Audience Experience Principles

The website should be designed around the following principles.

## People Before Process

Visitors should encounter real people and real experiences before administrative detail.

## Story Before Structure

The site should explain the program through stories, photographs, quotes, timelines, and outcomes rather than organizational language.

## Shared Ownership

The website must represent Wichita, Panama, and Argentina as partners.

It must not suggest that Wichita owns the story while Panama and Argentina merely participate.

## Equal Language Experience

The Spanish experience should be equivalent in quality, completeness, tone, and usability to the English experience.

## Simple Entry, Deeper Discovery

The home page should be easy to understand, while deeper pages provide historical, educational, and operational detail.

## Contribution Without Complexity

People should be able to share a story or photograph without navigating an unnecessarily complex membership process.

---

# 10. Brand Personality

The RITE website should feel:

* Warm
* Credible
* International
* Educational
* Optimistic
* Human
* Respectful
* Inclusive
* Established
* Forward-looking
* Community-owned
* Professionally designed

It should not feel:

* Corporate
* Bureaucratic
* Overly promotional
* Institutional
* Generic
* Technically driven
* Self-congratulatory
* American-centered
* Like a travel agency
* Like a fundraising campaign
* Like an administrative database

---

# 11. Tone of Voice

The content should be written in a voice that is:

## Clear

Avoid Rotary jargon, education jargon, and internal terminology unless explained.

## Personal

Use direct human language and first-person stories.

## Respectful

Honor the founders and long-term leaders without making the site feel like a memorial.

## International

Avoid idioms or cultural references that do not translate well.

## Evidence-Based

Use names, dates, places, stories, photographs, and documented outcomes rather than broad claims.

## Inviting

Encourage people to explore, contribute, reconnect, and participate.

## Authentic

Do not exaggerate the impact of the program. Let participants demonstrate its value through their own experiences.

---

# 12. Visual Direction

## Overall Style

The visual experience should combine:

* Editorial storytelling
* Modern educational design
* Rotary visual credibility
* International community imagery
* Archival history
* Clean contemporary interfaces

The site should feel polished enough for Rotary International, school district leadership, sponsors, and the general public while remaining warm and personal.

## Color Palette

Use Rotary-aligned colors as the primary visual foundation:

* Rotary royal blue
* Rotary azure
* Rotary gold
* White
* Warm neutrals
* Limited teal or turquoise accents
* Limited cranberry accents where appropriate

Colors should support navigation, storytelling, categorization, and calls to action without overwhelming participant photography.

This palette is already codified in `design-system.md` and `_ds/.../tokens/colors.css` (Azure `#0067c8`, Royal Blue `#17458f`, Sky Blue `#00a2e0`, Rotary Gold `#f7a81b`, Cranberry `#d41367`, Turquoise `#00adbb`) - new production UI should draw from those tokens rather than introducing new hex values.

## Wichita Identity

Use the Wichita flag as a recognizable visual symbol of the program's Wichita connection.

The Wichita flag should be used in a clean, abstract, graphic manner rather than as a waving photographic flag.

It may appear:

* In the hero graphic
* As a geometric background treatment
* As a section divider
* In Wichita-specific content
* In subtle iconography or pattern work

The flag should not dominate the identities of Panama or Argentina.

Equivalent visual consideration should be given to each participating country and community.

## Typography

Typography should be:

* Highly legible
* Modern
* Warm
* Available for web use
* Effective in English and Spanish
* Accessible at all screen sizes

Recommended approach:

* Strong condensed or semi-condensed display font for headings
* Neutral humanist sans serif for body content
* Clear hierarchy
* Generous line spacing
* Avoid excessive all-caps text

This matches the current design system: Oswald for display/headings and Open Sans for body, as free substitutes for the club's licensed Frutiger fonts until those files are supplied.

## Photography

Photography should be central to the experience.

Preferred imagery includes:

* Teachers in classrooms
* Teachers learning together
* Host-family moments
* School visits
* Community activities
* Cultural experiences
* Teacher presentations
* Students engaging with visiting educators
* Rotary gatherings
* Group photographs with clear context
* Historic photographs
* Contemporary alumni updates

Avoid:

* Generic stock photography
* Staged corporate poses
* Repeated handshake imagery
* Travel-tourism cliches
* Unidentified archival images
* Photographs without confirmed usage permission

---

# 13. Hero Graphic Direction

The hero must educate rather than merely decorate.

It should communicate the full RITE concept through a single integrated composition.

## Required Elements

* RITE name or approved brand mark
* Headline: **Teachers Crossing Borders**
* Supporting explanation
* Wichita, Panama, and Argentina
* Map or visual connection between the three locations
* Diverse educators interacting
* Professional learning materials
* Three books labeled:

  * Teach
  * Learn
  * Connect
* Abstract Wichita flag treatment
* Three program stages:

  * Learn Together
  * Live the Exchange
  * Carry It Forward

## Graphic Style

The preferred style is:

* Contemporary editorial illustration
* Warm and optimistic
* Clean enough for web use
* Detailed but not visually crowded
* Suitable for desktop and responsive adaptation
* Consistent with Rotary colors
* Culturally respectful
* Avoiding inaccurate geography or landmarks

## Geographic Accuracy

The map should accurately represent:

* Wichita, Kansas
* Panama, preferably the David or Chiriqui area where relevant
* Argentina, with the primary marker in or near Buenos Aires Province based on the program's participating communities

Map markers, paths, country names, and labels should be validated before production use.

## Hero Responsive Strategy

The hero should not depend on a single large image containing all critical text.

For production:

* Use the graphic as an illustration
* Render primary headline and supporting copy as HTML
* Render buttons as HTML
* Preserve accessibility and responsive behavior
* Develop alternate crops for desktop, tablet, and mobile
* Ensure text remains readable without zooming
* Provide meaningful alternative text

**Implementation note:** the current static prototype (`docs/`) already carries a hero graphic matching this composition - `RITE-Hero-Graphic.png` (Teachers Crossing Borders, the Wichita/Panama/Argentina map, the Teach/Learn/Connect books, and the three-stage band) - but it is used as a single flat image with the headline and copy baked in, not split into an illustration layer plus HTML text per the responsive strategy above. Treat that as prototype evidence of the target composition, not the production pattern; production should separate the illustration from the HTML-rendered headline, copy, and buttons as described here.

---

# 14. Information Architecture

**Resolved (2026-07-19):** the site's actual primary IA is the three-audience front-door model shipped in feature `0003-three-audience-experience` (ratified 2026-07-18) - alumni, active participants, and recruiting prospects, with the anonymous default oriented toward recruiting and education. That structure stays primary. The page list and topic groupings below describe content and should be organized *within* the audience landing views and the existing topic nav (History, Stories, Schools & Clubs, Resources, plus the Alumni directory) rather than stood up as a parallel top-level nav. Where a page below doesn't map cleanly onto an existing audience view or topic section, that's a signal to extend the current structure rather than fork a new one alongside it.

## Primary Navigation

Recommended public navigation, understood as content coverage rather than a literal top-level menu (see resolution note above):

* Home
* What Is RITE?
* Our Story
* Stories
* RITE Community
* Exchanges
* Partners
* Resources
* Share Your Story

Secondary authenticated navigation:

* My Profile
* My RITE Experience
* My Stories
* My Photos and Documents
* Drafts
* Messages from Editors
* Account and Privacy

## Recommended Site Structure

### Home

Purpose:

Explain RITE at its core and invite further exploration.

Key sections:

* Hero
* What is RITE?
* Teach, Learn, Connect
* Three-stage exchange model
* Featured participant story
* Wichita, Panama, and Argentina
* 30-year timeline preview
* Recent stories and updates
* Share your story
* Partner and supporter call to action

### What Is RITE?

Purpose:

Provide a complete but accessible explanation.

Content:

* Program purpose
* How an exchange works
* Educational value
* Cultural value
* Role of Rotary
* Role of schools
* Role of host families
* What participants carry home

### Our Story

Purpose:

Preserve the history.

Content:

* Origin story
* Founders
* Timeline
* Early challenges
* Expansion
* Panama relationship
* Argentina relationship
* Major milestones
* Program evolution
* Lessons learned
* The "secret sauce"
* Future leadership and continuity

### Stories

Purpose:

Present the human impact.

Story categories:

* Teacher experiences
* Host-family experiences
* Founder stories
* Classroom impact
* Cultural memories
* Where are they now?
* Lessons carried home
* Friendship and family
* Leadership and service

Filtering:

* Country
* Year
* Role
* Story type
* Language
* Location
* Exchange direction

### RITE Community

The shipped nav label for this section is **Alumni**, reached from the alumni audience landing view. Treat the label question (Alumni vs. RITE Community vs. Our People vs. RITE Family) as still open and low-stakes - resolve it separately with whoever owns nav copy, not as part of the IA resolution above.

Purpose:

Present approved participant and supporter profiles.

Possible label alternatives:

* Our People
* RITE Family
* Community

Profiles may include:

* Name
* Country
* City or region
* Participation years
* Roles
* Short biography
* Stories
* Photographs
* Current update
* Consent-controlled contact options

### Exchanges

Purpose:

Explain the distinct exchange models.

Subsections:

* Panama to Wichita
* Argentina to Wichita
* Wichita to Panama
* Wichita to Argentina, if applicable
* Host-family experience
* School observation and training
* Community and Rotary activities
* Selection processes
* What differs by country
* Typical exchange schedule

The Panama and Argentina experiences must not be flattened into one generic process.

### Partners

Purpose:

Explain the institutional relationships that sustain RITE.

Content:

* Rotary clubs
* School districts
* Schools
* Universities
* Community organizations
* Host families
* Sponsors
* International coordinators

The section should demonstrate why school-system relationships are essential to the program.

### Resources

Public resources may include:

* Teacher guides
* Host-family guides
* Orientation materials
* Classroom resources
* Cultural preparation
* Travel guidance
* Lesson plans
* Training materials
* Videos
* Program forms
* Historical documents

### Build a RITE Program

Purpose:

Provide a replication toolkit for interested Rotary clubs.

Content:

* Minimum requirements
* Partner selection
* School relationships
* Program leadership
* Teacher selection
* Hosting
* Funding
* Travel
* Risk management
* Safeguarding
* Communications
* Governance
* Succession planning
* Common failure points
* Lessons from 30 years

### News and Updates

Purpose:

Demonstrate that RITE is active and continuing.

Content:

* Current exchange updates
* Teacher projects after returning home
* School activities
* Alumni news
* Events
* New partnerships
* Application periods
* Calls for hosts or volunteers

### Share Your Story

Purpose:

Make contribution easy.

Contribution types:

* Story
* Memory
* Photograph
* Video
* Document
* Newsletter
* Program schedule
* Newspaper article
* Teacher resource
* Correction
* Historical information
* Contact referral

---

# 15. Homepage Content Strategy

The homepage should guide visitors through a deliberate sequence.

## Section 1: Hero

Answer:

> What is RITE?

Recommended headline:

> **Teachers Crossing Borders**

Recommended supporting copy:

> RITE connects educators in Wichita, Panama, and Argentina through professional learning, cultural exchange, and lasting friendship.

Primary call to action:

> Discover RITE

Secondary call to action:

> Share Your Story

## Section 2: Teach, Learn, Connect

Use the three-book motif.

### Teach

Share methods, strategies, lessons, and classroom experience.

### Learn

Observe schools, experience cultures, and gain new perspectives.

### Connect

Build relationships among teachers, students, families, schools, and Rotary communities.

## Section 3: How the Exchange Works

### Learn Together

Teachers collaborate and exchange educational practices.

### Live the Exchange

Participants experience classrooms, communities, and family life.

### Carry It Forward

Teachers return home and apply what they learned.

## Section 4: A Real Participant Story

Feature one compelling quote, photograph, and short story.

## Section 5: Three Countries, One Community

Explain Wichita, Panama, and Argentina as equal partners.

## Section 6: Thirty Years of Relationships

Introduce the timeline and history.

## Section 7: Continuing Impact

Show what teachers do after returning home.

## Section 8: Join the Story

Invite participants to contribute.

---

# 16. Storytelling Framework

Every major story should attempt to answer four questions.

## Before

Who was the participant, and what did they expect?

## During

What did they experience?

## Change

What changed in their thinking, teaching, relationships, or professional practice?

## After

What did they carry forward into their classroom, school, or community?

This framework creates consistency without forcing every story into the same format.

---

# 17. Content Collection Strategy

## Priority Interview Groups

1. Founders
2. Long-term organizers
3. School district partners
4. Teachers from Panama
5. Teachers from Argentina
6. Wichita teachers who traveled abroad
7. Host families
8. Rotary leaders
9. School administrators
10. Former participants with long-term impact stories

## Priority Archival Materials

* Founding documents
* Early photographs
* Letters
* Programs
* Schedules
* Newsletters
* Newspaper articles
* Participant lists
* School records
* Rotary presentations
* Certificates
* Travel itineraries
* Training documents
* Videos
* Audio recordings
* Classroom materials
* Personal journals
* Emails
* WhatsApp histories where permission is granted

## Content Status Categories

Every content item should have a status:

* Draft
* Submitted
* Under review
* Needs more information
* Needs translation
* Needs permission
* Approved
* Published
* Archived
* Withdrawn

---

# 18. Bilingual Content Strategy

English and Spanish must be treated as equally important.

## Requirements

* Full interface translation
* Full content translation where practical
* Correct accents and punctuation
* Professional Spanish review
* Regionally appropriate language
* Clear identification of original language
* Human review of AI-assisted translations
* Separate metadata for each language
* Language-specific search
* Language-specific URLs where practical
* Correct HTML language attributes

## Translation Status

Each translated item should record:

* Original language
* Translation language
* Translation source
* Human translator
* AI-assisted status
* Review status
* Approval date
* Last updated date

## Translation Principle

AI may assist with first drafts, but official historical content should be reviewed by a fluent human editor before publication.

---

# 19. User Contribution Model

Users should be able to contribute at different levels.

**Resolved (2026-07-19):** Quick Contribution below is approved to build. It extends, rather than replaces, what feature `0003-mock-registration-login` already shipped (account-only contribution via registration, claim, and memories). It needs its own feature spec - not yet scheduled - covering at minimum how a quick submission enters the same review workflow as an account-based one, and whether/how a quick contributor can later claim it from a full account.

## Quick Contribution

No full community profile required.

Fields:

* Name
* Email
* Country
* Connection to RITE
* Contribution type
* Description
* File upload
* Permission and consent
* Preferred attribution
* Submit

## Community Account

Users may:

* Create a profile
* Claim participation
* Add exchange years
* Identify roles
* Submit stories
* Upload media
* Edit drafts
* Respond to editorial questions
* Set privacy preferences
* Request corrections
* Withdraw content where applicable

## Contribution Principle

No user-submitted content should become public automatically.

---

# 20. Editorial and Moderation Workflow

**Resolved (2026-07-19):** the six-role model in this section is now the ratified target, replacing the prior four-role model (Public visitor / Registered member / Editor / Administrator). `privacy-and-governance.md` has been updated to match.

Recommended workflow:

1. Contributor creates or submits content.
2. System validates required information.
3. Editor reviews for relevance and safety.
4. Dates, names, and locations are verified where possible.
5. Consent and usage rights are confirmed.
6. Translation is prepared if required.
7. Human reviewer approves translation.
8. Content is approved for publication.
9. Content is published.
10. Contributor is notified.
11. Corrections and updates remain traceable.

## Editorial Roles

### Contributor

Creates and edits their own drafts.

### Reviewer

Checks completeness, relevance, and safety.

### Translator

Creates or reviews translated content.

### Historian or Archivist

Verifies dates, people, and program history.

### Publisher

Approves final public release.

### Administrator

Manages users, access, configuration, and policy.

`privacy-and-governance.md` now carries this same six-role model as the ratified access/review model - the two should stay in sync going forward.

---

# 21. Privacy, Consent, and Rights

The platform must take privacy seriously.

## Key Requirements

* Obtain permission before publishing personal stories.
* Obtain permission for photographs.
* Distinguish image permission from identification permission.
* Treat minors' information with special care.
* Do not publish student names without explicit authorization.
* Avoid exposing private contact details.
* Allow contributors to control attribution.
* Record the source and scope of permission.
* Support removal or correction requests.
* Record copyright ownership where known.
* Clearly identify public-domain or rights-free assets.
* Preserve original files separately from public versions.

## Attribution Options

Contributors may choose:

* Full name
* First name only
* Role and country only
* Anonymous
* Archive only, not public
* Story public, photographs private
* Photographs public, name withheld

---

# 22. Accessibility Requirements

The website should target WCAG 2.2 AA conformance.

Requirements include:

* Keyboard-accessible navigation
* Visible focus states
* Sufficient contrast
* Semantic headings
* Descriptive links
* Alternative text
* Video captions
* Audio transcripts
* Form labels
* Error summaries
* Language attributes
* Responsive text
* No required horizontal scrolling
* No information conveyed only by color
* Reduced-motion support
* Accessible authentication flows
* Accessible document downloads

Accessibility should be part of design, development, content creation, and quality assurance.

---

# 23. Technical Direction

## Front End

Recommended:

* React
* TypeScript
* Responsive component architecture
* Accessible design system
* Internationalization framework
* Static rendering or server-side rendering where appropriate for SEO
* Progressive enhancement
* Strong image optimization
* Structured metadata

## API

Recommended:

* ASP.NET Core Web API
* OpenAPI documentation
* Clear domain boundaries
* Role-based authorization
* Validation
* Audit logging
* Moderation workflow
* Translation workflow
* Media metadata management

## Data

Recommended initial approach:

* Entity Framework Core
* SQLite for early production or controlled initial deployment
* Migration path to Azure SQL or PostgreSQL if usage grows
* Azure Blob Storage or equivalent for media
* Database stores media metadata, not raw media files

## Authentication

Use a trusted external identity provider.

Requirements:

* Email-based registration
* Support for international participants
* Avoid dependence on organizational Microsoft accounts
* Passwordless or social login where practical
* Multi-factor authentication for administrators
* Account recovery
* Consent and privacy controls

## Hosting

Potential Azure architecture:

* Azure Static Web Apps or Azure App Service for front end
* Azure App Service or Azure Container Apps for API
* Azure Blob Storage for media
* Azure Key Vault for secrets
* Application Insights for monitoring
* Azure Front Door or CDN if needed
* Automated deployment through GitHub Actions

This section is a creative-brief-level restatement of the technical direction; `architecture.md` is the authoritative, more detailed source for API, frontend, storage, hosting, and authentication decisions.

---

# 24. Recommended Domain Model

Core entities:

* UserAccount
* Person
* ParticipantProfile
* Participation
* Exchange
* Country
* Location
* School
* RotaryClub
* PartnerOrganization
* Story
* StoryTranslation
* MediaItem
* MediaTranslation
* ConsentRecord
* RightsRecord
* Contribution
* Review
* EditorialComment
* TimelineEvent
* Resource
* ResourceTranslation
* NewsUpdate
* Tag
* Relationship
* AuditEvent

Important separation:

* A user account is not the same as a person.
* A person is not automatically a public profile.
* A participation claim is not automatically approved.
* A submitted story is not automatically published.
* A media upload is not automatically public.

The `Tag` entity already covers the shipped `audiences` tag (the closed `alumni` / `active` / `recruiting` set on `Story`, `Resource`, and alumni profiles from feature `0003-three-audience-experience`) - carry that concept forward explicitly when this model reaches production rather than reinventing it, per the IA resolution in §14.

---

# 25. Search and Discovery

Users should be able to explore content by:

* Country
* City or region
* Year
* Participant
* Role
* School
* Rotary club
* Exchange type
* Story category
* Language
* Tag
* Historical period
* Program direction

Search should support both English and Spanish terminology.

---

# 26. SEO and Public Discoverability

The site should be designed so people searching for RITE can find authoritative information.

Requirements:

* Clear page titles
* Meta descriptions
* Structured data
* Open Graph images
* Social sharing previews
* Canonical URLs
* XML sitemap
* Accessible semantic HTML
* Fast page load
* Human-readable URLs
* Separate language URLs
* Indexable story pages
* Descriptive image metadata

Potential search topics:

* Rotary teacher exchange
* RITE teacher exchange
* Wichita teacher exchange
* Panama teacher exchange
* Argentina teacher exchange
* Rotary international education programs
* Rotary teacher cultural exchange
* West Wichita Rotary international service

---

# 27. Performance Requirements

The site should meet strong performance expectations.

Targets:

* Core Web Vitals in the recommended range
* Hero content visible quickly
* Optimized images
* Responsive image formats
* Lazy loading below the fold
* Minimal JavaScript for public pages
* CDN delivery
* Cached public content
* Compressed assets
* Mobile-first testing
* Usable on slower international connections

The platform must remain useful for participants with limited bandwidth.

---

# 28. Analytics and Measurement

Analytics should be privacy-conscious and focused on product value.

Track:

* Homepage engagement
* Explanation-section completion
* Story views
* Language usage
* Search terms
* Contribution starts
* Contribution completions
* Registration starts
* Registration completions
* Profile claims
* Artifact uploads
* Resource downloads
* Country-level traffic
* Replication toolkit interest
* Return visits
* Editorial turnaround time

Avoid invasive tracking.

Do not collect more personal information than needed.

---

# 29. Governance

The website requires a clear ownership model.

## Product Owner

Responsible for:

* Vision
* Priorities
* Stakeholder alignment
* Release decisions
* Product backlog

## Editorial Board

Recommended representatives:

* West Wichita Rotary
* Panama program leadership
* Argentina program leadership
* Teacher participants
* Host families
* School-system representatives
* Spanish-language reviewers

## Technical Administrator

Responsible for:

* Hosting
* Deployment
* Security
* Monitoring
* Backups
* Account administration

## Archive Steward

Responsible for:

* Historical accuracy
* Provenance
* Cataloging
* Permissions
* Preservation practices

## Governance Principle

The site should not depend indefinitely on one individual.

Documentation, access, credentials, editorial processes, and ownership must be transferable.

---

# 30. Content Governance Standards

Every published item should answer:

* Who contributed it?
* When was it created?
* What event or year does it represent?
* Who appears in it?
* How was that information verified?
* Who owns it?
* What permission was granted?
* In what languages is it available?
* Who reviewed it?
* When was it last updated?

Historical uncertainty should be stated honestly.

Use labels such as:

* Date confirmed
* Approximate date
* Identity unconfirmed
* Contributor recollection
* Archival source
* Translation reviewed
* Additional information requested

---

# 31. MVP Scope

The initial production release should focus on education, storytelling, and contribution.

## MVP Features

* Bilingual public site
* Hero and program explanation
* Teach, Learn, Connect framework
* Three-country overview
* Timeline
* Founder introduction
* Story archive
* Participant profiles
* Partner pages
* Quick contribution form
* User registration
* Profile claim
* Story submission
* Photograph and document upload
* Editorial moderation
* Consent tracking
* Translation workflow
* Search and filtering
* Basic news and updates

## Explicitly Deferred

The first release should not attempt to become the complete operational system for:

* Travel booking
* Full trip scheduling
* Host matching
* Financial management
* Teacher selection workflow
* School district approval workflows
* Supply inventory
* Visa management
* Private messaging
* Complex social networking

These may be evaluated later based on demonstrated need.

---

# 32. Future Roadmap

## Phase 2

* Video interviews
* Automated transcription
* Transcript review
* Interactive map
* Where-are-they-now updates
* Participant notifications
* Editorial collaboration
* Advanced archive search
* School and club dashboards

## Phase 3

* Replication toolkit
* Application workflows
* Host-family onboarding
* Exchange calendars
* Private participant directory
* Resource libraries by country
* Classroom project sharing
* Impact reporting
* Program metrics

## Phase 4

* Multi-club support
* Multi-program architecture
* District-level management
* Rotary-wide replication model
* Research and educational partnership support

This phasing is the creative-brief view of the roadmap; `product.md` carries the current ratified Phase 1-3 MVP roadmap and should be reconciled with this phase list as planning matures.

---

# 33. Key Risks

## Incomplete History

Mitigation:

* Clearly label uncertain information.
* Invite corrections.
* Capture oral histories early.
* Preserve original source material.

## Overreliance on a Small Leadership Group

Mitigation:

* Document responsibilities.
* Build editorial and governance teams.
* Distribute access.
* Create succession processes.

## Privacy and Consent

Mitigation:

* Use explicit consent records.
* Moderate all public content.
* Protect minors.
* Support withdrawal and correction.

## Translation Quality

Mitigation:

* Use fluent human review.
* Track translation status.
* Avoid publishing unreviewed machine translation as official history.

## Scope Growth

Mitigation:

* Keep the MVP focused on explaining, preserving, and contributing.
* Defer operational exchange management.

## Low Contribution Rates

Mitigation:

* Offer quick contribution.
* Conduct guided interviews.
* Prepopulate profiles carefully.
* Use WhatsApp and email outreach.
* Feature contributors visibly.

## Technology Becoming a Barrier

Mitigation:

* Keep workflows simple.
* Support mobile devices.
* Minimize required fields.
* Provide assisted submission options.

---

# 34. Creative Evaluation Criteria

All major design concepts should be evaluated against the following questions.

## Clarity

Can a first-time visitor explain RITE after viewing the first screen?

## Humanity

Does the design center real people and relationships?

## International Balance

Do Wichita, Panama, and Argentina feel like equal partners?

## Authenticity

Does the experience feel credible to participants?

## Emotional Resonance

Does the site make visitors want to learn more?

## Accessibility

Can people of different ages, abilities, languages, and devices use it?

## Maintainability

Can content grow without redesigning the entire site?

## Trust

Are privacy, consent, authorship, and historical accuracy visible?

## Action

Does every audience understand what they can do next?

---

# 35. Recommended Calls to Action

Primary public actions:

* Discover RITE
* Explore the Story
* Meet the RITE Community
* Read Teacher Stories
* Share Your Story
* Contribute Photos or Documents
* Become a Host
* Support the Program
* Bring RITE to Your Club

Authenticated actions:

* Claim My Profile
* Add My RITE Experience
* Share a Memory
* Upload Photos
* Submit an Update
* Review My Permissions

---

# 36. Sample Home Page Copy

## Headline

**Teachers Crossing Borders**

## Supporting Copy

RITE connects educators in Wichita, Panama, and Argentina through professional learning, cultural exchange, and lasting friendship.

## Program Explanation

For more than 30 years, teachers have traveled across borders to observe classrooms, exchange ideas, experience new cultures, and build relationships that continue long after the journey home.

## Teach

Share strategies, lessons, and classroom experience.

## Learn

Discover new approaches, communities, and perspectives.

## Connect

Build relationships among teachers, schools, families, students, and Rotary clubs.

## Closing Statement

RITE is more than a trip. It is a community of educators carrying new ideas and lasting relationships back to their classrooms.

---

# 37. Final Creative Direction

The RITE website should be designed as a living international documentary rather than a traditional organizational site.

The experience should begin with a simple truth:

> Teachers learn best when they learn from one another.

It should then demonstrate how RITE makes that possible through travel, teaching, hospitality, culture, service, and relationships.

The site should honor the people who built the program while remaining focused on the future.

It should preserve the past without feeling nostalgic.

It should promote the program without feeling promotional.

It should use technology without allowing the technology to become the story.

The final result should make a visitor think:

> I understand what RITE is.
> I understand why it matters.
> I want to hear these stories.
> I want to help preserve this.
> I want to be part of what comes next.
