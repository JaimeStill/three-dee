import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;

init();
animate();

function init(): void {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
}

function animate(): void {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
