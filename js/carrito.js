//carrito.js
document.addEventListener('DOMContentLoaded', () => {
    const contenedorCarrito = document.querySelector('.carrito-items');
    const totalCarrito = document.querySelector('.carrito-precio-total');
    const carritoContainer = document.getElementById('carrito-container');
    const contenedorProductos = document.querySelector('.contenedor-items');

    // Escuchar el evento personalizado desde filtro-marcas.js
    document.addEventListener('producto-agregado', function (e) {
        const producto = e.detail;
        agregarAlCarrito(producto);
    });

    function agregarAlCarrito(producto) {
        const nombresCarrito = contenedorCarrito.querySelectorAll('.carrito-item-titulo');
        for (let nombre of nombresCarrito) {
            if (nombre.innerText === producto.modelo) {
                alert('Este producto ya está en el carrito');
                return;
            }
        }

        const nuevoItem = document.createElement('div');
        nuevoItem.classList.add('carrito-item');
        nuevoItem.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.modelo}" width="80px">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${producto.modelo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="${producto.cantidad || 1}" class="carrito-item-cantidad" readonly>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">$${parseFloat(producto.precio || 0).toFixed(2)}</span>
            </div>
            <span class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </span>
        `;

        contenedorCarrito.appendChild(nuevoItem);
        agregarEventosCarrito(nuevoItem);
        actualizarTotal();
        actualizarCarritoUI();
        guardarCarritoEnLocalStorage();
    }

    function agregarEventosCarrito(item) {
        item.querySelector('.btn-eliminar').addEventListener('click', () => {
            item.remove();
            actualizarTotal();
            actualizarCarritoUI();
            guardarCarritoEnLocalStorage();
        });

        item.querySelector('.sumar-cantidad').addEventListener('click', () => {
            let cantidad = item.querySelector('.carrito-item-cantidad');
            cantidad.value = parseInt(cantidad.value) + 1;
            actualizarTotal();
            guardarCarritoEnLocalStorage();
        });

        item.querySelector('.restar-cantidad').addEventListener('click', () => {
            let cantidad = item.querySelector('.carrito-item-cantidad');
            if (parseInt(cantidad.value) > 1) {
                cantidad.value = parseInt(cantidad.value) - 1;
                actualizarTotal();
                guardarCarritoEnLocalStorage();
            }
        });
    }

    function actualizarTotal() {
        let total = 0;
        const items = document.querySelectorAll('.carrito-item');
        items.forEach(item => {
            const precioTexto = item.querySelector('.carrito-item-precio')?.innerText.replace(/[^0-9.]/g, '') || "0";
            const precio = parseFloat(precioTexto);
            const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);

            if (!isNaN(precio) && !isNaN(cantidad)) {
                total += precio * cantidad;
            }
        });
        totalCarrito.innerText = `$${total.toFixed(2)}`;
    }


    function actualizarCarritoUI() {
        const items = document.querySelectorAll('.carrito-item');
        if (items.length === 0) {
            carritoContainer.classList.add('oculto');
            contenedorProductos.style.flex = '1 1 100%';
        } else {
            carritoContainer.classList.remove('oculto');
            contenedorProductos.style.flex = '1 1 60%';
        }
    }

    function guardarCarritoEnLocalStorage() {
        const items = [];
        document.querySelectorAll('.carrito-item').forEach(item => {
            const modelo = item.querySelector('.carrito-item-titulo').innerText;
            const precio = parseFloat(item.querySelector('.carrito-item-precio').innerText.replace('$', ''));
            const imagen = item.querySelector('img').src;
            const cantidad = parseInt(item.querySelector('.carrito-item-cantidad').value);
            items.push({ modelo, precio, imagen, cantidad });
        });
        localStorage.setItem('carrito', JSON.stringify(items));
    }

    function restaurarCarritoDesdeLocalStorage() {
        const datos = localStorage.getItem('carrito');
        if (datos) {
            const productosGuardados = JSON.parse(datos);
            if (productosGuardados.length === 0) {
                actualizarCarritoUI(); // Ocultar si no hay productos
            } else {
                productosGuardados.forEach(producto => {
                    agregarAlCarrito(producto);
                });
            }
        } else {
            actualizarCarritoUI();
        }
    }

    // Cargar productos al iniciar
    restaurarCarritoDesdeLocalStorage();
});
