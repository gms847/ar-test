let scene, camera, renderer, controls;
let video; // videoTextureは不要になるので削除

document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("overlay").style.display = "none";

  // カメラの取得
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  })
  .then(function (stream) {
    // HTML上のvideo要素を取得してストリームをセット
    video = document.getElementById("camera-video");
    video.srcObject = stream;

    video.onloadedmetadata = function () {
      video.play();
      
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

  // ★修正：alphaをtrueにし、背景を透明にできるようにする
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0); // 背景色を透明(アルファ0)に設定
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);
  
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.zIndex = "1"; // ★修正：ビデオ(-1)より手前に配置

  // ★削除：scene.backgroundの設定は不要になります
  // videoTexture = new THREE.VideoTexture(video);
  // scene.background = videoTexture;

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(light);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
}

// loadGLBとanimateは変更なし（ただしanimateでvideoTexture.needsUpdateなどは不要）
