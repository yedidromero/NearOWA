# OpenWeb-CryptoMX

RoadMap del proyecto

1. Planificación y diseño de la plataforma web:
   - Definir los objetivos y alcance del proyecto.
   - Realizar un análisis de requisitos detallado.
   - Diseñar la interfaz de usuario y la estructura de la plataforma educativa.

2. Desarrollo de la plataforma web:
   - Crear la arquitectura y la base de datos necesarias.
   - Implementar el registro de usuarios utilizando su correo electrónico como identificador único.
   - Desarrollar las páginas y componentes necesarios para la plataforma educativa.

3. Generación y asignación de wallets:
   - Configurar un sistema automatizado para generar una wallet única para cada usuario registrado.
   - Asociar la wallet generada con la cuenta de usuario correspondiente en nuestra base de datos.

4. Integración de Near y staking:
   - Conectar nuestra plataforma con la red Near Protocol para permitir a los usuarios ingresar Near en sus wallets.
   - Desarrollar una función de staking que permita a los usuarios bloquear sus Near en nuestra liquid staking pool durante 12 meses.
   - Establecer las reglas y condiciones para desbloquear el contenido en su totalidad después del período de staking.

5. Gestión de rendimientos y monetización:
   - Crear una wallet específica para recibir los rendimientos (APY) generados por el staking de los usuarios.
   - Implementar un sistema que envíe los rendimientos a esa wallet específica para monetizar el contenido gratuito ofrecido en nuestra        plataforma.

6. Retiro de Near y finalización del staking:
   - Establecer un mecanismo que permita a los usuarios retirar su Near de la liquid staking pool después de completar los 12 meses de staking.
   - Implementar los controles necesarios para verificar que los usuarios hayan cumplido el período de staking antes de permitirles            retirar sus fondos.

7. Acceso y visualización de cryptoactivos:
   - Desarrollar una función que permita a los usuarios iniciar sesión en su cuenta utilizando su correo electrónico.
   - Proporcionar una interfaz en la que los usuarios puedan visualizar sus cryptoactivos en staking, incluido el saldo actual y el            tiempo restante para completar el staking de 12 meses.
