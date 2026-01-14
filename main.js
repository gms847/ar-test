import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
import { OrbitControls } from './OrbitControls.js';

let scene, camera, renderer, controls;

async function startSystem() {
    console.log("Tap detected, attempting to start...");
    
    const overlay = document.getElementById("overlay");
    if (!overlay) return;

    try {
        // 1. まずカメラ許可を求める (Safariの関門)
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false
        });
        
        // 2. 許可が取れたら、即座に画面を消す
        overlay.style.display = "none";

        const video = document.getElementById("camera-video");
        video.srcObject = stream;
        await video.play();

        // 3. 3D空間の初期化
        initThree();
        loadGLB();
        animate();

    } catch (err) {
        console.error("Access denied or error:", err);
        alert("カメラの起動に失敗しました。設定でブラウザのカメラアクセスを許可してください。");
    }
}

// 画面全体のどこをタップしても反応するようにする
const overlayElement = document.getElementById("overlay");

// iPhone Safariで最も確実な「touchend」を使用
overlayElement.addEventListener("touchend", (e) => {
    e.preventDefault();
    startSystem();
}, { once: true });

// PC等のクリック用
overlayElement.addEventListener("click", () => {
    startSystem();
}, { once: true });

function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1, 3);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.zIndex = "10";
    document.body.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    controls = new OrbitControls(camera, renderer.domElement);
}

function loadGLB() {
    // 動作確認用の赤い立方体
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    cube.position.y = 0.5;
    scene.add(cube);
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    renderer.render(scene, camera);
}
