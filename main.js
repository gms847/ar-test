alert("main.js 実行確認");

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const button = document.getElementById("startButton");

button.addEventListener("click", () => {
  alert("開始ボタンが押されました");
  overlay.style.display = "none";
  startCamera();   // await しない
  initThree();
});

/* --------------------
   カメラ起動
-------------------- */
function startCamera() {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  }).then(stream => {
    video.srcObject = stream;
    alert("カメラ起動完了");
  }).catch(() => {
    alert("カメラ起動失敗");
  });
}

/* --------------------
   Three.js 初期化
-------------------- */
function initThree() {
  alert("Three.js 初期化 開始");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 2);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

  alert("Three.js 初期化 完了");

  loadGLB(scene); // ← ★ここで呼ぶ

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

/* --------------------
   GLB 読み込み（←ここに追加）
-------------------- */
function loadGLB(scene) {
  alert("GLB 読み込み開始");

  fetch("model.glb")
    .then(res => {
      if (!res.ok) throw new Error("fetch failed");
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

          // 初期調整
          model.position.set(0, 0, 0);
          model.scale.set(1, 1, 1);

          scene.add(model);
        },
        () => {
          alert("GLB パース失敗");
        }
      );
    })
    .catch(() => {
      alert("GLB 取得失敗");
    });
}
