const NETWORK_ID = 5
var NFT_PRICE = null
var PRESALE_PRICE = null
var MAX_SUPPLY = null
var MAX_PRESALE_SUPPLY = null
var contract
var accounts
var web3
var balance
var available
var mint_amount

function network(){
// Crear una instancia de Web3 utilizando el proveedor de Metamask
const web3 = new Web3(window.ethereum);

// Cambiar a la red de Polygon (Matic)
web3.eth.net.getId()
  .then((networkId) => {
    if (networkId !== 5 ) {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4e454153' }], // Cambiar 3 por 2 para Mainnet
      })
      .then(() => {
        // Cambio de red exitoso
        console.log('Se cambió a la red de Polygon');
      })
      .catch((error) => {
        // Error al cambiar de red
        console.error('Error al cambiar a la red de Polygon:', error);
      });
    }
  })
  .catch((error) => {
    // Error al obtener el ID de la red actual
    console.error('Error al obtener el ID de la red:', error);
  })
}
network()

function metamaskReloadCallback()
{
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Accounts changed, realoading...";
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    document.getElementById("web3_message").textContent="Network changed, realoading...";
    window.location.reload()
  })
}

const getAccounts = async () => {
  metamaskReloadCallback()
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    resolve(web3)
  } catch (error) {
    console.log(error)
  }
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if(document.readyState=="complete")
    {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent="Error: Please install Metamask";
      }
    }else
    {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent="Error: Please install Metamask";
        }
      });
    }
  });
};

function handleRevertError(message) {
  alert(message)
}

async function getRevertReason(txHash) {
  const tx = await web3.eth.getTransaction(txHash)
  await web3.eth
    .call(tx, tx.blockNumber)
    .then((result) => {
      throw Error("unlikely to happen")
    })
    .catch((revertReason) => {
      var str = "" + revertReason
      json_reason = JSON.parse(str.substring(str.indexOf("{")))
      handleRevertError(json_reason.message)
    });
}

const getContract = async (web3) => {
  const response = await fetch("./Stakedemy.json");
  const data = await response.json();

  const netId = await web3.eth.net.getId();
  const deployedNetwork = data.networks[netId];
  contract = new web3.eth.Contract(
    data.abi,
    deployedNetwork && deployedNetwork.address
    );
  return contract
}

async function loadAccount() {
  accounts = await web3.eth.getAccounts()
  balance = await contract.methods.balanceOf(accounts[0]).call()
  document.getElementById("web3_message").textContent="Connected"
  document.getElementById("connect_button").style.display = "none"
  document.getElementById("nft_balance").textContent="You have " + balance + " Stakedemy"
}

async function loadDapp() {
  document.getElementById("web3_message").textContent="Connecting..."
  var awaitWeb3 = async function () {
    web3 = await getWeb3()
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID) {
        var awaitContract = async function () {
          contract = await getContract(web3);
          NFT_PRICE = await contract.methods.price().call()
          MAX_SUPPLY = await contract.methods.MAX_SUPPLY().call()
          MAX_PRESALE_SUPPLY = await contract.methods.MAX_PRESALE_SUPPLY().call()
          total_mint = await contract.methods.totalSupply().call()
          available = MAX_SUPPLY - total_mint
          available_presale = MAX_PRESALE_SUPPLY - total_mint
          if(document.getElementById("total_mint"))
            document.getElementById("total_mint").textContent = available + "/" + MAX_SUPPLY + " available"
          if(document.getElementById("total_mint_presale"))
            document.getElementById("total_mint_presale").textContent = available_presale + "/" + MAX_PRESALE_SUPPLY + " available"
          if(document.getElementById("price"))
            document.getElementById("price").textContent= "Price: " + web3.utils.fromWei(NFT_PRICE) + " ETH"
          if(document.getElementById("presale_price"))
            document.getElementById("presale_price").textContent= "Presale Price: " + web3.utils.fromWei(PRESALE_PRICE) + " ETH"
          web3.eth.getAccounts(function(err, accounts){
            if (err != null)
              console.error("An error occurred: "+err);
            else if (accounts.length == 0)
              console.log("User is not logged in to MetaMask");
            else
            {
              loadAccount()
            }
          });
        };
        awaitContract();
      } else {
        document.getElementById("web3_message").textContent="Please connect to Rinkeby Testnet";
      }
    });
  };
  awaitWeb3();
}

loadDapp()

document.getElementById("web3_message").textContent="Please connect to Metamask"

/* SALE */

const mint = async () => {
  const result = await contract.methods.mintToken(mint_amount)
    .send({ from: accounts[0], gas: 0, value: NFT_PRICE * mint_amount })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}


/* Whitelist */

const mintWhitelist = async () => {
  const result = await contract.methods.mintWhitelist(mint_amount)
    .send({ from: accounts[0], gas: 0, value: NFT_PRICE * mint_amount })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}


const setSaleActive = async () => {
  const result = await contract.methods.setSaleActive(true)
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}

const setBaseURI = async () => {
  const result = await contract.methods.setBaseURI("http://")
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}

const setAddresses = async () => {
  const result = await contract.methods.setAddresses(
    [
      "0x656288857627435d53307fFF75C151F247C21dFA",
      "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"
    ]
    )
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}

const withdrawTeam = async () => {
  const result = await contract.methods.withdrawTeam("110")
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}

const editWhitelistReserved = async () => {
  const result = await contract.methods.editWhitelistReserved(
    [
      "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
      "0x656288857627435d53307fFF75C151F247C21dFA"
    ],
    [
      1,
      1
    ]
    )
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}

const setWhitelistActive = async () => {
  const result = await contract.methods.setWhitelistActive(true)
    .send({ from: accounts[0], gas: 0, value: 0 })
    .on('transactionHash', function(hash){
      document.getElementById("web3_message").textContent="Minting...";
    })
    .on('receipt', function(receipt){
      document.getElementById("web3_message").textContent="Success! Minting finished.";    })
    .catch((revertReason) => {
      getRevertReason(revertReason.receipt.transactionHash);
    });
}






var contractR
var accountsR
var web3R





const getContractA = async (web3) => {
  const data = await getJSON("./MyContract.json")
  const netId = await web3.eth.net.getId()
  const deployedNetwork = data.networks[netId]
  const contract = new web3.eth.Contract(
    data.abi,
    deployedNetwork && deployedNetwork.address
  )
  return contract
}

function getJSON(url) {
  return new Promise(resolve => {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.responseType = "json"
    xhr.onload = function () {
      resolve(xhr.response)
    }
    xhr.send()
  })
}

async function load() {
  var awaitWeb3 = async function () {
    web3R = await getWeb3()
    web3R.eth.net.getId((err, netId) => {
      var awaitContract = async function () {
        contractR = await getContractA(web3R)
        var awaitAccounts = async function () {
          accountsR = await web3R.eth.getAccounts()
          console.log("Web3 loaded")
        }
        awaitAccounts()
      }
      awaitContract()
    })
  }
  awaitWeb3()
}

load()


  










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

      mint()
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
//hacer el mint
mint()
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