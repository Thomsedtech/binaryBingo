# hex-next-clickfix
A sturdier ES Modules build that hardens Start/Reset click handling.

## Changes vs. previous scaffold
- Buttons are explicit `type="button"`.
- Start/Reset bind `click` **and** `pointerdown`, with delegated fallback on the toolbar.
- Toolbar uses `z-index:1000` + `isolation:isolate`; game surface adds `padding-bottom:96px` to prevent overlap.
- Everything stays build-less and Pages-friendly.
