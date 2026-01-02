// js/filtro-marcas.js
import { productos } from './productos.js';

document.addEventListener('DOMContentLoaded', function () {
    const productosContainer = document.getElementById('productos-container');
    const checkboxes = document.querySelectorAll('.filtro-marca');

    // Cargar marcas seleccionadas desde localStorage
    const marcasGuardadas = JSON.parse(localStorage.getItem('marcasSeleccionadas')) || [];
    checkboxes.forEach(checkbox => {
        if (marcasGuardadas.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    aplicarFiltro(); // Mostrar productos filtrados al cargar

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', aplicarFiltro);
    });

    function aplicarFiltro() {
        const marcasSeleccionadas = Array.from(checkboxes)
            .filter(chk => chk.checked)
            .map(chk => chk.value);

        // Guardar en localStorage
        localStorage.setItem('marcasSeleccionadas', JSON.stringify(marcasSeleccionadas));

        const productosFiltrados = marcasSeleccionadas.length === 0
            ? productos
            : productos.filter(p => marcasSeleccionadas.includes(p.marca));

        mostrarProductos(productosFiltrados);
    }

    function mostrarProductos(lista) {
        productosContainer.innerHTML = '';

        lista.forEach(producto => {
            const itemHTML = `
                <div class="item ${producto.marca}">
                    <span class="titulo-item">${producto.modelo}</span>
                    <img src="${producto.imagen}" alt="${producto.modelo}" class="img-item">
                    <span class="precio-item">$${producto.precio.toFixed(2)}</span>
                    <button class="boton-item" data-id="${producto.id}">Agregar al carrito</button>
                </div>
            `;
            productosContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        document.querySelectorAll('.boton-item').forEach(boton => {
            boton.addEventListener('click', agregarAlCarrito);
        });
    }

    function agregarAlCarrito(e) {
        const idProducto = parseInt(e.target.getAttribute('data-id'));
        const productoOriginal = productos.find(p => p.id === idProducto);
        // Preparamos un nuevo objeto asegurando que el precio sea un número
        const producto = {
            ...productoOriginal,
            precio: parseFloat(productoOriginal.precio) // 🔧 Convertimos el precio a número
        };
        document.dispatchEvent(new CustomEvent('producto-agregado', { detail: producto }));
        console.log('Producto enviado al carrito:', producto);
    }
});
