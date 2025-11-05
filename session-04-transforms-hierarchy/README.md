# Session 04: Transforms and Object3D Hierarchy

## Learning Objectives

By the end of this session, you will understand:
- How position, rotation, and scale properties work in Three.js
- The difference between local space and world space coordinates
- How parent-child relationships create hierarchical transforms
- How to use THREE.Group to organize compound objects
- How to build complex multi-part objects from geometric primitives
- How hierarchical animations work (rotating parts vs rotating the whole)

## What We're Building

A compound spaceship built from geometric primitives:
- **Main body** (box) - the core structure
- **Cockpit window** (sphere) - positioned relative to the body
- **Wings** (boxes) - attached to the sides, scaled appropriately
- **Engine nozzles** (cylinders) - positioned at the rear
- **Organized hierarchy** - all parts grouped together, transforming as one unit

We'll then experiment with:
- Rotating the entire spaceship as a single object
- Animating individual parts (spinning engine fans, tilting wings)
- Building more complex hierarchies (solar system, robot arm)
- Understanding coordinate spaces and transform inheritance

This builds on Sessions 01-03's rendering, geometry, materials, and lighting knowledge.

## Why This Matters

Hierarchical transforms are fundamental to game development:
- **Compound objects**: Characters, vehicles, and props are built from multiple parts
- **Skeletal animation**: Bones form a hierarchy where shoulder rotation affects the arm and hand
- **Scene organization**: Group related objects for easier management and batch transforms
- **Relative positioning**: Define parts relative to their parent, not the world
- **Efficient animation**: Rotate a parent to rotate all children automatically
- **Code reusability**: Build once, instance many times with different transforms

Without understanding transforms and hierarchies, you can't build anything beyond single-piece objects.

---

## Part 1: Project Setup

Session 04 uses the same Vite + TypeScript setup as previous sessions.

### Step 1: Initialize Project

Navigate to the session directory:
```bash
cd session-04-transforms-hierarchy
```

The project is already initialized with Vite and TypeScript!

### Step 2: Install Dependencies

```bash
npm install
npm install three
```

### Step 3: Start Dev Server

```bash
npm run dev
```

Open the localhost URL in your browser. You should see a blank page ready for your spaceship!

---

## Part 2: Understanding Transform Properties

Before building, let's understand the three core transform properties every Object3D has.

### The Three Transform Properties

Every Three.js object (meshes, lights, cameras, groups) inherits from `Object3D` and has:

1. **position** (Vector3) - Where the object is in 3D space
2. **rotation** (Euler) - How the object is rotated (in radians)
3. **scale** (Vector3) - How large the object is (multiplier per axis)

### Working with Position

Position is a `Vector3` with x, y, z components:

```typescript
const mesh = new THREE.Mesh(geometry, material);

// Set position
mesh.position.set(10, 5, -3);  // x=10, y=5, z=-3

// Or set individual axes
mesh.position.x = 10;
mesh.position.y = 5;
mesh.position.z = -3;

// Add to position
mesh.position.add(new THREE.Vector3(1, 0, 0)); // Move right by 1

// Copy another position
mesh.position.copy(otherMesh.position);
```

**Coordinate system in Three.js:**
- **+X** = Right
- **+Y** = Up
- **+Z** = Toward camera (right-hand rule)

### Working with Rotation

Rotation is an `Euler` angle object (angles in radians):

```typescript
// Set rotation
mesh.rotation.set(0, Math.PI / 4, 0);  // Rotate 45° around Y-axis

// Or set individual axes
mesh.rotation.x = Math.PI / 2;  // 90° pitch
mesh.rotation.y = Math.PI;      // 180° yaw
mesh.rotation.z = 0;            // 0° roll

// Useful constants
Math.PI / 2  // 90 degrees
Math.PI      // 180 degrees
Math.PI * 2  // 360 degrees (full rotation)
```

**Rotation axes:**
- **X-axis** = Pitch (nodding yes)
- **Y-axis** = Yaw (shaking head no)
- **Z-axis** = Roll (tilting head sideways)

**Important**: Rotations are applied in XYZ order by default. For complex rotations, consider using quaternions (we'll cover that in a later session).

### Working with Scale

Scale is a `Vector3` that multiplies the object's size:

```typescript
// Uniform scale (same on all axes)
mesh.scale.set(2, 2, 2);  // Twice as large

// Non-uniform scale
mesh.scale.set(2, 1, 0.5);  // Wide, normal height, thin

// Individual axes
mesh.scale.x = 3;  // Stretch along X-axis
```

**Scale values:**
- `1` = Original size
- `2` = Twice as large
- `0.5` = Half size
- `-1` = Flipped (mirrored)

---

## Part 3: Parent-Child Relationships

The magic of hierarchical transforms comes from parent-child relationships.

### How add() Creates Hierarchies

When you add an object to another object using `add()`, you create a parent-child relationship:

```typescript
const parent = new THREE.Mesh(parentGeometry, material);
const child = new THREE.Mesh(childGeometry, material);

parent.add(child);  // child is now a child of parent
scene.add(parent);  // parent is a child of scene
```

**Key concept**: Child transforms are **relative to the parent**, not the world.

### Transform Inheritance Example

```typescript
const parent = new THREE.Mesh(boxGeometry, material);
parent.position.set(10, 0, 0);  // Parent at world position x=10

const child = new THREE.Mesh(sphereGeometry, material);
child.position.set(5, 0, 0);    // Child at position x=5 RELATIVE to parent

parent.add(child);
scene.add(parent);

// Child's world position is now x=15 (parent's 10 + child's 5)
```

### What Happens When You Transform a Parent?

When you transform a parent, **all children transform with it**:

```typescript
// Rotate the parent
parent.rotation.y = Math.PI / 4;  // Rotate 45°

// The child automatically rotates with the parent
// The child maintains its relative position (5, 0, 0)
// But its world position rotates around the parent
```

**Mental model**: Think of the child as "glued" to the parent. Wherever the parent goes, the child follows while maintaining its relative offset.

### Multiple Levels of Hierarchy

You can nest hierarchies as deep as needed:

```typescript
const grandparent = new THREE.Group();
const parent = new THREE.Group();
const child = new THREE.Mesh(geometry, material);

grandparent.add(parent);
parent.add(child);
scene.add(grandparent);

// Now:
// - Rotating grandparent rotates parent AND child
// - Rotating parent rotates only parent and child
// - Rotating child rotates only child
```

---

## Part 4: Building a Compound Spaceship

Now let's build! We'll create a spaceship from geometric primitives using hierarchical transforms.

### Step 1: Basic Scene Setup

Create `src/main.ts` and set up the basic scene:

```typescript
import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let spaceship: THREE.Group; // Our compound object!

init();
animate();

function init(): void {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a14); // Deep space blue

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 5, 10);
  camera.lookAt(0, 0, 0);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // Build the spaceship (we'll implement this next)
  spaceship = createSpaceship();
  scene.add(spaceship);

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
}

function animate(): void {
  requestAnimationFrame(animate);

  // Rotate the entire spaceship
  spaceship.rotation.y += 0.005;

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
```

Save this. The scene won't render yet because we haven't implemented `createSpaceship()`.

### Step 2: Create Spaceship Function (Starting with Body)

Add this function before `init()`:

```typescript
function createSpaceship(): THREE.Group {
  const group = new THREE.Group();

  // Main body (fuselage)
  const bodyGeometry = new THREE.BoxGeometry(1.5, 1, 4);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.7,
    roughness: 0.3
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  return group;
}
```

**What we did:**
- Created a `Group` to hold all spaceship parts
- Created a box for the main body (1.5 wide, 1 tall, 4 long)
- Used metallic material for a spaceship feel
- Added body to group

Save and check your browser - you should see a gray rotating box!

### Step 3: Add Cockpit Window

Add this after the body creation (inside `createSpaceship`):

```typescript
  // Cockpit window (front sphere)
  const windowGeometry = new THREE.SphereGeometry(0.4, 16, 16);
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: 0x0099ff,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x004488,
    emissiveIntensity: 0.3
  });
  const cockpitWindow = new THREE.Mesh(windowGeometry, windowMaterial);

  // Position relative to the body center
  cockpitWindow.position.set(0, 0.3, 1.8); // Forward and slightly up

  group.add(cockpitWindow);
```

**What we did:**
- Created a sphere for the cockpit window
- Used glowing blue material (emissive for sci-fi look)
- Positioned at (0, 0.3, 1.8):
  - `x=0` = centered horizontally
  - `y=0.3` = slightly above body center
  - `z=1.8` = near the front of the 4-unit-long body

Save and observe - the blue sphere rotates with the body!

### Step 4: Add Wings

Add this after the cockpit window:

```typescript
  // Left wing
  const wingGeometry = new THREE.BoxGeometry(4, 0.2, 1.5);
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.6,
    roughness: 0.4
  });
  const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
  leftWing.position.set(-2.75, 0, -0.5); // Left side, slightly back
  group.add(leftWing);

  // Right wing (reuse geometry and material)
  const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
  rightWing.position.set(2.75, 0, -0.5); // Right side, slightly back
  group.add(rightWing);
```

**What we did:**
- Created wide, thin boxes for wings (4 wide, 0.2 tall, 1.5 long)
- Positioned symmetrically on left (-X) and right (+X)
- Slightly back from center (z=-0.5)
- Used darker gray material

**Optimization note**: We reused `wingGeometry` and `wingMaterial` for both wings. Three.js efficiently shares these resources.

### Step 5: Add Engine Nozzles

Add this after the wings:

```typescript
  // Engine nozzles (cylinders at the rear)
  const engineGeometry = new THREE.CylinderGeometry(0.25, 0.35, 0.8, 16);
  const engineMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.9,
    roughness: 0.2
  });

  // Left engine
  const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
  leftEngine.position.set(-0.6, -0.3, -2); // Left side, rear
  leftEngine.rotation.x = Math.PI / 2; // Rotate to point backward
  group.add(leftEngine);

  // Right engine
  const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
  rightEngine.position.set(0.6, -0.3, -2); // Right side, rear
  rightEngine.rotation.x = Math.PI / 2; // Rotate to point backward
  group.add(rightEngine);
```

**What we did:**
- Created cylinders for engine nozzles (0.25 top radius, 0.35 bottom radius for taper)
- Positioned at the rear (z=-2) on left and right sides
- Rotated 90° to point along the Z-axis (backward)
- Used very dark metallic material

**Note on cylinder rotation**: Cylinders are created along the Y-axis by default. We rotate them 90° around X to point them backward (along Z).

### Step 6: Add Engine Glow (Optional Flair)

Add this after the engines for a nice touch:

```typescript
  // Engine glow (emissive spheres inside nozzles)
  const glowGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6600,
  });

  const leftGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  leftGlow.position.set(-0.6, -0.3, -2.3); // Inside left engine
  group.add(leftGlow);

  const rightGlow = new THREE.Mesh(glowGeometry, glowMaterial);
  rightGlow.position.set(0.6, -0.3, -2.3); // Inside right engine
  group.add(rightGlow);
```

**What we did:**
- Created small glowing spheres (MeshBasicMaterial = always visible, ignores lighting)
- Positioned inside the engine nozzles
- Used orange color for thruster effect

**Why MeshBasicMaterial?**: It always renders at full brightness regardless of lighting, perfect for glowing effects.

### Complete Spaceship

Save and check your browser! You should now see a complete rotating spaceship with:
- ✓ Metallic gray body
- ✓ Glowing blue cockpit
- ✓ Dark wings on both sides
- ✓ Engine nozzles at the rear
- ✓ Orange engine glow
- ✓ All parts rotating together as one unit

**Key insight**: We added 8 different meshes to a single Group. When we rotate the group (`spaceship.rotation.y += 0.005`), all parts rotate together while maintaining their relative positions.

---

## Part 5: Local vs World Space

Understanding coordinate spaces is crucial for working with hierarchies.

### What is Local Space?

**Local space** (also called object space) is the coordinate system relative to an object's parent.

When you set `child.position.set(5, 0, 0)`, that's 5 units along the parent's local X-axis, not the world's X-axis.

### What is World Space?

**World space** (also called global space) is the coordinate system relative to the scene origin.

The scene is the root of all hierarchies. Objects added directly to the scene use world space.

### Visualizing the Difference

```typescript
const parent = new THREE.Group();
parent.position.set(10, 0, 0);  // Parent at world x=10
parent.rotation.y = Math.PI / 4;  // Parent rotated 45°

const child = new THREE.Mesh(geometry, material);
child.position.set(5, 0, 0);  // Local position: 5 units along parent's X-axis

parent.add(child);
scene.add(parent);

// Question: Where is the child in world space?
// Answer: NOT at world x=15!
// Because the parent is rotated, the child's local X-axis is also rotated
// The child is 5 units along the rotated X-axis, PLUS the parent's offset
```

### Converting Between Spaces

Three.js provides methods to convert coordinates:

```typescript
// Get world position of an object
const worldPosition = new THREE.Vector3();
child.getWorldPosition(worldPosition);
console.log(worldPosition); // World coordinates

// Get world rotation (quaternion)
const worldQuaternion = new THREE.Quaternion();
child.getWorldQuaternion(worldQuaternion);

// Get world scale
const worldScale = new THREE.Vector3();
child.getWorldScale(worldScale);

// Convert a local vector to world space
const localVector = new THREE.Vector3(1, 0, 0); // Local X-axis
const worldVector = localVector.clone();
child.localToWorld(worldVector);
console.log(worldVector); // Now in world coordinates

// Convert a world vector to local space
const worldPoint = new THREE.Vector3(10, 5, 3);
const localPoint = worldPoint.clone();
child.worldToLocal(localPoint);
console.log(localPoint); // Now in child's local coordinates
```

**When to use these:**
- Positioning objects relative to other objects in world space
- Calculating distances between objects in different hierarchies
- Raycasting from a child object in world space
- Debug logging (world positions are easier to reason about)

---

## Part 6: Experiments to Try

Now for the fun part! Try these experiments to build deep intuition.

### Experiment 1: Animate Individual Parts

**Goal**: Rotate parts independently while the whole ship rotates.

In the `animate()` function, add:

```typescript
// Rotate the entire spaceship
spaceship.rotation.y += 0.005;

// Access children by index and animate them
// (Assuming body=0, cockpit=1, left wing=2, right wing=3, etc.)
const leftWing = spaceship.children[2] as THREE.Mesh;
const rightWing = spaceship.children[3] as THREE.Mesh;

leftWing.rotation.z += 0.02;  // Flap left wing
rightWing.rotation.z -= 0.02; // Flap right wing (opposite direction)
```

**Observe**: The wings flap while the whole ship rotates. The wing rotations are relative to their local axes!

**Try**: Make the engine glow spheres pulse by scaling them:

```typescript
const time = Date.now() * 0.001;
const leftGlow = spaceship.children[6] as THREE.Mesh;
const rightGlow = spaceship.children[7] as THREE.Mesh;

const pulseScale = 1 + Math.sin(time * 5) * 0.3;
leftGlow.scale.setScalar(pulseScale);
rightGlow.scale.setScalar(pulseScale);
```

### Experiment 2: Naming Objects for Easy Access

**Goal**: Access specific parts by name instead of index (much cleaner!).

When creating objects, give them names:

```typescript
// In createSpaceship():
leftWing.name = 'leftWing';
rightWing.name = 'rightWing';
leftGlow.name = 'leftGlow';
rightGlow.name = 'rightGlow';
```

Then access them in `animate()`:

```typescript
const leftWing = spaceship.getObjectByName('leftWing') as THREE.Mesh;
const rightWing = spaceship.getObjectByName('rightWing') as THREE.Mesh;

if (leftWing && rightWing) {
  leftWing.rotation.z += 0.02;
  rightWing.rotation.z -= 0.02;
}
```

**Much better!** No magic indices, and it's clear what you're animating.

### Experiment 3: Build a Solar System Hierarchy

**Goal**: Understand nested hierarchies through a classic example.

Create a new function:

```typescript
function createSolarSystem(): THREE.Group {
  const solarSystem = new THREE.Group();

  // Sun (center, doesn't orbit)
  const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  solarSystem.add(sun);

  // Earth orbit group (rotates around sun)
  const earthOrbit = new THREE.Group();
  earthOrbit.position.x = 5; // Orbital radius
  solarSystem.add(earthOrbit);

  // Earth mesh (child of orbit group)
  const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2233ff });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earthOrbit.add(earth);

  // Moon orbit group (rotates around Earth)
  const moonOrbit = new THREE.Group();
  moonOrbit.position.x = 1.5; // Distance from Earth
  earthOrbit.add(moonOrbit); // Child of earthOrbit!

  // Moon mesh
  const moonGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moonOrbit.add(moon);

  return solarSystem;
}
```

Replace the spaceship in `init()`:

```typescript
const solarSystem = createSolarSystem();
scene.add(solarSystem);
```

Animate it:

```typescript
function animate(): void {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.0001;

  const solarSystem = scene.getObjectByName('solarSystem') as THREE.Group;
  if (solarSystem) {
    // Rotate the entire solar system (or don't)
    solarSystem.rotation.y = time * 0.1;

    // Find earth orbit and rotate it
    const earthOrbit = solarSystem.children[1] as THREE.Group;
    earthOrbit.rotation.y = time;

    // Find moon orbit (child of earthOrbit) and rotate it
    const moonOrbit = earthOrbit.children[0].children[0] as THREE.Group;
    moonOrbit.rotation.y = time * 3;
  }

  renderer.render(scene, camera);
}
```

**Observe**:
- Sun stays at center
- Earth orbits sun (earthOrbit rotates)
- Moon orbits Earth (moonOrbit rotates around Earth, which is itself orbiting)
- **Key insight**: The moon's world position traces a complex path, but we only defined simple rotations!

**Don't forget to set names:**
```typescript
solarSystem.name = 'solarSystem';
```

### Experiment 4: Build an Articulated Robot Arm

**Goal**: Create a chain of dependent joints.

```typescript
function createRobotArm(): THREE.Group {
  const arm = new THREE.Group();

  // Base (rotates left-right)
  const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.name = 'base';
  arm.add(base);

  // Lower arm segment (pivots at base)
  const lowerArmGeometry = new THREE.BoxGeometry(0.3, 2, 0.3);
  const armMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000 });
  const lowerArm = new THREE.Mesh(lowerArmGeometry, armMaterial);
  lowerArm.position.y = 1; // Half its height above base
  lowerArm.name = 'lowerArm';
  base.add(lowerArm); // Child of base

  // Upper arm segment (pivots at lower arm's top)
  const upperArm = new THREE.Mesh(lowerArmGeometry, armMaterial);
  upperArm.position.y = 2; // At top of lower arm
  upperArm.name = 'upperArm';
  lowerArm.add(upperArm); // Child of lowerArm

  // Hand (pivots at upper arm's top)
  const handGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const handMaterial = new THREE.MeshStandardMaterial({ color: 0x00cccc });
  const hand = new THREE.Mesh(handGeometry, handMaterial);
  hand.position.y = 1;
  hand.name = 'hand';
  upperArm.add(hand); // Child of upperArm

  return arm;
}
```

Animate it:

```typescript
const time = Date.now() * 0.001;

const base = robotArm.getObjectByName('base') as THREE.Mesh;
const lowerArm = robotArm.getObjectByName('lowerArm') as THREE.Mesh;
const upperArm = robotArm.getObjectByName('upperArm') as THREE.Mesh;

if (base && lowerArm && upperArm) {
  base.rotation.y = Math.sin(time) * 1; // Swivel base
  lowerArm.rotation.z = Math.sin(time * 0.7) * 0.5; // Bend at elbow
  upperArm.rotation.z = Math.sin(time * 1.3) * 0.5; // Bend at wrist
}
```

**Observe**: When you rotate the base, the entire arm swivels. When you bend the lower arm, the upper arm and hand follow. This is how skeletal animation works in games!

### Experiment 5: Local vs World Position Logging

**Goal**: See the difference between local and world coordinates.

Add this to `animate()`:

```typescript
// Get any child object from your spaceship
const cockpit = spaceship.children[1] as THREE.Mesh;

if (cockpit) {
  // Log local position
  console.log('Local position:', cockpit.position);

  // Log world position
  const worldPos = new THREE.Vector3();
  cockpit.getWorldPosition(worldPos);
  console.log('World position:', worldPos);
}
```

**Observe**: The local position stays constant (0, 0.3, 1.8), but the world position changes as the spaceship rotates!

### Experiment 6: Scale Inheritance

**Goal**: Understand how scale cascades through hierarchies.

Add this to your spaceship or robot arm:

```typescript
// Scale the entire group
spaceship.scale.setScalar(2); // Entire ship 2x larger

// Or scale just one part
const body = spaceship.children[0] as THREE.Mesh;
body.scale.set(1, 2, 1); // Body stretched vertically
```

**Observe**: When you scale the group, all children scale proportionally. Scaling individual children only affects those parts.

**Try**: Scale the parent to 2x and a child to 0.5x - the child ends up at original size (2 × 0.5 = 1)!

### Experiment 7: Compound Rotation Challenge

**Goal**: Create complex motion with simple rotations.

Make your spaceship move in a figure-8 pattern:

```typescript
const time = Date.now() * 0.001;

// Orbit group
const orbit = new THREE.Group();
scene.add(orbit);
orbit.add(spaceship);

// Spaceship offset from orbit center
spaceship.position.x = 5;

// Animate
orbit.rotation.y = time; // Circular orbit
spaceship.rotation.z = Math.sin(time * 2) * 0.5; // Rock back and forth
spaceship.rotation.y += 0.01; // Spin
```

**Observe**: The spaceship orbits in a circle while rocking and spinning - all from simple rotations!

### Experiment 8: Building a Spinning Wheel

**Goal**: Create many objects arranged in a circle.

```typescript
function createWheel(spokeCount: number): THREE.Group {
  const wheel = new THREE.Group();

  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;

    const spoke = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 2, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );

    // Position spoke at angle
    spoke.position.x = Math.cos(angle) * 3;
    spoke.position.z = Math.sin(angle) * 3;

    // Rotate spoke to point outward
    spoke.rotation.y = angle;

    wheel.add(spoke);
  }

  return wheel;
}

const wheel = createWheel(12); // 12 spokes
scene.add(wheel);

// Animate
wheel.rotation.y += 0.02;
```

**Observe**: All spokes rotate together. Try animating individual spokes for a wave effect!

### Experiment 9: Nested Groups for Organization

**Goal**: Organize complex scenes with multiple levels of groups.

```typescript
const fleet = new THREE.Group();
fleet.name = 'fleet';

const squad1 = new THREE.Group();
squad1.name = 'squad1';
squad1.position.x = -10;
fleet.add(squad1);

const squad2 = new THREE.Group();
squad2.name = 'squad2';
squad2.position.x = 10;
fleet.add(squad2);

// Add ships to each squad
for (let i = 0; i < 3; i++) {
  const ship1 = createSpaceship();
  ship1.position.z = i * 5;
  squad1.add(ship1);

  const ship2 = createSpaceship();
  ship2.position.z = i * 5;
  squad2.add(ship2);
}

scene.add(fleet);

// Animate: rotate the entire fleet
fleet.rotation.y += 0.001;
```

**Observe**: 6 ships organized into 2 squads, all rotating together. Perfect for managing complex scenes!

### Experiment 10: Dynamic Hierarchy Changes

**Goal**: Move objects between parents at runtime.

```typescript
// Move a spaceship part to a different parent
const cockpit = spaceship.getObjectByName('cockpitWindow') as THREE.Mesh;

if (cockpit) {
  // Remove from current parent
  spaceship.remove(cockpit);

  // Add to scene (now independent)
  scene.add(cockpit);

  // Cockpit now rotates independently!
  cockpit.rotation.y += 0.02;
}
```

**Use case**: Detaching objects (jetpack falling off character, wheel falling off car), picking up objects, etc.

---

## Part 7: Common Issues and Solutions

### Issue: Child object disappears or is in the wrong place

**Possible causes:**
- Child positioned outside camera view
- Parent has scale of 0 or negative scale
- Child was added but parent wasn't added to scene

**Solution:**
- Check world position: `getWorldPosition()`
- Verify parent chain: every parent must be added to scene
- Check scales: `console.log(parent.scale)`

### Issue: Rotation doesn't look right

**Possible causes:**
- Euler angle gimbal lock (multiple axes)
- Wrong rotation order
- Forgetting that rotations are in radians, not degrees

**Solution:**
- Use single-axis rotations when possible
- Remember: Math.PI = 180°, not 360°
- For complex rotations, consider quaternions (later session)

### Issue: Can't access child by index

**Possible causes:**
- Children array order is not what you expect
- Objects added in different order than you thought

**Solution:**
- Use `object.name` and `getObjectByName()` instead of indices
- Log children array: `console.log(parent.children)`

### Issue: Scale affects children unexpectedly

**This is expected behavior!** Child scales multiply with parent scales.

**Solution:**
- If you need absolute size, compensate: `child.scale.divideScalar(parent.scale.x)`
- Or add child to scene separately when you need independent scale

### Issue: Local vs world confusion

**Symptom**: Positions seem wrong after rotation.

**Solution:**
- Always be aware whether you're thinking in local or world space
- Use `getWorldPosition()` for debugging
- Remember: child.position is ALWAYS relative to parent, not scene

### Issue: Hierarchy is too deep, hard to manage

**Solution:**
- Give everything meaningful names
- Use helper functions to find nested objects
- Document your hierarchy structure
- Consider flatter hierarchies when possible

---

## Part 8: Key Takeaways

1. **Three core transform properties**:
   - `position` (Vector3) - where it is
   - `rotation` (Euler) - how it's oriented (in radians!)
   - `scale` (Vector3) - how large it is

2. **Parent-child relationships via add()**:
   - `parent.add(child)` creates a hierarchy
   - Child transforms are relative to parent
   - Transforming parent affects all descendants

3. **Use Groups to organize compound objects**:
   - `new THREE.Group()` is a lightweight container
   - Perfect for multi-part objects that move together
   - Makes code cleaner and more maintainable

4. **Local vs World space**:
   - Local = relative to parent
   - World = relative to scene origin
   - Use `getWorldPosition()` and related methods to convert

5. **Transform inheritance cascades**:
   - Rotate parent → children rotate with it
   - Scale parent → children scale with it
   - Position parent → children maintain relative offset

6. **Name your objects**:
   - Use `object.name = 'something'`
   - Access with `getObjectByName('something')`
   - Avoids fragile array indices

7. **Hierarchies enable complex animation**:
   - Simple rotations at each level create complex motion
   - Essential for skeletal animation, vehicles, articulated objects
   - Orbits, spinning parts, compound motion all from hierarchies

8. **Common patterns**:
   - Compound objects: Group with multiple meshes
   - Orbital systems: Empty group as pivot, object as child
   - Articulated chains: Each segment parent of next segment
   - Scene organization: Nested groups by category

9. **When things seem wrong, debug with**:
   - `console.log(object.position)` - local position
   - `getWorldPosition()` - world position
   - `console.log(parent.children)` - what's in the hierarchy
   - Visual helpers (axes, wireframes)

10. **Think in terms of hierarchies from the start**:
    - Even simple objects benefit from organization
    - Easier to refactor later if already using groups
    - Game objects almost always need hierarchies eventually

---

## What's Next?

After mastering transforms and hierarchies, you can continue:

**Continue Phase 1:**
- **Session 05: The Animation Loop** - Delta time, frame-independent movement, timing

**Jump to Phase 2:**
- **Session 06: Keyboard Input** - Control your spaceship with WASD keys!
- **Session 07: Camera Movement Patterns** - Follow your spaceship with a third-person camera

**Jump to Phase 4:**
- **Session 11: Entity Structure** - Combine transforms with game object architecture

The curriculum is flexible! Choose based on what excites you.

---

## Notes Section

Use this space to record your discoveries:

- What compound object did you build?
- Any interesting hierarchy patterns you discovered?
- How did local vs world space "click" for you?
- Which experiments were most enlightening?
- Ideas for hierarchical objects to build next?
- Any "aha" moments about transforms?
- Questions for Claude?

---

**Time estimate:** 1-1.5 hours including experimentation
**Difficulty:** Beginner-Intermediate
**Prerequisites:** Sessions 01-03 (Scene, Geometry, Materials, Lighting) recommended

**Key concept**: Hierarchical transforms are the foundation of every complex object in game development. Master this and you can build anything!
