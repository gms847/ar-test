let scene, camera, renderer, controls;
let video, videoTexture;

document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("overlay").style.display = "none";

  // ★ Safari最優先：カメラを最初に起動
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  })
  .then(function (stream) {
    video = document.createElement("video");
    video.srcObject = stream;
    video.playsInline = true;
    video.muted = true;

    video.onloadedmetadata = function () {
      video.play();

      // カメラが動いた「後」に Three.js
      initThree();
      loadGLB();
      animate();
    };
  })
  .catch(function (err) {
    alert("カメラ起動失敗: " + err.name);
  });
});

function initThree() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 2);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "0";   // ← 背面


  // ★ カメラ映像を背景に設定
  videoTexture = new THREE.VideoTexture(video);
  scene.background = videoTexture;

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
}

function loadGLB() {
  const loader = new THREE.GLTFLoader();
  loader.load(
    "https://gms847.github.io/ar-test/model.glb",
    function (gltf) {
      const model = gltf.scene;
      model.position.set(0, 0, -1);
      scene.add(model);
    },
    undefined,
    function () {
      alert("GLB 読み込み失敗");
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

