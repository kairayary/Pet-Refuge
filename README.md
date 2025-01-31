# Pet Refuge 🐾🐶🐱

**Pet Refuge** es una aplicación web diseñada para facilitar la gestión y adopción de mascotas. Ofrece herramientas para que los refugios puedan registrar, administrar y actualizar información sobre las mascotas disponibles para adopción, mientras que los usuarios interesados pueden explorar opciones y seguir procesos de adopción.  

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript.
- **Express.js**: Framework para construir la API.
- **bcrypt**: Cifrado de contraseñas para usuarios.
- **jsonwebtoken**: Generación y validación de tokens para autenticación.
- **cors**: Gestión de políticas de intercambio entre dominios.
- **body-parser**: Para el manejo de datos JSON en las solicitudes.
- **dotenv**: Manejo de variables de entorno.
- **fs (File System)**: Para leer y escribir archivos locales (base de datos en formato JSON).

---

## Estructura del Proyecto

### 1. `index.js`

Es el punto de entrada de la API. Aquí se configuran las rutas y se inicia el servidor en el puerto 3000.

### 2. **Rutas** (`routes/petsRoutes.js` y `routes/usersRoutes.js`)

- **`petsRoutes.js`**:

Este archivo define las rutas relacionadas con las mascotas, permitiendo interactuar con los recursos de mascotas de la aplicación.

- **`usersRoutes.js`**:

Este archivo define las rutas relacionadas con los usuarios (profesores), permitiendo el registro y la autenticación de los mismos.

### 3. **Controladores** (`controllers/petsController.js`, `controllers/usersController.js`)

Los controladores gestionan las solicitudes a las rutas y realizan las operaciones necesarias, como la obtención de mascotas, la adopción y el registro de usuarios.

- **`petsController.js`**: 
  - **`getPets`**: Obtiene una lista de mascotas filtrada por tipo y estado.
  - **`addPet`**: Añade una nueva mascota a la base de datos.
  - **`updatePet`**: Actualiza los detalles de una mascota por su ID.
  - **`deletePet`**: Elimina una mascota de la base de datos por su ID.
  - **`adoptPet`**: Asigna una mascota a un usuario para su adopción.

- **`usersController.js`**:
  - **`registerUser`**: Registra un nuevo usuario.
  - **`loginUser`**: Inicia sesión a un usuario existente y genera un token JWT.

### 4. **Middlewares** (`middLeware/authMiddleware.js`)

Los middlewares se encargan de manejar la autenticación y la validación de los datos de las solicitudes.

- **`authenticateToken`**: Middleware que verifica si la solicitud contiene un token de autenticación válido.
- **`validatePetData`**: Middleware para validar los datos de las mascotas antes de que se guarden o actualicen en la base de datos. 

### 5. **Base de Datos** (`database.json`)

El archivo `database.json` simula una base de datos que contiene la información de las mascotas, los usuarios y las adopciones.

### 6. **Servicios** (`services/databaseService.js`)

El archivo `databaseService.js` gestiona la lectura y escritura de datos en el archivo `database.json`.

### 7. Pública (`public/`)

El directorio `/public` contiene los archivos de la interfaz de usuario (frontend). Aquí se encuentran los archivos necesarios para interactuar con la API a través de una interfaz web, tales como `index.html`, `style.css` y `script.js`.

---

## Instalación y Configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/kairayary/Pet-Refuge.git
   
   ```
2. Instalar las dependencias:
   ```bash
   npm install express bcrypt dotenv body-parser cors jsonwebtoken
   ```
3. Ejecutar el servidor:
   ```bash
   npm start
   ```
---

## Uso del Sistema

### **Usuarios**

El sistema permite a los usuarios realizar las siguientes acciones:

- **Registrar una cuenta de usuario**: Crear una cuenta proporcionando nombre, correo y contraseña.
- **Iniciar sesión**: Autenticarse con correo y contraseña para obtener un token JWT.
- **Consultar el perfil de usuario**: Ver información del perfil, solo disponible para usuarios autenticados.
- **Consultar mascotas**: Ver la lista completa de mascotas disponibles. Se pueden filtrar por tipo (ej. "dog") o estado (ej. "available").
- **Registrar una mascota**: Añadir nuevas mascotas al sistema proporcionando su nombre, tipo, descripción, edad, tamaño, entre otros datos.
- **Actualizar una mascota**: Modificar la información de una mascota ya registrada.
- **Eliminar una mascota**: Eliminar una mascota del sistema mediante su `id`.
- **Asignar una mascota a un usuario (adopción)**: Los usuarios pueden adoptar mascotas disponibles cambiando su estado a "adopted".

### **Flujo de adopción de mascotas**

1. Un usuario se registra o inicia sesión.
2. Un administrador o usuario con permisos puede consultar y registrar mascotas disponibles.
3. El usuario solicita adoptar una mascota.
4. El estado de la mascota se actualiza a "adopted" y se asocia al usuario.

### **Autenticación con JWT**

Las rutas protegidas requieren que los usuarios estén autenticados mediante un **token JWT**. El token se obtiene al iniciar sesión y debe incluirse en el encabezado de las solicitudes a rutas protegidas.

---

### **Frontend**

Esta interfaz permite a los usuarios interactuar con el sistema de gestión de mascotas y usuarios. Incluye los siguientes elementos:

- **Formulario de registro de usuario**: Permite a los usuarios crear una cuenta proporcionando su nombre, correo y contraseña.
- **Formulario de inicio de sesión**: Los usuarios pueden ingresar su correo y contraseña para autenticarse y obtener un token JWT.
- **Interfaz de visualización de mascotas**: Muestra la lista de mascotas disponibles, permitiendo filtrar por tipo y estado. Los usuarios pueden consultar los detalles de cada mascota.
- **Formulario de adopción**: Permite a los usuarios adoptar mascotas disponibles. Una vez adoptada, la mascota cambia su estado a "adopted".
- **Formulario para añadir y actualizar mascotas**: Los usuarios con permisos pueden agregar nuevas mascotas o actualizar la información de las existentes.
