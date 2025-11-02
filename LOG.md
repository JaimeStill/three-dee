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

## Session 02: Geometry and Materials
**Date:** 2025-11-01
**Duration:** ~1 hour
**Status:** ✅ Completed

### What Was Built
- Geometry showcase scene with 5 different primitive types:
  - SphereGeometry with shiny metallic material
  - BoxGeometry with matte plastic material
  - CylinderGeometry with semi-glossy finish
  - TorusKnotGeometry with emissive glow effect
  - IcosahedronGeometry displayed as wireframe
- Implemented helper functions for creating geometries with varied materials
- Positioned multiple objects in 3D space along X-axis
- Animated all objects with rotation

### Key Learnings
- **Three.js API mapping** - Mapped prior 3D experience to Three.js-specific implementations
- **Material properties** - Hands-on understanding of how roughness and metalness interact with lighting
- **Geometry parameters** - Segment counts, radii, and how they affect visual appearance
- **Practical applications** - Thinking ahead to game mechanics (e.g., emissive intensity for overheating weapons)

### Experiments Conducted
- Explored material property combinations (roughness, metalness, emissive)
- Tried different geometry variations and segment counts
- Tested emissive glow effects for state indication concepts
- Visualized geometry structure with wireframe mode
- **Favorite discovery:** Cylinder-to-cone transformation by adjusting top/bottom radii

### Technical Notes
- All experiments completed within the 1-hour timeframe
- Quick iteration through experiment sections
- TypeScript caught the `camera.setSize` vs `renderer.setSize` typo

### Reflections
Building foundation for more complex applications - particularly interested in how these concepts will scale to composed objects and dynamic state visualization (e.g., glowing emissive materials indicating weapon heat on spaceships).

---

## Next Session Preview

**Session 03: Lighting** (following reordered Phase 1 curriculum)
- Explore additional light types (PointLight, SpotLight, HemisphereLight)
- Learn light positioning and scene mood
- Understand shadows and shadow configuration
- Light helpers for debugging

**OR**

**Session 03: Transforms and Object3D Hierarchy** (alternative next step)
- Position, rotation, scale properties
- Local vs world space coordinates
- Parent-child relationships and scene graphs
- Build compound objects from primitives (spaceship assembly!)

---

## Repository Milestones

- **2025-11-01**: Repository initialized, CLAUDE.md created, Session 01 completed, Session 02 completed, PROJECT.md Phase 1 reordered
