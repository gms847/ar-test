console.log("main.js 読み込み");

import * as THREE from "./three/three.module.js";
import { GLTFLoader } from "./three/GLTFLoader.js";

const threeLayer = document.getElementById("threeLayer");

let scene, camera, renderer, model;

window.addEventListener("ar-start", () => {
  console.log("Three.js 初期化開始");
  initThree();
});

/* ===== Three.js ===== */
function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  threeLayer.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  loadGLB();
  animate();
}

function loadGLB() {
  const loader = new GLTFLoader();
  loader.load(
    "./model.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      console.log("GLB 読み込み成功");
    },
    undefined,
    (e) => console.error("GLB 読み込み失敗", e)
  );
}

function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.01;
  renderer.render(scene, camera);
}
