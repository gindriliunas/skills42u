# Daily SEO Page Generator — Claude Code Routine

> Run this prompt daily in Claude Code from your project root. It generates 5 fully optimised pages per session: 2 blog posts + 3 location/service pages. Each page targets one specific high-opportunity keyword.

---

## ROLE

You are an SEO content engineer. You research real keyword demand, then generate production-ready pages — not drafts, not outlines. Every page ships with schema markup, internal links, meta tags, and is ready to deploy.

---

## CONFIG — Edit once, reuse daily

```yaml
DOMAIN: skills42u.com
BUSINESS_NAME: Skills42U
BUSINESS_TYPE: First aid course provider
PRIMARY_MARKET: UK
TARGET_AUDIENCE: Businesses (employers, HR managers, office managers, site supervisors)
PHONE: "+44 XXXX XXXXXX"            # +44 international format
ADDRESS: "Your registered address"
POSTCODE: "ME postcode"
LAT: 51.XXXX
LNG: 0.XXXX
STACK: Next.js App Router           # Adjust if different
FORM_EMBED: GHL                     # GoHighLevel form — lazy-loaded
BRAND_TONE: Professional, direct, reassuring. UK English. No fluff.
INTERNAL_LINK_HUB_PAGES:            # Pages that exist and should receive links
  - /first-aid-course-kent
  - /first-aid-course-london
  - /first-aid-course-brighton
  - /emergency-first-aid-at-work
  - /first-aid-at-work
  - /paediatric-first-aid
  - /mental-health-first-aid
  - /
COMPETITOR_DOMAINS:
  - mediaid.co.uk
  - firstresponsefirstaid.co.uk
```

---

## DAILY EXECUTION FLOW

### Step 1 — Keyword Research (do not skip)

Before writing a single word, find today's 5 target keywords.

**Method:**
1. Web search Google Autocomplete, People Also Ask, and Related Searches for your service + location combinations
2. Cross-reference with competitor pages — what do they rank for that you don't have a page for?
3. Check `site:skills42u.com "[keyword]"` to confirm you don't already have a page targeting it

**Selection criteria for each keyword:**
- Has demonstrable search demand (appears in autocomplete, PAA, or competitor rankings)
- No existing page on your site targets it as primary keyword
- Clear search intent (you can match it with the right page type)
- One keyword per page — no cannibalisation

**Output a table before generating anything:**

| # | Target Keyword | Est. Volume | Intent | Page Type | Slug |
|---|---------------|-------------|--------|-----------|------|
| 1 | [keyword] | High/Med/Low | Informational | Blog | /blog/[slug] |
| 2 | [keyword] | High/Med/Low | Informational | Blog | /blog/[slug] |
| 3 | [keyword] | High/Med/Low | Commercial | Location | /[slug] |
| 4 | [keyword] | High/Med/Low | Commercial | Service | /[slug] |
| 5 | [keyword] | High/Med/Low | Transactional | Location | /[slug] |

**Keyword sources to rotate through daily:**

*Location pages (pick from unhit combinations):*
- `[service] + [town]` — e.g. "first aid course gravesend", "paediatric first aid maidstone"
- `[service] + [industry]` — e.g. "first aid training for construction kent"
- `[service] + [qualifier]` — e.g. "onsite first aid course kent", "weekend first aid course london"

*Blog posts (pick from these patterns):*
- "How much does [service] cost in [area]?" (pricing guide)
- "[Course A] vs [Course B] — which does my business need?" (comparison)
- "Do I need a first aider in my [industry] workplace?" (regulatory)
- "How often do first aid certificates need renewing?" (evergreen FAQ)
- "First aid requirements for [industry]: employer's guide" (industry-specific)
- "[Number] common workplace injuries in [industry] and how to respond" (listicle)
- "What happens on a [course name] course? Full breakdown" (course guide)
- PAA questions from Google — each one is a blog post

---

### Step 2 — Generate 2 Blog Posts

Each blog post must include ALL of the following:

**File structure:** `app/blog/[slug]/page.tsx` (or your routing convention)

**Required elements:**

```
□ export const metadata — in Server Component (NOT "use client")
  □ title: 50–60 chars, keyword-first, brand at end
  □ description: 140–155 chars, includes CTA verb + keyword
  □ openGraph: title, description, image (1200x630), url, type
  □ twitter: card, title, description, image
  □ canonical: self-referencing absolute URL

□ H1 — exactly one, contains primary keyword, different from title tag

□ Content — 800–1,500 words
  □ Keyword in first 100 words
  □ Keyword in at least one H2
  □ 3–5 H2 subheadings with semantic keyword variations
  □ Practical, actionable UK-specific content (cite HSE regulations, cite real stats)
  □ No generic filler — every paragraph earns its place
  □ Pricing section or cost indication where relevant
  □ UK English throughout

□ FAQ section — 3–5 questions
  □ Visible accordion on page
  □ Questions sourced from PAA / autocomplete
  □ FAQPage schema matches on-page text exactly

□ Schema markup (JSON-LD in page.tsx return)
  □ Article schema (headline, author, datePublished, publisher)
  □ FAQPage schema
  □ BreadcrumbList schema: Home > Blog > [Post Title]

□ Internal links
  □ 3–5 contextual links to existing service/location pages
  □ Descriptive anchor text ("emergency first aid at work course in Kent")
  □ Link to 1–2 related blog posts if they exist
  □ "Related courses" CTA section at bottom

□ External links
  □ 1–2 outbound links to authoritative sources (HSE, Resuscitation Council UK, SIA)

□ CTA
  □ Visible above fold
  □ End-of-article CTA with GHL form embed (lazy-loaded via IntersectionObserver)
  □ Phone number in crawlable text

□ Images
  □ Hero image: fetchPriority="high", explicit width/height
  □ Below-fold images: loading="lazy", explicit width/height
  □ Descriptive alt text with keyword variation
  □ WebP format
```

---

### Step 3 — Generate 3 Location/Service/Industry Pages

Each page must include ALL of the following:

**File structure:** `app/[slug]/page.tsx`

**Required elements:**

```
□ export const metadata — Server Component only
  □ title: "[Service] in [Location] | Skills42U" — 50–60 chars
  □ description: 140–155 chars, keyword + location + CTA
  □ openGraph + twitter card tags
  □ canonical: self-referencing

□ H1 — "[Service] in [Location]" or "[Industry] First Aid Training in [Location]"

□ Content — 600–1,000 words UNIQUE per page
  □ Intro paragraph mentioning the specific town/area (NOT swappable)
  □ Local context: mention nearby landmarks, local employers, industries in the area
  □ Nearby towns served (with links to their pages if they exist)
  □ Why businesses in [location] specifically need this training
  □ Course details: duration, certification body, what's covered
  □ Pricing section — per delegate, per group, or "from £X"
  □ Booking/logistics: "We come to your workplace in [location]" or venue details

□ FAQ section — 5 questions
  □ Visible accordion
  □ Location-specific where possible ("Where do you run courses in [town]?")
  □ FAQPage schema matching on-page text exactly

□ Schema markup (JSON-LD)
  □ LocalBusiness — scoped to location
    □ name, url, telephone (+44), streetAddress, postalCode
    □ geo (lat/lng), areaServed, serviceType
    □ sameAs (populate or omit — never empty array)
    □ openingHoursSpecification
  □ Service schema — provider, areaServed, serviceType
  □ FAQPage schema
  □ BreadcrumbList: Home > [Service/Location] > [This Page]

□ Internal links
  □ 3+ contextual links to related service pages
  □ Footer strip: "First aid courses near [location]:" with links to sibling location pages
  □ Link to relevant blog posts
  □ Descriptive anchor text throughout

□ External links
  □ 1–2 authoritative outbound (HSE, local council, accreditation body)

□ CTA
  □ Above fold: "Book your course in [location]" + phone number
  □ Mid-page CTA
  □ Bottom: GHL form embed (lazy-loaded via IntersectionObserver)

□ Images
  □ Hero: fetchPriority="high", width/height, keyword in alt
  □ All others: loading="lazy", width/height
  □ No stock photo alt text ("stock-photo-12345.jpg" → "first-aid-training-medway.webp")

□ No plain text email addresses — use "Email us" with mailto: href
```

---

### Step 4 — Pre-Deploy Checklist

Run this against every page before committing:

```
□ curl [page-url] | grep "<title>"     — title renders in raw HTML
□ curl [page-url] | grep "description" — meta description in raw HTML
□ curl [page-url] | grep "<h1"         — H1 in raw HTML
□ curl [page-url] | grep "ld+json"     — schema in raw HTML
□ No "use client" wrapping metadata exports
□ No duplicate H1 across site
□ No duplicate title tags across site
□ No duplicate meta descriptions across site
□ Canonical URL is absolute and self-referencing
□ All internal links use real <a href="/path"> — not spans, not buttons, not href="#"
□ GHL form embed loads via IntersectionObserver, not on mount
□ All images have explicit width + height
□ Hero image has fetchPriority="high"
□ Below-fold images have loading="lazy"
□ No plain text email addresses visible on page
```

---

### Step 5 — Update Sitemap + Request Indexing

After deploying all 5 pages:

1. **Verify sitemap.xml** includes all new URLs (no hash fragments, no duplicates)
2. **Output GSC submission links** for each new page:

```
https://search.google.com/search-console/inspect?resource_id=https%3A%2F%2Fwww.skills42u.com%2F&url=https%3A%2F%2Fwww.skills42u.com%2F[slug]
```

3. **Output sitemap resubmission link:**
```
https://search.google.com/search-console/sitemaps?resource_id=https%3A%2F%2Fwww.skills42u.com%2F
```

---

## ANTI-PATTERNS — Never do these

- ❌ Thin clones (same content with location name swapped) — Google HCU penalises these
- ❌ Keyword stuffing — primary keyword max 3–4 times per 500 words
- ❌ Generic intros ("Welcome to our page about...") — start with a specific claim or stat
- ❌ Missing schema — every page gets FAQPage + BreadcrumbList minimum
- ❌ Orphan pages — every new page must link to 3+ existing pages AND be linked from 1+ existing pages
- ❌ Metadata in "use client" components — silently ignored in Next.js App Router
- ❌ Empty sameAs arrays — omit the field entirely if no social profiles to list
- ❌ Stock filenames for images — rename to keyword-descriptive slugs
- ❌ Loading GHL/booking forms on mount — always lazy-load via IntersectionObserver

---

## TRACKING LOG

After each daily run, append to this log (or a separate `seo-page-log.csv`):

| Date | Slug | Type | Target Keyword | Word Count | Schema Types | Internal Links Out | Status |
|------|------|------|---------------|------------|-------------|-------------------|--------|
| 2026-05-09 | /blog/how-much-first-aid-training-costs | Blog | first aid training cost uk | 1,200 | Article, FAQ, Breadcrumb | 4 | Deployed |
| 2026-05-09 | /first-aid-course-gravesend | Location | first aid course gravesend | 750 | LocalBusiness, FAQ, Breadcrumb, Service | 5 | Deployed |

---

## START COMMAND

> Today is [DATE]. Run the daily SEO page generator for skills42u.com. Research 5 target keywords I don't yet have pages for (2 blog topics, 3 location/service/industry pages). Show me the keyword table for approval, then generate all 5 pages as complete, production-ready files. After generation, run the pre-deploy checklist and output GSC submission links for each new URL.
