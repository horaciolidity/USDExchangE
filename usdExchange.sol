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

    mapping(address => SaldoUsuario) private saldosUsuarios; // Dirección del usuario => SaldoUsuario
    mapping(uint256 => uint256) public estadoContrato; // Bloque => Estado del contrato

    event Mint(address indexed destino, uint256 cantidad);
    event DepositoETH(address indexed usuario, uint256 cantidad);
    event ModificacionSaldo(address indexed usuario, TipoCaja tipoCaja, uint256 nuevoSaldo);
    event TransferenciaEntreCajas(address indexed origen, address indexed destino, TipoCaja tipoCaja, uint256 cantidad);
    event EstadoActualizado(uint256 bloque, uint256 nuevoEstado);

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

    function consultarValorCripto(TipoCaja tipoCaja) internal view returns (uint256) {
        // Implementa la lógica para consultar el valor de la criptomoneda (tipo de caja) en la blockchain
        // Devuelve el valor de la criptomoneda en USD
        // (Puedes utilizar oráculos o APIs externas para obtener el valor real)
        return 1; // Por defecto, 1 unidad de la criptomoneda equivale a 1 unidad de valor representativo en USD
    }

    function actualizarEstadoContrato(uint256 nuevoEstado) external soloPropietario {
        estadoContrato[block.number] = nuevoEstado;
        emit EstadoActualizado(block.number, nuevoEstado);
    }

    function consultarEstadoContrato(uint256 bloque) external view returns (uint256) {
        return estadoContrato[bloque];
    }

    function consultarBalanceUsuario(address usuario, TipoCaja tipoCaja) external view returns (uint256) {
        return saldosUsuarios[usuario].saldos[uint256(tipoCaja)];
    }

    function consultarDetalleSaldoUsuario(address usuario) external view returns (DetalleSaldoUsuario memory) {
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