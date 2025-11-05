# Math and Physics Reference for Three.js Game Development

A quick reference guide for the mathematical and physical concepts commonly used in 3D game development with Three.js.

---

## Table of Contents

1. [Trigonometry Fundamentals](#trigonometry-fundamentals)
2. [2D Circular Motion](#2d-circular-motion)
3. [3D Spherical Coordinates](#3d-spherical-coordinates)
4. [Vector Operations](#vector-operations)
5. [Interpolation](#interpolation)
6. [Easing Functions](#easing-functions)
7. [Physics Basics](#physics-basics)
8. [Rotation Representations](#rotation-representations)
9. [Random Distributions](#random-distributions)
10. [Common Formulas Cheat Sheet](#common-formulas-cheat-sheet)

---

## Trigonometry Fundamentals

### SOH CAH TOA

The classic mnemonic for right triangle relationships:

```
        /|
       / |
    h /  | o (opposite)
     /   |
    / θ  |
   /_____|
      a (adjacent)

sin(θ) = opposite / hypotenuse    (SOH)
cos(θ) = adjacent / hypotenuse    (CAH)
tan(θ) = opposite / adjacent      (TOA)
```

### JavaScript Functions

```javascript
// Forward: angle → ratio
Math.sin(angle)   // Returns opposite/hypotenuse
Math.cos(angle)   // Returns adjacent/hypotenuse
Math.tan(angle)   // Returns opposite/adjacent (NOT good for animation!)

// Inverse: ratio → angle
Math.asin(ratio)  // Returns angle from sine ratio
Math.acos(ratio)  // Returns angle from cosine ratio
Math.atan(ratio)  // Returns angle from tangent ratio
Math.atan2(y, x)  // Returns angle from y/x (handles all quadrants)
```

### Key Facts

- **Angles in JavaScript**: Always in **radians**, not degrees
- **Conversion**: `degrees × (Math.PI / 180) = radians`
- **Conversion**: `radians × (180 / Math.PI) = degrees`
- **Common values**:
  - `Math.PI / 4` = 45°
  - `Math.PI / 2` = 90°
  - `Math.PI` = 180°
  - `Math.PI * 2` = 360°

### Sine and Cosine for Animation

**Use sine and cosine for smooth oscillating motion:**

```typescript
const time = Date.now() * 0.001; // Convert to seconds

// Oscillate between -1 and 1
object.position.y = Math.sin(time);

// Oscillate between -5 and 5
object.position.y = Math.sin(time) * 5;

// Oscillate faster (frequency)
object.position.y = Math.sin(time * 3);

// Start at peak instead of middle
object.position.y = Math.cos(time);

// Start at -1 instead of 0
object.position.y = -Math.cos(time);
```

**Phase relationships:**
- `cos(x) = sin(x + π/2)` — Cosine is 90° ahead of sine
- `sin(x) = cos(x - π/2)` — Sine is 90° behind cosine
- `-sin(x)` — Flipped vertically (upside down)
- `sin(x + π)` — 180° phase shift (same as `-sin(x)`)

**Why tangent is bad for animation:**
- Range: -∞ to +∞ (unbounded)
- Has discontinuities (jumps)
- Use for **angle calculations**, not smooth motion

---

## 2D Circular Motion

### From Angle to Position

```typescript
// Place object on circle
const radius = 5;
const angle = Math.PI / 4; // 45°

const x = Math.cos(angle) * radius;
const y = Math.sin(angle) * radius;

// Three.js
object.position.set(x, y, 0);
```

### From Position to Angle

```typescript
// Calculate angle to target
const dx = target.x - player.x;
const dy = target.y - player.y;

const angle = Math.atan2(dy, dx);

// Rotate to face target
player.rotation.z = angle;
```

**Why `atan2()` over `atan()`:**
- `atan(dy / dx)` only gives angles from -90° to 90°
- `atan2(dy, dx)` gives full 360° range and handles all quadrants correctly

### Circular Motion Example

```typescript
function animate() {
  const time = Date.now() * 0.001;
  const radius = 5;

  // Object orbits in a circle
  object.position.x = Math.cos(time) * radius;
  object.position.z = Math.sin(time) * radius;

  // Face direction of travel (tangent to circle)
  object.rotation.y = Math.atan2(
    Math.sin(time),
    Math.cos(time)
  ) + Math.PI / 2;
}
```

---

## 3D Spherical Coordinates

### Coordinate Systems

**Cartesian (x, y, z)** → What Three.js uses by default
**Spherical (r, θ, φ)** → Useful for placing objects on spheres

- **r** (radius) — Distance from origin
- **θ** (theta) — Horizontal angle (azimuth, like longitude, 0 to 2π)
- **φ** (phi) — Vertical angle from top pole (elevation, like latitude, 0 to π)

### Spherical → Cartesian

```typescript
// Manual calculation
const x = radius * Math.sin(phi) * Math.cos(theta);
const y = radius * Math.cos(phi);
const z = radius * Math.sin(phi) * Math.sin(theta);

// Three.js helper (EASIER!)
const position = new THREE.Vector3();
position.setFromSphericalCoords(radius, phi, theta);
```

### Cartesian → Spherical

```typescript
// Manual calculation
const r = Math.sqrt(x*x + y*y + z*z);
const theta = Math.atan2(z, x);
const phi = Math.acos(y / r);

// Three.js helper (EASIER!)
const spherical = new THREE.Spherical();
spherical.setFromVector3(new THREE.Vector3(x, y, z));

console.log(spherical.radius);  // r
console.log(spherical.theta);   // θ
console.log(spherical.phi);     // φ
```

### Place Objects on Sphere

```typescript
// Random distribution
function placeOnSphere(radius: number): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;  // 0 to 360°
  const phi = Math.random() * Math.PI;        // 0 to 180°

  const position = new THREE.Vector3();
  position.setFromSphericalCoords(radius, phi, theta);
  return position;
}

// Even distribution (Fibonacci sphere)
function createFibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * i / goldenRatio;
    const phi = Math.acos(1 - 2 * (i + 0.5) / count);

    const position = new THREE.Vector3();
    position.setFromSphericalCoords(radius, phi, theta);
    positions.push(position);
  }

  return positions;
}
```

---

## Vector Operations

### Vector Basics

A vector represents **direction and magnitude** (length).

```typescript
// Create vectors
const v1 = new THREE.Vector3(1, 2, 3);
const v2 = new THREE.Vector3(4, 5, 6);

// Common operations
v1.add(v2);           // Add vectors
v1.sub(v2);           // Subtract vectors
v1.multiplyScalar(2); // Scale by number
v1.length();          // Get magnitude (distance from origin)
v1.normalize();       // Make length = 1 (unit vector)
v1.clone();           // Copy vector (doesn't modify original)
```

### Length (Magnitude)

```typescript
// Distance from origin
const length = vector.length();

// Distance between two points
const distance = pointA.distanceTo(pointB);

// Manual calculation (Pythagorean theorem in 3D)
const distance = Math.sqrt(
  (x2 - x1)**2 +
  (y2 - y1)**2 +
  (z2 - z1)**2
);
```

### Normalization (Unit Vector)

Convert a vector to length 1 while preserving direction:

```typescript
// Normalize (modifies in place)
vector.normalize();

// Get normalized copy
const normalized = vector.clone().normalize();

// Manual
const length = vector.length();
vector.x /= length;
vector.y /= length;
vector.z /= length;
```

**Use case:** Direction vectors for movement (want direction, not speed)

### Dot Product

Measures how much two vectors point in the same direction:

```typescript
const dot = v1.dot(v2);

// Manual: dot = x1*x2 + y1*y2 + z1*z2

// Properties:
// dot > 0  → Vectors point in similar direction (< 90°)
// dot = 0  → Vectors are perpendicular (90°)
// dot < 0  → Vectors point in opposite directions (> 90°)

// Get angle between vectors
const angle = Math.acos(v1.dot(v2) / (v1.length() * v2.length()));
```

**Use cases:**
- Check if object is in front or behind (compare forward vector with direction to object)
- Field of view checks (dot product with camera forward)
- Surface lighting (dot product of light direction and surface normal)

### Cross Product

Creates a vector perpendicular to two input vectors:

```typescript
const perpendicular = new THREE.Vector3();
perpendicular.crossVectors(v1, v2);

// Or modify in place
v1.cross(v2);
```

**Properties:**
- Result is perpendicular to both input vectors
- Follows right-hand rule for direction
- Magnitude = area of parallelogram formed by vectors

**Use cases:**
- Calculate surface normals
- Find "up" vector for camera
- Determine if turn is clockwise or counter-clockwise

---

## Interpolation

### Linear Interpolation (Lerp)

Blend between two values smoothly:

```typescript
// Manual lerp
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Where t ranges from 0 to 1:
// t = 0   → returns start
// t = 0.5 → returns midpoint
// t = 1   → returns end

// Three.js Vector3 lerp
const start = new THREE.Vector3(0, 0, 0);
const end = new THREE.Vector3(10, 10, 10);
const current = new THREE.Vector3();

current.lerpVectors(start, end, 0.5); // Midpoint
// Or lerp from current position
current.lerp(end, 0.1); // Move 10% toward end
```

**Use cases:**
- Smooth camera movement
- Object following (lag behind target)
- Color transitions
- Fade effects

### Frame-Independent Lerp

For smooth animations that work at any framerate:

```typescript
function animate(deltaTime: number) {
  const smoothing = 5; // Higher = faster approach
  const t = 1 - Math.exp(-smoothing * deltaTime);

  current.lerp(target, t);
}
```

### Spherical Linear Interpolation (Slerp)

For interpolating rotations (quaternions):

```typescript
const startQuat = new THREE.Quaternion();
const endQuat = new THREE.Quaternion();
const currentQuat = new THREE.Quaternion();

currentQuat.slerpQuaternions(startQuat, endQuat, 0.5);

// Apply to object
object.quaternion.copy(currentQuat);
```

**Why slerp for rotations:**
- Lerp on Euler angles can cause weird paths
- Slerp maintains constant angular velocity
- Avoids gimbal lock

---

## Easing Functions

Add organic feel to linear interpolation:

```typescript
// Basic easing functions
function easeInQuad(t: number): number {
  return t * t;
}

function easeOutQuad(t: number): number {
  return t * (2 - t);
}

function easeInOutQuad(t: number): number {
  return t < 0.5
    ? 2 * t * t
    : -1 + (4 - 2 * t) * t;
}

function easeInCubic(t: number): number {
  return t * t * t;
}

function easeOutCubic(t: number): number {
  return (--t) * t * t + 1;
}

// Elastic bounce
function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

// Usage
const t = elapsedTime / duration; // 0 to 1
const easedT = easeInOutQuad(t);
const value = lerp(start, end, easedT);
```

**Common easing patterns:**
- **Ease In** — Slow start, fast end (acceleration)
- **Ease Out** — Fast start, slow end (deceleration)
- **Ease In-Out** — Slow start and end, fast middle (smooth)

**Use cases:**
- UI animations
- Camera movements
- Object spawning/despawning
- Menu transitions

---

## Physics Basics

### Velocity and Acceleration

```typescript
// Position, velocity, acceleration
const position = new THREE.Vector3(0, 0, 0);
const velocity = new THREE.Vector3(0, 0, 0);
const acceleration = new THREE.Vector3(0, -9.8, 0); // Gravity

function update(deltaTime: number) {
  // Update velocity based on acceleration
  velocity.addScaledVector(acceleration, deltaTime);

  // Update position based on velocity
  position.addScaledVector(velocity, deltaTime);

  // Apply to object
  object.position.copy(position);
}
```

### Forces

**Newton's Second Law: F = ma (Force = mass × acceleration)**

```typescript
class PhysicsObject {
  position = new THREE.Vector3();
  velocity = new THREE.Vector3();
  acceleration = new THREE.Vector3();
  mass = 1;

  applyForce(force: THREE.Vector3) {
    // F = ma, so a = F/m
    const acceleration = force.clone().divideScalar(this.mass);
    this.acceleration.add(acceleration);
  }

  update(deltaTime: number) {
    // Integrate
    this.velocity.addScaledVector(this.acceleration, deltaTime);
    this.position.addScaledVector(this.velocity, deltaTime);

    // Clear acceleration (forces accumulate each frame)
    this.acceleration.set(0, 0, 0);
  }
}

// Usage
const obj = new PhysicsObject();
obj.applyForce(new THREE.Vector3(10, 0, 0)); // Push right
obj.applyForce(new THREE.Vector3(0, -9.8, 0)); // Gravity
obj.update(deltaTime);
```

### Drag/Friction

```typescript
function applyDrag(velocity: THREE.Vector3, dragCoefficient: number) {
  // Drag opposes velocity
  const drag = velocity.clone().multiplyScalar(-dragCoefficient);
  return drag;
}

// In update:
const drag = applyDrag(velocity, 0.1);
velocity.add(drag);
```

### Spring Forces (Hooke's Law)

```typescript
// F = -k * x (Force proportional to displacement)
function springForce(
  current: THREE.Vector3,
  target: THREE.Vector3,
  stiffness: number,
  damping: number,
  velocity: THREE.Vector3
): THREE.Vector3 {
  const displacement = target.clone().sub(current);
  const springForce = displacement.multiplyScalar(stiffness);
  const dampingForce = velocity.clone().multiplyScalar(-damping);

  return springForce.add(dampingForce);
}

// Usage (bouncy camera follow)
const force = springForce(camera.position, target, 10, 2, cameraVelocity);
cameraVelocity.add(force.multiplyScalar(deltaTime));
camera.position.addScaledVector(cameraVelocity, deltaTime);
```

### Projectile Motion

```typescript
function launchProjectile(
  startPos: THREE.Vector3,
  angle: number,
  speed: number
): { position: THREE.Vector3; velocity: THREE.Vector3 } {
  const velocity = new THREE.Vector3(
    Math.cos(angle) * speed,
    Math.sin(angle) * speed,
    0
  );

  return {
    position: startPos.clone(),
    velocity: velocity
  };
}

// Update each frame
const gravity = new THREE.Vector3(0, -9.8, 0);
velocity.addScaledVector(gravity, deltaTime);
position.addScaledVector(velocity, deltaTime);
```

---

## Rotation Representations

### Euler Angles

**Pros:** Intuitive, easy to understand (pitch, yaw, roll)
**Cons:** Gimbal lock, order-dependent, not good for interpolation

```typescript
// Set rotation
object.rotation.set(x, y, z); // In radians
object.rotation.x = Math.PI / 4;

// Rotate incrementally
object.rotation.y += 0.01;

// Euler order (default: 'XYZ')
object.rotation.order = 'YXZ'; // Apply Y, then X, then Z
```

**Gimbal lock:** When two rotation axes align, you lose a degree of freedom. Happens at ±90° on one axis.

### Quaternions

**Pros:** No gimbal lock, smooth interpolation (slerp), efficient for composition
**Cons:** Less intuitive, harder to visualize

```typescript
// Create quaternion from Euler angles
const quaternion = new THREE.Quaternion();
quaternion.setFromEuler(new THREE.Euler(x, y, z));

// Create quaternion from axis-angle
quaternion.setFromAxisAngle(
  new THREE.Vector3(0, 1, 0), // Axis (must be normalized)
  Math.PI / 4                  // Angle
);

// Apply to object
object.quaternion.copy(quaternion);

// Interpolate (slerp)
object.quaternion.slerp(targetQuaternion, 0.1);

// Combine rotations (multiply)
const combined = quat1.clone().multiply(quat2);
```

**When to use quaternions:**
- Interpolating between rotations
- Procedural animation (IK, physics)
- Avoiding gimbal lock
- Rotating around arbitrary axes

### LookAt

Point object toward a target:

```typescript
// Object looks at target
object.lookAt(target.position);

// Camera looks at object
camera.lookAt(object.position);

// Look at specific point
object.lookAt(new THREE.Vector3(10, 5, 0));
```

**Under the hood:** Three.js calculates the rotation matrix/quaternion needed to face the target.

---

## Random Distributions

### Uniform Random

```typescript
// Random float between 0 and 1
Math.random();

// Random float between min and max
function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// Random integer between min and max (inclusive)
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random point in 2D circle
function randomInCircle(radius: number): THREE.Vector2 {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius; // sqrt for uniform distribution
  return new THREE.Vector2(
    Math.cos(angle) * r,
    Math.sin(angle) * r
  );
}

// Random point in 3D sphere
function randomInSphere(radius: number): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2 * Math.PI;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius; // cbrt for uniform distribution

  const pos = new THREE.Vector3();
  pos.setFromSphericalCoords(r, phi, theta);
  return pos;
}
```

### Three.js Random Helpers

```typescript
// Random between -1 and 1
THREE.MathUtils.randFloat(-1, 1);

// Random between min and max
THREE.MathUtils.randFloat(min, max);

// Random integer
THREE.MathUtils.randInt(min, max);

// Random sign (-1 or 1)
THREE.MathUtils.randFloatSpread(2); // Returns -1 to 1
```

### Seeded Random (Deterministic)

For reproducible randomness:

```typescript
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  random(): number {
    // Simple LCG (Linear Congruential Generator)
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const rng = new SeededRandom(12345);
console.log(rng.random()); // Always same sequence for same seed
```

---

## Common Formulas Cheat Sheet

### Distance

```typescript
// 2D distance
const distance = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

// 3D distance
const distance = Math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2);

// Three.js
const distance = point1.distanceTo(point2);
```

### Angle Between Vectors

```typescript
// Using dot product
const angle = Math.acos(v1.dot(v2) / (v1.length() * v2.length()));

// Three.js
const angle = v1.angleTo(v2);
```

### Point on Line Segment

```typescript
// t ranges from 0 (start) to 1 (end)
function pointOnLine(start: THREE.Vector3, end: THREE.Vector3, t: number): THREE.Vector3 {
  return start.clone().lerp(end, t);
}
```

### Closest Point on Line to Point

```typescript
function closestPointOnLine(
  lineStart: THREE.Vector3,
  lineEnd: THREE.Vector3,
  point: THREE.Vector3
): THREE.Vector3 {
  const line = lineEnd.clone().sub(lineStart);
  const toPoint = point.clone().sub(lineStart);

  const t = toPoint.dot(line) / line.dot(line);
  const clampedT = Math.max(0, Math.min(1, t)); // Clamp to segment

  return lineStart.clone().addScaledVector(line, clampedT);
}
```

### Reflect Vector

```typescript
// Reflect velocity off surface (like a bouncing ball)
function reflect(velocity: THREE.Vector3, normal: THREE.Vector3): THREE.Vector3 {
  // R = V - 2(V·N)N
  const dotProduct = velocity.dot(normal);
  return velocity.clone().sub(normal.clone().multiplyScalar(2 * dotProduct));
}
```

### Clamp Value

```typescript
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Three.js
THREE.MathUtils.clamp(value, min, max);

// Clamp vector length
function clampLength(vector: THREE.Vector3, maxLength: number): THREE.Vector3 {
  const length = vector.length();
  if (length > maxLength) {
    vector.normalize().multiplyScalar(maxLength);
  }
  return vector;
}

// Three.js
vector.clampLength(0, maxLength);
```

### Map Range

```typescript
// Map value from one range to another
function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

// Example: map 0-100 to 0-1
const normalized = mapRange(50, 0, 100, 0, 1); // 0.5

// Three.js
THREE.MathUtils.mapLinear(value, inMin, inMax, outMin, outMax);
```

---

## Practical Examples

### Orbit Camera Around Target

```typescript
class OrbitCamera {
  radius = 10;
  theta = 0;
  phi = Math.PI / 4;
  target = new THREE.Vector3(0, 0, 0);

  update(camera: THREE.Camera) {
    // Convert spherical to cartesian
    camera.position.x = this.radius * Math.sin(this.phi) * Math.cos(this.theta);
    camera.position.y = this.radius * Math.cos(this.phi);
    camera.position.z = this.radius * Math.sin(this.phi) * Math.sin(this.theta);

    // Add target offset
    camera.position.add(this.target);

    // Look at target
    camera.lookAt(this.target);
  }

  rotate(deltaTheta: number, deltaPhi: number) {
    this.theta += deltaTheta;
    this.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.phi + deltaPhi));
  }
}
```

### Smooth Follow Camera

```typescript
class FollowCamera {
  position = new THREE.Vector3();
  velocity = new THREE.Vector3();

  update(target: THREE.Vector3, offset: THREE.Vector3, deltaTime: number) {
    const desiredPosition = target.clone().add(offset);

    // Spring force
    const displacement = desiredPosition.clone().sub(this.position);
    const force = displacement.multiplyScalar(10); // Stiffness
    const damping = this.velocity.clone().multiplyScalar(-5); // Damping

    this.velocity.add(force.add(damping).multiplyScalar(deltaTime));
    this.position.addScaledVector(this.velocity, deltaTime);
  }
}
```

### Homing Projectile

```typescript
class HomingProjectile {
  position = new THREE.Vector3();
  velocity = new THREE.Vector3();
  speed = 10;
  turnRate = 2; // radians per second

  update(target: THREE.Vector3, deltaTime: number) {
    // Direction to target
    const toTarget = target.clone().sub(this.position).normalize();

    // Current direction
    const currentDir = this.velocity.clone().normalize();

    // Smoothly rotate toward target
    currentDir.lerp(toTarget, this.turnRate * deltaTime);

    // Update velocity
    this.velocity.copy(currentDir.multiplyScalar(this.speed));

    // Update position
    this.position.addScaledVector(this.velocity, deltaTime);
  }
}
```

### Procedural Bobbing Motion

```typescript
function updateBobbing(object: THREE.Object3D, time: number) {
  // Combine multiple sine waves for organic motion
  object.position.y =
    Math.sin(time * 2) * 0.5 +           // Primary bob
    Math.sin(time * 3.7) * 0.1 +         // Secondary bob (different frequency)
    Math.sin(time * 5.3) * 0.05;         // Subtle tertiary bob

  // Slight rotation wobble
  object.rotation.z = Math.sin(time * 1.5) * 0.1;
}
```

---

## Additional Resources

### Three.js Math Utilities

Explore `THREE.MathUtils` for many helpful functions:
- `THREE.MathUtils.degToRad(degrees)`
- `THREE.MathUtils.radToDeg(radians)`
- `THREE.MathUtils.clamp(value, min, max)`
- `THREE.MathUtils.lerp(start, end, t)`
- `THREE.MathUtils.smoothstep(x, min, max)`
- `THREE.MathUtils.smootherstep(x, min, max)`

### Three.js Classes

- `THREE.Vector2` / `THREE.Vector3` / `THREE.Vector4`
- `THREE.Euler` — Euler angle rotations
- `THREE.Quaternion` — Quaternion rotations
- `THREE.Matrix3` / `THREE.Matrix4` — Transform matrices
- `THREE.Spherical` — Spherical coordinates
- `THREE.Cylindrical` — Cylindrical coordinates

### External Tools

- **Desmos** (desmos.com) — Visualize equations and functions
- **GeoGebra** — 3D geometry visualization
- **Wolfram Alpha** — Solve equations and conversions

---

## Quick Mental Models

1. **Sine/Cosine** = Smooth waves for animation
2. **Tangent** = Slopes and angles, not animation
3. **Vectors** = Arrows with direction and length
4. **Dot product** = "How much do these point the same way?"
5. **Cross product** = "Give me a perpendicular vector"
6. **Lerp** = "Move X% of the way from A to B"
7. **Normalize** = "Keep direction, make length = 1"
8. **Quaternion** = Better rotations, less intuitive
9. **Spherical coords** = Latitude + Longitude for 3D

---

**Remember:** Math is a tool, not a goal. Start with simple approaches, then optimize. Working code beats perfect math!
