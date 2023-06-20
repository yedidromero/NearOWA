<script>
let web3;
let userAddress;

async function connectToMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);

    try {
      // Solicita acceso a las cuentas del usuario
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      userAddress = accounts[0];

      // Mostrar dirección del usuario
      console.log('Dirección del usuario:', userAddress);
    } catch (error) {
      // El usuario rechazó la conexión
      console.error('El usuario rechazó la conexión:', error);
    }
  } else {
    // MetaMask no está instalado
    alert('Por favor, instala MetaMask para usar esta aplicación.');
  }
}
</script>
