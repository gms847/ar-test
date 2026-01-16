console.log("start.js 読み込み");

async function startAR() {
  console.log("startAR 実行");

  const startLayer = document.getElementById("startLayer");
  const video = document.getElementById("camera");

  /* ===== カメラ起動（ユーザー操作直下）===== */
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
    audio: false
  });

  video.srcObject = stream;
  await video.play();

  console.log("カメラ起動完了");

  /* UI を消す */
  startLayer.style.display = "none";

  /* Three.js 開始を通知 */
  window.dispatchEvent(new Event("ar-start"));
}

window.startAR = startAR;
