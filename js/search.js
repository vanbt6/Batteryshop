// js/search.js

function searchProducts(event) {
  event.preventDefault();
  const query = document.getElementById("searchInput").value.toLowerCase();

  if (!query.trim()) {
    alert("Por favor, ingresa un término de búsqueda.");
    return false;
  }

  // Redirige a la página de productos con la búsqueda como parámetro
  window.location.href = `productos.html?busqueda=${encodeURIComponent(query)}`;
  return false;
}
