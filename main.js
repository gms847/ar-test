const logEl = document.getElementById("log");
function log(msg) {
  console.log(msg);
  logEl.textContent += msg + "\n";
}

log("main.js 実行確認");

let scene, camera, renderer, controls;

document.getElementById("startButton").addEventListener("click", async () => {
  alert("開始ボタンが押されました");
  document.getElementById("overlay").style.display = "none";
  await startAR();
});

async function startAR() {
  log("Three.js 初期化 開始");

  scene = new THREE.Scene();
  log("scene OK");

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 2);
  log("Camera OK");

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  log("renderer 生成 OK");
  log("Canvas 追加 OK");

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);
  log("light OK");

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  log("Three.js 初期化 ok");

  await startCamera();
  loadGLB();

  animate();
}

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  const video = document.createElement("video");
  video.srcObject = stream;
  video.playsInline = true;
  await video.play();

  const videoTexture = new THREE.VideoTexture(video);
  scene.background = videoTexture;

  log("カメラ起動完了");
}

function loadGLB() {
  log("★★ GLB 読み込み開始 ★★");

  const loader = new THREE.GLTFLoader();

  loader.load(
    "https://gms847.github.io/ar-test/model.glb",
    (gltf) => {
      log("★★ GLB 読み込み成功 ★★");

      const model = gltf.scene;
      model.position.set(0, 0, -1);
      model.scale.set(1, 1, 1);

      scene.add(model);
    },
    undefined,
    (error) => {
      log("★★ GLB 読み込み失敗 ★★");
      console.error(error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}
