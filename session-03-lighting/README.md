# Session 03: Lighting

## Learning Objectives

By the end of this session, you will understand:
- The characteristics and use cases for PointLight, SpotLight, and HemisphereLight
- How to configure shadows (shadow maps, shadow cameras, quality settings)
- How to use light helpers to visualize and debug lighting setups
- How lighting creates mood, atmosphere, and visual drama in 3D scenes
- Performance implications of different light types and shadow configurations

## What We're Building

A lighting laboratory scene featuring:
- PointLight (omnidirectional, like a lightbulb) with shadows
- SpotLight (cone-shaped, like a flashlight) with visible shadow camera
- HemisphereLight (sky-to-ground gradient, like outdoor ambient)
- Shadow-casting objects and shadow-receiving ground plane
- Light helpers to visualize light positions, directions, and shadow frustums
- Experiments exploring mood, performance, and visual effects

This builds on Session 01's basic lighting (AmbientLight + DirectionalLight) and Session 02's material understanding.

## Why This Matters

Lighting is one of the most powerful tools for creating compelling 3D scenes:
- **Realism**: Proper lighting makes scenes feel grounded and believable
- **Mood**: Warm vs cool, bright vs dark, high vs low contrast all evoke different emotions
- **Focus**: Lighting directs the viewer's attention to important elements
- **Depth**: Shadows and highlights reveal form and spatial relationships
- **Performance**: Understanding lighting costs helps you optimize game performance

In game development, lighting is often the difference between a flat, boring scene and an immersive, atmospheric world.

---

## Part 1: Project Setup

Session 03 uses the same Vite + TypeScript setup as previous sessions.

### Step 1: Initialize Project

Navigate to the session directory:
```bash
cd session-03-lighting
```

Initialize Vite with TypeScript:
```bash
npm create vite@latest . -- --template vanilla-ts
```

Confirm when prompted to use the current directory.

### Step 2: Install Dependencies

```bash
npm install
npm install three
```

### Step 3: Set Up HTML and CSS

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Session 03: Lighting</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Create `src/style.css`:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  font-family: sans-serif;
}

canvas {
  display: block;
}
```

### Step 4: Start Dev Server

```bash
npm run dev
```

Open the localhost URL in your browser. You should see a blank page ready for your lighting experiments!

---

## Part 2: Understanding Light Types

Before coding, let's understand what we're working with.

### Light Types Comparison

**From Previous Sessions:**
- **AmbientLight**: Uniform illumination from all directions
  - No shadows
  - Fills in dark areas
  - Very cheap performance-wise
  - Use for: Base illumination, preventing pure black shadows

- **DirectionalLight**: Parallel rays (like the sun)
  - Has direction but no position falloff
  - Can cast shadows
  - Moderate performance cost with shadows
  - Use for: Sunlight, moonlight, outdoor key lighting

**New Light Types:**

- **PointLight**: Omnidirectional light from a single point
  - Like a lightbulb or candle
  - Intensity falls off with distance
  - Can cast shadows (expensive - needs 6 shadow maps for all directions)
  - Use for: Lamps, torches, explosions, magical effects

- **SpotLight**: Cone-shaped directional light
  - Like a flashlight, stage light, or car headlight
  - Has position, direction, cone angle, and edge softness (penumbra)
  - Can cast shadows (expensive but only one direction)
  - Use for: Flashlights, searchlights, stage lighting, focused dramatic lighting

- **HemisphereLight**: Gradient from sky color to ground color
  - Simulates outdoor ambient lighting (sky + ground reflection)
  - No shadows
  - Very cheap performance
  - Use for: Outdoor scenes, natural-looking ambient light, open environments

### Shadow System Fundamentals

Shadows in Three.js work through **shadow mapping**:

1. **Shadow Camera**: Each shadow-casting light has an invisible camera that renders the scene from the light's perspective
2. **Shadow Map**: A texture that stores depth information from the light's viewpoint
3. **Shadow Comparison**: When rendering the scene normally, Three.js compares each pixel's depth to the shadow map to determine if it's in shadow

**Key shadow properties:**
- `renderer.shadowMap.enabled = true` - Enables shadow rendering globally
- `light.castShadow = true` - Light casts shadows
- `object.castShadow = true` - Object casts shadows
- `object.receiveShadow = true` - Object receives shadows
- `light.shadow.mapSize` - Shadow texture resolution (512, 1024, 2048, etc.)
- `light.shadow.camera` - The invisible camera used for shadow rendering

**Performance note**: Shadows are expensive! Each shadow-casting light requires additional render passes. Typical games use 1-3 shadow-casting lights maximum.

### Light Helpers

Helpers visualize what lights are doing:

- **PointLightHelper**: Shows a small wireframe sphere at the light's position
- **SpotLightHelper**: Shows the cone shape and direction of the spotlight
- **DirectionalLightHelper**: Shows the light direction with a line and plane
- **HemisphereLightHelper**: Shows sky and ground colors with a double-sided mesh
- **CameraHelper**: Shows the frustum of any camera, including shadow cameras

**Helpers are essential for debugging!** They let you see why shadows are cut off, where lights are pointing, and how far lights reach.

---

## Part 3: Building the Lighting Laboratory

Now let's build! Create `src/main.ts` and we'll add code step by step.

### Step 1: Basic Scene Setup with Shadows

Start with the familiar scene setup, but enable shadows:

```typescript
import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

// Objects for animation
let box: THREE.Mesh;
let sphere: THREE.Mesh;

init();
animate();

function init(): void {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a); // Very dark background

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(8, 6, 8);
  camera.lookAt(0, 0, 0);

  // Create renderer with shadows enabled
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadows!
  document.body.appendChild(renderer.domElement);

  // Create ground plane to receive shadows
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x404040,
    roughness: 0.8,
    metalness: 0.2
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // Rotate to horizontal
  ground.receiveShadow = true; // Ground receives shadows
  scene.add(ground);

  // Create box that casts shadows
  const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
  const boxMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    roughness: 0.5,
    metalness: 0.5
  });
  box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(-3, 1, 0);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);

  // Create sphere that casts shadows
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    roughness: 0.3,
    metalness: 0.7
  });
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(3, 1, 0);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  // Add a very dim ambient light (just enough to see unlit areas)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
}

function animate(): void {
  requestAnimationFrame(animate);

  // Gentle rotation
  box.rotation.y += 0.005;
  sphere.rotation.y += 0.005;

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
```

**What's new:**
- `renderer.shadowMap.enabled = true` - Enables shadow rendering
- Ground plane with `receiveShadow = true`
- Objects with both `castShadow` and `receiveShadow` set to true
- Very dim AmbientLight (0.1) so you can see the effect of our new lights

Save and check your browser. You should see a dark scene with a box and sphere, but no dramatic shadows yet.

### Step 2: Add PointLight with Shadows

Add this after the ambient light in `init()`:

```typescript
  // PointLight - omnidirectional like a lightbulb
  const pointLight = new THREE.PointLight(0xffffff, 100, 50);
  pointLight.position.set(0, 5, 0); // Above the scene
  pointLight.castShadow = true;

  // Configure shadow quality
  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 0.5;
  pointLight.shadow.camera.far = 50;

  scene.add(pointLight);

  // Add helper to visualize the light
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  scene.add(pointLightHelper);
```

**What this does:**
- Creates a white PointLight with intensity 100, distance 50
- Positions it above the scene at (0, 5, 0)
- Enables shadow casting
- Sets shadow map resolution to 1024×1024
- Configures shadow camera near/far clipping
- Adds a helper sphere so you can see where the light is

**PointLight parameters:**
- `color` - Light color (hex)
- `intensity` - Brightness (1 = standard, higher = brighter)
- `distance` - Maximum range (0 = infinite, but performance cost)
- `decay` - How quickly light fades (default 2, physically accurate)

Save and observe: You should now see your objects lit from above with shadows on the ground!

### Step 3: Add SpotLight with Shadow Camera Visualization

Add this after the PointLight:

```typescript
  // SpotLight - cone-shaped like a flashlight
  const spotLight = new THREE.SpotLight(0xffaa55, 200);
  spotLight.position.set(6, 8, 4);
  spotLight.angle = Math.PI / 6; // 30-degree cone
  spotLight.penumbra = 0.2; // Soft edge (0-1, where 1 = very soft)
  spotLight.decay = 2;
  spotLight.distance = 30;
  spotLight.castShadow = true;

  // Configure shadow quality
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 20;

  scene.add(spotLight);
  scene.add(spotLight.target); // SpotLight needs a target!

  // Add helper to visualize the cone
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  // Add shadow camera helper to see the shadow frustum
  const shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(shadowCameraHelper);
```

**What this does:**
- Creates an orange SpotLight (0xffaa55) pointing at the origin
- `angle` controls the cone width (smaller = tighter beam)
- `penumbra` controls edge softness (0 = hard edge, 1 = very soft)
- Shadow camera helper shows exactly what the shadow camera sees

**Important**: SpotLights point at their `target` object. By default, the target is at (0,0,0), but you can move it:
```typescript
spotLight.target.position.set(3, 0, 0); // Point at the sphere
```

To update helpers in the animation loop, add this near the end of `animate()` (before `renderer.render()`):

```typescript
  // Update helpers (needed when lights or targets move)
  spotLightHelper.update();
  shadowCameraHelper.update();
```

Save and check: You should see an orange cone of light with a wireframe showing the shadow camera frustum!

### Step 4: Add HemisphereLight for Outdoor Ambiance

Add this after the SpotLight:

```typescript
  // HemisphereLight - sky and ground colors
  const hemiLight = new THREE.HemisphereLight(
    0x87ceeb, // Sky color (sky blue)
    0x5c4033, // Ground color (earth brown)
    0.3       // Intensity
  );
  scene.add(hemiLight);

  // Optional: add helper to visualize
  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 1);
  scene.add(hemiLightHelper);
```

**What this does:**
- Creates a gradient light from sky blue (top) to earth brown (bottom)
- Simulates natural outdoor lighting (sky + ground reflection)
- No shadows, very cheap performance
- Adds subtle color variation to your scene

**Use case**: HemisphereLight is perfect for outdoor scenes. The top color represents the sky, the bottom represents reflected light from the ground.

Save and observe the subtle color shift between the top and bottom of your objects!

### Complete Setup

At this point, your scene should have:
- ✓ Very dim AmbientLight (base illumination)
- ✓ PointLight with shadows (main light from above)
- ✓ SpotLight with shadows (dramatic accent from the side)
- ✓ HemisphereLight (subtle outdoor ambient)
- ✓ Helpers showing where lights are and what they're doing

---

## Part 4: Experiments to Try

Now for the fun part! Try these experiments to build deep intuition about lighting.

### Experiment 1: Shadow Map Resolution

**Goal**: Understand the quality vs performance trade-off of shadow maps.

Modify the PointLight's shadow map size:

```typescript
// Try each of these:
pointLight.shadow.mapSize.width = 256;   // Low quality, fast
pointLight.shadow.mapSize.height = 256;

pointLight.shadow.mapSize.width = 512;   // Default
pointLight.shadow.mapSize.height = 512;

pointLight.shadow.mapSize.width = 1024;  // Good quality
pointLight.shadow.mapSize.height = 1024;

pointLight.shadow.mapSize.width = 2048;  // High quality, slower
pointLight.shadow.mapSize.height = 2048;
```

**Observe:**
- Low resolution (256): Blocky, pixelated shadow edges
- Medium (512-1024): Smooth enough for most games
- High (2048): Very sharp, but uses 4× the memory of 1024

**Question**: At what resolution do you stop noticing improvements? This is your quality/performance sweet spot.

### Experiment 2: Shadow Camera Frustum Debugging

**Goal**: Understand why shadows sometimes cut off or don't appear.

The `CameraHelper` shows the shadow camera's view frustum. Shadows only render for objects within this frustum.

Try these modifications:

```typescript
// Make shadow camera frustum very small
spotLight.shadow.camera.near = 5;
spotLight.shadow.camera.far = 10;
// Move objects outside this range - their shadows disappear!

// Make it very large
spotLight.shadow.camera.near = 0.1;
spotLight.shadow.camera.far = 100;
// Shadows appear but might be lower quality (frustum covers more area)
```

**Experiment**:
1. Set `near = 5` and `far = 10`
2. Move the sphere far from the light (`sphere.position.z = -15`)
3. Observe: The sphere is lit but casts no shadow (it's outside the shadow camera frustum)

**Key insight**: Shadow cameras need to encompass all shadow-casting objects. Tighter frustums = better shadow quality. Use `CameraHelper` to debug!

### Experiment 3: PointLight Distance Falloff

**Goal**: Control how far a PointLight reaches and how quickly it fades.

Modify the PointLight:

```typescript
// Infinite distance (expensive!)
const pointLight = new THREE.PointLight(0xffffff, 100, 0);

// Short distance (only lights nearby objects)
const pointLight = new THREE.PointLight(0xffffff, 100, 10);

// Adjust decay rate (how quickly light fades)
pointLight.decay = 0; // No falloff (unnatural but sometimes useful)
pointLight.decay = 1; // Linear falloff
pointLight.decay = 2; // Physically accurate (inverse square law)
```

**Experiment**:
1. Set `distance = 10` and `decay = 2`
2. Move objects far from the light
3. Observe how quickly they become dark

**Performance tip**: Smaller `distance` values improve performance because the renderer knows it can skip distant pixels.

### Experiment 4: Flashlight Effect

**Goal**: Create a dramatic spotlight effect like a flashlight or searchlight.

Modify the SpotLight for a tight, focused beam:

```typescript
spotLight.angle = Math.PI / 12;  // Very narrow (15 degrees)
spotLight.penumbra = 0.1;        // Sharp edge
spotLight.intensity = 300;       // Very bright
spotLight.color.set(0xffffee);   // Slightly warm white

// Point it at the sphere
spotLight.target.position.copy(sphere.position);
```

**Try animating it** in the `animate()` function:

```typescript
// Sweep the flashlight back and forth
const time = Date.now() * 0.001;
spotLight.target.position.x = Math.sin(time) * 5;
```

**Observe**: The tight cone creates dramatic lighting with sharp shadow edges - perfect for stealth games, horror lighting, or searchlights.

### Experiment 5: Outdoor Scene Lighting (Time of Day)

**Goal**: Create realistic outdoor lighting using HemisphereLight + DirectionalLight.

Comment out the PointLight and SpotLight, then add:

```typescript
// Daytime outdoor scene
const hemiLight = new THREE.HemisphereLight(
  0x87ceeb, // Sky blue
  0x8b7355, // Earth brown
  0.6
);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffffee, 1.0);
sunLight.position.set(5, 10, 7); // High noon
sunLight.castShadow = true;
scene.add(sunLight);
```

**Now try sunset**:

```typescript
const hemiLight = new THREE.HemisphereLight(
  0xff7e5f, // Orange/red sky
  0x2c1810, // Dark warm ground
  0.5
);

const sunLight = new THREE.DirectionalLight(0xff8844, 0.8);
sunLight.position.set(10, 2, 0); // Low on horizon
```

**Observe**: How color and angle create completely different moods. Outdoor scenes typically use HemisphereLight (ambient) + DirectionalLight (sun/moon).

### Experiment 6: Moody Interior Lighting

**Goal**: Create atmospheric interior lighting using minimal light sources.

Remove all lights and create a dark, moody scene:

```typescript
// Very dim ambient (just enough to see unlit areas)
const ambientLight = new THREE.AmbientLight(0x111111, 0.5);
scene.add(ambientLight);

// Single warm overhead light
const light1 = new THREE.PointLight(0xffaa55, 80, 30);
light1.position.set(0, 4, 0);
light1.castShadow = true;
scene.add(light1);

// Optional: add a second dim light for fill
const light2 = new THREE.PointLight(0x5588ff, 40, 20);
light2.position.set(-5, 2, 3);
scene.add(light2);
```

**Observe**: Low-key lighting with deep shadows creates mystery and drama. Perfect for dungeons, horror games, or intimate spaces.

**Try**: Different colored lights to create different moods (warm = cozy, cool = clinical/eerie).

### Experiment 7: Colored Shadow Mixing

**Goal**: Create artistic, stylized lighting with colored shadows.

Add multiple PointLights with different colors:

```typescript
const redLight = new THREE.PointLight(0xff0000, 100, 30);
redLight.position.set(-4, 5, 0);
redLight.castShadow = true;
scene.add(redLight);

const blueLight = new THREE.PointLight(0x0000ff, 100, 30);
blueLight.position.set(4, 5, 0);
blueLight.castShadow = true;
scene.add(blueLight);

const greenLight = new THREE.PointLight(0x00ff00, 100, 30);
greenLight.position.set(0, 5, 4);
greenLight.castShadow = true;
scene.add(greenLight);
```

**Observe**: Where light cones overlap, colors mix additively (red + blue = magenta, blue + green = cyan, red + green = yellow). Shadows in one light are filled with the color from other lights!

**Use case**: Stylized games, music visualizers, psychedelic effects.

### Experiment 8: Animated Stage Lighting

**Goal**: Create dynamic concert/stage lighting effects.

Create multiple SpotLights and animate them:

```typescript
// In init():
const spot1 = new THREE.SpotLight(0xff0000, 200);
spot1.position.set(-5, 8, 0);
spot1.angle = Math.PI / 8;
spot1.penumbra = 0.3;
scene.add(spot1);
scene.add(spot1.target);

const spot2 = new THREE.SpotLight(0x00ff00, 200);
spot2.position.set(5, 8, 0);
spot2.angle = Math.PI / 8;
spot2.penumbra = 0.3;
scene.add(spot2);
scene.add(spot2.target);

const spot3 = new THREE.SpotLight(0x0000ff, 200);
spot3.position.set(0, 8, 5);
spot3.angle = Math.PI / 8;
spot3.penumbra = 0.3;
scene.add(spot3);
scene.add(spot3.target);

// In animate():
const time = Date.now() * 0.001;
spot1.target.position.x = Math.cos(time) * 3;
spot2.target.position.z = Math.sin(time) * 3;
spot3.intensity = 100 + Math.sin(time * 2) * 100; // Pulsing
```

**Observe**: Dynamic, colorful lighting creates energy and movement. Try different animation patterns!

### Experiment 9: Performance Testing with Shadow Count

**Goal**: Understand the performance cost of shadows.

Open your browser's DevTools and enable the Performance Monitor (Chrome: Cmd/Ctrl+Shift+P → "Show Performance Monitor").

Start with all lights casting shadows, then progressively disable them:

```typescript
// All lights cast shadows (slowest)
pointLight.castShadow = true;
spotLight.castShadow = true;

// Only spotlight casts shadows (faster)
pointLight.castShadow = false;
spotLight.castShadow = true;

// No shadows (fastest)
pointLight.castShadow = false;
spotLight.castShadow = false;
```

**Observe**: FPS (frames per second) in the Performance Monitor. Each shadow-casting light significantly impacts performance.

**Game development rule**: Use 1-3 shadow-casting lights maximum. Use non-shadow lights for fill and accent.

---

## Part 5: Common Issues and Solutions

### Issue: Shadows not appearing at all

**Checklist:**
- ✓ Is `renderer.shadowMap.enabled = true`?
- ✓ Does the light have `castShadow = true`?
- ✓ Does the object have `castShadow = true`?
- ✓ Does the receiving surface have `receiveShadow = true`?
- ✓ Is the shadow camera frustum encompassing the objects? (Use `CameraHelper`)

### Issue: Shadows are cut off or incomplete

**Possible causes:**
- Shadow camera frustum is too small
- Objects are outside the near/far range

**Solution:**
- Add a `CameraHelper` to visualize the shadow camera
- Adjust `light.shadow.camera.near` and `.far`
- For DirectionalLight, adjust `shadow.camera.left/right/top/bottom`
- Make the frustum tight around your scene for best quality

### Issue: Shadows are blocky or pixelated

**Possible causes:**
- Shadow map resolution is too low
- Shadow camera frustum is too large (covering too much area)

**Solution:**
- Increase `light.shadow.mapSize.width/height` (512 → 1024 → 2048)
- Tighten shadow camera frustum to cover only necessary area
- Balance quality vs performance

### Issue: SpotLight pointing the wrong direction

**Possible causes:**
- SpotLight always points at its `.target` object
- Forgetting to add target to scene
- Target is at the wrong position

**Solution:**
```typescript
// Move the target
spotLight.target.position.set(x, y, z);

// Make sure target is in the scene
scene.add(spotLight.target);

// Update helper in animate loop
spotLightHelper.update();
```

### Issue: PointLight shadows look wrong or missing

**Note**: PointLight shadows are expensive because they require rendering the scene 6 times (once for each direction of a cube map).

**Solution**: Consider using SpotLight or DirectionalLight instead for performance. If you need PointLight shadows, limit to 1-2 maximum.

### Issue: Scene is too dark or too bright

**Solution:**
- Adjust light intensities
- Add a dim AmbientLight (0.1-0.3) to prevent pure black areas
- Balance multiple lights - remove some if it's too bright
- Use HDR tone mapping: `renderer.toneMapping = THREE.ACESFilmicToneMapping`

### Issue: Lights don't affect MeshBasicMaterial

**This is expected!** MeshBasicMaterial ignores lights. Use MeshStandardMaterial or MeshPhongMaterial for lit surfaces.

---

## Part 6: Key Takeaways

1. **Different lights serve different purposes**:
   - PointLight = omnidirectional from a point (lamps, torches)
   - SpotLight = focused cone (flashlights, stage lights, car headlights)
   - HemisphereLight = outdoor ambient (sky + ground reflection)

2. **Shadows are expensive** - use sparingly:
   - Typical games use 1-3 shadow-casting lights maximum
   - PointLight shadows are most expensive (6 shadow maps)
   - SpotLight/DirectionalLight shadows are cheaper (1 shadow map)

3. **Shadow cameras define shadow boundaries**:
   - Use `CameraHelper` to visualize and debug
   - Tight frustums = better shadow quality
   - Objects outside frustum won't cast shadows

4. **Light helpers are essential for debugging**:
   - Always use helpers during development
   - Remove or disable them in production
   - Helpers show position, direction, range, and frustums

5. **Lighting creates mood and atmosphere**:
   - Warm colors (orange, yellow) = cozy, inviting, energetic
   - Cool colors (blue, cyan) = clinical, eerie, calm
   - High contrast = dramatic, tense
   - Low contrast = soft, peaceful

6. **Intensity and color work together**:
   - Higher intensity ≠ always better
   - Subtle, balanced lighting often looks more professional
   - Multiple dim lights can be more interesting than one bright light

7. **Real-world lighting principles apply**:
   - Three-point lighting (key, fill, rim)
   - Outdoor = HemisphereLight + DirectionalLight
   - Indoor = PointLights + dim AmbientLight
   - Dramatic = single source + deep shadows

8. **Performance considerations**:
   - Shadows have the biggest performance cost
   - Lights with `distance` parameter perform better (culling)
   - Shadow map resolution directly impacts memory and performance

9. **TypeScript helps immensely**:
   - Autocomplete shows all light properties
   - Type checking prevents mistakes
   - Hover over parameters to see ranges and meanings

10. **Experiment freely to build intuition**:
    - Save presets that look good
    - Try extreme values to understand boundaries
    - Combine techniques from different experiments

---

## What's Next?

After mastering lighting, you have several paths forward:

**Continue Phase 1:**
- **Session 04: Transforms and Object3D Hierarchy** - Build compound objects from primitives using parent-child relationships
- **Session 05: The Animation Loop** - Time-based animations, delta time, frame-independent movement

**Jump to Phase 2:**
- **Session 06: Keyboard Input** - Capture keyboard events and control objects
- **Session 07: Camera Movement Patterns** - First-person, third-person, orbit controls

**The curriculum is flexible!** Choose based on what excites you most. Each session builds transferable skills.

---

## Notes Section

Use this space to record your discoveries:

- Which lighting setup looked most dramatic?
- What shadow map resolution worked best for your scene?
- How did colored lights change the mood?
- Which light type did you find most useful?
- Any "aha" moments about shadows or shadow cameras?
- Ideas for lighting setups you want to try in future projects?
- Questions for Claude?

---

**Time estimate:** 1 hour including experimentation
**Difficulty:** Beginner-Intermediate
**Prerequisites:** Session 01 (Scene/Camera/Renderer), Session 02 (Materials) recommended

**Performance note**: Shadows and multiple lights can significantly impact frame rate. Use the browser's Performance Monitor to observe real-time FPS and optimize accordingly.
