var contractR
var accountsR
var web3R







async function getPersona() {
  var indice = document.getElementById('input_indice').value
  if(indice!=""){
     try {
    
    const persona = await contractR.methods.getPersona(indice).call();
    document.getElementById("p_hello").innerHTML="Nombre: "+ persona[0]+"<br>Correo: "+ persona[1]+"<br>Institucion: "+ persona[2]+"<br>Enfoque: "+ persona[3]+"<br>Wallet: "+ persona[4]
    console.log('Detalles de la persona:');
    console.log('Nombre:', persona[0]);
    console.log('Correo:', persona[1]);
    console.log('Institución:', persona[2]);
    console.log('Enfoque:', persona[3]);
    console.log('Dirección:', persona[4]);
  } catch (error) {
    console.error('Error al obtener persona:', error);
  }
  }
}

var wallet=getWallet()
var walletC=createWallet()
var key=""

function getWallet(){
  
  if (typeof window.ethereum !== 'undefined') {
    const provider = window.ethereum;
  
    // Obtener la dirección de la billetera activa en Metamask
    provider.request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        
        wallet= accounts[0];
        
      })
      .catch((error) => {
        console.error('Error al obtener la dirección de la billetera:', error);
      });
     
  } else {
    console.error('Metamask no está instalado o no está disponible');
}
return wallet
}

const setLog = async () => {
  console.log("wallet: "+wallet)
    var nombre = document.getElementById('input_nombre').value
  var correo = document.getElementById('input_correo').value
  var institucion = document.getElementById('input_institucion').value
  var enfoque = document.getElementById('input_enfoque').value
  
  if(nombre!=""&&correo!=""&&institucion!=""&&enfoque!=""){

     const result = await contractR.methods.setPersona(nombre,correo,institucion,enfoque,wallet)
            .send({ from: accountsR[0], gas: 400000 })
  }
}

function createWallet(){ 
  // Verificar si Metamask está instalado
  if (typeof window.ethereum !== 'undefined') {

      // Crear una instancia de web3 utilizando Metamask
      const web3 = new Web3(window.ethereum);

      // Solicitar al usuario que se conecte a Metamask
      window.ethereum.enable().then(() => {
        // Crear una nueva wallet
        const newAccount = web3.eth.accounts.create();

        // Mostrar la dirección generada en la página
       
        key=newAccount.privateKey
        
         walletC= newAccount.address
        
      }
      
      ).catch((error) => {
        console.error('Error al conectar con Metamask:', error);
      });
     
  } else {
    console.error('Metamask no está instalado');
  }
return walletC
}

const a = async () => {
  console.log('Wallet:', walletC);
  var nombre = document.getElementById('input_nombre').value
  var correo = document.getElementById('input_correo').value
  var institucion = document.getElementById('input_institucion').value
  var enfoque = document.getElementById('input_enfoque').value
  document.getElementById("key").innerHTML="key: "+key
  const result = await contractR.methods.setPersona(nombre,correo,institucion,enfoque,walletC)
  .send({ from: accountsR[0], gas: 400000 })
//agregar privatekey a metamask
  private()
//cambio de adress
  window.addEventListener('load', async () => {
    // Verificar si MetaMask está instalado y disponible
    if (typeof window.ethereum !== 'undefined') {
      // Solicitar permisos al usuario
      await window.ethereum.enable();
  
      // Obtener instancia del proveedor de MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
  
      // Obtener dirección actual del usuario
      const accounts = await provider.listAccounts();
      const direccionActual = accounts[0];
      console.log('Dirección actual:', direccionActual);
  
      // Obtener el botón y asignarle un manejador de eventos
      const cambioDireccionBtn = document.getElementById('cambioDireccionBtn');
      cambioDireccionBtn.addEventListener('click', async () => {
        const nuevaDireccion = walletC;
  
        // Actualizar la dirección actual con la nueva dirección especificada
        await signer.sendTransaction({
          to: nuevaDireccion,
          value: 0
        });
  
        const nuevaCuenta = await signer.getAddress();
        console.log('Nueva dirección:', nuevaCuenta);
      });
    } else {
      console.error('MetaMask no está instalado.');
    }
  });

  }

  function private (){
    if (window.ethereum) {
      const ethereum = window.ethereum;
    
      // Solicitar permisos al usuario
      ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(async (accounts) => {
          // Importar clave privada en Metamask
          const privateKey = 'PRIVATE'; // Reemplaza con tu clave privada
          await ethereum.request({
            method: 'wallet_importRawKey',
            params: [privateKey],
          });
    
          const address = accounts[0]; // Obtener la dirección del usuario
          console.log('Dirección de Metamask:', address);
    
          // Realizar acciones adicionales con la dirección
          // ...
    
        })
        .catch((error) => {
          console.error('Error al solicitar permisos:', error);
        });
    } else {
      console.error('Metamask no detectado');
    }
  }
 

















  




  



