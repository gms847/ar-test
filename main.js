import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, controls;

async function startSystem(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  console.log("System activation started");
  
  // 何はともあれ、まずオーバーレイを消す
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.style.display = "none";

  try {
    // 1. Three.js 初期化
    initThree();
    loadGLB();
    animate();

    // 2. カメラ起動
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    const video = document.getElementById("camera-video");
    video.srcObject = stream;
    await video.play();

  } catch (err) {
    console.error(err);
    alert("エラーが発生しました: " + err.message);
    // 失敗した場合はボタンを戻す
    if (overlay) overlay.style.display = "flex";
  }
}

// 実行を確実にするため、window読み込みを待つ
window.onload = () => {
  const btn = document.getElementById("startButton");
  
  // スマホのタッチとクリック両方に対応
  btn.addEventListener("touchstart", startSystem, { once: true });
  btn.addEventListener("click", startSystem, { once: true });
};

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // 3Dレイヤーをカメラ映像の上に配置
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "10";
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  controls = new OrbitControls(camera, renderer.domElement);
}

function loadGLB() {
  // 確認用の赤い箱
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  cube.position.y = 0.5;
  scene.add(cube);
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}
