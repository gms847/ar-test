let scene, camera, renderer;

const overlay = document.getElementById("overlay");
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  overlay.style.display = "none";
  startTest();
});

function startTest() {

  /* ===== Three.js ===== */
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false   // ← 重要：透明をやめる
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  /* ===== 強制的に前面に出す ===== */
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.inset = "0";
  renderer.domElement.style.zIndex = "10";

  document.body.appendChild(renderer.domElement);

  /* ===== 絶対見える立方体 ===== */
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
  );
  scene.add(cube);

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

