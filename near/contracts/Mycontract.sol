// SPDX-License-Identifier: MIT

pragma solidity 0.8.5;
//Crear matriz 
contract MyContract {
   struct Persona {
        string nombre;
        string correo;
        string institucion;
        string enfoque;
        address wallet;
    }

    mapping(uint256 => Persona) public personas;
    uint256 public totalPersonas;

     function setPersona(
        string memory _nombre,
        string memory _correo,
        string memory _institucion,
        string memory _enfoque,
        address _wallet
    ) public {
        personas[totalPersonas] = Persona(
            _nombre,
            _correo,
            _institucion,
            _enfoque,
            _wallet
        );
        totalPersonas++;
    }

    function getPersona(uint256 _indice)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            address
        )
    {
        require(_indice < totalPersonas, "Indice fuera de rango");
        Persona memory persona = personas[_indice];
        return (
            persona.nombre,
            persona.correo,
            persona.institucion,
            persona.enfoque,
            persona.wallet
        );
    }

    function getNombre(uint256 _indice)
        public
        view
        returns (
            string memory

        )
    {
        require(_indice < totalPersonas, "Indice fuera de rango");
       return personas[_indice].nombre;
    }

    function getCorreo(uint256 _indice)
        public
        view
        returns (
            string memory
        )
    {
        require(_indice < totalPersonas, "Indice fuera de rango");
   
           return personas[_indice].correo;

    }

    function setCorreo(
        uint256 _indice,string memory _correo

    ) public {
        personas[_indice].correo = _correo;
    }

    function getInstitucion(uint256 _indice)
        public
        view
        returns (
            string memory
        )
    {
        require(_indice < totalPersonas, "Indice fuera de rango");

           return personas[_indice].institucion;
   
    }

    function setInstitucion(
        uint256 _indice,string memory _institucion

    ) public {
        personas[_indice].institucion = _institucion;
    }

    function getEnfoque(uint256 _indice)
        public
        view
        returns (
            string memory
        )
    {
        require(_indice < totalPersonas, "Indice fuera de rango");
       
           return personas[_indice].enfoque;
     }

    function setEnfoque(
        uint256 _indice,string memory _enfoque

    ) public {
        personas[_indice].enfoque = _enfoque;
    }

    function getWallet(uint256 _indice)
        public
        view
        returns (
            address
        )
    {
        require(_indice < totalPersonas, "Indice fuera de rango");
    
           return personas[_indice].wallet;
    }

}
