import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, controls;

document.getElementById("startButton").addEventListener("click", async function () {
  console.log("Button clicked");
  document.getElementById("overlay").style.display = "none";

  try {
    // 1. Three.js を先に初期化（カメラを待たずに画面を作る）
    initThree();
    animate();
    console.log("Three.js initialized");

    // 2. カメラの起動
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    const video = document.getElementById("camera-video");
    video.srcObject = stream;
    
    // play()に失敗しても3D側を止めないようにする
    video.play().catch(e => console.warn("Video play deferred", e));

    // 3. 3Dモデルの読み込み
    loadGLB();

  } catch (err) {
    console.error("Error details:", err);
    alert("エラーが発生しました: " + err.message);
  }
});

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
  renderer.domElement.style.zIndex = "10";
  document.body.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(light);
  
  controls = new OrbitControls(camera, renderer.domElement);
}

function loadGLB() {
  // 動作確認用の赤い箱
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
  );
  cube.position.y = 0.5;
  scene.add(cube);

  // 本番用モデルの読み込み（必要ならコメント解除）
  // const loader = new GLTFLoader();
  // loader.load('logo.glb', (gltf) => { scene.add(gltf.scene); });
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}
