document.getElementById("checkout-form").addEventListener("submit", async e => {
    e.preventDefault();
  
    const pedido = {
      cliente: {
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value,
        direccion: direccion.value
      },
      carrito: JSON.parse(localStorage.getItem("carrito")) || [],
      envio: Number(localStorage.getItem("envioSeleccionado")) || 0
    };
  
    const res = await fetch("http://localhost:4000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido)
    });
  
    if (res.ok) {
      alert("Pedido confirmado 🎉");
      localStorage.clear();
      window.location.href = "index.html";
    }
  });

// Finalizacion de Compra con animacion 
async function finalizarCompra() {
    const overlay = document.getElementById("checkout-overlay");
    const text = document.getElementById("checkout-text");
    const btn = document.getElementById("checkout-btn");
  
    btn.disabled = true;
    btn.textContent = "Procesando...";
    overlay.classList.remove("hidden");
  
    try {
      const pedido = {
        cliente: {
          nombre: "Cliente Web",
          email: "cliente@test.com",
          telefono: "3312345678"
        },
        carrito,
        envio: Number(localStorage.getItem("envioSeleccionado")) || 0
      };
  
      const res = await fetch("http://localhost:4000/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
      });
  
      if (!res.ok) throw new Error("Error en checkout");
  
      text.innerHTML = "✅ ¡Compra confirmada!";
      text.classList.add("success");
  
      localStorage.removeItem("carrito");
      carrito = [];
  
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2500);
  
    } catch (error) {
      text.innerHTML = "❌ Error al procesar la compra";
      btn.disabled = false;
      btn.textContent = "Finalizar compra";
    }
  }