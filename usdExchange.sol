// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract MiContrato {
    address public propietario;
    string public nombreToken;
    string public simboloToken;
    uint8 public decimalesToken;

    enum TipoCaja { USDT, BTC, ETH, USDE, TRX }

    struct SaldoUsuario {
        mapping(uint256 => uint256) saldos; // Tipo de caja (enum) => Saldo
    }

    struct Recompensa {
        uint256 cantidad;
        TipoCaja tipo; // Puede ser USDT, BTC, ETH, USDE o TRX
        bool activa;
    }

    struct DetalleSaldoUsuario {
        uint256 saldoUSDT;
        uint256 saldoBTC;
        uint256 saldoETH;
        uint256 saldoUSDE;
        uint256 saldoTRX;
        uint256 saldoTotalUSD;
        bool tieneSaldoUSDT;
        bool tieneSaldoBTC;
        bool tieneSaldoETH;
        bool tieneSaldoUSDE;
        bool tieneSaldoTRX;
    }

    struct DetalleUsuario {
        uint256 saldoUSDT;
        uint256 saldoBTC;
        uint256 saldoETH;
        uint256 saldoUSDE;
        uint256 saldoTRX;
        uint256 saldoTotalUSD;
    }

    mapping(address => SaldoUsuario) private saldosUsuarios; // Dirección del usuario => SaldoUsuario
    mapping(address => bool) public recompensaReclamada; 
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
        propietario = msg.sender;
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
        require(tipo >= TipoCaja.USDT && tipo <= TipoCaja.TRX, "Tipo de caja no valido");
        recompensaActual = Recompensa(cantidad, tipo, true);
        emit RecompensaCreada(cantidad, _tipoCajaToString(tipo));
    }

    function reclamarRecompensa() external {
        require(recompensaActual.activa, "No hay recompensa disponible");
        require(!recompensaReclamada[msg.sender], "Recompensa ya reclamada");

        uint256 cantidad = recompensaActual.cantidad;
        TipoCaja tipo = recompensaActual.tipo;

        // Sumar la recompensa al saldo del usuario
        saldosUsuarios[msg.sender].saldos[uint256(tipo)] += cantidad;

        recompensaReclamada[msg.sender] = true;
        emit RecompensaReclamada(msg.sender, cantidad, _tipoCajaToString(tipo));
    }

    function consultarBalanceUsuario(address usuario, TipoCaja tipoCaja) external view returns (uint256) {
        return saldosUsuarios[usuario].saldos[uint256(tipoCaja)];
    }

    function setPrecioCriptomoneda(TipoCaja tipoCaja, uint256 precioUSD) external soloPropietario {
        preciosCriptomonedas[uint256(tipoCaja)] = precioUSD;
        emit PrecioCriptomonedaActualizado(tipoCaja, precioUSD);
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
        if (tipo == TipoCaja.TRX) return "TRX";
        revert("Tipo de caja no valido");
    }

    function consultarDetalleUsuario(address usuario) external view returns (DetalleUsuario memory) {
        DetalleSaldoUsuario memory saldoDetalle = _consultarDetalleSaldoUsuario(usuario);

        return DetalleUsuario({
            saldoUSDT: saldoDetalle.saldoUSDT,
            saldoBTC: saldoDetalle.saldoBTC,
            saldoETH: saldoDetalle.saldoETH,
            saldoUSDE: saldoDetalle.saldoUSDE,
            saldoTRX: saldoDetalle.saldoTRX,
            saldoTotalUSD: saldoDetalle.saldoTotalUSD
        });
    }

    function _consultarDetalleSaldoUsuario(address usuario) internal view returns (DetalleSaldoUsuario memory) {
        uint256 saldoUSDT = saldosUsuarios[usuario].saldos[uint256(TipoCaja.USDT)] * consultarValorCripto(TipoCaja.USDT);
        uint256 saldoBTC = saldosUsuarios[usuario].saldos[uint256(TipoCaja.BTC)] * consultarValorCripto(TipoCaja.BTC);
        uint256 saldoETH = saldosUsuarios[usuario].saldos[uint256(TipoCaja.ETH)] * consultarValorCripto(TipoCaja.ETH);
        uint256 saldoUSDE = saldosUsuarios[usuario].saldos[uint256(TipoCaja.USDE)] * consultarValorCripto(TipoCaja.USDE);
        uint256 saldoTRX = saldosUsuarios[usuario].saldos[uint256(TipoCaja.TRX)] * consultarValorCripto(TipoCaja.TRX);

        uint256 saldoTotalUSD = saldoUSDT + saldoBTC + saldoETH + saldoUSDE + saldoTRX;

        return DetalleSaldoUsuario({
            saldoUSDT: saldoUSDT,
            saldoBTC: saldoBTC,
            saldoETH: saldoETH,
            saldoUSDE: saldoUSDE,
            saldoTRX: saldoTRX,
            saldoTotalUSD: saldoTotalUSD,
            tieneSaldoUSDT: saldoUSDT > 0,
            tieneSaldoBTC: saldoBTC > 0,
            tieneSaldoETH: saldoETH > 0,
            tieneSaldoUSDE: saldoUSDE > 0,
            tieneSaldoTRX: saldoTRX > 0
        });
    }
}
