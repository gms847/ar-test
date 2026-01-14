import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, controls;
let video;

// 画面読み込み完了時にボタンへイベントを登録
window.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById("startButton");
  
  startButton.addEventListener("click", async function () {
    console.log("Start button clicked");
    
    // UIを隠す
    document.getElementById("overlay").style.display = "none";

    try {
      // 1. カメラのストリームを取得（背面カメラを優先）
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      // 2. ビデオ要素の設定と再生開始
      video = document.getElementById("camera-video");
      video.srcObject = stream;
      
      // 再生が開始されるのを待つ
      await video.play();

      // 3. Three.jsの初期化
      initThree();
      loadGLB();
      animate();

    } catch (err) {
      console.error("Camera error:", err);
      alert("カメラの起動に失敗しました。ブラウザの設定でカメラを許可してください。");
      // 失敗したらボタンを再表示
      document.getElementById("overlay").style.display = "flex";
    }
  });
});

function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1, 3);

  // 背景を透明にする設定
  renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true 
  });
  renderer.setClearColor(0x000000, 0); 
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // 3D表示用キャンバスの設定
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "10"; // ビデオ(-1)より前、オーバーレイより後ろ
  
  document.body.appendChild(renderer.domElement);

  // 照明
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(2, 2, 5);
  scene.add(dirLight);

  // 操作
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  window.addEventListener('resize', onWindowResize);
}

function loadGLB() {
  // テスト用の赤い立方体（モデルがない場合でも動作確認するため）
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.y = 0.5;
  scene.add(cube);

  // GLBの読み込み（必要に応じてパスを変更してください）
  /*
  const loader = new GLTFLoader();
  loader.load('logo.glb', (gltf) => {
    scene.add(gltf.scene);
  });
  */
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
