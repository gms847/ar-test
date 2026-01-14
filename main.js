alert("main.js 実行確認");

const video = document.getElementById("camera");
const overlay = document.getElementById("overlay");
const button = document.getElementById("startButton");

button.addEventListener("click", async () => {
  alert("開始ボタンが押されました");
  overlay.style.display = "none";
  await startCamera();
  initThree();
});

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" }
  });
  video.srcObject = stream;
}

function initThree() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.set(0, 0, 2);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

  const loader = new THREE.GLTFLoader();
  loader.load(
    "model.glb",
    (gltf) => {
      scene.add(gltf.scene);
      alert("GLB 読み込み成功");
    },
    undefined,
    () => alert("GLB 読み込み失敗")
  );

  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
