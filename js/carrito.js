let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function renderCarrito() {
  const contenedor = document.getElementById("cart-items");
  const totalSpan = document.getElementById("cart-total");

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach(producto => {
    total += producto.price * producto.cantidad;

    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = `
      <img src="${producto.image}" alt="${producto.name}" width="80">
      <div>
        <h4>${producto.name}</h4>
        <p>$${producto.price}</p>

        <button onclick="cambiarCantidad(${producto.id}, -1)">−</button>
        <span> ${producto.cantidad} </span>
        <button onclick="cambiarCantidad(${producto.id}, 1)">+</button>

        <br><br>
        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
      </div>
    `;

    contenedor.appendChild(div);
  });

  actualizarTotalConEnvio(total);
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cambiarCantidad(id, cambio) {
  const producto = carrito.find(p => p.id === id);
  if (!producto) return;

  producto.cantidad += cambio;

  if (producto.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  renderCarrito();
}

function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  renderCarrito();
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
}

  //seleccion visual del carrito 

  function seleccionarEnvio(elemento, costo) {
    document.querySelectorAll(".envio-opcion").forEach(op => {
      op.classList.remove("active");
    });
  
    elemento.classList.add("active");
  
    localStorage.setItem("envioSeleccionado", costo);
  
    renderCarrito(); // 👈 ESTO ES CLAVE
  }
  

  document.addEventListener("DOMContentLoaded", () => {
    renderCarrito();
  });
  

function actualizarTotalConEnvio(subtotal) {
    const envio = Number(localStorage.getItem("envioSeleccionado")) || 0;
    const totalFinal = subtotal + envio;
  
    const totalSpan = document.getElementById("cart-total");
    if (totalSpan) {
      totalSpan.textContent = totalFinal.toFixed(2);
    }
}

function calcularEnvio() {
    const cp = document.getElementById("cp").value;
  
    if (cp.length !== 5) {
      alert("Ingresa un Código Postal válido");
      return;
    }
  
    let costoEnvio = 0;
  
    // 🔵 SIMULACIÓN POR ZONA
    if (cp.startsWith("44")) {
      costoEnvio = 120; // Guadalajara
    } else if (cp.startsWith("45")) {
      costoEnvio = 150;
    } else {
      costoEnvio = 200; // resto del país
    }
  
    localStorage.setItem("envioSeleccionado", costoEnvio);
  
    document.getElementById("envio-result").innerHTML = `
      <div class="envio-opcion active">
        Envío estándar: $${costoEnvio}
      </div>
    `;
  
    renderCarrito();
  }
  
  
  