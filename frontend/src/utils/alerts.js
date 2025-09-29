// frontend/src/utils/alerts.js
export function showAlert(message, type = "info") {
  if (type === "error") {
    alert(`❌ ${message}`);
  } else if (type === "success") {
    alert(`✅ ${message}`);
  } else {
    alert(message);
  }
}
