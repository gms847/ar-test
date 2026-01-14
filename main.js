import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, controls;
let video;

document.getElementById("startButton").addEventListener("click", async function () {
  // UIを非表示にする
  document.getElementById("overlay").style.display = "none";

  try {
    // 1. カメラのストリームを取得
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    // 2. ビデオ要素の設定と再生
    video = document.getElementById("camera-video");
    video.srcObject = stream;
    await video.play();

    // 3. Three.jsの初期化
    initThree();
    loadGLB(); // 3Dモデル読み込み
    animate();

    console.log("System started successfully");

  } catch (err) {
    console.error("Initialization failed:", err);
    alert("起動に失敗しました。カメラの許可を確認してください。");
  }
});

function initThree() {
  // シーンの作成
  scene = new THREE.Scene();

  // カメラの設定
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 3);

  // レンダラーの設定（背景を透明にする）
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0); // アルファを0にして透明化
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // 照明
  const light = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(light);
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(2, 2, 5);
  scene.add(dirLight);

  // 操作
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // ウィンドウリサイズ対応
  window.addEventListener('resize', onWindowResize);
}

function loadGLB() {
  const loader = new GLTFLoader();
  // ここに読み込みたいモデルのパスを指定してください（例: 'model.glb'）
  // loader.load('model.glb', (gltf) => {
  //   scene.add(gltf.scene);
  // }, undefined, (error) => {
  //   console.error(error);
  // });
  
  // デバッグ用：モデルがない場合でも何かが映るように箱を置く
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
