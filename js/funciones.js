//----------------------------FUNCIONES-----------------------------------------------------

//Función para cargar datos desde archivo json
const cargarDatos = async () => {
    try {
        const response = await fetch("./data.json");
        const data = await response.json();
        catalogo = data;
        mostrarLibros(catalogo);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al cargar el catálogo',
            footer: 'Vuelve a intentar en unos minutos'
        });
    };
};

//Función para mostrar el texto en opción "Quienes somos" de barra navegación
const mostrarTexto = () => {
    let divTexto = document.createElement("div");
    divTexto.className = "parrafoMenu";
    divTexto.id = "parrafoMenu";
    divTexto.innerHTML = "Somos LeO MÁS, un emprendimiento que tiene como objetivo que puedas acceder a más libros, en forma rápida y económica";
    document.body.append(divTexto);
};

//Función para mostrar el texto en opción "Como comprar" de barra navegación 
const mostrarTextoComprar = () => {
    let divTexto = document.createElement("div");
    divTexto.className = "parrafoMenu";
    divTexto.id = "parrafoMenu";
    divTexto.innerHTML = "Elegí tu libro en nuestro catálogo, podés buscar por autor o por título, también elegir en que idioma querés leer o cuánto querés gastar. Abonalo con tarjeta de crédito y recibilo GRATIS en el domicilio que indiques";
    document.body.append(divTexto);
};

//Función para quitar el texto de cada opción en barra navegación al pasar a la otra
const quitarTexto = () => {
    let div = document.getElementById("parrafoMenu");
    div.remove();
};

//Función para mostrar los libros
const mostrarLibros = arregloLibros => {
    let contenedor = document.getElementById("listaLibros");
    contenedor.innerHTML = "";
    arregloLibros.forEach(item => {
        let card = document.createElement("div");
        card.className = "cardLibros col-12 col-md-6 col-lg-4";
        card.innerHTML = `               
            <p class="cardTitulo">${item.titulo.toUpperCase()}</p>
            <p class="cardAutor">${item.autor}</p>
            <img class="tapa" src="${item.tapa}">
            <p class="cardPrecio">$${item.precio}</p>
            <button id="boton${item.id}" class="button"> Comprar </button>            
            `;
        contenedor.append(card);
        let botonComprar = document.getElementById(`boton${item.id}`);
        botonComprar.addEventListener("click", () => agregarAlCarrito(item));
    });
};

//Función para filtrar por idioma y mostrar resultado
const filtrarIdioma = idiomaElegido => {
    const filtradosPorIdioma = catalogo.filter((item) => item.idioma === idiomaElegido);
    mostrarLibros(filtradosPorIdioma);
};

//Función para mostrar mensaje cuando no hay coincidencias de búsqueda
const noCoincidencia = () => {
    let contenedor = document.getElementById("listaLibros");
    contenedor.innerHTML = `
                        <h2>No hay libros que coincidan con esta búsqueda</h2>
                        `;
};

//Función para agregar un libro al carrito
const agregarAlCarrito = libro => {
    let carritoStorage = localStorage.getItem("librosCarrito");
    let carrito = carritoStorage ? JSON.parse(carritoStorage) : []; 
    let producto = {
        id: libro.id,
        tapa: libro.tapa,
        titulo: libro.titulo,
        autor: libro.autor,
        precio: libro.precio,
    };
    carrito.push(producto);

    carritoAbierto && verCarrito(carrito); //esta línea me permite que si el carito está cerrado, no se abra al comprar un libro

    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Agregaste un libro al Carrito de Compras',
        showConfirmButton: false,
        timer: 1700,
        background: '#f8efde'
    });
    localStorage.setItem("librosCarrito", JSON.stringify(carrito));
};

//Función para mostrar carrito 
const verCarrito = carro => {
    carritoAbierto = true;
    let divCarrito = document.getElementById("contenedorCarrito");
    divCarrito.className = "carrito";
    divCarrito.innerHTML = "";
    carro.forEach(item => {
        let cardCarrito = document.createElement("div");
        cardCarrito.className = "libroCarrito";
        cardCarrito.innerHTML = `
        <img src="${item.tapa}"> 
        <div class="tituloAutorCarrito">   
            <p>${item.titulo.toUpperCase()}</p>
            <p>${item.autor}</p> 
        </div>               
        <b>$${item.precio}</b>
        <button id="botonBorrar${item.id}" class="button">Quitar</button>
        `;
        divCarrito.append(cardCarrito);

        let borrarlibro = document.getElementById(`botonBorrar${item.id}`);
        borrarlibro.addEventListener("click", () => quitarLibroCarrito(item.id));
    });
    //calcular el importe total
    let importeTotal = carro.reduce((acum, item) => acum + item.precio, 0);
    totalCarrito = document.createElement("div");
    totalCarrito.className = "carritoTotal";
    totalCarrito.innerHTML = `
        <hr>
        <b>Total: $${importeTotal}</b>
        <hr>
        <button id="cerrarCarrito" class="button">Cerrar</button>
    `;
    divCarrito.append(totalCarrito);
    let cerrarCarrito = document.getElementById("cerrarCarrito");
    cerrarCarrito.addEventListener("click", () => {
        divCarrito = document.getElementById("contenedorCarrito");
        divCarrito.innerHTML = "";
        divCarrito.classList.remove("carrito");
        carritoAbierto = false;
    });

    //botón Finalizar Compra
    let botonCompra = document.createElement("button");
    botonCompra.className = "button";
    botonCompra.id = "botonCompra"
    botonCompra.innerHTML = `Finalizar Compra`;
    divCarrito.append(botonCompra);

    botonCompra.addEventListener("click", () => {
               finalizarCompra(importeTotal);               
    });
};

//Función para quitar libros del carrito
const quitarLibroCarrito = id => {
    let carritoStorage = localStorage.getItem("librosCarrito");
    carrito = JSON.parse(carritoStorage);
    let nuevoCarrito = carrito.filter(libro => libro.id != id);
    localStorage.setItem("librosCarrito", JSON.stringify(nuevoCarrito));
    verCarrito(nuevoCarrito);
};

//Función para finalizar compra
const finalizarCompra = (importe) => {
    //cerrar carrito
    let divCarrito = document.getElementById("contenedorCarrito");
    divCarrito.innerHTML = "";
    divCarrito.classList.remove("carrito");
    carritoAbierto = false;

    //hacer aparecer el formulario quitando la clase .oculto
    let formPago = document.getElementById("contenedorFormPago");
    formPago.classList.remove("oculto");

    //dar funcionalidad al botón CANCELAR
    let botonCancelar = document.getElementById("botonCancelar");
    botonCancelar.addEventListener("click", () => {
        formPago.classList.add("oculto");
    });

    //dar funcionalidad al botón PAGAR    
    let formularioPago = document.getElementById("formularioPago");
    formularioPago.addEventListener("submit", (e) => {
        e.preventDefault();
        // validar número de tarjeta y finalizar compra
        let inputNroTarjeta = e.target.children[6].children[2].children;
        let nroTarjeta = inputNroTarjeta[1].value;

        if (nroTarjeta.toString().length != 16) {
            inputNroTarjeta[1].value = "";
            Swal.fire({
                icon: 'error',
                title: 'Número de tarjeta inválido',
                text: 'Debe contener 16 dígitos',
            })
        } else {
            Swal.fire({
                title: '¿Seguro de realizar la compra?',
                text: `Abonarás $${importe} por tus libros`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, abonar'
                
              }).then((result) => {
                if (result.isConfirmed) {
                  Swal.fire(
                    '¡Genial!',
                    'En breve nos comunicaremos para coordinar la entrega',
                    'success'
                  )
                  formPago.classList.add("oculto");
                  //borrar localStorage ya que finalizó la compra 
                  localStorage.clear();
                };
              })           
        };
    })        
};
