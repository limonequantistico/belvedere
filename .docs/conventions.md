# Belvedere — Project Conventions

Rules and practices we follow during development. This is a living document — add new rules as they emerge.

---

## 1. Phase Documentation

Every phase or major feature gets its own folder under `.docs/phases/`. This creates a traceable history of what was done, how, and why.

```
.docs/phases/
├── phase-0-foundation/
│   ├── implementation-plan.md   # What we planned to do
│   ├── decisions.md             # Key decisions & rationale
│   └── walkthrough.md           # What was actually done + validation results
├── phase-1-backend/
│   └── ...
└── ...
```

**Rules:**
- Create the phase folder **before** starting work.
- The `implementation-plan.md` is written first, reviewed, then executed.
- `decisions.md` captures any non-obvious choices made during implementation (e.g., "Chose Nunito over Quicksand because...").
- `walkthrough.md` is written after completion as a summary of what changed and what was tested.

---

## 2. Reference Docs

| File | Purpose | When to update |
|------|---------|----------------|
| `seed-document.md` | Vision, personas, core features | When scope changes |
| `tech-stack.md` | Technical choices & justifications | When adding/swapping a tool |
| `design-system.md` | Visual tokens, components, patterns | When building new UI components |
| `tasks.md` | Living to-do checklist | Continuously |
| `conventions.md` | This file — project rules | When a new rule emerges |
