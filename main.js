window.onerror = function (msg, url, line) {
  alert("JSエラー:\n" + msg + "\n" + line);
};

const loader = new THREE.GLTFLoader();
loader.load(
  "model.glb",
  (gltf) => {

    model = gltf.scene;

    // ===== 強制補正 =====
    model.traverse((obj) => {
      if (obj.isMesh) {
        obj.material.side = THREE.DoubleSide;
      }
    });

    scene.add(model);

    // ===== サイズを完全に正規化 =====
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // 原点に移動
    model.position.sub(center);

    // 最大辺を基準にスケール
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 1 / maxDim;
    model.scale.setScalar(scale);

    // ===== カメラを確実に前へ =====
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);

    // 操作
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;

    animate();
  },
  undefined,
  (error) => {
    alert("model.glb の読み込みに失敗しました");
    console.error(error);
  }
);


