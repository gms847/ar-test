let scene, camera, renderer;
let model;
let controls;
let initialScale = 0.3;

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");

/* ===== 画面表示デバッグ用テキスト ===== */
const debugText = document.createElement("div");
debugText.style.position = "fixed";
debugText.style.bottom = "10px";
debugText.style.left = "10px";
debugText.style.padding = "8px 12px";
debugText.style.background = "rgba(0,0,0,0.6)";
debugText.style.color = "white";
debugText.style.fontSize = "12px";
debugText.style.zIndex = "999";
debugText.innerText = "待機中";
document.body.appendChild(debugText);

startButton.addEventListener("click", async () => {
  overlay.style.display = "none";
  debugText.innerText = "開始ボタン押下";
  await startAR();
});

async function startAR() {

  /* ===== カメラ起動 ===== */
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });
  video.srcObject = stream;
  debugText.innerText = "カメラ起動OK";

  /* ===== Three.js ===== */
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 3);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  /* ===== ライト ===== */
  scene.add(new THREE.AmbientLight(0xffffff, 2));
  const dir = new THREE.DirectionalLight(0xffffff, 1.5);
  dir.position.set(1, 1, 1);
  scene.add(dir);

  /* ===== 基準オブジェクト（必ず見える）===== */
  const testBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshNormalMaterial()
  );
  scene.add(testBox);
  debugText.innerText = "テストBOX表示中";

  /* ===== モデル読み込み ===== */
  const loader = new THREE.GLTFLoader();
  loader.load("model.glb", (gltf) => {

    model = gltf.scene;

    let meshCount = 0;
    model.traverse((obj) => {
      if (obj.isMesh) {
        meshCount++;
        obj.geometry.center();
        obj.material.side = THREE.DoubleSide;
      }
    });

    /* 画面表示で結果を知らせる */
    if (meshCount === 0) {
      debugText.innerText = "GLB内にMeshがありません";
      return;
    } else {
      debugText.innerText = "GLB読込成功 / Mesh数: " + meshCount;
    }

    /* サイズ・位置・回転を強制補正 */
    model.scale.setScalar(initialScale);
    model.position.set(0, 0, 0);
    model.rotation.set(0, Math.PI, 0);
    model.updateMatrixWorld(true);

    /* テストBOXを消してモデル表示 */
    scene.remove(testBox);
    scene.add(model);

    /* 視野外対策（絶対中央に来る） */
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);
    camera.position.set(0, 0, size * 1.5);
    camera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.update();

  }, undefined, () => {
    debugText.innerText = "GLB読み込み失敗（ファイル名/場所）";
  });

  /* ===== 操作 ===== */
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;

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
