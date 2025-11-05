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

## Session 03: Lighting
**Date:** 2025-11-02
**Duration:** ~1 hour
**Status:** ✅ Completed

### What Was Built
- Lighting laboratory scene featuring multiple light types:
  - PointLight (omnidirectional) with shadow configuration positioned above scene
  - SpotLight (cone-shaped) with orange tint and visible shadow camera frustum
  - HemisphereLight (sky-to-ground gradient) for outdoor ambient feel
  - Very dim AmbientLight for base illumination
- Shadow system implementation:
  - Enabled `renderer.shadowMap` for shadow rendering
  - Configured shadow-casting objects (box, sphere)
  - Shadow-receiving ground plane
  - Shadow map resolution settings (1024×1024)
- Light helpers for visualization:
  - PointLightHelper showing light position
  - SpotLightHelper displaying cone shape
  - CameraHelper revealing shadow camera frustum
  - HemisphereLightHelper showing sky/ground colors

### Key Learnings
- **Lighting impact on scenes** - First substantial experience working with lighting; gained appreciation for how different light types and configurations dramatically affect scene atmosphere and mood
- **Shadow system mechanics** - Understanding that shadows require shadow cameras, and objects outside the shadow camera frustum won't cast shadows
- **Light type characteristics** - Each light type serves different purposes (PointLight for lamps/torches, SpotLight for focused beams, HemisphereLight for outdoor ambient)
- **Performance considerations** - Shadows are expensive; typical games limit to 1-3 shadow-casting lights

### Experiments Conducted
- Explored shadow quality settings and resolution trade-offs
- Debugged shadow camera frustums using CameraHelper
- Experimented with PointLight distance and decay parameters
- Tested different lighting scenarios (dramatic, outdoor, interior moods)
- Observed how light positioning and color create atmosphere

### Technical Notes
- Encountered initial bug: ground plane rotation was `-Math.PI` instead of `-Math.PI / 2`, causing plane to be flipped upside down (back face culling made it invisible)
- Fixed helper update calls in animation loop for SpotLight and shadow camera
- Session completed within 1-hour timeframe with multiple experiments
- TypeScript autocomplete helpful for discovering light properties and parameters

### Reflections
Lighting is a skill that will require considerable time to build intuition. The basic mechanics are now understood, providing a foundation to carry forward. Like other concepts in the curriculum, clarity will cement through continued experimentation and practice over time.

---

## Session 04: Transforms and Object3D Hierarchy
**Date:** 2025-11-05
**Duration:** ~2 hours
**Status:** ✅ Completed

### What Was Built
- Compound spaceship built from geometric primitives:
  - Metallic main body (BoxGeometry)
  - Glowing cockpit window (SphereGeometry with emissive material)
  - Wings positioned symmetrically (BoxGeometry, left and right)
  - Engine nozzles at rear (CylinderGeometry, rotated 90°)
  - Engine glow effects (MeshBasicMaterial spheres)
  - All organized in THREE.Group hierarchy
- Solar system demonstration with nested hierarchies:
  - Sun at center (MeshBasicMaterial - self-illuminated)
  - Earth orbit group (child of solarSystem)
  - Moon orbit group (child of earth)
  - Three levels of nested orbital motion
- Refactored spaceship into modular factory functions for cleaner code organization
- Created comprehensive math and physics reference document (`references/math-and-physics.md`)

### Key Learnings
- **Hierarchical transforms cascade** - Parent transforms automatically affect all children while maintaining relative offsets
- **Local vs world space** - Child positions are relative to parent, not scene origin; `getWorldPosition()` converts between coordinate systems
- **Parent-child relationships** - `add()` creates hierarchies; transforming parent moves entire subtree
- **Sine/cosine for animation** - Perfect for smooth oscillating motion (wings flapping, engine pulsing); both are waves shifted by 90°
- **Phase relationships** - `cos(x) = sin(x + π/2)`; cosine starts at peak (1) while sine starts at middle (0)
- **Tangent for angles, not animation** - `tan()` is unbounded with discontinuities; use for slope calculations and `atan2()` for direction-to-angle conversions
- **Entity-component architecture intuition** - Starting to envision how object hierarchies map to formal game entity systems and state management patterns

### Experiments Conducted
- Implemented wing flapping with sine wave oscillation (`Math.sin(time * 2) * 0.33`)
- Created pulsing engine glow with scale animation
- Built three-level hierarchy (solar system → sun/earth → moon) with independent rotation speeds
- Tested opposite phase animations (left wing vs right wing)
- Debugged hierarchy structure to fix earth orbital motion (moved earth from sun child to solarSystem child)
- Explored math concepts: trigonometry (SOH CAH TOA), 2D circular motion, 3D spherical coordinates
- Applied intuition-driven experimentation by deviating from README to test understanding

### Technical Notes
- Used `getObjectByName()` for clean object access instead of array indices
- Named all objects for maintainable code (`leftWing`, `rightWing`, `leftGlow`, etc.)
- Discovered hierarchy structure affects what rotates: rotating sun makes earth orbit, rotating earth makes moon orbit
- Confirmed understanding: `Math.sin(time * 2) * -1` ≠ `Math.cos(time * 2)` (90° phase difference, not inverse)
- Session included extensive math sidebar discussions that cemented trigonometry intuition
- Created 24KB reference document covering trig, vectors, interpolation, physics, rotations, and practical examples

### Reflections
Read through remaining experiments in README and found concepts feel intuitive and well-understood. While direct implementation would be educational, the mental models are solidified enough to revisit later when refreshing specific implementation details. Already envisioning how hierarchical transforms will integrate with entity-component systems and state-driven behaviors - the foundation for Phase 4 (Game Architecture Patterns) is starting to form intuitively.

The math reference document will serve as a valuable quick-reference for future sessions, consolidating trigonometry, vector operations, and physics formulas with Three.js-specific helpers and practical code examples.

---

## Next Session Preview

**Session 05: The Animation Loop** (Phase 1.5)
- Implement `requestAnimationFrame` loop
- Calculate delta time between frames
- Understand frame-independent movement
- Monitor frame rate and performance
- Exercise: Rotate objects continuously at consistent speed regardless of frame rate

---

## Repository Milestones

- **2025-11-01**: Repository initialized, CLAUDE.md created, Session 01 completed, Session 02 completed, PROJECT.md Phase 1 reordered
- **2025-11-02**: Session 03 (Lighting) completed
- **2025-11-05**: Session 04 (Transforms and Hierarchy) completed, `references/` directory created with math-and-physics.md
