/* =========================================
   INICIALIZAR EMAILJS
========================================= */

emailjs.init({
    publicKey: "4eqZSjBUc_9gIXW2a"
});


/* =========================================
   STOCK INICIAL DE LAS 24 GORRAS
========================================= */

var stockInicial = {

    "Gorra Combinada 1": 135,
    "Gorra Combinada 2": 120,
    "Gorra Combinada 3": 130,
    "Gorra Combinada 4": 150,
    "Gorra Combinada 5": 120,
    "Gorra Combinada 6": 140,
    "Gorra Combinada 7": 125,
    "Gorra Combinada 8": 120,

    "Gorra Camuflada 1": 130,
    "Gorra Camuflada 2": 170,
    "Gorra Camuflada 3": 130,
    "Gorra Camuflada 4": 140,
    "Gorra Camuflada 5": 130,
    "Gorra Camuflada 6": 120,
    "Gorra Camuflada 7": 125,
    "Gorra Camuflada 8": 125,

    "Gorra Negra 1": 130,
    "Gorra Negra 2": 130,
    "Gorra Negra 3": 135,
    "Gorra Negra 4": 140,
    "Gorra Negra 5": 135,
    "Gorra Negra 6": 130,
    "Gorra Negra 7": 120,
    "Gorra Negra 8": 125

};


/* =========================================
   CARGAR STOCK GUARDADO
========================================= */

var stockGuardado = localStorage.getItem("stockHouseOfCaps");

var stock = stockGuardado
    ? JSON.parse(stockGuardado)
    : { ...stockInicial };

if (!stockGuardado) {

    localStorage.setItem(
        "stockHouseOfCaps",
        JSON.stringify(stock)
    );

}


/* =========================================
   ACTUALIZAR VISUALMENTE EL STOCK
========================================= */

function actualizarStockVisual() {

    var botones = document.querySelectorAll(".buy-btn");

    botones.forEach(function(boton) {

        var productoCompleto =
            boton.getAttribute("data-producto");

        if (!productoCompleto) {
            return;
        }

        var producto =
            productoCompleto.split(" - ")[0];

        var cantidad = stock[producto];

        var tarjeta =
            boton.closest(".producto-card");

        if (!tarjeta) {
            return;
        }

        var textoStock =
            tarjeta.querySelector(".stock");

        if (!textoStock) {

            textoStock = document.createElement("p");
            textoStock.className = "stock";

            var precio = tarjeta.querySelector("span");

            if (precio) {
                precio.parentNode.insertBefore(
                    textoStock,
                    precio
                );
            }

        }

        if (cantidad <= 0) {

            textoStock.textContent = "AGOTADO";
            textoStock.classList.add("agotado");

            boton.disabled = true;
            boton.textContent = "AGOTADO";

        } else {

            textoStock.textContent =
                cantidad + " disponibles";

            textoStock.classList.remove("agotado");

            boton.disabled = false;
            boton.textContent = "Comprar";

        }

    });

}


/* =========================================
   CARRUSEL PRINCIPAL
========================================= */

var swiperPrincipal = new Swiper(".mySwiper-1", {

    loop: true,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true
    }

});


/* =========================================
   MOSTRAR CATEGORÍAS
========================================= */

function mostrarCategoria(categoria, boton) {

    var categorias =
        document.querySelectorAll(".categoria-productos");

    categorias.forEach(function(seccion) {

        seccion.classList.remove("activa");

    });

    var seleccionada =
        document.getElementById(categoria);

    if (seleccionada) {

        seleccionada.classList.add("activa");

    }

    var botones =
        document.querySelectorAll(".categoria-btn");

    botones.forEach(function(btn) {

        btn.classList.remove("activo");

    });

    if (boton) {

        boton.classList.add("activo");

    }

    actualizarStockVisual();

}


/* =========================================
   BOTONES COMPRAR
========================================= */

document.addEventListener("click", function(event) {

    if (!event.target.classList.contains("buy-btn")) {
        return;
    }

    var boton = event.target;

    if (boton.disabled) {
        return;
    }

    var productoCompleto =
        boton.getAttribute("data-producto");

    if (!productoCompleto) {
        return;
    }

    var campoProducto =
        document.getElementById("producto");

    if (campoProducto) {

        campoProducto.value = productoCompleto;

    }

    var formularioSeccion =
        document.getElementById("formulario");

    if (formularioSeccion) {

        formularioSeccion.scrollIntoView({
            behavior: "smooth"
        });

    }

});


/* =========================================
   FORMULARIO DE PEDIDOS CON MYSQL
========================================= */

var formulario = document.getElementById("pedidoForm");

if (formulario) {

    formulario.addEventListener("submit", async function(event) {

        event.preventDefault();

        var nombre = document.getElementById("nombre").value.trim();
        var telefono = document.getElementById("telefono").value.trim();
        var correo = document.getElementById("correo").value.trim();
        var productoCompleto = document.getElementById("producto").value;
        var cantidad = parseInt(document.getElementById("cantidad").value);
        var zona = document.getElementById("zona").value;
        var direccion = document.getElementById("direccion").value.trim();

        if (
            !nombre || !telefono || !correo ||
            !productoCompleto || isNaN(cantidad) ||
            cantidad <= 0 || !zona || !direccion
        ) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        var producto = productoCompleto.split(" - ")[0];

        var botonEnviar = formulario.querySelector('[type="submit"]');

        if (botonEnviar) {
            botonEnviar.disabled = true;
        }

        try {

            // GUARDAR PEDIDO EN MYSQL

            var respuesta = await fetch("http://localhost:3000/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: nombre,
                    telefono: telefono,
                    correo: correo,
                    producto: productoCompleto,
                    cantidad: cantidad,
                    zona: zona,
                    direccion: direccion
                })
            });

            var resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.error || "No se pudo guardar el pedido."
                );
            }

            // ACTUALIZAR EL STOCK LOCAL PARA MOSTRARLO

            stock[producto] = resultado.stockRestante;

            localStorage.setItem(
                "stockHouseOfCaps",
                JSON.stringify(stock)
            );

            actualizarStockVisual();

            // PREPARAR MENSAJE DE WHATSAPP

            var mensajeWhatsApp =
                "🏠 HOUSE OF CAPS — PEDIDO DESDE LA PÁGINA\n\n" +
                "👤 Nombre: " + nombre + "\n" +
                "📱 Teléfono: " + telefono + "\n" +
                "📧 Correo: " + correo + "\n" +
                "🧢 Producto: " + productoCompleto + "\n" +
                "🔢 Cantidad: " + cantidad + "\n" +
                "📍 Zona: " + zona + "\n" +
                "🏠 Dirección: " + direccion + "\n" +
                "Gracias por comprar en House Of Caps. 💜";

            var enlaceWhatsApp =
                "https://wa.me/59163391075?text=" +
                encodeURIComponent(mensajeWhatsApp);

            // ENVIAR CORREO

            var datosPedido = {
                nombre: nombre,
                telefono: telefono,
                correo: correo,
                producto: productoCompleto,
                cantidad: cantidad,
                zona: zona,
                direccion: direccion
            };

            try {
                await emailjs.send(
                    "service_ykb2bpr",
                    "template_a4ihom1",
                    datosPedido
                );

                console.log("Correo enviado correctamente.");

            } catch (errorCorreo) {
                console.error("No se pudo enviar el correo:", errorCorreo);
                alert("El pedido se guardó en MySQL, pero no se pudo enviar el correo.");
            }

            alert(
                "¡Pedido guardado correctamente!\n" +
                "Número de pedido: " + resultado.pedidoId
            );

            formulario.reset();

            // ABRIR WHATSAPP

            window.location.href = enlaceWhatsApp;

        } catch (error) {

            console.error("Error al guardar el pedido:", error);

            alert("No se pudo guardar el pedido: " + error.message);

        } finally {

            if (botonEnviar) {
                botonEnviar.disabled = false;
            }

        }

    });

}
/* =========================================
   ACTUALIZAR STOCK AL CARGAR LA PÁGINA
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        actualizarStockVisual();

    }
);