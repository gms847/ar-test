console.log("main.js 実行開始");

import * as THREE from "./three/three.module.js";
import { GLTFLoader } from "./three/GLTFLoader.js";

const startButton = document.getElementById("startButton");
const uiLayer = document.getElementById("uiLayer");
const video = document.getElementById("camera");
const threeLayer = document.getElementById("threeLayer");

let scene, camera, renderer, model;

/* =========================
   開始ボタン（Safari確実）
========================= */
startButton.onclick = () => {
  console.log("開始ボタン押下");
  uiLayer.style.display = "none";
  startCamera();
  initThree();
};

/* =========================
   カメラ起動
========================= */
async function startCamera() {
  console.log("カメラ起動開始");

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;
  console.log("カメラ起動完了");
}

/* =========================
   Three.js 初期化
========================= */
function initThree() {
  console.log("Three.js 初期化 開始");

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

/* =========================
   GLB 読み込み
========================= */
function loadGLB() {
  console.log("GLB 読み込み開始");

  const loader = new GLTFLoader();
  loader.load(
    "./model.glb",
    (gltf) => {
      model = gltf.scene;
      scene.add(model);
      console.log("GLB 読み込み成功");
    },
    undefined,
    (error) => {
      console.error("GLB 読み込み失敗", error);
    }
  );
}

/* =========================
   レンダリング
========================= */
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
