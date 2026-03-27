import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

import GUI from "lil-gui";

const gui = new GUI();
const params = {
  color: "#ffABAB",
  x: 0,
  y: 0,
  z: 0,
};

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  viewport.width / viewport.height,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(viewport.width, viewport.height);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.enablePan = false;
controls.cursorStyle = "grab";
controls.autoRotate = true;

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x00ff00,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.5;

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
});

const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
);

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load("model.glb", (gltf) => {
  scene.add(gltf.scene);
});

scene.add(cube, plane);

camera.position.set(1, 2, 4);
camera.lookAt(cube.position);

const ambLight = new THREE.AmbientLight(0xffffff, 1);
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(0, 5, 0);
dirLight.target.position.set(-5, 0, 2);
dirLight.castShadow = true;
scene.add(ambLight, dirLight, dirLight.target);

function helpers() {
  const gridHelper = new THREE.GridHelper(10, 20);
  gridHelper.position.y = -0.5;

  scene.add(gridHelper);
}

helpers();

window.onresize = () => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;

  camera.aspect = viewport.width / viewport.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewport.width, viewport.height);
  renderer.render(scene, camera);
};

function animate(time) {
  cube.scale.x = Math.sin(time / 1000) + 2;
  cube.position.z = Math.sin(time / 1000);
  cube.rotation.y = Math.PI * Math.sin(time / 1000);

  controls.update();

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

renderer.render(scene, camera);
