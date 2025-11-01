# Development Log

A chronological record of learning sessions and progress through the Three.js curriculum.

---

## Session 01: Essential Foundation
**Date:** 2025-11-01
**Duration:** ~30 minutes
**Status:** ✅ Completed

### What Was Built
- Initialized Vite project with TypeScript (`vanilla-ts` template)
- Created basic Three.js scene with:
  - Scene with dark gray background
  - PerspectiveCamera positioned at z=5
  - Rotating cube (cyan-green color)
  - AmbientLight + DirectionalLight
  - WebGLRenderer with antialiasing
  - Window resize handling

### Key Learnings
- **TypeScript was definitely worth it** - IntelliSense provided confidence and quick access to API details
- **Light color mixing** - Final object color is influenced by both material color and light colors/intensities
- **Camera frustum behavior** - Understanding near/far clipping planes and their performance implications
- **Field of view effects** - How FOV changes the "lens" perspective (wide angle vs telephoto feel)

### Experiments Conducted
- Tweaked light colors and intensities to observe effects on cube appearance
- Moved camera along Z-axis to understand depth
- Adjusted camera frustum points (near/far clipping)
- Modified field of view values
- Added a sphere geometry to the scene

### Technical Notes
- Vite's hot reload worked seamlessly with TypeScript
- Type safety caught potential mistakes before runtime
- Three.js type definitions provided excellent autocomplete

### Reflections
Taking time to let concepts settle before moving to next session. Goal is deep understanding rather than rushing through material.

---

## Next Session Preview

**Session 02: Geometry & Materials**
- Explore different geometry types (spheres, cylinders, tori, planes)
- Deep dive into material properties (roughness, metalness, wireframe)
- Learn to compose multiple geometries into compound objects
- Build foundation for procedurally generated modular objects

**Long-term Vision:** Understanding how to create entity systems where properties (like spaceship hulls) determine rendering and available module attachment points.

---

## Repository Milestones

- **2025-11-01**: Repository initialized, CLAUDE.md created, Session 01 completed
