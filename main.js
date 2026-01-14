let scene, camera, renderer;
let model;
let controls;
let initialScale = 1;

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
  overlay.style.display = "none";
  await startAR();
});

async function startAR() {

  // ---- カメラ起動（Safari必須）----
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });
  video.srcObject = stream;

  // ---- Three.js ----
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 2);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // ---- ライト ----
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

  // ---- モデル ----
  const loader = new THREE.GLTFLoader();
  loader.load(
  "model.glb",
  (gltf) => {
    console.log("GLB loaded");
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("GLB error", error);
  }
);


  // ---- 操作 ----
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;

  // ダブルタップでリセット
  let lastTap = 0;
  renderer.domElement.addEventListener("touchend", () => {
    const now = Date.now();
    if (now - lastTap < 300 && model) {
      model.rotation.set(0, 0, 0);
      model.scale.setScalar(initialScale);
    }
    lastTap = now;
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

