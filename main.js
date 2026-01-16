console.log("main.js 読み込み");

import * as THREE from "./three/three.module.js";
import { GLTFLoader } from "./three/GLTFLoader.js";

const threeLayer = document.getElementById("threeLayer");

let scene, camera, renderer;
let testCube;   // ★ 赤い立方体
let model;      // ★ GLB

/* start.js からの開始通知 */
window.addEventListener("ar-start", () => {
  console.log("Three.js 初期化開始");
  initThree();
});

/* ===== Three.js 初期化 ===== */
function initThree() {
  console.log("initThree 開始");

  /* シーン */
  scene = new THREE.Scene();
  console.log("scene OK");

  /* カメラ */
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);
  console.log("camera OK");

  /* レンダラー */
  renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  threeLayer.appendChild(renderer.domElement);
  console.log("renderer OK");

  /* ===== ライト ===== */
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const dir = new THREE.DirectionalLight(0xffffff, 2);
  dir.position.set(2, 2, 2);
  scene.add(dir);
  console.log("light OK");

  /* ==============================
     ★ 決定打テスト（赤い立方体）
     ============================== */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  testCube = new THREE.Mesh(geometry, material);
  scene.add(testCube);
  console.log("赤い立方体 追加");

  /* GLB 読み込み（あとで） */
  loadGLB();

  animate();
}

/* ===== GLB ===== */
function loadGLB() {
  console.log("GLB 読み込み開始");

  const loader = new GLTFLoader();
  loader.load(
    "./model.glb",
    (gltf) => {
      model = gltf.scene;

      model.scale.set(0.5, 0.5, 0.5);
      model.position.set(0, 0, 0);

      scene.add(model);
      console.log("GLB 読み込み成功");
    },
    undefined,
    (error) => {
      console.error("GLB 読み込み失敗", error);
    }
  );
}

/* ===== 描画ループ ===== */
function animate() {
  requestAnimationFrame(animate);

  if (testCube) {
    testCube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
