# Session 01: Essential Foundation

## Learning Objectives

By the end of this session, the developer will understand:
- How to set up a Vite development environment for Three.js with TypeScript
- The three essential components: Scene, Camera, Renderer
- How to create and render a 3D object
- The basics of lighting and why it matters
- How to create an animation loop
- How to handle window resizing
- Basic TypeScript type annotations for Three.js

## What We're Building

A minimal but complete 3D scene featuring:
- A rotating cube in the center
- Two types of lighting (ambient and directional)
- Responsive canvas that adapts to window size
- Smooth 60fps animation

This is the "Hello World" of Three.js - simple enough to understand completely, but containing all the fundamental building blocks for more complex scenes.

## Why This Foundation Matters

Every Three.js application, no matter how complex, has these same core elements:
1. **Scene** - The container for all 3D objects
2. **Camera** - Your viewport into the 3D world
3. **Renderer** - Draws the scene to the screen
4. **Animation Loop** - Updates and renders each frame

Master these, and you can build anything.

---

## TypeScript Basics You Need to Know

Don't worry - you only need to understand a few TypeScript concepts for this session:

### Type Annotations
TypeScript lets you specify what type a variable is:
```typescript
let count: number = 5;
let name: string = "cube";
let isVisible: boolean = true;
```

For Three.js objects:
```typescript
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let cube: THREE.Mesh;
```

### Why This Helps
When you type `camera.` in your editor, you'll see all available methods and properties with descriptions. No more guessing or checking documentation!

### You Don't Need to Type Everything
TypeScript is smart and can often infer types:
```typescript
const renderer = new THREE.WebGLRenderer({ antialias: true });
// TypeScript knows renderer is a WebGLRenderer - you don't need to specify
```

**That's it!** For this session, that's all the TypeScript you need. The rest is just regular JavaScript.

---

## Part 1: Project Setup

### Step 1: Initialize Vite Project with TypeScript

Navigate to the session directory in your terminal:
```bash
cd session-01-essential-foundation
```

Initialize a new Vite project using the vanilla TypeScript template:
```bash
npm create vite@latest . -- --template vanilla-ts
```

When prompted, confirm you want to use the current directory.

**What this does:** Vite creates a minimal development environment with:
- Fast hot-reload dev server
- TypeScript support (zero configuration!)
- ES6 module support
- Optimized production builds
- Auto-generated `tsconfig.json` with sensible defaults

### Step 2: Install Dependencies

```bash
npm install
```

This installs Vite, TypeScript, and their dependencies based on the generated `package.json`.

### Step 3: Add Three.js

```bash
npm install three
```

This adds the Three.js library (with TypeScript type definitions included!) to the project.

**Note:** Three.js ships with TypeScript definitions, so you automatically get full IntelliSense for the entire API.

### Step 4: Clean Up Default Files

Vite creates some default files we don't need. Let's start fresh:

1. Open `index.html` and replace its contents with:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Session 01: Essential Foundation</title>
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

**Note:** Vite's TypeScript template uses a `src/` directory by default.

2. Delete the following files (we'll recreate them):
   - `src/main.ts` (we'll rewrite it)
   - `src/style.css`
   - `src/typescript.svg`
   - `src/counter.ts` (if it exists)
   - `src/vite-env.d.ts` (type definitions - we'll keep the auto-generated one)
   - `public/vite.svg`

Actually, keep `src/vite-env.d.ts` - this file enables Vite-specific types.

3. Create a new `src/style.css` with minimal full-screen canvas styling:
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

4. Link the stylesheet in `index.html` by adding to the `<head>`:
```html
<link rel="stylesheet" href="/src/style.css" />
```

### Step 5: Start the Dev Server

```bash
npm run dev
```

This starts Vite's development server. You should see a URL like `http://localhost:5173/` in the terminal. Open it in your browser - you'll see a blank page, which is perfect! We're ready to add Three.js.

**Keep the dev server running.** Vite will automatically reload the page whenever you save changes to your files.

**TypeScript compilation happens automatically** - Vite handles it behind the scenes. You'll see type errors in your terminal if you make mistakes.

---

## Part 2: Building the 3D Scene

Now create a new `src/main.ts` file. We'll build it step by step, explaining each part.

### Step 1: Import Three.js

```typescript
import * as THREE from 'three';
```

**What this does:** Imports the entire Three.js library as a module. All Three.js classes and functions will be available under the `THREE` namespace.

**TypeScript bonus:** Your editor now knows about all Three.js types!

### Step 2: Set Up Scene Variables

```typescript
import * as THREE from 'three';

// Global variables for our scene components
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;

init();
animate();
```

**Notice the type annotations:** `: THREE.PerspectiveCamera`, etc. This tells TypeScript (and your editor) what type each variable is.

**Why globals?** We need these variables accessible in multiple functions (init, animate, resize handler). In later sessions, we'll learn better patterns for organizing this.

**Try this:** Type `camera.` in your editor after the init() call - you'll see autocomplete suggestions!

### Step 3: Create the Init Function

The `init()` function sets up everything before the animation starts:

```typescript
function init(): void {
  // 1. CREATE THE SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // 2. CREATE THE CAMERA
  camera = new THREE.PerspectiveCamera(
    75,                                      // Field of view (degrees)
    window.innerWidth / window.innerHeight,  // Aspect ratio
    0.1,                                     // Near clipping plane
    1000                                     // Far clipping plane
  );
  camera.position.z = 5;

  // 3. CREATE THE CUBE
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff88  // Cyan-green color
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // 4. ADD LIGHTING
  // Ambient light provides base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Directional light simulates sunlight
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // 5. CREATE THE RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 6. HANDLE WINDOW RESIZE
  window.addEventListener('resize', onWindowResize);
}
```

**TypeScript note:** `: void` means the function doesn't return anything. TypeScript will warn you if you try to use a return value.

**Let's break down each part:**

#### The Scene
```typescript
scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
```
- **Scene** is a container for all 3D objects, lights, and cameras
- Background color uses hexadecimal (0x222222 = dark gray)
- Think of Scene as your 3D stage
- **TypeScript tip:** Type `scene.` to see all available properties!

#### The Camera
```typescript
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
```
- **PerspectiveCamera** mimics how human eyes see (objects get smaller with distance)
- **Field of view (75°)**: Wider = more visible but distorted; narrower = zoomed in
- **Aspect ratio**: Must match canvas dimensions to avoid stretching
- **Near (0.1) and far (1000) clipping**: Objects outside this range aren't rendered
- **Position (z=5)**: Moves camera back from origin (0,0,0) so we can see objects at origin
- **TypeScript tip:** Type `camera.position.` to see x, y, z properties with autocomplete!

#### The Cube
```typescript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```
- **Geometry**: Defines the shape (1x1x1 cube)
- **Material**: Defines appearance (color, shininess, texture)
- **MeshStandardMaterial**: Physically-based material that responds to lighting
- **Mesh**: Combines geometry + material into a renderable object
- **scene.add()**: Places the mesh in the scene
- **TypeScript tip:** Hover over `BoxGeometry` to see constructor parameter types!

#### The Lighting
```typescript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
```
- **AmbientLight**: Illuminates all objects equally from all directions (no shadows)
- **DirectionalLight**: Parallel rays like sunlight, creates depth and shadows
- **Intensity (0.5, 0.8)**: Brightness multiplier
- **Position matters** for DirectionalLight - try different values!
- **TypeScript**: Your editor knows `intensity` and `color` are valid properties!

**Why two lights?** Ambient prevents complete darkness in unlit areas. Directional creates dimension and depth. Together they create realistic lighting.

#### The Renderer
```typescript
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```
- **WebGLRenderer**: Uses GPU to draw the scene (fast!)
- **antialias: true**: Smooths jagged edges (slight performance cost, worth it)
- **setPixelRatio**: Handles high-DPI displays (Retina, 4K monitors)
- **setSize**: Sets canvas dimensions
- **appendChild**: Adds the canvas to the HTML body
- **TypeScript**: `renderer.domElement` is typed as `HTMLCanvasElement`!

### Step 4: Create the Animation Loop

```typescript
function animate(): void {
  requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}
```

**How this works:**
- **requestAnimationFrame**: Browser calls this function before next repaint (~60fps)
- Recursively calls itself to create a continuous loop
- **Rotation**: In radians (0.01 rad/frame ≈ 34°/second at 60fps)
- **renderer.render()**: Actually draws the scene from the camera's perspective
- **TypeScript tip:** Type `cube.rotation.` to see x, y, z properties!

**Why not setInterval?** `requestAnimationFrame` synchronizes with the display refresh rate, pauses when tab is hidden, and is more performant.

### Step 5: Handle Window Resize

```typescript
function onWindowResize(): void {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);
}
```

**Why this matters:**
- Without this, resizing the browser would stretch/squash the scene
- **updateProjectionMatrix()** is crucial - camera won't update without it
- This gets called automatically via the event listener in `init()`
- **TypeScript catches typos:** Try typing `updateProjectMatrix()` (wrong) - you'll get an error!

---

## Part 3: Complete Code

Here's the full `src/main.ts` file:

```typescript
import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;

init();
animate();

function init(): void {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Create cube
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // Create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Handle window resize
  window.addEventListener('resize', onWindowResize);
}

function animate(): void {
  requestAnimationFrame(animate);

  // Rotate cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
```

Save this file. Your browser should automatically reload and show a rotating cyan-green cube!

**If you see TypeScript errors in your editor:** They're helpful! Read them carefully - they'll guide you toward fixing issues before you even run the code.

---

## Part 4: Experiments to Try

Now that you have a working scene, experiment to build intuition:

### Experiment 1: Play with Colors
- Change `scene.background` color
- Change the cube's `color` property
- Try different light colors (colored lights create interesting effects!)
- **TypeScript tip:** Try typing an invalid color like `color: "red"` - TypeScript will show you the correct format (number)

### Experiment 2: Adjust Camera
- Change field of view (try 45, 90, 120)
- Move camera position (`camera.position.set(x, y, z)`)
- Try `camera.position.x = 3` to see the cube from the side
- **TypeScript tip:** Use autocomplete to discover `camera.position.set()` vs setting x, y, z individually

### Experiment 3: Rotation Speeds
- Change rotation increment (0.001, 0.05, 0.1)
- Rotate on only one axis (comment out the other)
- Try negative values (reverse rotation)
- Make rotation speeds different (cube.rotation.x and .y different values)

### Experiment 4: Lighting Effects
- Disable ambient light (comment it out) - what happens?
- Disable directional light - what happens?
- Move directional light position
- Change light intensities
- **TypeScript tip:** Type `directionalLight.` to discover other properties like `castShadow`

### Experiment 5: Cube Properties
- Change BoxGeometry dimensions: `BoxGeometry(2, 0.5, 1)`
- Try `material.wireframe = true`
- Add `material.roughness = 0.2` and `material.metalness = 0.8`
- **TypeScript tip:** Type `material.` to see ALL available properties with descriptions!

### Experiment 6: Multiple Objects
Try adding a second shape:
```typescript
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = -2;
scene.add(sphere);
```

**TypeScript benefit:** When you type `new THREE.Sphere` your editor will autocomplete with `SphereGeometry` and show you what parameters it needs!

---

## Part 5: TypeScript Benefits You'll Notice

As you experiment, you'll discover TypeScript helps in several ways:

### 1. API Discovery
Instead of checking documentation, type `object.` and see what's available:
- `camera.` → shows fov, aspect, near, far, position, rotation, etc.
- `material.` → shows color, roughness, metalness, wireframe, etc.
- `scene.` → shows add, remove, children, background, etc.

### 2. Parameter Hints
When you type a function, you see what parameters it expects:
```typescript
new THREE.PerspectiveCamera(
  // TypeScript shows: fov, aspect, near, far
```

### 3. Catch Mistakes Immediately
Common typos that TypeScript catches:
- `camera.updateProjectMatrix()` ❌ → suggests `updateProjectionMatrix()` ✓
- `cube.rotate.x` ❌ → suggests `rotation.x` ✓
- `material.color = "red"` ❌ → shows you need a number (0xff0000) ✓

### 4. Documentation on Hover
Hover over any class or method to see its documentation right in your editor!

---

## Common Issues and Solutions

### Issue: "Black screen, nothing renders"
**Possible causes:**
- Camera is inside the object (move camera back: `camera.position.z = 5`)
- Using MeshBasicMaterial without realizing it doesn't respond to lighting
- No lighting in scene (add lights!)
- Object is outside camera's clipping range

### Issue: "Cube looks flat/wrong"
**Possible causes:**
- Using MeshBasicMaterial instead of MeshStandardMaterial
- Only ambient lighting (no directional light for depth)
- Camera field of view too extreme

### Issue: "Scene stretches when I resize window"
**Solution:** Make sure resize handler is working and calls `camera.updateProjectionMatrix()`

### Issue: "Rotation is too fast/slow"
**Solution:** Adjust rotation increment. Remember it's per-frame, so 60fps means 60 increments/second

### Issue: "TypeScript errors I don't understand"
**Solution:** Read the error carefully - it usually points to the exact problem. Common ones:
- `Property 'x' does not exist` → typo in property name
- `Argument of type 'string' is not assignable to parameter of type 'number'` → use a number instead
- `Cannot find name 'THREE'` → missing import statement

---

## Key Takeaways

1. **Every Three.js app needs**: Scene, Camera, Renderer
2. **MeshStandardMaterial** responds to lights; MeshBasicMaterial doesn't
3. **Lighting is essential** for depth perception
4. **requestAnimationFrame** creates smooth animations
5. **Always handle window resize** properly
6. **Rotations use radians**, not degrees
7. **Camera position matters** - start at z=5 to see objects at origin
8. **TypeScript catches mistakes** before you run the code
9. **IntelliSense is your friend** - explore APIs through autocomplete
10. **Type annotations are optional** but helpful for clarity

---

## What's Next?ambientLight

In the next session, we'll explore:
- Different geometry types (spheres, cylinders, tori)
- More material properties (roughness, metalness, wireframe)
- Positioning and scaling objects
- Building compound objects from multiple shapes
- More TypeScript patterns for organizing code

## Notes Section

Use this space to record your discoveries:

- What color combinations looked interesting?
- What rotation speeds felt right?
- Any "aha" moments with TypeScript IntelliSense?
- Questions for Claude?

---

**Time estimate:** 1-2 hours including experimentation
**Difficulty:** Beginner
**Prerequisites:** Basic JavaScript knowledge (TypeScript knowledge not required!)
