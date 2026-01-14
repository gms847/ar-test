/* ===============================
   iPhone用：JSエラー可視化
================================ */
window.onerror = function (msg, url, line) {
  alert("JSエラー:\n" + msg + "\n行: " + line);
};

/* ===============================
   DOM取得
================================ */
const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");

let scene, camera, renderer;
let model, controls;

/* ===============================
   開始ボタン
================================ */
startButton.addEventListener("click", async () => {
  alert("開始ボタンが押されました");
  overlay.style.display = "none";
  await startAR();
});

/* ===============================
   AR開始
================================ */
async function startAR() {

  alert("startAR 開始");

  /* ----- カメラ ----- */
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });
  video.srcObject = stream;

  alert("カメラ起動完了");

  /* ----- Three.js ----- */
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 1);

  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "1";

  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const dir = new THREE.DirectionalLight(0xffffff, 1.5);
  dir.position.set(1, 1, 1);
  scene.add(dir);

  alert("Three.js 初期化完了");

  /* ----- GLB 読み込み ----- */
  const loader = new THREE.GLTFLoader();

  loader.load(
    "model.glb",
    (gltf) => {

      alert("GLB 読み込み成功");

      model = gltf.scene;

      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.material.side = THREE.DoubleSide;
        }
      });

      scene.add(model);

      /* 強制的に見える状態にする */
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      model.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      model.scale.setScalar(1 / maxDim);

      camera.position.set(0, 0, 2);
      camera.lookAt(0, 0, 0);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableDamping = true;

      animate();
    },
    undefined,
    (err) => {
      alert("GLB 読み込み失敗");
      console.error(err);
    }
  );
}

/* ===============================
   描画
================================ */
function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}
