alert("main.js 実行確認");

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const button = document.getElementById("startButton");

button.addEventListener("click", async () => {
  alert("開始ボタンが押されました");
  overlay.style.display = "none";
  await startCamera();
  alert("カメラ起動完了");
  initThree();
});

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });
  video.srcObject = stream;
}

function initThree() {
  alert("Three.js 初期化 開始");

  const scene = new THREE.Scene();
  alert("Scene OK");

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
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
  alert("Renderer サイズ設定 OK");

  document.body.appendChild(renderer.domElement);
  alert("Canvas 追加 OK");

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);
  alert("Light OK");

  alert("Three.js 初期化 完了");

  // ★ あえて GLB はまだ読み込まない
}
