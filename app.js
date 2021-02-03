//selectores
const contenedorCarrito = document.querySelector('.contenedor-carrito');

const carrito = document.querySelector('.carrito');

let listaProductos;

const contenedorProductosCarnes = document.querySelector('.carnes');

const contenedorProductosVegeterianas = document.querySelector('.vegetarianas')

const HtmlPrecioTotal = document.querySelector('.carrito-precio-total')

let ProductosCarrito = [];

let stockProductos;

//listeners

carrito.addEventListener('click', quitarProductoAlCarrito);

document.addEventListener('DOMContentLoaded', () => {

    //ajax
    $.ajax({
        url: 'productos.json',
        success: function (data, status, xhr) {
            stockProductos = (data);
            console.log(status)
            console.log(xhr)
            dibujarProductos()
            listaProductos = document.querySelector('.Productos');
            listaProductos.addEventListener('click', agregarProducto);
        },
        error: function (xhr, status, errorThrown) {
            //console.log(xhr)
            //console.log(status)
            console.log(errorThrown)
        }
    });


    //levanto carrito del local storage

    ProductosCarrito = JSON.parse(localStorage.getItem('carrito'));

    if (ProductosCarrito == null) {
        ProductosCarrito = []
    }


    // dibujo nuevamente carrito con los elementos del local storage

    llenarCarrito()

});

//

//funciones

//funcion para dibujar html en base a json
function dibujarProductos() {
    stockProductos.forEach(producto => {
        insertarProducto(producto)
    })
}

function insertarProducto(producto) {
    const {
        nombre,
        imagen,
        precio,
        id,
        categoria,
        ingredientes
    } = producto;
    const divcard = document.createElement('div');

    divcard.innerHTML = ` 
    <div class="cartas-sombras mb-4">
        <div class="shadow-lg card" style="width: 17rem;">
          <img src="${imagen}" class="item-imagen card-img-top" alt="...">
          <div class="item card-body">
            <h5 class="item-title card-title">${nombre}</h5>
            <p class="card-text">
              <ul>
                <li>${ingredientes[0]}</li>
                <li>${ingredientes[1]}</li>
                <li>${ingredientes[2]}</li>
                <li>${ingredientes[3]}</li>

                <li class="shadow-lg text-warning item-precio">${"$"+precio}</li>
              </ul>
            </p>
            </p>
            <button href="" class="botonComprar btn btn-dark " data-id="${id}">Comprar</button>
          </div>
        </div>
      </div>
      `


    if (categoria == "carne") {
        contenedorProductosCarnes.appendChild(divcard)
    } else if (categoria == "vegetariana") {
        contenedorProductosVegeterianas.appendChild(divcard)
    } else {
        console.log("categoria desconocida: " + nombre)
    }

}



//quitar producto
function quitarProductoAlCarrito(e) {
    if (e.target.classList.contains('borrar-producto')) {
        const productoId = e.target.getAttribute('data-id');
        //console.log(productoId);
        //aca se filtran los productos
        ProductosCarrito = ProductosCarrito.filter(producto => producto.id != productoId);

        vaciarCarrito()
        llenarCarrito()
        guardarStorage()

    }
}
//restar unidades del producto
function restarProducto(id) {
    const producto = ProductosCarrito.find(producto => producto.id == id)
    if (producto.cantidad > 1) {
        producto.cantidad--
    }

    //console.log(productoId);
    //aca se filtran los productos

    vaciarCarrito()
    llenarCarrito()
    guardarStorage()


}

function sumarProducto(id) {

    //console.log(productoId);
    //aca se filtran los productos
    ProductosCarrito.find(producto => producto.id == id).cantidad++

    vaciarCarrito()
    llenarCarrito()
    guardarStorage()


}



function agregarProducto(e) {


    //selecciono el card del producto
    if (e.target.classList.contains('botonComprar')) {
        const seleccionProducto = e.target.parentElement.parentElement

        obtenerDatos(seleccionProducto);
        //console.log(seleccionProducto);
    }
}

function obtenerDatos(producto) {
    //extraigo la informacion del prod
    // console.log(producto.querySelector('img'))
    const productoAgregado = {
        imagen: producto.querySelector('.item-imagen').src,
        nombre: producto.querySelector('.item-title').textContent,
        precio: producto.querySelector('.item-precio').textContent.replace('$', ''),
        id: producto.querySelector('button').getAttribute('data-id'),
        cantidad: 1

    }
    /*evitar que los productos se repitan */
    const existe = ProductosCarrito.some(producto => producto.id == productoAgregado.id);
    //Producto existende
    if (existe) {
        const productos = ProductosCarrito.map(producto => {
            if (producto.id === productoAgregado.id) {
                producto.cantidad++;
                return producto;
            } else {
                return producto;
            }
        })
        ProductosCarrito = [...productos];
    } else {

        ProductosCarrito.push(productoAgregado);
    }

    //console.log(ProductosCarrito);
    //insertarCarritohtml();
    vaciarCarrito()
    llenarCarrito()
    guardarStorage()
}

// guargar en el storage
function guardarStorage() {
    localStorage.setItem('carrito', JSON.stringify(ProductosCarrito));
    //console.log(localStorage.getItem('carrito'))
}


function llenarCarrito() {
    let precioTotal = 0
    ProductosCarrito.forEach(producto => {
        console.log(producto)
        //suma total
        precioTotal += parseFloat(producto.precio) * parseFloat(producto.cantidad)
        insertarElemento(producto)

    });
    //dibujo precio total html
    HtmlPrecioTotal.innerHTML = "$" + precioTotal
    console.log(HtmlPrecioTotal)


    //console.log(precioTotal)
}

function vaciarCarrito() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// aca comienzo a dibujar mi carrito en el modal,html
function insertarElemento(producto) {
    const {
        nombre,
        imagen,
        precio,
        cantidad,
        id
    } = producto;
    const divcard = document.createElement('div');

    divcard.innerHTML = `
         <div class="row mb-3 mt-3">
            <div class="col-3">
              <div class="">
                <h6>${nombre}</h6>
                
              </div>
                </div>
                  <div class="col-3">
                   <div class=" ">
                <img src="${imagen}" width="100" alt="" class="rounded" >  
                
            </div>
            </div>
            <div class="col-2">
            <div class="">
                <h6 class="">$${precio}</h6>
            </div>
            </div>
            <div class="col-2">
            
          <div class="">
        
          
          <a type="button" onclick="restarProducto(${id})" href="#" class="restar-producto btn btn-danger" data-id="${id}"> - </a>
          <span>${cantidad}</span>
          <a type= "button" onclick="sumarProducto(${id})" href="#" class="sumar-producto btn btn-success" data-id="${id}"> + </a>
          

            
            </div>
          </div>
        
     <div class="col-2">
          <div>
            <a type="button" href="#" class="borrar-producto btn botonborrar" data-id="${id}">✘</a>
          </div>
        </div>
          </div>

        `

    contenedorCarrito.appendChild(divcard)
}


//jquery

$(function () {
    $('[data-toggle="modal-1"]').hover(function () {
        var modalId = $(this).data('target');
        $(modalId).modal('show');
    });
});


$('.encabezado').hide(5000)