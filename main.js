console.log("AR main.js 読み込み");

import * as THREE from "./three/three.module.js";
import { GLTFLoader } from "./three/GLTFLoader.js";

const video = document.getElementById("camera");
const threeLayer = document.getElementById("threeLayer");
const startLayer = document.getElementById("startLayer");

let scene, camera, renderer, model;
let started = false;

/* ★ Safari 確実起動用：window に直接生やす */
window.startAR = async function () {
  if (started) return;
  started = true;

  console.log("startAR 実行");

  startLayer.style.display = "none";

  await startCamera();
  initThree();
};

/* ===== カメラ ===== */
async function startCamera() {
  console.log("カメラ起動開始");

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;
  await video.play(); // Safari 重要

  console.log("カメラ起動完了");
}

/* ===== Three.js ===== */
function initThree() {
  console.log("Three.js 初期化");

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
