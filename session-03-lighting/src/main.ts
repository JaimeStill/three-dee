import * as THREE from 'three';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;

let box: THREE.Mesh;
let sphere: THREE.Mesh;
let spotLightHelper: THREE.SpotLightHelper;
let shadowCameraHelper: THREE.CameraHelper;

init();
animate();

function init(): void {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(8, 6, 8);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x404040,
    roughness: 0.8,
    metalness: 0.2
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2; // Rotate 90 degrees to make it horizontal
  ground.receiveShadow = true;
  scene.add(ground);

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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 100, 50);
  pointLight.position.set(0, 5, 0);
  pointLight.castShadow = true;

  pointLight.shadow.mapSize.width = 1024;
  pointLight.shadow.mapSize.height = 1024;
  pointLight.shadow.camera.near = 0.5;
  pointLight.shadow.camera.far = 50;
  scene.add(pointLight);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  scene.add(pointLightHelper);

  const spotLight = new THREE.SpotLight(0xffaa55, 200);
  spotLight.position.set(6, 8, 4);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 0.2;
  spotLight.decay = 2;
  spotLight.distance = 30;
  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 20;

  scene.add(spotLight);
  scene.add(spotLight.target);

  spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  scene.add(shadowCameraHelper);

  const hemiLight = new THREE.HemisphereLight(
    0x87ceeb,
    0x5c4033,
    0.3
  );
  scene.add(hemiLight);

  const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 1);
  scene.add(hemiLightHelper);

  window.addEventListener('resize', onWindowResize);
}

function animate(): void {
  requestAnimationFrame(animate);

  box.rotation.y += 0.005;
  sphere.rotation.y += 0.005;

  // Update helpers (needed when lights or targets move)
  spotLightHelper.update();
  shadowCameraHelper.update();

  renderer.render(scene, camera);
}

function onWindowResize(): void {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
