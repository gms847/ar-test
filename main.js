const video = document.getElementById('camera');
const canvas = document.getElementById('ar-canvas');
const startBtn = document.getElementById('start');
const overlay = document.getElementById('overlay');
const captureBtn = document.getElementById('capture');

let scene, camera, renderer, model;
let scale = 1;

// ---------------- カメラ ----------------
async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: 1280 },
      height: { ideal: 720 }
    }
  });
  video.srcObject = stream;
}

// ---------------- Three.js ----------------
function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 2.5);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(1, 1, 1);
  scene.add(dir);

  new THREE.GLTFLoader().load('model.glb', gltf => {
    model = gltf.scene;
    scene.add(model);
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// ---------------- 操作 ----------------
let dragging = false, px = 0, py = 0, prevDist = 0;

canvas.addEventListener('pointerdown', e => {
  dragging = true;
  px = e.clientX;
  py = e.clientY;
});

canvas.addEventListener('pointermove', e => {
  if (!dragging || !model) return;

  model.rotation.y += (e.clientX - px) * 0.01;
  model.rotation.x += (e.clientY - py) * 0.01;

  // 上下回転制限（⑥-3）
  model.rotation.x = Math.max(
    -Math.PI / 4,
    Math.min(Math.PI / 4, model.rotation.x)
  );

  px = e.clientX;
  py = e.clientY;
});

canvas.addEventListener('pointerup', () => dragging = false);

// ピンチ
canvas.addEventListener('touchmove', e => {
  if (e.touches.length !== 2 || !model) return;

  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  const d = Math.hypot(dx, dy);

  if (prevDist) {
    scale *= d / prevDist;
    scale = Math.min(Math.max(scale, 0.5), 2.0);
    model.scale.setScalar(scale);
  }
  prevDist = d;
});

canvas.addEventListener('touchend', () => prevDist = 0);

// ダブルタップリセット（⑥-2）
let lastTap = 0;
canvas.addEventListener('touchend', () => {
  const now = Date.now();
  if (now - lastTap < 300 && model) {
    model.rotation.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scale = 1;
  }
  lastTap = now;
});

// ---------------- 保存（④） ----------------
captureBtn.addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = renderer.domElement.toDataURL('image/png');
  a.download = 'ar.png';
  a.click();
});

// ---------------- 開始 ----------------
startBtn.onclick = async () => {
  startBtn.style.display = 'none';
  overlay.style.display = 'none';
  await startCamera();
  initThree();
};
