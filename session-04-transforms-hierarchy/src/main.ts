import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let spaceship: THREE.Group;
let solarSystem: THREE.Group;

init();
animate();

function createBody(): THREE.Mesh {
  const geo = new THREE.BoxGeometry(1.5, 1, 4);

  const mat = new THREE.MeshStandardMaterial({
    color: 0x888888,
    metalness: 0.7,
    roughness: 0.3
  });

  const body = new THREE.Mesh(geo, mat);
  body.name = 'body';

  return body;
}

function createCockpit(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.4, 16, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x0099ff,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x004488,
    emissiveIntensity: 0.3
  });

  const cockpit = new THREE.Mesh(geo, mat);
  cockpit.position.set(0, 0.3, 1.8);
  cockpit.name = 'cockpit';

  return cockpit;
}

function createEngine(name: string, x: number, y: number, z: number): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(0.25, 0.35, 0.8, 16);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    metalness: 0.9,
    roughness: 0.2
  });

  const engine = new THREE.Mesh(geo, mat);
  engine.position.set(x, y, z);
  engine.rotation.x = Math.PI / 2;
  engine.name = name;

  return engine;
}

function createWing(name: string, x: number, y: number, z: number): THREE.Mesh {
  const geo = new THREE.BoxGeometry(4, 0.2, 1.5);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.6,
    roughness: 0.4
  });

  const wing = new THREE.Mesh(geo, mat);
  wing.position.set(x, y, z);
  wing.name = name;

  return wing;
}

function createGlow(name: string, x: number, y: number, z: number): THREE.Mesh {
  const geo = new THREE.SphereGeometry(0.2, 8, 8);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xff6600,
  });

  const glow = new THREE.Mesh(geo, mat);
  glow.position.set(x, y, z);
  glow.name = name;

  return glow;
}

function createSpaceship(): THREE.Group {
  const group = new THREE.Group();

  const body = createBody();
  const cockpit = createCockpit();
  const leftWing = createWing('leftWing', -2.75, 0, -0.5);
  const rightWing = createWing('rightWing', 2.75, 0, -0.5);
  const leftEngine = createEngine('leftEngine', -0.6, -0.3, -2);
  const rightEngine = createEngine('rightEngine', 0.6, -0.3, -2);
  const leftGlow = createGlow('leftGlow', -0.6, -0.3, -2.3);
  const rightGlow = createGlow('rightGlow', 0.6, -0.3, -2.3);

  group.add(body);
  group.add(cockpit);
  group.add(leftWing);
  group.add(rightWing);
  group.add(leftEngine);
  group.add(rightEngine);
  group.add(leftGlow);
  group.add(rightGlow);

  return group;
}

function createSun(): THREE.Mesh {
  const geo = new THREE.SphereGeometry(1, 32, 32);
  const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sun = new THREE.Mesh(geo, mat);
  sun.name = 'sun';

  return sun;
}

function createEarth(): THREE.Group {
  const orbit = new THREE.Group();
  orbit.position.x = 5;
  orbit.name = 'earth';

  const geo = new THREE.SphereGeometry(0.5, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2233ff });
  const earth = new THREE.Mesh(geo, mat);
  orbit.add(earth);

  return orbit;
}

function createMoon(): THREE.Group {
  const orbit = new THREE.Group();
  orbit.position.x = 1.5;
  orbit.name = 'moon';

  const geo = new THREE.SphereGeometry(0.2, 32, 32);
  const mat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
  const moon = new THREE.Mesh(geo, mat);
  orbit.add(moon);

  return orbit;
}

function createSolarSystem(): THREE.Group {
  const solarSystem = new THREE.Group();
  solarSystem.position.set(-15, 0, 5);

  const sun = createSun();
  const earth = createEarth();
  const moon = createMoon();

  earth.add(moon);
  solarSystem.add(earth);
  solarSystem.add(sun);

  return solarSystem;
}

function init(): void {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a14);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 5, 10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  spaceship = createSpaceship();
  solarSystem = createSolarSystem();

  scene.add(spaceship);
  scene.add(solarSystem);

  window.addEventListener('resize', onWindowResize);
}

function animate(): void {
  requestAnimationFrame(animate);

  spaceship.rotation.y += 0.005;

  const time = Date.now() * 0.001;
  const pulse = 1 + Math.sin(time * 5) * 0.3;
  const leftWing = spaceship.getObjectByName('leftWing') as THREE.Mesh;
  const rightWing = spaceship.getObjectByName('rightWing') as THREE.Mesh;
  const leftGlow = spaceship.getObjectByName('leftGlow') as THREE.Mesh;
  const rightGlow = spaceship.getObjectByName('rightGlow') as THREE.Mesh;

  leftWing.rotation.x = Math.sin(time * 2) * 0.33;
  rightWing.rotation.x = Math.sin(time * 2) * -0.33;
  leftGlow.scale.setScalar(pulse);
  rightGlow.scale.setScalar(pulse);

  const interval = Date.now() * 0.001;
  const earth = solarSystem.getObjectByName('earth');
  const moon = earth?.getObjectByName('moon');

  solarSystem.rotation.y = time * 0.1;

  if (earth) {
    earth.rotation.y = interval;

    if (moon) {
      moon.rotation.y = interval * 3;
    }
  }

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
