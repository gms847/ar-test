console.log("start.js 読み込み");

function startAR() {
  console.log("startAR 実行");

  const startLayer = document.getElementById("startLayer");
  startLayer.style.display = "none";

  /* Three.js 開始通知 */
  window.dispatchEvent(new Event("three-start"));
}

window.startAR = startAR;
