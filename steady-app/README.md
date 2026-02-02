# Steady - Parenting Decision Support

A calm, consistent third adult in your household. Steady provides in-the-moment parenting guidance tailored to your child's temperament and your chosen approach.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Child Profile**: Store your child's name, age, and temperament (reactivity, persistence, sensitivity)
- **Parenting Approaches**: Choose between "Connect → Redirect" or "Emotion Coaching + Boundaries"
- **In-the-moment Guidance**: Get specific, actionable steps for common challenging situations
- **Context-aware**: Toggle factors like "tired", "hungry", "overstimulated", or "public place"
- **History Tracking**: Log outcomes and review what worked
- **Paywall Demo**: Free trial with 3 uses, then subscription required

## Project Structure

```
steady-app/
├── app/
│   ├── page.tsx          # Landing page (/)
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles + Tailwind
│   ├── app/
│   │   └── page.tsx      # Main prototype (/app)
│   ├── pricing/
│   │   └── page.tsx      # Pricing page
│   └── checkout/
│       └── page.tsx      # Fake checkout flow
├── components/
│   ├── Header.tsx        # Navigation header
│   ├── Footer.tsx        # Footer with disclaimer
│   ├── Logo.tsx          # Steady logo/icon
│   ├── Button.tsx        # Reusable button
│   ├── Card.tsx          # Card container
│   ├── Slider.tsx        # Temperament slider
│   ├── ChildProfileCard.tsx
│   ├── ApproachSelector.tsx
│   ├── HelpMeNow.tsx     # Main decision support UI
│   ├── HistoryList.tsx   # Past sessions
│   └── PaywallModal.tsx  # Subscription prompt
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── storage.ts        # localStorage helpers
│   └── rulesEngine.ts    # Decision logic
└── tailwind.config.ts    # Custom color palette
```

## How the Rules Engine Works

The rules engine (`lib/rulesEngine.ts`) generates guidance based on:

### Inputs
1. **Situation**: tantrum, refusing instructions, bedtime battle, sibling conflict, or transition trouble
2. **Approach**: "Connect → Redirect" or "Emotion Coaching + Boundaries"
3. **Temperament**: Three 0-10 sliders (reactivity, persistence, sensitivity)
4. **Context**: Optional toggles (tired, hungry, overstimulated, public place)

### Process
1. Base guidance is selected for the situation + approach combination
2. Temperament modifiers are applied if sliders exceed thresholds:
   - High reactivity (≥7): "Allow extra time—reactions may be intense"
   - High persistence (≥7): "Stay consistent—they'll test the boundary longer"
   - High sensitivity (≥7): "Lower your voice and reduce stimulation"
3. Context modifiers are added:
   - Tired: "Keep it simple—they have less capacity"
   - Hungry: "Address hunger first if possible"
   - Overstimulated: "Move to a quieter space"
   - Public: "Focus on getting through, not teaching"

### Output
- **Do this now**: 3-4 numbered steps
- **Avoid this**: 2-3 things not to do
- **Why this works**: One sentence explanation

### Configuration
The thresholds and weights can be adjusted in `lib/types.ts`:

```typescript
export const DEFAULT_RULES_CONFIG: RulesEngineConfig = {
  highReactivityThreshold: 7,
  highPersistenceThreshold: 7,
  highSensitivityThreshold: 7,
  temperamentWeight: 0.5, // 0-1 scale
}
```

## Data Persistence

All data is stored in browser localStorage under the key `steady-app-state`:
- Child profile (name, age, temperament, last updated)
- Selected parenting approach
- Event history (up to 50 events)
- Subscription status
- Free trial usage count

No data is sent to any server.

## Parenting Approaches

### Connect → Redirect (Right brain → Left brain)
Based on Dan Siegel's work. The idea is to first connect emotionally with your child (engaging the right brain), then redirect behavior once they feel heard (engaging the left brain). Focuses on co-regulation before problem-solving.

### Emotion Coaching + Boundaries
Based on John Gottman's research. The approach names and validates emotions while maintaining clear, consistent boundaries. Helps children understand their feelings without giving in to inappropriate behavior.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (custom palette)
- **Persistence**: localStorage
- **No external dependencies**: SVG icons, no UI kits

## Design Notes

Inspired by [edufront.co.in](https://www.edufront.co.in) aesthetic:
- Soft gradients
- Rounded cards (2xl border-radius)
- Clean typography (Inter font)
- Generous whitespace
- Professional but warm color palette (teal primary, coral accent)

## Disclaimer

Steady is not medical advice or a substitute for professional care. If you're worried about your child's safety or wellbeing, contact local emergency services or a mental health professional.

## License

Prototype - not for production use.
