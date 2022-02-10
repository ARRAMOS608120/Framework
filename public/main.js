const socket = io.connect();

const formProducto = document.getElementById('formProducto')
formProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formProducto[0].value,
        price: formProducto[1].value,
        thumbnail: formProducto[2].value
    }
    
    enviarYRecibirProductos(producto)

   // socket.emit('update', producto);
})

async function enviarYRecibirProductos(producto) {

    const options = {
        method: "POST", 
        body: JSON.stringify(producto), 
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const r = await fetch('/api/productos', options)
    console.log(r)
    //Obtenemos el listado de productos
    cargarTablaProductos();

}

async function cargarTablaProductos() {
    const res = await fetch('/api/productos')
    const data = await res.json()
    console.log("------------------------------------")
    console.log(data)
    actualizarProductos(data);
}

/*socket.on('productos', productos => {
    listadoHTML(productos).then(html => {
        document.getElementById('productos').innerHTML = html
    })
});

function listadoHTML(productos) {
    return fetch('plantillas/listaProductos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}*/


const inputMail = document.getElementById('inputMail')
const inputNombre =document.getElementById('inputNombre')
const inputApellido =document.getElementById('inputApellido')
const inputEdad =document.getElementById('inputEdad')
const inputAlias =document.getElementById('inputAlias')
const inputAvatar =document.getElementById('inputAvatar')

const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formMensaje = document.getElementById('formMensaje')
formMensaje.addEventListener('submit', e => {
    e.preventDefault()
    const author = {
        id: inputMail.value,
        nombre: inputNombre.value,
        apellido: inputApellido.value,
        edad: inputEdad.value,
        alias: inputAlias.value,
        avatar: inputAvatar.value
    }
    console.log(author);
    const mensaje = { autor: author, texto: inputMensaje.value }
    socket.emit('nuevoMensaje', mensaje);
})

socket.on('mensajes', mensajes => {
    console.log(mensajes);
    const html = listMensajesHTML(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function listMensajesHTML(mensajes) {
    return mensajes.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.autor}</b>
                [<span style="color:brown;">${mensaje.fyh}</span>] :
                <i style="color:green;">${mensaje.texto}</i>
            </div>
        `)
    }).join(" ");
}

async function actualizarProductos(productos) {
    // console.log("LISTA PROD: " + productos)

    // busco la plantilla del servidor
    const recursoRemoto = await fetch('plantillas/listaProductos.hbs')

    //extraigo el texto de la respuesta del servidor
    const textoPlantilla = await recursoRemoto.text()

    //armo el template con handlebars
    const functionTemplate = Handlebars.compile(textoPlantilla)

    // relleno la plantilla con las personas recibidas
    const html = functionTemplate({ productos })

    // reemplazo el contenido del navegador con los nuevos datos
    document.getElementById('productos').innerHTML = html

}