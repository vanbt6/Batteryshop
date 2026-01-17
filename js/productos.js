async function cargarProductos() {
    try {
      const res = await fetch("http://localhost:4000/api/productos");
      const productos = await res.json();
  
      productos.forEach(producto => {
        const carousel = document.getElementById(`carousel-${producto.carousel}`);
        if (!carousel) return;
  
        const div = document.createElement("div");
        div.classList.add("product");
  
        div.innerHTML = `
          <span class="discount">-${producto.discount}%</span>
          <img src="${producto.image}" alt="${producto.name}">
          <p>${producto.name}</p>
          <p>
            <span class="price-old">$${producto.oldPrice.toFixed(2)}</span><br>
            <span class="price-new">$${producto.price.toFixed(2)}</span>
          </p>
          <button class="buy-button">COMPRAR AHORA</button>
        `;
  
        // evento correcto (NO onclick con JSON.stringify)
        div.querySelector(".buy-button").addEventListener("click", () => {
          agregarAlCarrito(producto);
        });
  
        carousel.appendChild(div);
      });
  
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  }
  
  function mostrarToast(mensaje) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = mensaje;
  
    document.body.appendChild(toast);
  
    setTimeout(() => toast.classList.add("show"), 50);
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
  

  function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  
    const existe = carrito.find(p => p.id === producto.id);
  
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
  
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
  
    mostrarToast("Producto agregado al carrito 🛒");
  }
  
  function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  
    const contador = document.getElementById("cart-count");
    if (contador) contador.textContent = total;
  }
   
  function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  
    const contador = document.getElementById("cart-count");
    if (contador) {
      contador.textContent = total;
      contador.classList.add("bounce");
      setTimeout(() => contador.classList.remove("bounce"), 300);
    }
  }
  

  document.addEventListener("DOMContentLoaded", () => {
    cargarProductos();
    actualizarContadorCarrito();
  });
  
  