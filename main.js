let scene, camera, renderer;
let model, controls;

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", async () => {
  overlay.style.display = "none";
  await startAR();
});

async function startAR() {

  /* ===== ① カメラ起動（最初に必ず行う）===== */
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });
  video.srcObject = stream;

  /* ===== ② Three.js 初期化 ===== */
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false   // ← 透明にしない（Safari安定策）
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 1);

  /* canvasを確実に前面へ */
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "1";

  document.body.appendChild(renderer.domElement);

  /* ===== ③ ライト（必須）===== */
  scene.add(new THREE.AmbientLight(0xffffff, 2));

  const dir = new THREE.DirectionalLight(0xffffff, 1.5);
  dir.position.set(1, 1, 1);
  scene.add(dir);

  /* ===== ④ モデル読み込み（安全補正付き）===== */
  const loader = new THREE.GLTFLoader();
  loader.load("model.glb", (gltf) => {

    model = gltf.scene;

    /* 原点・マテリアル補正 */
    model.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry.center();
        obj.material.side = THREE.DoubleSide;
      }
    });

    scene.add(model);

    /* サイズ・位置を自動調整（確実に見える） */
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);
    model.scale.setScalar(1);

    camera.position.set(0, 0, size * 1.5);
    camera.lookAt(0, 0, 0);

    /* 操作 */
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;

    animate();
  });
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
