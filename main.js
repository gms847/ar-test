console.log("main.js 読み込み");

import * as THREE from "./three/three.module.js";

let scene, camera, renderer, cube;

window.addEventListener("three-start", () => {
  console.log("Three.js 初期化開始");
  initThree();
});

function initThree() {
  console.log("initThree");

  /* ===== シーン ===== */
  scene = new THREE.Scene();

  /* ===== カメラ ===== */
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);

  /* ===== レンダラー（強制可視） ===== */
  renderer = new THREE.WebGLRenderer({
    alpha: false,
    antialias: true
  });

  /* 背景を赤くする（見えなければ異常） */
  renderer.setClearColor(0x880000, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  /* Safari 対策：直接 style 指定 */
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.zIndex = "9999";
  renderer.domElement.style.pointerEvents = "none";

  document.body.appendChild(renderer.domElement);

  console.log("renderer 追加");

  /* ===== 赤い立方体 ===== */
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  console.log("赤 cube 追加");

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (cube) {
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.005;
  }

  renderer.render(scene, camera);
}
