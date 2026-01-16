console.log("start.js 読み込み");

/* Safari が確実に認識するグローバル関数 */
function startAR() {
  console.log("startAR 呼び出し");

  const startLayer = document.getElementById("startLayer");
  startLayer.style.display = "none";

  /* module 側に開始を通知 */
  window.dispatchEvent(new Event("ar-start"));
}

/* グローバル公開（念のため） */
window.startAR = startAR;
