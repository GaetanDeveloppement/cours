import * as THREE from "three";

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
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
});

const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 5;

window.onresize = () => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;

  camera.aspect = viewport.width / viewport.height;
  camera.updateProjectionMatrix();

  renderer.setSize(viewport.width, viewport.height);
  renderer.render(scene, camera);
};

renderer.render(scene, camera);
