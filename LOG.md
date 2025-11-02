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

## Next Session Preview

**Session 04: Transforms and Object3D Hierarchy** (Phase 1.4)
- Position, rotation, scale properties
- Local vs world space coordinates
- Parent-child relationships
- Group nodes for hierarchical transforms
- Exercise: Build a simple compound object (e.g., spaceship from primitives) using parent-child transforms

---

## Repository Milestones

- **2025-11-01**: Repository initialized, CLAUDE.md created, Session 01 completed, Session 02 completed, PROJECT.md Phase 1 reordered
- **2025-11-02**: Session 03 (Lighting) completed
