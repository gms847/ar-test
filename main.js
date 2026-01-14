const logEl = document.getElementById("log");
function log(msg) {
  console.log(msg);
  logEl.textContent += msg + "\n";
}

log("main.js 実行確認");

let scene, camera, renderer, controls;

document.getElementById("startButton").addEventListener("click", () => {
  alert("開始ボタンが押されました");
  document.getElementById("overlay").style.display = "none";

  // ★ ユーザー操作直結で実行
  initThree();
  startCamera();   // ← await しない
  loadGLB();
  animate();
});

function initThree() {
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
}

function startCamera() {
  log("カメラ起動要求");

  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  })
  .then((stream) => {
    log("getUserMedia 成功");

    const video = document.createElement("video");
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;

    video.onloadedmetadata = () => {
      video.play();
      log("video 再生開始");

      const videoTexture = new THREE.VideoTexture(video);
      scene.background = videoTexture;

      log("カメラ起動完了");
    };
  })
  .catch((err) => {
    log("getUserMedia 失敗");
    log(err.name + ": " + err.message);
  });
}

function loadGLB() {
  log("GLB 読み込み開始");

  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://gms847.github.io/ar-test/model.glb",
    (gltf) => {
      log("GLB 読み込み成功");
      const model = gltf.scene;
      model.position.set(0, 0, -1);
      scene.add(model);
    },
    undefined,
    (error) => {
      log("GLB 読み込み失敗");
      console.error(error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) controls.update();
  renderer.render(scene, camera);
}
