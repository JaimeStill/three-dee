import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

let objects: THREE.Mesh[] = [
  createSphere(-4),
  createBox(-2),
  createCylinder(0),
  createTorusKnot(2),
  createIcosahedron(4)
];

init();
animate();

function createSphere(x: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.8, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff6b6b,
    metalness: 1.0,
    roughness: 0.3
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
    roughness: 0.8
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
    roughness: 0.5
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
    emissiveIntensity: 0.2
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
    wireframe: true
  })

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0, 0);
  return mesh;
}

function init(): void {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 2, 8);
  camera.lookAt(0, 0, 0);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  objects.forEach(obj => scene.add(obj));

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
}

function animate(): void {
  requestAnimationFrame(animate);

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
