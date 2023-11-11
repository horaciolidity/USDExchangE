// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract USDEx {
    address payable public propietario;
    string public nombreToken;
    string public simboloToken;
    uint8 public decimalesToken;

    enum TipoCaja { USDT, BTC, ETH, USDE, BNB }

    struct SaldoUsuario {
        mapping(uint256 => uint256) saldos; // Tipo de caja (enum) => Saldo
    }

    struct Recompensa {
        uint256 cantidad;
        TipoCaja tipo; // Puede ser USDT, BTC, ETH, USDE o BNB
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

    mapping(address => SaldoUsuario) private saldosUsuarios; // Dirección del usuario => SaldoUsuario
    mapping(uint256 => mapping(address => bool)) public recompensaReclamada;

    Recompensa public recompensaActual;
    mapping(uint256 => uint256) public preciosCriptomonedas; // Tipo de caja (enum) => Precio en USD

    event Mint(address indexed destino, uint256 cantidad);
    event DepositoETH(address indexed usuario, uint256 cantidad);
    event ModificacionSaldo(address indexed usuario, TipoCaja tipoCaja, uint256 nuevoSaldo);
    event TransferenciaEntreCajas(address indexed origen, address indexed destino, TipoCaja tipoCaja, uint256 cantidad);
    event RecompensaCreada(uint256 cantidad, string tipo);
    event RecompensaReclamada(address usuario, uint256 cantidad, string tipo);
    event PrecioCriptomonedaActualizado(TipoCaja tipoCaja, uint256 nuevoPrecio);

    constructor(string memory _nombreToken, string memory _simboloToken, uint8 _decimalesToken) {
        propietario = payable(msg.sender);
        nombreToken = _nombreToken;
        simboloToken = _simboloToken;
        decimalesToken = _decimalesToken;
    }

    modifier soloPropietario() {
        require(msg.sender == propietario, "Solo el propietario puede realizar esta operacion");
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

        // Sumar la recompensa al saldo del usuario
        saldosUsuarios[msg.sender].saldos[uint256(tipo)] += cantidad;

        recompensaReclamada[uint256(tipo)][msg.sender] = true;
        emit RecompensaReclamada(msg.sender, cantidad, _tipoCajaToString(tipo));
    }

    function consultarBalanceUsuario(address usuario, TipoCaja tipoCaja) external view returns (uint256) {
        return saldosUsuarios[usuario].saldos[uint256(tipoCaja)];
    }

    function setPrecioCriptomoneda(TipoCaja tipoCaja, uint256 precioUSD) external soloPropietario {
        preciosCriptomonedas[uint256(tipoCaja)] = precioUSD;
        emit PrecioCriptomonedaActualizado(tipoCaja, precioUSD);
    }

    function comprarConBNBDesdeBilletera(TipoCaja tipoCaja, uint256 cantidadCajas, uint256 cantidadUSD) external payable {
        // Verificar que el tipo de caja sea válido
        require(tipoCaja != TipoCaja.BNB, "No se admiten compras de BNB con esta funcion");
        require(preciosCriptomonedas[uint256(tipoCaja)] > 0, "Tipo de caja no tiene precio establecido");

        // Calcular la cantidad total de BNB necesarios para la compra de cajas
        uint256 cantidadTotalBNBCajas = preciosCriptomonedas[uint256(tipoCaja)] * cantidadCajas;

        // Calcular la cantidad total de BNB necesarios para la compra de USD
        uint256 cantidadTotalBNBUSD = cantidadUSD;

        // Verificar que el usuario haya enviado suficientes BNB para la compra de cajas y/o USD
        require(msg.value >= cantidadTotalBNBCajas + cantidadTotalBNBUSD, "Fondos insuficientes para realizar la compra");

        // Transferir los BNB para la compra de cajas desde la billetera del usuario al contrato
        propietario.transfer(cantidadTotalBNBCajas);

        // Agregar las cajas al saldo del usuario
        saldosUsuarios[msg.sender].saldos[uint256(tipoCaja)] += cantidadCajas;

        emit TransferenciaEntreCajas(address(this), msg.sender, tipoCaja, cantidadCajas);

        // Transferir los BNB para la compra de USD desde la billetera del usuario al contrato
        propietario.transfer(cantidadTotalBNBUSD);

        // Agregar los USD al saldo del usuario
        saldosUsuarios[msg.sender].saldos[uint256(TipoCaja.USDT)] += cantidadUSD;

        emit TransferenciaEntreCajas(address(this), msg.sender, TipoCaja.USDT, cantidadUSD);
    }

    function comprarConUSD(TipoCaja tipoCaja, uint256 cantidadCajas) external {
        // Verificar que el tipo de caja sea válido y tenga un precio establecido en USD
        require(tipoCaja != TipoCaja.BNB, "No se admiten compras de BNB con esta funcion");
        require(preciosCriptomonedas[uint256(tipoCaja)] > 0, "Tipo de caja no tiene precio establecido");

        // Calcular el costo total en USD para la compra de las cajas
        uint256 costoTotalUSD = preciosCriptomonedas[uint256(tipoCaja)] * cantidadCajas;

        // Verificar que el usuario tenga suficientes USD para la compra
        require(saldosUsuarios[msg.sender].saldos[uint256(TipoCaja.USDT)] >= costoTotalUSD, "Saldo USDT insuficiente para realizar la compra");

        // Restar los USD del saldo del usuario
        saldosUsuarios[msg.sender].saldos[uint256(TipoCaja.USDT)] -= costoTotalUSD;

        // Agregar las cajas al saldo del usuario
        saldosUsuarios[msg.sender].saldos[uint256(tipoCaja)] += cantidadCajas;

        emit TransferenciaEntreCajas(msg.sender, address(this), TipoCaja.USDT, costoTotalUSD);
        emit TransferenciaEntreCajas(address(this), msg.sender, tipoCaja, cantidadCajas);
    }

    function consultarValorCripto(TipoCaja tipoCaja) internal view returns (uint256) {
        // Consulta el precio de la criptomoneda en USD desde la configuración del contrato
        uint256 precio = preciosCriptomonedas[uint256(tipoCaja)];

        // Si el precio está configurado como 0, devuelve un valor predeterminado (1 USD)
        if (precio == 0) {
            return 1;
        }

        return precio;
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
