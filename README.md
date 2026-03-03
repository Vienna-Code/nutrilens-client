# NutriLens (Cliente)

<img src="./public/logo.svg" width="200px" align="right" >

Cliente para el proyecto NutriLens

## Requisitos

Antes debemos instalar los requisitos para este proyecto:

- [git](https://git-scm.com/)
- [Bun](https://bun.sh/) o [Node.js v22+](https://nodejs.org/en)

## Cómo correr este proyecto

Primero clonamos este repositorio y accedemos al directorio con los comandos:

> git clone https://github.com/Vienna-Code/nutrilens-client
> 
> cd nutrilens-client

> [!IMPORTANT] 
> Asegurarse de crear un archivo .env en la raíz del proyecto que contenta tres variables de entorno:
>   - "VITE_API_URL", cuyo valor sea igual a la URL de nuestro servidor.
>   - "VITE_OSRM_URL", cuyo valor sea igual a la URL del servidor OSRM.
>   - "VITE_NOMINATIM_URL", cuyo valor sea igual a la URL del servidor Nominatim.

Dependiendo de nuestro runtime a utilizar los comandos serán diferentes, por lo que debe referirse al que corresponda para ejecutar los comandos siguientes.

<details>
  <summary>Bun</summary>

  Instalamos las dependencias con

  > bun install

  Luego de haber instalado las dependencias podemos:

  - Correr el proyecto en modo desarrollo
  
    > bun dev
  
  - Correr el proyecto en modo producción

    > bun run build
    >
    > bun run preview
</details>
<br />
<details>
  <summary>Node</summary>

  Instalamos las dependencias con

  > npm install

  Luego de haber instalado las dependencias podemos:

  - Correr el proyecto en modo desarrollo
  
    > npm run dev
  
  - Correr el proyecto en modo producción

    > npm run build
    >
    > npm run preview
</details>

> [!IMPORTANT] 
> Sí o sí necesitamos que esté corriendo el [servidor backend](https://github.com/Vienna-Code/nutrilens-backend) junto con el servidor OSRM y el servidor Nominatim, de lo contrario el proyecto no funcionará correctamente o tendrá capacidades limitadas.