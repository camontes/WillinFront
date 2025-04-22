proyecto creado con Nextjs, Reactjs, TypeScript
para correr el proyecto en el contenedor y que se comunique con el back se debe de crear la red que esta especificada en el docker-compose que esta corriendo el back, ejecutar el siguiente comando en la consola
*docker network create backend_network
despues de crear la red levantar el proyecto
*docker-compose up --build
