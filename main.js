console.log("main.js 読み込み開始");

import * as THREE from "./three/three.module.js";

let started = false;

const startLayer = document.getElementById("startLayer");
const startButton = document.getElementById("startButton");

/* iOS Safari 対策：touchstart + click 両対応 */
function onStart() {
  if (started) return;
  started = true;

  console.log("開始ボタンが押されました");

  startLayer.style.display = "none";
  init();
}

startButton.addEventListener("touchstart", onStart, { passive: true });
startButton.addEventListener("click", onStart);

/* ===== Three.js ===== */

let scene, camera, renderer, cube;

function init() {
  console.log("Three.js 初期化 開始");

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  console.log("Three.js 初期化 完了");
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
