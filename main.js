alert("main.js 実行確認");

/* --------------------
   DOM 取得
-------------------- */
const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const button = document.getElementById("startButton");

/* --------------------
   開始ボタン
-------------------- */
button.addEventListener("click", () => {
  alert("開始ボタンが押されました");
  overlay.style.display = "none";

  startCamera();
  initThree();
});

/* --------------------
   カメラ起動
-------------------- */
function startCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  })
  .then(stream => {
    video.srcObject = stream;
    alert("カメラ起動完了");
  })
  .catch(err => {
    alert("カメラ起動失敗");
  });
}

/* --------------------
   Three.js 初期化
-------------------- */
function initThree() {
  alert("Three.js 初期化 開始");

  // Scene
  const scene = new THREE.Scene();
  alert("scene OK");

  // Camera
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 2);
  alert("Camera ok");

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  alert("render 生成ok");

  renderer.setSize(window.innerWidth, window.innerHeight);
  alert("render サイズ ok");

  document.body.appendChild(renderer.domElement);
  alert("Canvas 追加 OK");

  // Light
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);
  alert("light OK");

  alert("Three.js 初期化 ok");

  /* ★★★ 決定打テスト① ★★★ */
  alert("initThree の最後まで到達");

  loadGLB(scene);

  /* ★★★ 決定打テスト② ★★★ */
  alert("loadGLB 呼び出し後");

  // 描画ループ
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

/* --------------------
   GLB 読み込み
-------------------- */
function loadGLB(scene) {
  /* ★★★ 決定打テスト③ ★★★ */
  alert("★★ loadGLB 関数に入った ★★");

  alert("GLB 読み込み開始");

  fetch(fetch("https://gms847.github.io/ar-test/model.glb")
    .then(res => {
      if (!res.ok) {
        throw new Error("fetch failed");
      }
      return res.arrayBuffer();
    })
    .then(buffer => {
      const loader = new THREE.GLTFLoader();

      loader.parse(
        buffer,
        "",
        gltf => {
          alert("GLB 読み込み成功");

          const model = gltf.scene;

          // 表示調整
          model.position.set(0, 0, 0);
          model.scale.set(1, 1, 1);

          scene.add(model);
        },
        error => {
          alert("GLB パース失敗");
        }
      );
    })
    .catch(err => {
      alert("GLB 取得失敗");
    });
}


