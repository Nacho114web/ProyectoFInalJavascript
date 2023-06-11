//----------------------------VARIABLES GLOBALES-------------------------------------------
let catalogo = [];  //todos los libros disponibles
let carritoAbierto=false; //indica carrito en pantalla


//----------------------------CLASES-------------------------------------------------------
/*class Libros {
    constructor(id, titulo, autor, precio, idioma, tapa) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.precio = precio;
        this.idioma = idioma;
        this.tapa = tapa;
    };        
};*/

//-----------------------------BARRA DE NAVEGACIÓN-------------------------------------------
//Funcionalidad para mostrar todo el catálogo al clickear el logo
let logo = document.querySelector(".navbar-brand img");
logo.addEventListener("click", (e) => mostrarLibros(catalogo)
);

//Funcionalidad para mostrar descripcción de las opciones al pasar el mouse
let opcionMenu = document.getElementById("opcionQuienesSomos");
opcionMenu.addEventListener("mouseover", mostrarTexto);
opcionMenu.addEventListener("mouseout", quitarTexto);

let opcionMenu2 = document.getElementById("opcionComoComprar");
opcionMenu2.addEventListener("mouseover", mostrarTextoComprar);
opcionMenu2.addEventListener("mouseout", quitarTexto);

//---------------------------CARGAR EL CATÁLOGO DESDE JSON --------------
//--------------------------- Y MOSTRAR AL INICIAR PÁGINA----------------
cargarDatos();

//--------------------BUSCAR LIBROS POR TÍTULO O AUTOR-----------------
let busquedaTituloAutor = document.getElementById("busquedaTituloAutor");
busquedaTituloAutor.addEventListener("submit", (e) => {
    e.preventDefault();
    let buscador = document.getElementById("buscador");
    const encontrados = catalogo.filter((item) => item.titulo.toLowerCase().includes(buscador.value) || item.autor.toLowerCase().includes(buscador.value));
    encontrados.length === 0 ? noCoincidencia() : mostrarLibros(encontrados);
});

//----------------------BUSCAR LIBROS POR IDIOMA-------------------------
let formularioIdioma = document.getElementById("formIdioma");
formularioIdioma.addEventListener("submit", (e) => {
    e.preventDefault();
    //tomar valor radio buttons
    let radiosIdioma = document.querySelectorAll('input[name="idioma"]');
    for (let i = 0; i < radiosIdioma.length; i++) {
        if (radiosIdioma[i].checked) {
            idiomaSeleccionado = radiosIdioma[i].value;
        };
    };
    //mostrar idiomas
    idiomaSeleccionado === "todos" && mostrarLibros(catalogo);
    idiomaSeleccionado === "español" && filtrarIdioma(idiomaSeleccionado);
    idiomaSeleccionado === "inglés" && filtrarIdioma(idiomaSeleccionado);
    idiomaSeleccionado === "italiano" && filtrarIdioma(idiomaSeleccionado);
});

//--------------------BUSCAR LIBROS POR PRECIO---------------------------
let formularioPrecio = document.getElementById("formPrecio");
formularioPrecio.addEventListener("submit", (e) => {
    e.preventDefault();
    //tomar valores del formulario    
    let inputs = e.target.children;
    let minimo = inputs[2].value;
    let maximo = inputs[4].value;
    //validar y mostrar resultados
    if (minimo && maximo) {
        const filtradosPorPrecio = catalogo.filter((item) => item.precio >= minimo && item.precio <= maximo);
        filtradosPorPrecio.length === 0 ? noCoincidencia() : mostrarLibros(filtradosPorPrecio);
    } else {
        noCoincidencia();
    };
});

//---------------------------ABRIR CARRITO------------------------------
let mostrarCarrito = document.getElementById("imagenCarrito");
mostrarCarrito.addEventListener("click", () => {
    let carritoStorage = localStorage.getItem("librosCarrito");
    let carrito = carritoStorage ? JSON.parse(carritoStorage) : []; 
    verCarrito(carrito);  
      
});







