# Dockerized Project

Proyecto base pensado para orquestar todos los subproyectos que conforman al mismo, por ejemplo: web, mobile, backend y base de datos.

# Empecemos

## Creando un nuevo proyecto

Para empezar un nuevo proyecto lo más fácil será copiar el contenido del archivo [create-dockerized-project.sh](https://github.com/mchamper/Template---Dockerized-Project---Docker/tree/master/downloads/create-dockerized-project.sh) situado en la carpeta **downloads** y colocarlo en la carpeta base de todos sus proyectos. A continuación:

```
$ cd <base-project-folder>
$ bash create-dockerized-project.sh <path-to-new-project>
```

Este comando creará una copia de este projecto en la ruta especificada dentro de una carpeta llamada **docker**.

Una vez creado el nuevo proyecto, lo siguiente será editar los siguientes archivos según las correspondientes necesidades:

- .env
- composer.dev.yml
- install.sh

Por último, correr el comando **install.sh**:

```
$ bash install.sh
```

## Sincronizado un proyecto existente

Una vez clonado el repositorio en cuestión, duplicar el archivo **.env.example** y renombrarlo **.env**, editarlo y correr el comando **install.sh**:

```
$ bash install.sh
```

# Convenciones

## Sources y services

En el archivo **.env** se definen las rutas a las carpetas donde se almacenarán los diferentes repositorios de los subproyectos que conforman al proyecto general, por ejemplo: web, backend, mobile, etc. Asi también se definen los **services** para docker en el archivo **compose.*.yml**.

En la variable **SRCS** debe respetarse la siguiente convención:

```
SRC_NAME=<path-to-subproject>

SRCS=(
  <docker-service-name>:$SRC_NAME
  ...
)
```

Quedando de la siguiente manera en un caso de uso real:

```
SRC_WEB="./../web"
SRC_MOBILE="./../mobile"
SRC_BACKOFFICE="./../backoffice"
SRC_BACKEND="./../backend"

SRCS=(
  web:${SRC_WEB}
  mobile:${SRC_MOBILE}
  backoffice:${SRC_BACKOFFICE}
  backend:${SRC_BACKEND}
)
```

Los nombres de `<docker-service-name>` deben coincidir sí o sí con los nombres designados en el archivo **compose.*.yml** de docker, ya que las variables de entorno se utilizan en los comandos base:

```
services:
  web:
    ...
  mobile:
    ...
  backoffice:
    ...
  backend:
    ...
```

# Comandos

Dentro de la carpeta **base/bin** existen a disposición una serie de comandos preparados para realizar disintas acciones generales relacionadas con los subproyectos.

Para ejecutar cualquier estos comandos es necesario estar parado en la carpeta raíz del proyecto principal:

```
$ bash base/bin/sources/create.sh
$ bash base/bin/docker/build.sh
$ bash base/bin/docker/create/laravel.sh <docker-service-name>
```

Asi mismo, la carpeta raíz **bin** esta preparada para crear sus propios comandos.

# Dockerfiles

Dentro de la carpeta **base/dockerfiles** existen a disposición una serie de Dockerfiles para imágenes de docker base y generales, con algunos archivos de configuración de ejemplo.

Si se necesita crear una imagen distinta se recomeindo copiar la carpeta base de esta ruta y duplicarla en la carpeta raíz **dockerfiles** para posteriormente trabjarlo de la manera que se necesite.

# Importante

Todos los contenidos de la carpeta raíz **base** son reemplazados por su nueva versión al momento de utilizar el comando `create-dockerized-project.sh` para actualizar el proyecto base.

Si se necesita crear contenido personalizado utilice las carpetas **bin** y **dockerfiles** correspondientemente.


