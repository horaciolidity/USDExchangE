// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract USDEx {
    address payable public propietario;
    string public nombreToken;
    string public simboloToken;
    uint8 public decimalesToken;
    uint256 public feeCompra;
    uint256 public feeVenta;
    enum TipoCaja { USDT, BTC, ETH, USDE, BNB }
    struct SaldoUsuario {
        mapping(uint256 => uint256) saldos; 
    }
    struct RecompensaAportacionLiquidez {
        uint256 porcentajeDiario; 
        uint256 ultimaActualizacion; 
    }
    struct Recompensa {
        uint256 cantidad;
        TipoCaja tipo; 
        bool activa;
    }
    struct DetalleSaldoUsuario {
        uint256 saldoUSDT;
        uint256 saldoBTC;
        uint256 saldoETH;
        uint256 saldoUSDE;
        uint256 saldoBNB;
        uint256 saldoTotalUSD;
        bool tieneSaldoUSDT;
        bool tieneSaldoBTC;
        bool tieneSaldoETH;
        bool tieneSaldoUSDE;
        bool tieneSaldoBNB;
    }
    struct DetalleUsuario {
        uint256 saldoUSDT;
        uint256 saldoBTC;
        uint256 saldoETH;
        uint256 saldoUSDE;
        uint256 saldoBNB;
        uint256 saldoTotalUSD;
    }
    mapping(uint256 => RecompensaAportacionLiquidez) public recompensasAportacionLiquidez;
    mapping(address => SaldoUsuario) private saldosUsuarios; 
    mapping(uint256 => mapping(address => bool)) public recompensaReclamada;
    Recompensa public recompensaActual;
    mapping(uint256 => uint256) public preciosCriptomonedas; 
    mapping(address => mapping(uint256 => uint256)) private fondosBloqueadosPorUsuarioYTipo;

    event Mint(address indexed destino, uint256 cantidad);
    event DepositoETH(address indexed usuario, uint256 cantidad);
    event ModificacionSaldo(address indexed usuario, TipoCaja tipoCaja, uint256 nuevoSaldo);
    event TransferenciaEntreCajas(address indexed origen, address indexed destino, TipoCaja tipoCaja, uint256 cantidad);
    event RecompensaCreada(uint256 cantidad, string tipo);
    event RecompensaReclamada(address usuario, uint256 cantidad, string tipo);
    event PrecioCriptomonedaActualizado(TipoCaja tipoCaja, uint256 nuevoPrecio);
    event FeeActualizado(uint256 nuevoFeeCompra, uint256 nuevoFeeVenta);
    event RecompensaAportacionLiquidezActualizada(uint256 tipoCaja, uint256 nuevoPorcentaje);
    event FondosBloqueados(address indexed usuario, uint256 indexed tipoCaja, uint256 cantidad);
    event FondosDesbloqueados(address indexed usuario, uint256 indexed tipoCaja, uint256 cantidad);

    constructor(string memory _nombreToken, string memory _simboloToken, uint8 _decimalesToken) {
        propietario = payable(msg.sender);
        nombreToken = _nombreToken;
        simboloToken = _simboloToken;
        decimalesToken = _decimalesToken;
        feeCompra = 1; 
        feeVenta = 1; 
    }
    modifier soloPropietario() {
        require(msg.sender == propietario, "Solo propietario");
        _;
    }
    function mintearUSD(address destino, uint256 cantidad) external soloPropietario {
        saldosUsuarios[destino].saldos[uint256(TipoCaja.USDT)] += cantidad;
        emit Mint(destino, cantidad);
    }
    function depositarETH() external payable {
        saldosUsuarios[msg.sender].saldos[uint256(TipoCaja.ETH)] += msg.value;
        emit DepositoETH(msg.sender, msg.value);
    }
    function modificarSaldoCaja(address usuario, TipoCaja tipoCaja, uint256 cantidad) external soloPropietario {
        saldosUsuarios[usuario].saldos[uint256(tipoCaja)] = cantidad;
        emit ModificacionSaldo(usuario, tipoCaja, cantidad);
    }
    function transferirEntreCajas(address origen, address destino, TipoCaja tipoCaja, uint256 cantidad) external {
        uint256 saldoOrigen = saldosUsuarios[origen].saldos[uint256(tipoCaja)];
        require(saldoOrigen >= cantidad, "Saldo insuficiente en la caja de origen");
        saldosUsuarios[origen].saldos[uint256(tipoCaja)] = saldoOrigen - cantidad;
        saldosUsuarios[destino].saldos[uint256(tipoCaja)] += cantidad;
        emit TransferenciaEntreCajas(origen, destino, tipoCaja, cantidad);
    }
    function crearRecompensa(uint256 cantidad, TipoCaja tipo) external soloPropietario {
        require(tipo >= TipoCaja.USDT && tipo <= TipoCaja.BNB, "Tipo de caja no valido");
        recompensaActual = Recompensa(cantidad, tipo, true);
        emit RecompensaCreada(cantidad, _tipoCajaToString(tipo));
    }
    function reclamarRecompensa() external {
        require(recompensaActual.activa, "No hay recompensa disponible");
        require(!recompensaReclamada[uint256(recompensaActual.tipo)][msg.sender], "Recompensa ya reclamada");
        uint256 cantidad = recompensaActual.cantidad;
        TipoCaja tipo = recompensaActual.tipo;
        saldosUsuarios[msg.sender].saldos[uint256(tipo)] += cantidad;
        recompensaReclamada[uint256(tipo)][msg.sender] = true;
        emit RecompensaReclamada(msg.sender, cantidad, _tipoCajaToString(tipo));
    }
     function setFees(uint256 nuevoFeeCompra, uint256 nuevoFeeVenta) external soloPropietario {
        require(nuevoFeeCompra <= 100, "El fee de compra no puede ser mayor que 100%");
        require(nuevoFeeVenta <= 100, "El fee de venta no puede ser mayor que 100%");

        feeCompra = nuevoFeeCompra;
        feeVenta = nuevoFeeVenta;

        emit FeeActualizado(nuevoFeeCompra, nuevoFeeVenta);
    }
    function consultarBalanceUsuario(address usuario, TipoCaja tipoCaja) external view returns (uint256) {
        return saldosUsuarios[usuario].saldos[uint256(tipoCaja)];
    }
    function setPrecioCriptomoneda(TipoCaja tipoCaja, uint256 precioUSD) external soloPropietario {
        preciosCriptomonedas[uint256(tipoCaja)] = precioUSD;
        emit PrecioCriptomonedaActualizado(tipoCaja, precioUSD);
    }
    function comprarConBNBDesdeBilletera(TipoCaja tipoCaja, uint256 cantidadCajas, uint256 cantidadUSD) external payable {
    require(preciosCriptomonedas[uint256(tipoCaja)] > 0, "Tipo de caja no tiene precio establecido");
    uint256 cantidadTotalBNBCajas = 0;
    uint256 cantidadTotalBNBUSD = 0;
    if (tipoCaja == TipoCaja.BNB) {
        cantidadTotalBNBCajas = cantidadCajas;
    } else {
        cantidadTotalBNBCajas = preciosCriptomonedas[uint256(tipoCaja)] * cantidadCajas;
    }
    cantidadTotalBNBUSD = cantidadUSD;
    require(msg.value >= cantidadTotalBNBCajas + cantidadTotalBNBUSD, "Fondos insuficientes para realizar la compra");
    if (tipoCaja != TipoCaja.BNB) {
        propietario.transfer(cantidadTotalBNBCajas);
    }
    saldosUsuarios[msg.sender].saldos[uint256(tipoCaja)] += cantidadCajas;
    emit TransferenciaEntreCajas(address(this), msg.sender, tipoCaja, cantidadCajas);
    propietario.transfer(cantidadTotalBNBUSD);
    saldosUsuarios[msg.sender].saldos[uint256(TipoCaja.USDT)] += cantidadUSD;
    emit TransferenciaEntreCajas(address(this), msg.sender, TipoCaja.USDT, cantidadUSD);
}
    function comprarConUSD(TipoCaja tipoCaja, uint256 cantidadCajas) external {
    require(preciosCriptomonedas[uint256(tipoCaja)] > 0, "Tipo de caja no tiene precio establecido");
    uint256 costoTotalUSD = preciosCriptomonedas[uint256(tipoCaja)] * cantidadCajas;
    require(saldosUsuarios[msg.sender].saldos[uint256(TipoCaja.USDT)] >= costoTotalUSD, "Saldo USDT insuficiente para realizar la compra");
    saldosUsuarios[msg.sender].saldos[uint256(TipoCaja.USDT)] -= costoTotalUSD;
    saldosUsuarios[msg.sender].saldos[uint256(tipoCaja)] += cantidadCajas;
    emit TransferenciaEntreCajas(msg.sender, address(this), TipoCaja.USDT, costoTotalUSD);
    emit TransferenciaEntreCajas(address(this), msg.sender, tipoCaja, cantidadCajas);
}

    function consultarValorCripto(TipoCaja tipoCaja) internal view returns (uint256) {
        uint256 precio = preciosCriptomonedas[uint256(tipoCaja)];
        if (precio == 0) {
            return 1;
        }
        return precio;
    }
    function withdrawFunds() external onlyPropietario {
    uint256 contractBalance = address(this).balance;
    require(contractBalance > 0, "El saldo del contrato es cero");
    propietario.transfer(contractBalance);
}
  modifier onlyPropietario() {
        require(msg.sender == propietario, "Solo el propietario puede realizar esta operacion");
        _;
    }
     function actualizarRecompensaAportacionLiquidez(uint256 tipoCaja, uint256 nuevoPorcentaje) external soloPropietario {
        require(tipoCaja >= uint256(TipoCaja.USDT) && tipoCaja <= uint256(TipoCaja.BNB), "Tipo de caja no valido");
        require(nuevoPorcentaje <= 100, "El porcentaje de recompensa no puede ser mayor que 100%");
        recompensasAportacionLiquidez[tipoCaja].porcentajeDiario = nuevoPorcentaje;
        recompensasAportacionLiquidez[tipoCaja].ultimaActualizacion = block.timestamp;
        emit RecompensaAportacionLiquidezActualizada(tipoCaja, nuevoPorcentaje);
    }
    function calcularRecompensaAportacionLiquidez(uint256 tipoCaja, uint256 tiempoTranscurrido) internal view returns (uint256) {
        uint256 porcentajeDiario = recompensasAportacionLiquidez[tipoCaja].porcentajeDiario;
        uint256 recompensaAcumulada = (porcentajeDiario * tiempoTranscurrido) / (1 days);
        return recompensaAcumulada;
    }
    function reclamarRecompensaAportacionLiquidez(uint256 tipoCaja) external {
        require(saldosUsuarios[msg.sender].saldos[tipoCaja] > 0, "El usuario no posee el tipo de caja seleccionado");
        uint256 tiempoTranscurrido = block.timestamp - recompensasAportacionLiquidez[tipoCaja].ultimaActualizacion;
        uint256 recompensa = calcularRecompensaAportacionLiquidez(tipoCaja, tiempoTranscurrido);
        require(recompensa > 0, "No hay recompensa acumulada");
        recompensasAportacionLiquidez[tipoCaja].ultimaActualizacion = block.timestamp;     
        bloquearFondos(msg.sender, tipoCaja, recompensa);
        emit RecompensaReclamada(msg.sender, recompensa, _tipoCajaToString(TipoCaja(tipoCaja)));
    }
    function bloquearFondos(address usuario, uint256 tipoCaja, uint256 cantidad) internal {
    require(msg.sender == propietario, "Solo el propietario puede bloquear fondos");
    mapping(address => mapping(uint256 => uint256)) storage fondosBloqueados = fondosBloqueadosPorUsuarioYTipo;
    require(saldosUsuarios[usuario].saldos[tipoCaja] >= cantidad, "Fondos insuficientes para bloquear");
    saldosUsuarios[usuario].saldos[tipoCaja] -= cantidad;
    fondosBloqueados[usuario][tipoCaja] += cantidad;
    emit FondosBloqueados(usuario, tipoCaja, cantidad);
}
function desbloquearFondos(address usuario, uint256 tipoCaja, uint256 cantidad) external soloPropietario {
    mapping(address => mapping(uint256 => uint256)) storage fondosBloqueados = fondosBloqueadosPorUsuarioYTipo;
    require(fondosBloqueados[usuario][tipoCaja] >= cantidad, "Fondos bloqueados insuficientes para desbloquear");
    fondosBloqueados[usuario][tipoCaja] -= cantidad;
    saldosUsuarios[usuario].saldos[tipoCaja] += cantidad;
    emit FondosDesbloqueados(usuario, tipoCaja, cantidad);
}
    function _tipoCajaToString(TipoCaja tipo) internal pure returns (string memory) {
        if (tipo == TipoCaja.USDT) return "USDT";
        if (tipo == TipoCaja.BTC) return "BTC";
        if (tipo == TipoCaja.ETH) return "ETH";
        if (tipo == TipoCaja.USDE) return "USDE";
        if (tipo == TipoCaja.BNB) return "BNB";
        revert("Tipo de caja no valido");
    }
    function consultarDetalleUsuario(address usuario) external view returns (DetalleUsuario memory) {
        DetalleSaldoUsuario memory saldoDetalle = _consultarDetalleSaldoUsuario(usuario);
        return DetalleUsuario({
            saldoUSDT: saldoDetalle.saldoUSDT,
            saldoBTC: saldoDetalle.saldoBTC,
            saldoETH: saldoDetalle.saldoETH,
            saldoUSDE: saldoDetalle.saldoUSDE,
            saldoBNB: saldoDetalle.saldoBNB,
            saldoTotalUSD: saldoDetalle.saldoTotalUSD
        });
    }
    function consultarSupplyActual(TipoCaja tipoCaja) external view returns (uint256) {
        uint256 supply = 0;
        supply += saldosUsuarios[address(this)].saldos[uint256(tipoCaja)] * preciosCriptomonedas[uint256(tipoCaja)];
        return supply;
    }
    function _consultarDetalleSaldoUsuario(address usuario) internal view returns (DetalleSaldoUsuario memory) {
        uint256 saldoUSDT = saldosUsuarios[usuario].saldos[uint256(TipoCaja.USDT)] * consultarValorCripto(TipoCaja.USDT);
        uint256 saldoBTC = saldosUsuarios[usuario].saldos[uint256(TipoCaja.BTC)] * consultarValorCripto(TipoCaja.BTC);
        uint256 saldoETH = saldosUsuarios[usuario].saldos[uint256(TipoCaja.ETH)] * consultarValorCripto(TipoCaja.ETH);
        uint256 saldoUSDE = saldosUsuarios[usuario].saldos[uint256(TipoCaja.USDE)] * consultarValorCripto(TipoCaja.USDE);
        uint256 saldoBNB = saldosUsuarios[usuario].saldos[uint256(TipoCaja.BNB)] * consultarValorCripto(TipoCaja.BNB);
        uint256 saldoTotalUSD = saldoUSDT + saldoBTC + saldoETH + saldoUSDE + saldoBNB;
        return DetalleSaldoUsuario({
            saldoUSDT: saldoUSDT,
            saldoBTC: saldoBTC,
            saldoETH: saldoETH,
            saldoUSDE: saldoUSDE,
            saldoBNB: saldoBNB,
            saldoTotalUSD: saldoTotalUSD,
            tieneSaldoUSDT: saldoUSDT > 0,
            tieneSaldoBTC: saldoBTC > 0,
            tieneSaldoETH: saldoETH > 0,
            tieneSaldoUSDE: saldoUSDE > 0,
            tieneSaldoBNB: saldoBNB > 0
        });
    }
}
