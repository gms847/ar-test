import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, controls;

async function startSystem() {
  console.log("System activation triggered");
  document.getElementById("overlay").style.display = "none";

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
    alert("エラー: " + err.message);
  }
}

const btn = document.getElementById("startButton");

// クリックとタッチの両方に対応
btn.addEventListener("click", (e) => {
  e.preventDefault();
  startSystem();
}, { once: true }); // 二重起動防止

btn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startSystem();
}, { once: true });

function initThree() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.zIndex = "10";
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 1.0));
  controls = new OrbitControls(camera, renderer.domElement);
}

function loadGLB() {
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
