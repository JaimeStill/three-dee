# Three.js + Game Development Learning Path

A progressive curriculum for building game development fundamentals with Three.js and TypeScript.

---

## Phase 1: Three.js Rendering Fundamentals

### 1.1 Scene, Camera, Renderer ✅
**Goal:** Understand the basic rendering pipeline.

- Initialize a Scene (container for all objects)
- Setup PerspectiveCamera (FOV, aspect ratio, near/far clipping)
- Create WebGLRenderer and attach to DOM
- Render a single frame
- Handle window resize and aspect ratio updates

**Exercise:** Render a single colored cube in the center of the scene.

### 1.2 Geometry and Materials ✅
**Goal:** Control mesh appearance and structure.

- BufferGeometry basics (vertices, indices, attributes)
- Built-in geometries (Box, Sphere, Cylinder, Cone)
- Material types (MeshBasicMaterial, MeshStandardMaterial, MeshPhongMaterial)
- Material properties (color, emissive, wireframe)

**Exercise:** Create multiple geometric primitives with different materials.

### 1.3 Lighting ✅
**Goal:** Understand how lights affect material appearance.

- AmbientLight (global illumination)
- DirectionalLight (sun-like parallel rays)
- PointLight (omnidirectional from position)
- Light intensity and color
- Why MeshBasicMaterial ignores lights

**Exercise:** Light a scene with multiple light sources and observe material responses.

### 1.4 Transforms and Object3D Hierarchy ✅
**Goal:** Master spatial relationships and scene graphs.

- Position, rotation, scale properties
- Local vs world space coordinates
- Parent-child relationships
- Group nodes for hierarchical transforms

**Exercise:** Build a simple compound object (e.g., spaceship from primitives) using parent-child transforms.

### 1.5 The Animation Loop
**Goal:** Learn continuous rendering and time-based updates.

- Implement `requestAnimationFrame` loop
- Calculate delta time between frames
- Understand frame-independent movement
- Monitor frame rate and performance

**Exercise:** Rotate the cube continuously at a consistent speed regardless of frame rate.

---

## Phase 2: Input and Camera Control

### 2.1 Keyboard Input
**Goal:** Capture and process keyboard events.

- Event listeners (keydown, keyup)
- Track key state in a dictionary/map
- Polling input state in the game loop
- Handle key repeat and multiple simultaneous keys

**Exercise:** Move a cube with WASD keys using frame-independent velocity.

### 2.2 Gamepad API
**Goal:** Support controller input for gameplay.

- Poll `navigator.getGamepads()` each frame
- Understand gamepad axes (sticks) and buttons
- Implement dead zones for analog sticks
- Handle gamepad connection/disconnection

**Exercise:** Control cube movement with left stick, rotation with right stick.

### 2.3 Camera Movement Patterns
**Goal:** Implement common camera behaviors.

- First-person camera (rotation controls look direction)
- Third-person camera (offset from target position)
- Camera smoothing and interpolation (lerp)
- Look-at constraints

**Exercise:** Implement a third-person camera that follows a moving object with smooth tracking.

---

## Phase 3: Vector Mathematics for Games

### 3.1 Vector Operations
**Goal:** Apply vector math to gameplay problems.

- Vector3 addition, subtraction, scaling
- Magnitude and normalization
- Dot product (angle relationships, projections)
- Cross product (perpendicular vectors, rotation axes)

**Exercise:** Calculate forward direction from rotation, project movement onto a plane.

### 3.2 Quaternions and Rotation
**Goal:** Handle 3D rotation without gimbal lock.

- Euler angles vs quaternions
- Quaternion.setFromAxisAngle for arbitrary rotation
- Slerp for smooth rotation interpolation
- Converting between Euler and quaternion representations

**Exercise:** Rotate an object to face a moving target smoothly over time.

### 3.3 Interpolation Techniques
**Goal:** Create smooth transitions and motion.

- Linear interpolation (lerp)
- Spherical linear interpolation (slerp)
- Easing functions for non-linear motion
- Spring physics for natural motion

**Exercise:** Implement smooth camera following with adjustable responsiveness.

---

## Phase 4: Game Architecture Patterns

### 4.1 Entity Structure
**Goal:** Organize game objects systematically.

- Entity as class with update/render separation
- Transform, mesh, and behavior composition
- Entity lifecycle (spawn, update, destroy)
- Reference management and cleanup

**Exercise:** Create a reusable Entity base class for game objects.

### 4.2 Game State Management
**Goal:** Track and update multiple entities efficiently.

- Entity collection management (arrays, maps)
- Update all entities each frame
- Remove destroyed entities safely
- Separate update and render phases

**Exercise:** Manage a collection of moving entities with spawn/despawn.

### 4.3 Object Pooling
**Goal:** Optimize frequent spawn/destroy patterns.

- Why garbage collection affects performance
- Pre-allocate object pools
- Activate/deactivate vs create/destroy
- Pool size management

**Exercise:** Create a projectile pool for laser spawning.

### 4.4 Delta Time and Fixed Timestep
**Goal:** Maintain consistent simulation behavior.

- Frame-rate independent movement (multiply by delta)
- Fixed timestep for physics stability
- Accumulator pattern for fixed updates
- Interpolation between physics steps

**Exercise:** Implement both variable and fixed timestep update loops.

---

## Phase 5: Collision and Physics

### 5.1 Bounding Volumes
**Goal:** Efficient spatial queries and collision detection.

- Bounding boxes (AABB, OBB)
- Bounding spheres
- Box3 and Sphere classes in Three.js
- Compute bounding volumes from geometry

**Exercise:** Visualize bounding volumes and detect overlaps between objects.

### 5.2 Basic Collision Detection
**Goal:** Implement common collision algorithms.

- Sphere-sphere collision
- AABB-AABB collision
- Ray-sphere and ray-box intersection
- Spatial partitioning concepts (grid, quadtree)

**Exercise:** Detect and respond to projectile-target collisions.

### 5.3 Physics-Based Movement
**Goal:** Apply forces and constraints to motion.

- Velocity and acceleration
- Apply gravity and drag
- Collision response (bounce, stop, destroy)
- Impulse-based collision resolution

**Exercise:** Create projectiles affected by gravity with bouncing collisions.

---

## Phase 6: Procedural Generation

### 6.1 Custom Geometry Creation
**Goal:** Build meshes from vertex data programmatically.

- BufferGeometry from scratch
- Position, normal, and UV attributes
- Index arrays for face definitions
- Compute vertex normals for lighting

**Exercise:** Generate a parametric surface (sphere, torus) from equations.

### 6.2 Geometric Primitives and Patterns
**Goal:** Create interesting shapes through algorithms.

- Platonic solids (tetrahedron, icosahedron)
- Subdivision and smoothing
- Extrusion and revolution
- Fractal patterns and L-systems

**Exercise:** Generate a procedural spaceship hull using geometric operations.

### 6.3 Noise and Randomness
**Goal:** Generate organic variation in content.

- Pseudorandom number generation (seeded)
- Perlin noise concepts and libraries
- Apply noise to vertex positions (terrain, asteroids)
- Noise-driven animation (turbulence, flutter)

**Exercise:** Create an asteroid field with noise-deformed sphere geometry.

### 6.4 Procedural Textures
**Goal:** Generate patterns and colors algorithmically.

- Canvas-based texture generation
- Procedural patterns (stripes, checkerboard, gradients)
- Data textures for lookup tables
- Combine with shaders for real-time generation

**Exercise:** Create color variations for entities using procedural textures.

---

## Phase 7: Visual Effects and Polish

### 7.1 Particle Systems
**Goal:** Create effects through many small objects.

- Particle emitter patterns
- Particle lifecycle (spawn, update, fade out)
- Instancing for performance (InstancedMesh)
- Billboard sprites for camera-facing particles

**Exercise:** Implement laser hit effects and thruster trails.

### 7.2 Post-Processing
**Goal:** Apply screen-space effects to the rendered scene.

- EffectComposer and render passes
- Bloom for glowing objects
- Screen shake through camera transform
- Color grading and tone mapping

**Exercise:** Add glow to lasers and energy shields using bloom.

### 7.3 Audio Integration
**Goal:** Add sound effects and music.

- Web Audio API basics
- AudioListener attached to camera
- PositionalAudio for 3D sound
- AudioLoader for sound files
- Trigger sounds from gameplay events

**Exercise:** Add spatial audio for laser firing and explosions.

---

## Phase 8: Advanced Game Systems

### 8.1 AI and Behavior Trees
**Goal:** Create autonomous entity behavior.

- State machines for simple AI
- Behavior trees for complex decision making
- Steering behaviors (seek, flee, wander)
- Formation movement and flocking

**Exercise:** Implement enemy ships with basic patrol and attack behaviors.

### 8.2 User Interface
**Goal:** Display game information and menus.

- HTML overlay UI vs in-world UI
- CSS3DRenderer for integrated 3D UI elements
- Health bars, score displays, minimaps
- Pause menus and state transitions

**Exercise:** Add a HUD showing ship health and score.

### 8.3 Scene Management
**Goal:** Structure complex games with multiple scenes.

- Load/unload scene content
- Scene transition patterns
- Asset preloading and management
- Memory cleanup between scenes

**Exercise:** Create a menu scene and gameplay scene with transitions.

---

## Suggested Project Progression

**Project 1: Orbital Viewer**
Scene setup, geometry, materials, lighting, camera controls. Render procedurally generated geometric objects that the camera orbits around.

**Project 2: Flight Simulator**
Keyboard/gamepad input, camera following, velocity-based movement. Control a spaceship with 6DOF movement and third-person camera.

**Project 3: Target Practice**
Entity management, projectiles, collision detection. Shoot at procedurally placed targets with hit detection and scoring.

**Project 4: Asteroid Dodge**
Object pooling, procedural generation, difficulty progression. Navigate through an endless field of procedurally generated obstacles.

**Project 5: Space Combat**
AI behaviors, health systems, effects, audio. Fight against AI-controlled enemies with weapons and abilities.

---

## Learning Resources

**Three.js Documentation**
- Official examples: https://threejs.org/examples/
- API reference: https://threejs.org/docs/
- Manual: https://threejs.org/manual/

**Vector Math**
- 3Blue1Brown "Essence of Linear Algebra" series
- Immersive Linear Algebra (interactive textbook)

**Game Programming Patterns**
- "Game Programming Patterns" by Robert Nystrom (free online)
- Focuses on architecture, not engine-specific

**WebGL/Graphics**
- WebGL Fundamentals (webglfundamentals.org)
- Useful for understanding what Three.js abstracts

---

## Practice Philosophy

1. **Build incrementally** - Master each concept before combining them
2. **Experiment freely** - Modify parameters, break things, observe results
3. **Refactor often** - Revisit early code with new knowledge
4. **Start ugly** - Procedural geometry doesn't need to be beautiful initially
5. **Profile performance** - Use browser dev tools to understand bottlenecks

The goal is not to rush to a complete game, but to understand each system deeply enough to apply it confidently in any context.
