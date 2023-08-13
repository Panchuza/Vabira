## Instalacion

```bash
$ npm install
```

## Levantar el proyecto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```
```bash
## local.env
Agregar dentro de la carpeta src\common\envs el archivo local.env con lo siguiente:
DATABASE_USER=(nombre de usuario con el que se registraron, generalmente es "sa")
DATABASE_PASSWORD=(contraseña que pusieron en el registro)

DATABASE_HOST=(en mi caso es "localhost", en el de ustedes deberia ser igual)

DATABASE_NAME=(el nombre que le pusieron a la base de datos que crearon)
DATABASE_PORT=(el puerto es 1433 avisarme para configurarlo juntos)

NODE_DEBUG=false
```
