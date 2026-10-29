/* =========================================
   STOCK INICIAL DE LAS 24 GORRAS
========================================= */

var stockInicial = {

    "Gorra Combinada 1": 120,
    "Gorra Combinada 2": 80,
    "Gorra Combinada 3": 150,
    "Gorra Combinada 4": 100,
    "Gorra Combinada 5": 120,
    "Gorra Combinada 6": 90,
    "Gorra Combinada 7": 75,
    "Gorra Combinada 8": 200,

    "Gorra Camuflada 1": 100,
    "Gorra Camuflada 2": 120,
    "Gorra Camuflada 3": 80,
    "Gorra Camuflada 4": 150,
    "Gorra Camuflada 5": 90,
    "Gorra Camuflada 6": 110,
    "Gorra Camuflada 7": 70,
    "Gorra Camuflada 8": 130,

    "Gorra Negra 1": 120,
    "Gorra Negra 2": 100,
    "Gorra Negra 3": 150,
    "Gorra Negra 4": 80,
    "Gorra Negra 5": 100,
    "Gorra Negra 6": 90,
    "Gorra Negra 7": 110,
    "Gorra Negra 8": 75
};


/* =========================================
   CARGAR STOCK
========================================= */

var stockGuardado =
    localStorage.getItem("stockHouseOfCaps");

var stock;

if (stockGuardado) {

    stock = JSON.parse(stockGuardado);

} else {

    stock = { ...stockInicial };

    localStorage.setItem(
        "stockHouseOfCaps",
        JSON.stringify(stock)
    );
}


/* =========================================
   CARRUSEL PRINCIPAL
========================================= */

var swiperPrincipal =
    new Swiper(".mySwiper-1", {

        loop: true,

        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },

        navigation: {
            nextEl: ".mySwiper-1 .swiper-button-next",
            prevEl: ".mySwiper-1 .swiper-button-prev"
        },

        pagination: {
            el: ".mySwiper-1 .swiper-pagination",
            clickable: true
        }

    });


/* =========================================
   MOSTRAR CATEGORÍA
========================================= */

function mostrarCategoria(categoria, boton) {

    var categorias =
        document.querySelectorAll(".categoria-productos");

    categorias.forEach(function(elemento) {

        elemento.classList.remove("activa");

    });


    var categoriaSeleccionada =
        document.getElementById(categoria);

    if (categoriaSeleccionada) {

        categoriaSeleccionada.classList.add("activa");

    }


    var botones =
        document.querySelectorAll(".categoria-btn");

    botones.forEach(function(elemento) {

        elemento.classList.remove("activo");

    });


    boton.classList.add("activo");
}


/* =========================================
   MOSTRAR STOCK
========================================= */

function actualizarStockVisual() {

    var tarjetas =
        document.querySelectorAll(".producto-card");


    tarjetas.forEach(function(tarjeta) {

        var boton =
            tarjeta.querySelector(".buy-btn");

        if (!boton) {
            return;
        }


        var productoCompleto =
            boton.getAttribute("data-producto");

        if (!productoCompleto) {
            return;
        }


        var producto =
            productoCompleto.split(" - ")[0];


        if (stock[producto] === undefined) {
            return;
        }


        var cantidad =
            stock[producto];


        var informacion =
            tarjeta.querySelector(".producto-info");

        if (!informacion) {
            return;
        }


        var stockElemento =
            informacion.querySelector(".stock");


        if (!stockElemento) {

            stockElemento =
                document.createElement("div");

            stockElemento.className = "stock";


            var precio =
                informacion.querySelector("span");


            if (precio) {

                informacion.insertBefore(
                    stockElemento,
                    precio
                );

            } else {

                informacion.appendChild(
                    stockElemento
                );

            }

        }


        if (cantidad > 0) {

    stockElemento.textContent =
        cantidad + " disponibles";

    stockElemento.classList.remove("agotado");

    boton.disabled = false;

    boton.textContent = "Comprar";

} else {

    /* MOSTRAR AGOTADO EN LA TARJETA */

    stockElemento.textContent =
        "AGOTADO";

    stockElemento.classList.add("agotado");

    /* CAMBIAR EL BOTÓN */

    boton.disabled = false;

    boton.textContent =
        "AGOTADO";
}

    });
}


/* =========================================
   MOSTRAR STOCK AL CARGAR
========================================= */

actualizarStockVisual();


/* =========================================
   BOTONES COMPRAR
========================================= */

document.addEventListener("click", function(event) {

    var boton =
        event.target.closest(".buy-btn");

    if (!boton) {
        return;
    }


    var productoCompleto =
        boton.getAttribute("data-producto");


    if (!productoCompleto) {
        return;
    }


    var producto =
        productoCompleto.split(" - ")[0];


    var disponible =
        stock[producto];


    /* PRODUCTO AGOTADO */

    if (disponible <= 0) {

        alert(
            "⚠️ PRODUCTO AGOTADO\n\n" +
            "Lo sentimos, " +
            producto +
            " ya no tiene unidades disponibles."
        );

        return;
    }


    /* COLOCAR PRODUCTO */

    var campoProducto =
        document.getElementById("producto");


    if (campoProducto) {

        campoProducto.value =
            productoCompleto;

    }


    /* BORRAR CANTIDAD ANTERIOR */

    var campoCantidad =
        document.getElementById("cantidad");


    if (campoCantidad) {

        campoCantidad.value = "";

    }


    /* IR AL FORMULARIO */

    var formularioSeccion =
        document.getElementById("formulario");


    if (formularioSeccion) {

        formularioSeccion.scrollIntoView({
            behavior: "smooth"
        });

    }

});


/* =========================================
   FORMULARIO
========================================= */

var formulario =
    document.getElementById("pedidoForm");


if (formulario) {

    formulario.addEventListener(
        "submit",
        function(event) {


            var productoCompleto =
                document.getElementById("producto").value;


            var cantidad =
                parseInt(
                    document.getElementById("cantidad").value
                );


            /* ==============================
               COMPROBAR PRODUCTO
            ============================== */

            if (productoCompleto === "") {

                event.preventDefault();

                alert(
                    "⚠️ Por favor selecciona una gorra."
                );

                return;
            }


            /* ==============================
               COMPROBAR CANTIDAD
            ============================== */

            if (isNaN(cantidad) || cantidad <= 0) {

                event.preventDefault();

                alert(
                    "⚠️ Ingresa una cantidad válida."
                );

                return;
            }


            /* ==============================
               OBTENER PRODUCTO
            ============================== */

            var producto =
                productoCompleto.split(" - ")[0];


            /* ==============================
               OBTENER STOCK
            ============================== */

            var disponible =
                stock[producto];


            if (disponible === undefined) {

                event.preventDefault();

                alert(
                    "⚠️ No se encontró el stock de este producto."
                );

                return;
            }


            /* ==============================
               PRODUCTO AGOTADO
            ============================== */

            if (disponible <= 0) {

                event.preventDefault();

                alert(
                    "⚠️ PRODUCTO AGOTADO\n\n" +
                    "Lo sentimos, " +
                    producto +
                    " ya no tiene unidades disponibles."
                );

                actualizarStockVisual();

                return;
            }


            /* ==============================
               MÁS DEL STOCK DISPONIBLE
            ============================== */

            if (cantidad > disponible) {

                event.preventDefault();

                alert(
                    "⚠️ NO SE PUEDE REALIZAR LA COMPRA\n\n" +
                    "Producto: " +
                    producto +
                    "\n\n" +
                    "Solo quedan " +
                    disponible +
                    " gorras disponibles.\n\n" +
                    "Has solicitado " +
                    cantidad +
                    " gorras."
                );

                return;
            }


            /* ==============================
               DESCONTAR STOCK
            ============================== */

            stock[producto] =
                disponible - cantidad;


            /* GUARDAR STOCK */

            localStorage.setItem(
                "stockHouseOfCaps",
                JSON.stringify(stock)
            );


            /* ACTUALIZAR PANTALLA */

            actualizarStockVisual();


            /* ==============================
               MENSAJE DE COMPRA
            ============================== */

            if (stock[producto] > 0) {

                alert(
                    "✅ PEDIDO REALIZADO\n\n" +
                    "Producto: " +
                    producto +
                    "\n\n" +
                    "Cantidad comprada: " +
                    cantidad +
                    "\n\n" +
                    "Quedan " +
                    stock[producto] +
                    " disponibles."
                );

            } else {

                alert(
                    "✅ PEDIDO REALIZADO\n\n" +
                    "Producto: " +
                    producto +
                    "\n\n" +
                    "Se vendieron las últimas unidades.\n\n" +
                    "El producto ahora está AGOTADO."
                );

            }

            /*
               NO ponemos preventDefault aquí.
               Por eso el formulario puede enviarse
               normalmente a FormSubmit.
            */

        }
    );

}