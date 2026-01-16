console.log("ARページ 起動");

import * as THREE from "./three/three.module.js";
import { GLTFLoader } from "./three/GLTFLoader.js";

const video = document.getElementById("camera");
const container = document.getElementById("threeLayer");

let scene, camera, renderer, model;

/* =====================
   カメラ起動
===================== */
async function startCamera() {
  console.log("カメラ起動開始");

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;
  console.log("カメラ起動完了");
}

/* =====================
   Three.js 初期化
===================== */
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
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  loadGLB();
  animate();
}

/* =====================
   GLB 読み込み
===================== */
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
    (e) => {
      console.error("GLB 読み込み失敗", e);
    }
  );
}

/* =====================
   レンダリング
===================== */
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

/* =====================
   起動
===================== */
startCamera();
initThree();
