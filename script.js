  let contract;

        const contratoABI = [{"inputs":[{"internalType":"string","name":"_nombreToken","type":"string"},{"internalType":"string","name":"_simboloToken","type":"string"},{"internalType":"uint8","name":"_decimalesToken","type":"uint8"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usuario","type":"address"},{"indexed":false,"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"DepositoETH","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"nuevoFeeCompra","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"nuevoFeeVenta","type":"uint256"}],"name":"FeeActualizado","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usuario","type":"address"},{"indexed":true,"internalType":"uint256","name":"tipoCaja","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"FondosBloqueados","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usuario","type":"address"},{"indexed":true,"internalType":"uint256","name":"tipoCaja","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"FondosDesbloqueados","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"destino","type":"address"},{"indexed":false,"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"usuario","type":"address"},{"indexed":false,"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"nuevoSaldo","type":"uint256"}],"name":"ModificacionSaldo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"nuevoPrecio","type":"uint256"}],"name":"PrecioCriptomonedaActualizado","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tipoCaja","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"nuevoPorcentaje","type":"uint256"}],"name":"RecompensaAportacionLiquidezActualizada","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"cantidad","type":"uint256"},{"indexed":false,"internalType":"string","name":"tipo","type":"string"}],"name":"RecompensaCreada","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"usuario","type":"address"},{"indexed":false,"internalType":"uint256","name":"cantidad","type":"uint256"},{"indexed":false,"internalType":"string","name":"tipo","type":"string"}],"name":"RecompensaReclamada","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"origen","type":"address"},{"indexed":true,"internalType":"address","name":"destino","type":"address"},{"indexed":false,"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"TransferenciaEntreCajas","type":"event"},{"inputs":[{"internalType":"uint256","name":"tipoCaja","type":"uint256"},{"internalType":"uint256","name":"nuevoPorcentaje","type":"uint256"}],"name":"actualizarRecompensaAportacionLiquidez","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"internalType":"uint256","name":"cantidadCajas","type":"uint256"},{"internalType":"uint256","name":"cantidadUSD","type":"uint256"}],"name":"comprarConBNBDesdeBilletera","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"internalType":"uint256","name":"cantidadCajas","type":"uint256"}],"name":"comprarConUSD","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usuario","type":"address"},{"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"}],"name":"consultarBalanceUsuario","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"usuario","type":"address"}],"name":"consultarDetalleUsuario","outputs":[{"components":[{"internalType":"uint256","name":"saldoUSDT","type":"uint256"},{"internalType":"uint256","name":"saldoBTC","type":"uint256"},{"internalType":"uint256","name":"saldoETH","type":"uint256"},{"internalType":"uint256","name":"saldoUSDE","type":"uint256"},{"internalType":"uint256","name":"saldoBNB","type":"uint256"},{"internalType":"uint256","name":"saldoTotalUSD","type":"uint256"}],"internalType":"struct USDEx.DetalleUsuario","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"}],"name":"consultarSupplyActual","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"cantidad","type":"uint256"},{"internalType":"enum USDEx.TipoCaja","name":"tipo","type":"uint8"}],"name":"crearRecompensa","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimalesToken","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"depositarETH","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"usuario","type":"address"},{"internalType":"uint256","name":"tipoCaja","type":"uint256"},{"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"desbloquearFondos","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"feeCompra","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeVenta","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"destino","type":"address"},{"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"mintearUSD","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"usuario","type":"address"},{"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"modificarSaldoCaja","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nombreToken","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"preciosCriptomonedas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"propietario","outputs":[{"internalType":"address payable","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reclamarRecompensa","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tipoCaja","type":"uint256"}],"name":"reclamarRecompensaAportacionLiquidez","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"recompensaActual","outputs":[{"internalType":"uint256","name":"cantidad","type":"uint256"},{"internalType":"enum USDEx.TipoCaja","name":"tipo","type":"uint8"},{"internalType":"bool","name":"activa","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"recompensaReclamada","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"recompensasAportacionLiquidez","outputs":[{"internalType":"uint256","name":"porcentajeDiario","type":"uint256"},{"internalType":"uint256","name":"ultimaActualizacion","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"nuevoFeeCompra","type":"uint256"},{"internalType":"uint256","name":"nuevoFeeVenta","type":"uint256"}],"name":"setFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"internalType":"uint256","name":"precioUSD","type":"uint256"}],"name":"setPrecioCriptomoneda","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"simboloToken","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"origen","type":"address"},{"internalType":"address","name":"destino","type":"address"},{"internalType":"enum USDEx.TipoCaja","name":"tipoCaja","type":"uint8"},{"internalType":"uint256","name":"cantidad","type":"uint256"}],"name":"transferirEntreCajas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawFunds","outputs":[],"stateMutability":"nonpayable","type":"function"}];

async function consultarSaldosContrato(userAddress) {
  try {
    const web3 = new Web3(window.ethereum);

    
    const contratoAddress = '0x03bc935dDDDD0245b54446F2580c13030053d470';

   
    const contrato = new web3.eth.Contract(contratoABI, contratoAddress);

   
    const detalleUsuario = await contrato.methods.consultarDetalleUsuario(userAddress).call();

    console.log('Respuesta de consultarDetalleUsuario:', detalleUsuario);

    if (detalleUsuario && detalleUsuario.length > 0) {
      const saldoUSDT = detalleUsuario[0];
      const saldoBTC = detalleUsuario[1];
      const saldoETH = detalleUsuario[2];
      const saldoUSDE = detalleUsuario[3];
      const saldoBNB = detalleUsuario[4]; 
      const saldoTotalUSD = detalleUsuario[5]; 

     
      console.log('Saldos recuperados:', {
        saldoUSDT,
        saldoBTC,
        saldoETH,
        saldoUSDE,
        saldoBNB,
        saldoTotalUSD

      });

   
      return {
        saldoUSDT,
        saldoBTC,
        saldoETH,
        saldoUSDE,
        saldoBNB,
        saldoTotalUSD

      };
    } else {
      console.error('La respuesta de consultarDetalleUsuario está vacía o no tiene el formato esperado.');
      return null;
    }
  } catch (error) {
    console.error('Error en consultarSaldosContrato:', error);
    throw error; 
  }
}

async function conectarMetaMask() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];
      const ethereum = window.ethereum;
      const networkId = await ethereum.request({ method: 'net_version' });
      const networkName = obtenerNombreRed(networkId);

      document.getElementById('direccion').innerText = `${userAddress}`;
      document.getElementById('direccion').classList.remove('oculto');

      mensajeRed.innerText = ` ${networkName}`;
      mensajeRed.classList.remove('oculto');

      const web3 = new Web3(ethereum);

      const ethBalance = await web3.eth.getBalance(userAddress);
      const formattedEthBalance = web3.utils.fromWei(ethBalance, 'ether').slice(0, 6); 
      document.getElementById('saldoETH').innerText = ` ${formattedEthBalance} BNB`;
      document.getElementById('saldoETH').classList.remove('oculto');

      // Consultar los saldos en el contrato
      const saldosContrato = await consultarSaldosContrato(userAddress);

      // Actualizar los elementos HTML con los saldos del contrato
      if (saldosContrato) {
        document.getElementById('saldoUSDTValor').innerText = `${saldosContrato.saldoUSDT} USDT`;
        document.getElementById('saldoContainerUSDT').classList.remove('oculto');

        document.getElementById('saldoBTCValor').innerText = `${saldosContrato.saldoBTC} BTC`;
        document.getElementById('saldoContainerBTC').classList.remove('oculto');

        document.getElementById('saldoETHValor').innerText = `${saldosContrato.saldoETH} ETH`;
        document.getElementById('saldoContainerETH').classList.remove('oculto');

        document.getElementById('saldoUSDEValor').innerText = `${saldosContrato.saldoUSDE} USDE`;
        document.getElementById('saldoContainerUSDE').classList.remove('oculto');

        document.getElementById('saldoBNBValor').innerText = `${saldosContrato.saldoBNB} BNB`;
        document.getElementById('saldoContainerBNB').classList.remove('oculto');
      }

      // Asegúrate de llamar a la función actualizarSaldosEnColumna solo si es necesario
      actualizarSaldosEnColumna(saldosContrato);

      web3Button.innerText = 'WEB3 ACTIVO';
      web3Button.style.backgroundColor = 'green';
      web3Button.style.color = 'white';
    }
            } catch (error) {
                console.error(error);
            }
        }


function obtenerNombreRed(networkId) {
  switch (networkId) {
    case '1':
      return 'Mainnet';
    case '3':
      return 'Ropsten Testnet';
    case '4':
      return 'Rinkeby Testnet';
    case '42':
      return 'Kovan Testnet';
    default:
      return 'BEP20';
  }
}

document.addEventListener('DOMContentLoaded', function () {
    // Establece los valores de los tokens
    document.getElementById('saldoUSDTokenValor').textContent = '$1.00';
    document.getElementById('saldoUSDTTokenValor').textContent = '$1.00';
    document.getElementById('saldoBTCTokenValor').textContent = '$40345.00';
    document.getElementById('saldoETHTokenValor').textContent = '$1993.00';
    document.getElementById('saldoUSDETokenValor').textContent = '$1.00';
    document.getElementById('saldoBNBTokenValor').textContent = '$302.00';
});






     // Función para actualizar los saldos en la interfaz de usuario
function actualizarSaldosEnColumna(saldosContrato) {
  // Verificar que los saldos sean válidos
  if (saldosContrato) {
        document.getElementById('saldoUSDValor').innerText = `${saldosContrato.saldoTotalUSD} USD`;
        document.getElementById('saldoUSDTValor').innerText = `${saldosContrato.saldoUSDT} USDT`;
        document.getElementById('saldoBTCValor').innerText = `${saldosContrato.saldoBTC} BTC`;
        document.getElementById('saldoETHValor').innerText = `${saldosContrato.saldoETH} ETH`;
        document.getElementById('saldoUSDEValor').innerText = `${saldosContrato.saldoUSDE} USDE`;
        document.getElementById('saldoBNBValor').innerText = `${saldosContrato.saldoBNB} BNB`;
      
        document.getElementById('saldoContainerUSD').classList.remove('oculto');
        document.getElementById('saldoContainerUSDT').classList.remove('oculto');
        document.getElementById('saldoContainerBTC').classList.remove('oculto');
        document.getElementById('saldoContainerETH').classList.remove('oculto');
        document.getElementById('saldoContainerUSDE').classList.remove('oculto');
        document.getElementById('saldoContainerBNB').classList.remove('oculto');
  } else {
    // Manejar el caso en que los saldos no sean válidos
    mostrarError('Los saldos no son válidos.');
    actualizarSaldosEnColumna(saldosContrato);

  }
}
async function comprarConBNBDesdeBilletera(tipoCaja, cantidadCajas, cantidadUSD) {
    try {
        // Verificar si MetaMask está instalado y configurado
        if (typeof window.ethereum === 'undefined') {
            console.error('MetaMask no está instalado o configurado correctamente.');
            return;
        }

        // Solicitar al usuario que conecte su cuenta
        await window.ethereum.enable();

        // Obtener la dirección del usuario conectado
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();

        // Verificar si se ha conectado al menos una cuenta
        if (accounts.length === 0) {
            console.error('No se ha conectado ninguna cuenta de MetaMask.');
            return;
        }

        const userAddress = accounts[0];
        console.log('Dirección del usuario:', userAddress);

        // Obtener la instancia del contrato
        const contratoAddress = '0x03bc935dDDDD0245b54446F2580c13030053d470';
        const contrato = new web3.eth.Contract(contratoABI, contratoAddress);

        // Tasas de cambio
        const tasaCambioBNBUSD = 300;   // Ejemplo: 1 BNB = 300 USD
        const tasaCambioBTCUSD = 35000; // Ejemplo: 1 BTC = 35000 USD
        const tasaCambioETHUSD = 2000;  // Ejemplo: 1 ETH = 2000 USD
        const tasaCambioUSDEUSD = 1;    // Ejemplo: 1 USDE = 1 USD

      let cantidadBNB;
        switch (tipoCaja) {
            case 0: // USD
            case 1: // USDT (asumiendo que USDT tiene la misma tasa que USD)
            case 4: // USDE
                cantidadBNB = cantidadUSD / tasaCambioBNBUSD;
                break;
            case 3: // ETH
                cantidadBNB = (cantidadUSD / tasaCambioETHUSD) * tasaCambioBNBUSD;
                break;
            case 2: // BTC
                cantidadBNB = (cantidadUSD / tasaCambioBTCUSD) * tasaCambioBNBUSD;
                break;
            default:
                console.error('Tipo de caja no válido.');
                return;
        }

        // Redondear a un número manejable de decimales y convertir a Wei
        const cantidadBNBWei = web3.utils.toWei(cantidadBNB.toFixed(15), 'ether');

        // Llamar a la función comprarConBNBDesdeBilletera en el contrato
        const resultado = await contrato.methods
                         .comprarConBNBDesdeBilletera(tipoCaja, cantidadCajas, cantidadBNBWei)
                         .send({ from: userAddress, value: cantidadBNBWei });
        console.log('Compra exitosa:', resultado);
    } catch (error) {
        console.error('Error en comprarConBNBDesdeBilletera:', error);
    }
}
function onClickComprarConBNB() {
    const tipoCajaCompraSelect = document.getElementById('tipoCajaCompra');
    const cantidadUSDCompraInput = document.getElementById('cantidadUSDCompra');

    const tipoCajaCompra = parseInt(tipoCajaCompraSelect.value);
    const cantidadUSDCompra = parseFloat(cantidadUSDCompraInput.value);

    if (isNaN(tipoCajaCompra) || isNaN(cantidadUSDCompra) || cantidadUSDCompra <= 0) {
        console.error('Valores no válidos.');
        return;
    }

    // Haces visible el menú desplegable solo si el tipo de caja es USDT
    if (tipoCajaCompra === 1) {
        mostrarMenuDesplegable();
    } else {
        // Puedes ocultar el menú desplegable si no es USDT, según tus necesidades
    }

    comprarConBNBDesdeBilletera(tipoCajaCompra, 0, cantidadUSDCompra);
}


async function comprarActivo(tipoCaja) {
    const cantidadUSD = prompt("Ingrese la cantidad en USD que desea invertir:");
    if (cantidadUSD !== null && cantidadUSD !== "" && !isNaN(cantidadUSD) && Number(cantidadUSD) > 0) {
        await comprarConBNBDesdeBilletera(tipoCaja, 1, Number(cantidadUSD)); // Asume 1 caja por simplicidad
    } else {
        alert("Por favor, introduzca una cantidad válida.");
    }
}

function comprarBtc() {
    // El tipo de caja para BTC es 1
    comprarActivo(2);
}

function comprarETH() {
    // El tipo de caja para ETH es 2
    comprarActivo(3);
}

function comprarUSDE() {
    // El tipo de caja para USDE es 4
    comprarActivo(4);
}
 



async function reclamarRecompensa() {
  try {
    // Verificar si ethereum está disponible
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask no está instalado o activado.');
      return;
    }

    // Obtener la cuenta conectada a MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const cuentaUsuario = accounts[0];

    // Instanciar Web3 y el contrato
    const web3 = new Web3(window.ethereum);
    const contratoAddress = '0x03bc935dDDDD0245b54446F2580c13030053d470';
    const contrato = new web3.eth.Contract(contratoABI, contratoAddress);

    // Llamar a la función reclamarRecompensa en el contrato
    const resultado = await contrato.methods.reclamarRecompensa().send({ from: cuentaUsuario });

    console.log('Recompensa reclamada:', resultado);
    // Aquí puedes realizar acciones adicionales después de reclamar la recompensa si es necesario
  } catch (error) {
    console.error('Error al reclamar la recompensa:', error.message);
  }
}

          function abrirDeposito() {
            window.open('https://usd-exchang-e.vercel.app/deposito.html', '_blank');
        }
var menuVisible = false; 

        
function toggleMenu(idMenu) {
    const menuDesplegable = document.getElementById(idMenu);

    // Invierte el estado de visibilidad del menú al hacer clic en el botón
    menuDesplegable.style.display = (menuDesplegable.style.display === 'none' || menuDesplegable.style.display === '') ? 'block' : 'none';
}

function mostrarMenuTransferir() {
    var menuTransferir = document.getElementById("menuTransferir");
    if (menuTransferir.style.display === "none" || menuTransferir.style.display === "") {
        menuTransferir.style.display = "block";
    } else {
        menuTransferir.style.display = "none";
    }
}

function transferir(token) {
    // Lógica para transferir el token ERC20
    console.log("Transferir " + token);
}

function transferirUsuario(token) {
    // Lógica para transferir el token a un usuario de USDE (0% comisión)
    console.log("Transferir " + token + " a usuario de USDE (0% comisión)");
}
function toggleInversionesMenu() {
    var menuInversiones = document.getElementById("menuInversiones");
    if (menuInversiones.style.display === "none" || menuInversiones.style.display === "") {
        // Ocultar todos los menús desplegables antes de mostrar este
        ocultarTodosLosMenus();
        menuInversiones.style.display = "block";
    } else {
        menuInversiones.style.display = "none";
    }
}
function ocultarTodosLosMenus() {
    var menus = document.querySelectorAll(".menu-desplegable");
    menus.forEach(function(menu) {
        menu.style.display = "none";
    });
}

function mostrarPlan(plan) {
    console.log("Mostrando plan: " + plan);
}
      function toggleMenu(menuId) {
    var menu = document.getElementById(menuId);
    if (menu.style.display === "none" || menu.style.display === "") {
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}

         function handleTransferirClick() {
            // Puedes agregar lógica adicional aquí antes de llamar a transferirEntreCajas si es necesario
            transferirEntreCajas();
        }



function transferirUsuario(token) {
    // Lógica para transferir el token a un usuario de USDE (0% comisión)
    console.log("Transferir " + token + " a usuario de USDE (0% comisión)");
}
        // Función para mostrar mensajes de error
function mostrarError(mensaje) {
  const mensajeError = document.getElementById('mensajeError');
  mensajeError.innerText = mensaje;
  mensajeError.classList.remove('oculto');
}
   function mostrarMenuDesplegable() {
    const menuDesplegable = document.getElementById('menuDesplegable');
    menuDesplegable.style.display = 'block';
}


async function transferirEntreCajas() {
    console.log('Función transferirEntreCajas llamada');

    try {
        // Verificar si MetaMask está instalado y configurado
        if (typeof window.ethereum === 'undefined') {
            console.error('MetaMask no está instalado o configurado correctamente.');
            return;
        }

        // Solicitar al usuario que conecte su cuenta
        await window.ethereum.enable();

        // Obtener la dirección del usuario conectado
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();

        // Verificar si se ha conectado al menos una cuenta
        if (accounts.length === 0) {
            console.error('No se ha conectado ninguna cuenta de MetaMask.');
            return;
        }

        const userAddress = accounts[0];
        console.log('Dirección del usuario:', userAddress);

        // Obtener información del usuario (puedes personalizar esto según tus necesidades)
        const receiverAddress = prompt("Ingrese la dirección del receptor:");
        const tipoCajaString = prompt("Ingrese el tipo de caja (por ejemplo, 'USDT', 'BTC', etc.):");
        const cantidadString = prompt("Ingrese la cantidad a transferir:");

        const cantidad = parseInt(cantidadString); // Convertir a entero

        console.log("Cantidad ingresada:", cantidad);

        // Validar la entrada del usuario
        if (!receiverAddress || !tipoCajaString || isNaN(cantidad) || cantidad <= 0) {
            console.error('Entrada de usuario inválida.');
            return;
        }

        // Mapear el tipo de caja ingresado por el usuario a un valor numérico
        const tipoCaja = mapTipoCaja(tipoCajaString);

        // Verificar si el mapeo fue exitoso
        if (tipoCaja === null) {
            console.error('Tipo de caja no válido.');
            return;
        }

        // Obtener la instancia del contrato
        const contratoAddress = '0x03bc935dDDDD0245b54446F2580c13030053d470';
        const contrato = new web3.eth.Contract(contratoABI, contratoAddress);

        // Llamar a la función de transferirEntreCajas en el contrato 
        const resultado = await contrato.methods.transferirEntreCajas(receiverAddress, userAddress, tipoCaja, cantidad).send({ from: userAddress });

        console.log('Transferencia exitosa:', resultado);
        // Aquí puedes realizar acciones adicionales después de la transferencia si es necesario
    } catch (error) {
        console.error('Error en transferirEntreCajas:', error);
    }
}
document.getElementById('supportBtn').addEventListener('click', function() {
    var baseTelegramURL = "https://t.me/usdexchange_oficial";
    // No hay necesidad de un mensaje predefinido
    window.open(baseTelegramURL, '_blank');
});




  document.addEventListener("DOMContentLoaded", function() {
            const queryParams = new URLSearchParams(window.location.search);
            const referido = queryParams.get('ref');
            if (referido) {
                enviarAWebhook(referido);
            }
        });

        function generarLink() {
            const userAddress = document.getElementById('userAddress').value;
            if(userAddress === "") {
                alert("Por favor, ingrese su dirección.");
                return;
            }
            const referLink = window.location.href.split('?')[0] + '?ref=' + userAddress;
            document.getElementById('referLink').innerText = referLink.slice(-15); // Muestra los últimos 15 caracteres
            document.getElementById('fullReferLink').value = referLink; // Guarda el enlace completo para el botón de copiar
        }

        function enviarAWebhook(referido) {
            const webhookUrl = 'https://discordapp.com/api/webhooks/1088481416498651186/BTeEMH1zSnVTJQ3r8OQxFxIh5zbHzfAjvwSvAfDcSyONwDYgZMoEjAK9qj3gDBJ9Jhf2';
            const mensaje = {
                content: `Nuevo visitante referido: ${referido}`
            };

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mensaje)
            }).then(response => console.log('Enviado al webhook de Discord', response))
              .catch(error => console.error('Error al enviar al webhook de Discord', error));
        }

        function copiarAlPortapapeles() {
            const fullLink = document.getElementById('fullReferLink').value;
            navigator.clipboard.writeText(fullLink).then(() => {
                alert("Enlace copiado al portapapeles");
            }).catch(err => {
                console.error('Error al copiar al portapapeles', err);
            });
        }




document.addEventListener("DOMContentLoaded", function() {
    const counters = [
        { id: 'USD', valor: 'saldoUSDValor' },
        { id: 'USDT', valor: 'saldoUSDTValor' },
        { id: 'BTC', valor: 'saldoBTCValor' },
        { id: 'ETH', valor: 'saldoETHValor' },
        { id: 'USDE', valor: 'saldoUSDEValor' },
        { id: 'BNB', valor: 'saldoBNBValor' }
    ];

    counters.forEach(counter => {
        initializeCountdown(counter.id, counter.valor);
    });

    function initializeCountdown(currencyId, valorId) {
        let countdownElement = document.getElementById(`countdown${currencyId}`);
        let valorElement = document.getElementById(valorId);
        let previousSaldo = parseFloat(valorElement.textContent) || 0;

        // Observa cambios en el valor del saldo
        new MutationObserver(function(mutations) {
            mutations.forEach(mutation => {
                let currentSaldo = parseFloat(valorElement.textContent) || 0;
                if (previousSaldo === 0 && currentSaldo > 0) {
                    startCountdown(currencyId);
                }
                previousSaldo = currentSaldo; // Actualizar el saldo previo después de procesar el cambio
            });
        }).observe(valorElement, { childList: true, subtree: true, characterData: true });

        // Carga el contador desde localStorage si ya está en marcha
        if (localStorage.getItem(`countdownFinish${currencyId}`)) {
            startCountdown(currencyId);
        }
    }

    function startCountdown(currencyId) {
        let countdownElement = document.getElementById(`countdown${currencyId}`);
        let finishTime = localStorage.getItem(`countdownFinish${currencyId}`);

        if (!finishTime) {
            let now = new Date();
            let finishDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 días desde ahora
            finishTime = finishDate.getTime();
            localStorage.setItem(`countdownFinish${currencyId}`, finishTime);
        }

        let timer = setInterval(function() {
            let now = new Date().getTime();
            let distance = finishTime - now;

            if (distance < 0) {
                clearInterval(timer);
                countdownElement.textContent = "Tiempo expirado";
                localStorage.removeItem(`countdownFinish${currencyId}`);
                return;
            }

            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    }
});








// Función para mapear el tipo de caja ingresado por el usuario a un valor numérico
function mapTipoCaja(tipoCajaString) {
    // Mapea los tipos de caja a valores numéricos según el contrato
    const tipoCajas = {
        'usdt': 0,
        'btc': 1,
        'eth': 2,
        'usde': 3,
        'bnb': 4
    };

    // Convierte a minúsculas y elimina espacios en blanco
    const tipoCajaFormatted = tipoCajaString.trim().toLowerCase();

    // Verifica si el tipo de caja proporcionado por el usuario existe en el mapeo
    if (tipoCajaFormatted in tipoCajas) {
        return tipoCajas[tipoCajaFormatted];
    } else {
        console.error('Tipo de caja no válido.');
        return null;
    }
}

 const cryptoContainer = document.getElementById('crypto-container');
    const ctx = document.getElementById('crypto-chart').getContext('2d');

    // Obtener datos de precios simples para el ticker
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,litecoin,bitcoin-cash&vs_currencies=usd')
        .then(response => response.json())
        .then(data => {
            const cryptocurrencies = [
                { id: 'bitcoin', name: 'Bitcoin' },
                { id: 'ethereum', name: 'Ethereum' },
                { id: 'ripple', name: 'Ripple' },
                { id: 'litecoin', name: 'Litecoin' },
                { id: 'bitcoin-cash', name: 'Bitcoin Cash' }
            ];

            cryptocurrencies.forEach(crypto => {
                const price = data[crypto.id].usd;
                const cryptoDiv = document.createElement('div');
                cryptoDiv.classList.add('crypto');
                cryptoDiv.innerHTML = `<div class="name">${crypto.name}</div><div class="price">$${price}</div>`;
                cryptoContainer.appendChild(cryptoDiv);
            });

            // Clone the content to make the ticker continuous
            const clone = cryptoContainer.cloneNode(true);
            cryptoContainer.parentNode.appendChild(clone);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Obtener datos históricos para el gráfico de velas japonesas
    fetch('https://api.coingecko.com/api/v3/coins/bitcoin/ohlc?vs_currency=usd&days=7')
        .then(response => response.json())
        .then(data => {
            const ohlcData = data.map(d => ({
                x: new Date(d[0]),
                o: d[1],
                h: d[2],
                l: d[3],
                c: d[4]
            }));

            // Crear gráfico de velas japonesas
            new Chart(ctx, {
                type: 'candlestick',
                data: {
                    datasets: [{
                        label: 'BTC/USD',
                        data: ohlcData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        upColor: '#00ff00',
                        downColor: '#ff0000',
                        wickColor: '#000000',
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                tooltipFormat: 'MMM dd, yyyy'
                            },
                            ticks: {
                                source: 'auto',
                                autoSkip: true,
                                maxRotation: 0
                            }
                        },
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'x',
                            },
                            zoom: {
                                enabled: true,
                                mode: 'x',
                            }
                        }
                    },
                    elements: {
                        point: {
                            radius: 0
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));


 function showChart() {
            const contractAddress = document.getElementById('contractAddress').value;
            const network = document.getElementById('network').value;

            if (!contractAddress) {
                alert("Please enter a contract address.");
                return;
            }

            const chartContainer = document.getElementById('chartContainer');
            chartContainer.innerHTML = '';

            let widgetUrl = '';
            switch(network) {
                case 'ethereum':
                    widgetUrl = `https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js?contractAddress=${contractAddress}`;
                    break;
                case 'binance-smart-chain':
                    // Customize URL if needed for BSC
                    widgetUrl = `https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js?contractAddress=${contractAddress}`;
                    break;
                case 'polygon':
                    // Customize URL if needed for Polygon
                    widgetUrl = `https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js?contractAddress=${contractAddress}`;
                    break;
                case 'optimism':
                    // Customize URL if needed for Optimism
                    widgetUrl = `https://widgets.coingecko.com/coingecko-coin-price-chart-widget.js?contractAddress=${contractAddress}`;
                    break;
                default:
                    alert("Unsupported network");
                    return;
            }

            // Embed CoinGecko widget
            const widgetScript = document.createElement('script');
            widgetScript.src = widgetUrl;
            widgetScript.async = true;
            chartContainer.appendChild(widgetScript);
        }

