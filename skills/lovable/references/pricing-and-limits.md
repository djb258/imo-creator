# Lovable Pricing & Limits Reference

## Plan Details

### Free Plan
- 5 credits/day, 30/month cap
- 100 GB hosting bandwidth
- Public projects only
- No Code Mode
- No custom domains
- Enough to explore the tool, not enough to build a real project

### Starter ($25/month)
- 100 monthly credits + 5 daily
- Code Mode access (edit generated code directly)
- Unlimited private projects
- Custom domain support
- Monthly credits roll over, daily don't

### Launch ($50/month)
- 250 monthly credits + 5 daily (2.5x Starter)
- Everything in Starter

### Scale ($100/month)
- 500 monthly credits + 5 daily (5x Starter)
- Everything in Launch

### Enterprise (custom pricing)
- Custom message limits
- Centralized billing
- SSO integration
- Dedicated support + product specialist
- Custom integrations
- Architecture and debugging assistance

## Credit Economics

### What Costs Credits
- Generating new pages or features: HIGH credit cost
- Refactoring existing code: HIGH credit cost
- Simple edits (color, text, spacing): LOW credit cost
- Chat Mode (discussing, not generating): NO credit cost
- "Fix" messages (bug repair): NO credit cost — exploit this

### The Debugging Loop Tax
The most expensive pattern:
1. Ask Lovable to add a feature → costs credits
2. Feature has a bug → ask to fix → free (fix message)
3. Fix introduces new bug → ask to fix → free
4. Fix breaks something else → ask to fix → free
5. Loop continues until AI gives up or you escalate
6. Escalation = new prompt describing the problem → costs credits
7. Repeat from step 2

This loop can burn 10-20 credits on what should be a simple feature. Complex features
can drain 50+ credits across multiple debugging cycles.

### Credit Budget Reality

| Project Type | Estimated Credits | Plan Needed |
|-------------|-------------------|-------------|
| Landing page | 10-20 | Free/Starter |
| Simple CRUD app | 30-60 | Starter |
| Moderate dashboard | 60-120 | Launch |
| Complex MVP | 150-300+ | Scale |
| Anything with auth + payments + complex logic | 300+ | Scale (might not be enough) |

## Tech Stack Generated

Lovable generates:
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Backend**: Depends on choice (Supabase or Lovable Cloud)
- **Database**: PostgreSQL (via Supabase) or Lovable Cloud built-in
- **Auth**: Supabase Auth or Lovable Cloud Auth
- **Deployment**: Lovable hosting, Netlify, or custom

## Integration Details

### GitHub (primary integration)
- Two-way sync: changes in Lovable push to repo, changes in repo sync back
- You always own the code
- Can pull down repo and continue in any IDE
- **Cannot import existing repos** — only exports to fresh repos or syncs with Lovable-created ones

### Supabase
- Database (PostgreSQL)
- Authentication (email, social, magic link)
- Storage (file uploads)
- Edge Functions
- Requires separate Supabase account and project
- Connection configured within Lovable

### Lovable Cloud (newer alternative to Supabase)
- Built-in database, storage, auth
- Pre-integrated AI models (LLMs for chat, analysis, image gen)
- No separate account needed
- Less customizable than Supabase
- Free tier available, pay-as-you-scale

### Other Integrations
- Stripe: payment processing
- Clerk: authentication (alternative to Supabase Auth)
- OpenAI: AI features
- Netlify: deployment alternative

## Known Platform Behaviors

### What the AI Does Well
- Initial app scaffolding (zero to working UI in minutes)
- Clean, modern-looking component generation
- Basic CRUD operations
- Form handling and validation
- Responsive layouts
- Route setup and navigation

### What the AI Does Poorly
- Complex state management across many components
- Backend business logic with multiple edge cases
- Database schema for complex relationships
- Error handling for production scenarios
- Performance optimization
- Consistent code style across large projects
- Not re-introducing previously fixed bugs

### Export Quality
When you export to GitHub, you get:
- A standard React + Vite project
- Tailwind CSS for styling
- Reasonably readable code (not obfuscated)
- But: may not follow best practices for the specific framework
- But: may have redundant code or unusual patterns
- But: debugging can be hard if you don't know the codebase's "AI logic"

A developer picking up exported Lovable code should expect to spend time
understanding the generated architecture before making changes. It's not
spaghetti, but it's not hand-crafted either.
