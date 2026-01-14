import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, controls;

// 開始ボタンの処理
document.getElementById("startButton").addEventListener("click", async function () {
  console.log("開始ボタンが押されました");
  
  // UIを隠す
  document.getElementById("overlay").style.display = "none";

  try {
    // 1. Three.jsの初期化（先に土台を作る）
    initThree();
    loadGLB();
    animate();

    // 2. カメラの起動
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    const video = document.getElementById("camera-video");
    video.srcObject = stream;
    await video.play();

    console.log("システムが正常に起動しました");

  } catch (err) {
    console.error("起動エラー:", err);
    alert("カメラを起動できませんでした。HTTPS接続とカメラ許可を確認してください。");
  }
});

function initThree() {
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0); // 背景を透明にする
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // 3Dキャンバスを最前面に配置（ビデオより上）
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.zIndex = "10";
  document.body.appendChild(renderer.domElement);

  // 照明
  const light = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(light);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // 操作
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  window.addEventListener('resize', onWindowResize);
}

function loadGLB() {
  // 動作確認用の赤い立方体
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 0.5;
  scene.add(cube);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}
