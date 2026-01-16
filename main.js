console.log("main.js 読み込み");

import * as THREE from "./three/three.module.js";
import { GLTFLoader } from "./three/GLTFLoader.js";

const video = document.getElementById("camera");
const threeLayer = document.getElementById("threeLayer");

let scene, camera, renderer, model;

/* ★ start.js からの開始通知を受け取る */
window.addEventListener("ar-start", async () => {
  console.log("AR start イベント受信");

  await startCamera();
  initThree();
});

/* ===== カメラ ===== */
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;
  await video.play();

  console.log("カメラ起動完了");
}

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

/* ===== GLB ===== */
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

/* ===== 描画 ===== */
function animate() {
  requestAnimationFrame(animate);
  if (model) model.rotation.y += 0.01;
  renderer.render(scene, camera);
}

