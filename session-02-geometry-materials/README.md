# Session 02: Geometry and Materials

## Learning Objectives

By the end of this session, you will understand:
- Different built-in geometry types and their parameters
- How segment counts affect surface smoothness
- Material types and when to use each
- MeshStandardMaterial properties: roughness, metalness, emissive, wireframe
- The difference between materials that respond to lighting vs those that don't
- How to position multiple objects in 3D space
- Building a visually diverse scene with multiple shapes and materials

## What We're Building

A "geometry showcase" scene featuring:
- 4-5 different geometric primitives (sphere, box, cylinder, torus knot, icosahedron)
- Various materials demonstrating different properties
- Wireframe versions to visualize geometry structure
- Objects with different finishes (shiny metal, matte plastic, glowing emissive)
- Proper spacing and positioning for visual clarity

This builds on Session 01's foundation by adding visual complexity and material understanding.

## Why This Matters

Understanding geometry and materials is fundamental to creating any 3D scene:
- **Geometry** defines shape and structure
- **Materials** define appearance and how objects interact with light
- **Material properties** create realism (metal vs plastic, rough vs smooth)
- **Multiple objects** teach spatial reasoning and scene composition

These concepts are building blocks for everything from simple visualizations to complex game worlds.

---

## Part 1: Project Setup

Session 02 uses the same Vite + TypeScript setup as Session 01. If you're comfortable with the workflow, feel free to speed through this section.

### Step 1: Initialize Project

Navigate to the session directory:
```bash
cd session-02-geometry-materials
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
    <title>Session 02: Geometry and Materials</title>
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

Open the localhost URL in your browser. You should see a blank page.

**Neovim tip:** With the dev server running in a terminal split, Vite will auto-reload on file save. No need to manually refresh!

---

## Part 2: Understanding Geometry Types

Before we code, let's understand what we'll be creating.

### Built-in Geometries Overview

Three.js provides many built-in geometry types. Here are the most useful for this session:

**BoxGeometry** - Rectangular prism
- Parameters: `width`, `height`, `depth`
- Great for: Buildings, containers, simple objects

**SphereGeometry** - Sphere
- Parameters: `radius`, `widthSegments`, `heightSegments`
- Segments control smoothness (8 = faceted, 32 = smooth)
- Great for: Planets, balls, organic shapes

**CylinderGeometry** - Cylinder (or cone if radii differ)
- Parameters: `radiusTop`, `radiusBottom`, `height`
- Set `radiusTop` smaller than `radiusBottom` for cone shape
- Great for: Pillars, trees, rockets

**TorusKnotGeometry** - Complex twisted torus
- Parameters: `radius`, `tube`, `tubularSegments`, `radialSegments`
- Creates interesting mathematical knots
- Great for: Decorative objects, demonstrating complex geometry

**IcosahedronGeometry** - 20-sided polyhedron
- Parameters: `radius`, `detail`
- `detail` level subdivides faces (0 = basic, higher = smoother)
- Great for: Dice, geometric art, low-poly spheres

### Segment Counts Matter

Most geometries have segment parameters that control how many triangles make up the shape:

- **Low segments (8-12)**: Visible facets, "low-poly" aesthetic, better performance
- **High segments (32-64)**: Smooth curves, realistic appearance, more triangles

**Rule of thumb**: Use 32 segments for smooth curved surfaces in demos.

---

## Part 3: Understanding Materials

Materials define how geometry appears when rendered.

### Material Types

**MeshBasicMaterial**
- Does NOT respond to lights
- Always appears at full brightness
- Good for: Wireframes, UI elements, debugging, glowing objects
- Properties: `color`, `wireframe`

**MeshStandardMaterial** (Physically Based Rendering)
- Responds to lights realistically
- Modern, physically-accurate lighting model
- Good for: Almost everything in modern 3D applications
- Properties: `color`, `roughness`, `metalness`, `emissive`, `wireframe`

**MeshPhongMaterial** (Older lighting model)
- Responds to lights with specular highlights
- Less physically accurate than Standard
- Good for: Shiny plastic, specific artistic effects
- Properties: `color`, `shininess`, `specular`

**For this session, we'll focus on MeshBasicMaterial and MeshStandardMaterial.**

### MeshStandardMaterial Properties Deep Dive

**color** (number, hex format)
- Base color of the material
- Example: `0xff0000` (red), `0x00ff00` (green), `0x0000ff` (blue)

**roughness** (0.0 to 1.0)
- Controls surface reflectivity
- `0.0` = mirror-like, sharp reflections
- `0.5` = semi-glossy
- `1.0` = completely matte, diffuse

**metalness** (0.0 to 1.0)
- Defines metallic vs non-metallic behavior
- `0.0` = dielectric (plastic, wood, stone)
- `1.0` = full metal (gold, steel, chrome)
- Rarely use values in between

**emissive** (color) and **emissiveIntensity** (number)
- Makes material "glow" with self-illumination
- Does NOT cast light on other objects
- `emissive`: Color of the glow (e.g., `0xff0000` for red glow)
- `emissiveIntensity`: Brightness (typically 0-1, but can go higher)

**wireframe** (boolean)
- `true`: Shows geometry structure as lines
- `false`: Normal solid rendering
- Great for understanding how geometry is constructed

---

## Part 4: Building the Geometry Showcase

Now let's build! Create `src/main.ts` and we'll add code step by step.

### Step 1: Basic Scene Setup

Start with the familiar setup from Session 01:

```typescript
import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

// Array to hold all our geometry meshes for animation
let objects: THREE.Mesh[] = [];

init();
animate();

function init(): void {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 8);
  camera.lookAt(0, 0, 0);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
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

  // Rotate all objects
  objects.forEach(obj => {
    obj.rotation.x += 0.005;
    obj.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
```

**New elements:**
- `objects` array to track all meshes for animation
- `camera.lookAt(0, 0, 0)` to point camera at origin
- `camera.position.set(0, 2, 8)` gives a slightly elevated view

**Neovim LSP tip:** After typing `camera.`, your LSP should suggest `lookAt`, `position`, etc. Use `<Tab>` or `<C-n>` to accept suggestions.

### Step 2: Add Geometry Creation Functions

Add these helper functions before `init()`:

```typescript
function createSphere(x: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.8, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    metalness: 1.0,
    roughness: 0.2  // Shiny metal
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  return mesh;
}

function createBox(x: number): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    metalness: 0.0,
    roughness: 0.8  // Matte plastic
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  return mesh;
}

function createCylinder(x: number): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(0.6, 0.6, 1.5);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffe66d,
    metalness: 0.5,
    roughness: 0.5  // Semi-glossy
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  return mesh;
}

function createTorusKnot(x: number): THREE.Mesh {
  const geometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0xa8e6cf,
    metalness: 0.8,
    roughness: 0.3,
    emissive: 0xa8e6cf,
    emissiveIntensity: 0.2  // Subtle glow
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  return mesh;
}

function createIcosahedron(x: number): THREE.Mesh {
  const geometry = new THREE.IcosahedronGeometry(0.8, 0);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff99c8,
    metalness: 0.0,
    roughness: 1.0,
    wireframe: true  // Wireframe mode!
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  return mesh;
}
```

**What's happening:**
- Each function creates a different geometry type
- Each has unique material properties demonstrating different effects
- The `x` parameter positions objects along the X-axis
- **Notice the variety**: shiny metal, matte plastic, glowing, wireframe

**Neovim LSP tip:** Hover over `SphereGeometry` (usually `K` in normal mode) to see parameter descriptions.

### Step 3: Instantiate Objects in Scene

Add these lines inside the `init()` function, after the lighting setup and before the renderer creation:

```typescript
  // Create and add geometry objects
  objects.push(createSphere(-4));
  objects.push(createBox(-2));
  objects.push(createCylinder(0));
  objects.push(createTorusKnot(2));
  objects.push(createIcosahedron(4));

  // Add all objects to scene
  objects.forEach(obj => scene.add(obj));
```

**What this does:**
- Creates 5 different geometry objects
- Spaces them 2 units apart along X-axis (-4, -2, 0, 2, 4)
- Adds each to the `objects` array for animation
- Adds each to the scene for rendering

### Step 4: Test It!

Save `src/main.ts`. Your browser should auto-reload and show five rotating objects with different shapes and material properties!

**Expected result:**
- Red shiny metallic sphere on the left
- Cyan matte plastic box
- Yellow semi-glossy cylinder in center
- Green glowing torus knot
- Pink wireframe icosahedron on the right

**Neovim workflow tip:** Keep your terminal split visible to catch any TypeScript errors Vite reports.

---

## Part 5: Experiments to Try

Now that you have a working scene, experiment to build intuition!

### Experiment 1: Roughness and Metalness

Pick one object and try different combinations:

```typescript
// In createSphere(), try:
metalness: 0.0, roughness: 0.0  // Smooth plastic
metalness: 0.0, roughness: 1.0  // Matte plastic
metalness: 1.0, roughness: 0.0  // Mirror chrome
metalness: 1.0, roughness: 1.0  // Brushed metal
```

**Observe:** How does the lighting interact differently with each combination?

### Experiment 2: Segment Counts

Modify the sphere's segments:

```typescript
// In createSphere(), try:
new THREE.SphereGeometry(0.8, 8, 8)   // Low-poly faceted
new THREE.SphereGeometry(0.8, 16, 16) // Medium detail
new THREE.SphereGeometry(0.8, 64, 64) // Very smooth (more triangles)
```

**Observe:** At what point does adding more segments become imperceptible?

### Experiment 3: Emissive Glow

Make objects glow:

```typescript
// Try adding to any material:
emissive: 0xff0000,        // Red glow
emissiveIntensity: 0.5     // Medium brightness

// Or make it intense:
emissive: 0x00ffff,        // Cyan glow
emissiveIntensity: 2.0     // Very bright!
```

**Remember:** Emissive makes objects glow but doesn't cast light on other objects.

### Experiment 4: Wireframe Exploration

Toggle wireframe on different geometries:

```typescript
wireframe: true   // See the geometry structure
wireframe: false  // Normal solid rendering
```

**Try:** Set the torus knot to wireframe to see its complex structure!

### Experiment 5: Geometry Parameters

Experiment with different geometry parameters:

**Cylinder as a cone:**
```typescript
new THREE.CylinderGeometry(0.1, 0.8, 1.5)  // Narrow top, wide bottom
```

**Torus knot variations:**
```typescript
new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16)  // Original
new THREE.TorusKnotGeometry(0.5, 0.3, 50, 8)     // Thicker tube, lower detail
new THREE.TorusKnotGeometry(0.7, 0.1, 150, 24)   // Larger, thinner, more detail
```

**Icosahedron subdivision:**
```typescript
new THREE.IcosahedronGeometry(0.8, 0)  // Basic 20 faces
new THREE.IcosahedronGeometry(0.8, 1)  // Subdivided once (smoother)
new THREE.IcosahedronGeometry(0.8, 2)  // Subdivided twice (very smooth)
```

### Experiment 6: MeshBasicMaterial Comparison

Create a version of one object using MeshBasicMaterial to see the difference:

```typescript
function createBasicSphere(x: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.8, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff6b6b
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  return mesh;
}
```

**Observe:** The MeshBasicMaterial sphere appears flat because it doesn't respond to lighting. No depth, no shading.

### Experiment 7: Different Positioning

Try arranging objects in different patterns:

**Circle arrangement:**
```typescript
const radius = 5;
const angle = (Math.PI * 2) / objects.length;
objects.forEach((obj, i) => {
  obj.position.x = Math.cos(angle * i) * radius;
  obj.position.z = Math.sin(angle * i) * radius;
});
```

**Vertical stack:**
```typescript
objects.forEach((obj, i) => {
  obj.position.x = 0;
  obj.position.y = i * 2 - 4;  // Vertical spacing
});
```

### Experiment 8: Rotation Variations

Give each object different rotation speeds:

```typescript
// In animate(), instead of uniform rotation:
objects.forEach((obj, index) => {
  obj.rotation.x += 0.005 * (index + 1);
  obj.rotation.y += 0.01 * (index + 1);
});
```

### Experiment 9: Add More Geometries

Three.js has many more built-in geometries. Try adding:

**Cone:**
```typescript
const coneGeometry = new THREE.ConeGeometry(0.8, 1.5, 32);
```

**Torus:**
```typescript
const torusGeometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
```

**Capsule:**
```typescript
const capsuleGeometry = new THREE.CapsuleGeometry(0.5, 1.0, 8, 16);
```

**Tetrahedron:**
```typescript
const tetrahedronGeometry = new THREE.TetrahedronGeometry(0.8);
```

**Neovim LSP tip:** Type `new THREE.` and browse the autocomplete suggestions to discover more geometry types!

---

## Part 6: Advanced Material Exploration

### Creating Material Variations

Try creating multiple versions of the same geometry with different materials:

```typescript
function createMaterialShowcase(): void {
  const geometry = new THREE.SphereGeometry(0.6, 32, 32);

  // Matte non-metal
  const matte = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    metalness: 0.0,
    roughness: 1.0
  }));
  matte.position.set(-3, 1, 0);
  scene.add(matte);

  // Glossy non-metal
  const glossy = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    metalness: 0.0,
    roughness: 0.2
  }));
  glossy.position.set(-1, 1, 0);
  scene.add(glossy);

  // Brushed metal
  const brushedMetal = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    metalness: 1.0,
    roughness: 0.6
  }));
  brushedMetal.position.set(1, 1, 0);
  scene.add(brushedMetal);

  // Polished metal
  const polishedMetal = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    color: 0x4ecdc4,
    metalness: 1.0,
    roughness: 0.1
  }));
  polishedMetal.position.set(3, 1, 0);
  scene.add(polishedMetal);
}

// Call this in init() to see the material comparison
```

**What to observe:** How the same color and geometry look completely different based on metalness and roughness.

---

## Part 7: Common Issues and Solutions

### Issue: "Objects look completely black"

**Possible causes:**
- Using MeshStandardMaterial but forgot to add lights
- Lights are too dim (increase intensity)
- Camera is too far away

**Solution:** Check that you have both AmbientLight and DirectionalLight in your scene.

### Issue: "All materials look the same"

**Possible causes:**
- Lighting is too bright (washing out differences)
- Using MeshBasicMaterial (doesn't respond to roughness/metalness)
- Colors are too similar

**Solution:** Reduce ambient light intensity to 0.3-0.5, use contrasting colors, ensure you're using MeshStandardMaterial.

### Issue: "Wireframe shows nothing / looks weird"

**Possible causes:**
- Using wireframe with MeshStandardMaterial in a dark scene
- Wireframe color is same as background

**Solution:** Use MeshBasicMaterial for wireframes, or use a bright emissive color with MeshStandardMaterial.

### Issue: "Sphere looks like a disco ball (faceted)"

**Possible causes:**
- Too few segments (like 8, 8)
- Might actually be intentional for low-poly aesthetic!

**Solution:** Increase segments to 32, 32 for smooth spheres, or embrace the faceted look.

### Issue: "Objects are overlapping / can't see all of them"

**Possible causes:**
- Positioning values are too close together
- Camera is too close or badly positioned

**Solution:**
- Increase spacing between objects (use larger X values: -6, -3, 0, 3, 6)
- Move camera back: `camera.position.set(0, 2, 12)`
- Use `camera.lookAt(0, 0, 0)` to ensure camera points at origin

### Issue: "Emissive objects don't light up other objects"

**This is expected behavior!**
- `emissive` makes materials glow visually but doesn't emit actual light
- To light other objects, you need actual light sources (DirectionalLight, PointLight, etc.)

---

## Key Takeaways

1. **Geometry defines shape**, materials define appearance
2. **Segment counts** control smoothness vs performance trade-offs
3. **MeshStandardMaterial is your workhorse** - physically accurate and versatile
4. **MeshBasicMaterial ignores lights** - use for wireframes, UI, or intentional flat appearance
5. **Roughness** (0 = shiny, 1 = matte) and **metalness** (0 = non-metal, 1 = metal) are powerful tools
6. **Emissive makes objects glow** but doesn't cast light on others
7. **Wireframe mode** is great for understanding geometry structure
8. **Position objects thoughtfully** to create clear, comprehensible scenes
9. **TypeScript + LSP** helps you discover geometry types and material properties
10. **Experiment freely** - changing numbers and observing results builds intuition

---

## What's Next?

In the next session, we'll explore:
- More lighting types (PointLight, SpotLight, HemisphereLight)
- Light positioning and how it affects scene mood
- Shadows and shadow configuration
- Light helpers for debugging
- Creating dramatic lighting setups

Or, if you prefer to follow your reordered curriculum:
- Next up could be **Transforms and Object3D Hierarchy** to learn how to build complex compound objects from these primitives!

---

## Notes Section

Use this space to record your discoveries:

- What material combinations looked most interesting?
- Which geometries did you find most useful?
- Any "aha" moments about how roughness and metalness work together?
- Ideas for objects you want to create by combining geometries?
- Questions for Claude?

---

**Time estimate:** 1 hour including experimentation
**Difficulty:** Beginner
**Prerequisites:** Session 01 completed
