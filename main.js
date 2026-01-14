alert("main.js 実行確認");

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const button = document.getElementById("startButton");

button.addEventListener("click", () => {
  alert("開始ボタンが押されました");
  overlay.style.display = "none";
  startCamera();   // await しない
  initThree();     // 即 Three.js 初期化
});

function startCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  }).then(stream => {
    video.srcObject = stream;
    alert("カメラ起動完了");
  }).catch(() => {
    alert("カメラ起動失敗");
  });
}

function initThree() {
  alert("Three.js 初期化 開始");

  const scene = new THREE.Scene();
  alert("Scene OK");

  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.set(0, 0, 2);
  alert("Camera OK");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    alert("Renderer 生成 OK");
  } catch (e) {
    alert("Renderer 生成 NG");
    return;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  alert("Renderer サイズ OK");

  document.body.appendChild(renderer.domElement);
  alert("Canvas 追加 OK");

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
  alert("Light OK");

  alert("Three.js 初期化 完了");

  animate();

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
}


