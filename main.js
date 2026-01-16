import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

console.log("main.js 読み込み開始");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM 構築完了");

  /* =============================
     DOM 取得
  ============================= */
  const video = document.getElementById("camera");
  const threeLayer = document.getElementById("threeLayer");
  const touchLayer = document.getElementById("touchLayer");
  const uiLayer = document.getElementById("uiLayer");
  const startButton = document.getElementById("startButton");

  if (!startButton) {
    console.error("startButton が取得できていません");
    return;
  }

  console.log("startButton 取得 OK");

  /* =============================
     Three.js 変数
  ============================= */
  let scene, camera, renderer, model = null;
  let isDragging = false;
  let lastX = 0;

  /* =============================
     Three.js 初期化
  ============================= */
  function initThree() {
    console.log("Three.js 初期化 開始");

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeLayer.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(light);

    console.log("Three.js 初期化 完了");
  }

  /* =============================
     GLB 読み込み
  ============================= */
  function loadGLB() {
    console.log("GLB 読み込み開始");

    const loader = new GLTFLoader();
    loader.load(
      "https://gms847.github.io/ar-test/model.glb",
      (gltf) => {
        model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        scene.add(model);
        console.log("GLB 読み込み成功");
      },
      undefined,
      (err) => {
        console.error("GLB 読み込み失敗", err);
      }
    );
  }

  /* =============================
     カメラ起動
  ============================= */
  async function startCamera() {
    console.log("カメラ起動開始");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    video.srcObject = stream;
    console.log("カメラ起動完了");
  }

  /* =============================
     タッチ操作
  ============================= */
  touchLayer.addEventListener("touchstart", (e) => {
    if (!model) return;
    isDragging = true;
    lastX = e.touches[0].clientX;
  });

  touchLayer.addEventListener("touchmove", (e) => {
    if (!isDragging || !model) return;
    const x = e.touches[0].clientX;
    model.rotation.y += (x - lastX) * 0.01;
    lastX = x;
  });

  touchLayer.addEventListener("touchend", () => {
    isDragging = false;
  });

  /* =============================
     描画ループ
  ============================= */
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  /* =============================
     開始ボタン
  ============================= */
  startButton.addEventListener("click", async () => {
    console.log("開始ボタンが押されました");

    uiLayer.style.display = "none";

    await startCamera();
    initThree();
    loadGLB();
    animate();
  });

});
