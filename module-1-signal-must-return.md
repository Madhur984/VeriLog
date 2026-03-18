# Module 1: The Signal Must Return
## Product Requirement Document (PRD)

## Target Audience
Beginner learners interacting with electronics concepts for the first time. The goal is active discovery, not passive reading.

## Problem Statement
Traditional education relies on lecturing definitions (e.g., "A circuit must be closed"). VeriLog requires learners to experience, observe, and discover the rule before naming it, focusing on tactile interactions.

## Story Arc & User Stories
### Act 1 — The Hook ("The Invisible Messenger")
- **As a learner**, I want to tap a switch and see the signal stop at a broken path, so that I naturally ask "why?".
- **As a learner**, I want to drag wires together to complete the loop, so that I experience the satisfaction of a working circuit.

### Act 2 — Discovery Lab
- **As a learner**, I want to freely explore a workbench with a battery, bulb, and wire, so that I can figure out how to make a complete loop.
- **As a learner**, I want VoltMonkey to provide observational hints when my circuit fails (open/short), so that failure feels like debugging.

### Act 3 — Theory Reveal
- **As a learner**, I want the system to formally name "Open Circuit", "Short Circuit", and "Closed Circuit" ONLY AFTER I have discovered them, so that the terminology has contextual meaning.

### Act 4 — Skill Practice
- **As a learner**, I want to rapidly classify and predict circuit outcomes (lamp on/off), so that I reinforce my new mental model.

### Act 5 — Boss Challenge
- **As a learner**, I want to debug 3 circuits (fix open, remove short) and diagnose a real "flashlight" system, so that I can prove mastery and earn the "Loop Master" badge.

## Core Design Principles & Acceptance Criteria
- [ ] **No Passive Reading**: Any text reading takes <15 seconds.
- [ ] **Mandatory Micro-interactions**: Every screen must have drag, tap, or connect actions.
- [ ] **Physical Feedback**: Interactions trigger haptic, audio (snap/hum/spark), and visual particle feedback.
- [ ] **Color Mapping**: Blue = normal current, Red = short circuit, Grey = open circuit.
- [ ] **VoltMonkey Persona**: Observational, never lectures. Uses phrases like "Interesting...", "Notice what happened there?"

## Out of Scope
- Complex math, Ohm's law, or series/parallel calculation metrics (saved for future modules).
