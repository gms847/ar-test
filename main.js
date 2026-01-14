let scene, camera, renderer;
let model;
let controls;
let initialScale = 0.5;

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
  overlay.style.display = "none";
  await startAR();
});

async function startAR() {

  /* ===== カメラ起動（Safari必須）===== */
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });
  video.srcObject = stream;

  /* ===== Three.js 基本 ===== */
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 4);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  /* ===== ⑤ ライト強化（暗転防止）===== */
  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(1, 1, 1);
  scene.add(dirLight);

  /* ===== ③④ モデル読み込み＋補正 ===== */
  const loader = new THREE.GLTFLoader();
  loader.load(
    "model.glb",
    (gltf) => {
      model = gltf.scene;

      // ④ 原点ずれ補正
      model.traverse((obj) => {
        if (obj.isMesh && obj.geometry) {
          obj.geometry.center();
          obj.material.side = THREE.DoubleSide;
        }
      });

      // ③ サイズ強制補正
      model.scale.setScalar(initialScale);
      model.position.set(0, 0, 0);
      model.rotation.set(0, Math.PI, 0);

      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("GLB load error:", error);
    }
  );

  /* ===== 操作（展示向け）===== */
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 0.6;

  /* ダブルタップでリセット */
  let lastTap = 0;
  renderer.domElement.addEventListener("touchend", () => {
    const now = Date.now();
    if (now - lastTap < 300 && model) {
      model.rotation.set(0, Math.PI, 0);
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
