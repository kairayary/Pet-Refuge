//Manejo de formularios

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const registerUsername = document.getElementById('registerUsername');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: loginUsername.value,
                    password: loginPassword.value
                })
            });
            const result = await response.json();
            if (response.ok) {

                localStorage.setItem('token', result.token);
                alert('Inicio de sesión exitoso');
                loginUsername.value = '';
                loginPassword.value = '';
                window.location.href = "/"
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un error al iniciar sesión');
        }
    });

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: registerUsername.value,
                email: registerEmail.value,
                password: registerPassword.value
            })
        });

        if (response.ok) {
            alert('Cuenta creada exitosamente');
            registerUsername.value = '';
            registerEmail.value = '';
            registerPassword.value = '';

            toggleForm();
        } else {
            alert('Error al crear la cuenta');
        }
    });
});

const toggleForm = () => {
    const contenedor = document.querySelector('.formularios');
    contenedor.classList.toggle('active');
};

// Función para cerrar sesión
function logout() {
    // Elimina el token del localStorage
    localStorage.removeItem('token');
    // Opcionalmente, puedes limpiar otros datos si los tienes
    // localStorage.clear();
    
    // Redirige al usuario a la página de inicio o login
    window.location.href = '/register-login.html';
}

// Asignar el evento al botón de cerrar sesión
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar la acción por defecto del enlace
            logout();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const petsGallery = document.getElementById('pets-gallery');
    const searchButton = document.getElementById('search-button');
    const addPetButton = document.getElementById('add-pet-button');
    const searchNameInput = document.getElementById('search-name');
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    const petNameInput = document.getElementById('pet-name');
    const petTypeInput = document.getElementById('pet-type');
    const petAgeInput = document.getElementById('pet-age');
    const petSizeInput = document.getElementById('pet-size');
    const petDescriptionInput = document.getElementById('pet-description');

    const API_URL = '/pets';

    const displayPets = (pets) => {
        petsGallery.innerHTML = '';
        pets.forEach((pet) => {
            const petCard = document.createElement('div');
            petCard.classList.add('pet-card');
            petCard.setAttribute('data-id', pet.id);
            petCard.setAttribute('data-status', pet.status);

            let imagePath;
            switch (pet.type.toLowerCase()) {
                case 'gato': imagePath = './image/gato.png'; break;
                case 'perro': imagePath = './image/perro.png'; break;
                case 'conejo': imagePath = './image/conejo.png'; break;
                default: imagePath = './image/animales.png';
            }

            petCard.innerHTML = `
                <img src="${imagePath}" alt="${pet.name}">
                <h3>${pet.name}</h3>
                <p>Tipo: ${pet.type}</p>
                <p>Edad: ${pet.age} años</p>
                <p>Tamaño: ${pet.size}</p>
                <p>Descripción: ${pet.description}</p>
                <p class="status">${pet.status.toLowerCase() === 'adoptado' ? 'Adoptado' : 'Disponible'}</p>
                <div class="pet-actions">
                    <button class="update-button" data-id="${pet.id}">Actualizar</button>
                    ${pet.status.toLowerCase() !== 'adoptado' ? `<button class="delete-button" data-id="${pet.id}">Eliminar</button>` : ''}
                    ${pet.status.toLowerCase() !== 'adoptado' ? `<button class="adopt-button" data-id="${pet.id}">Adoptar</button>` : ''}
                </div>
            `;
            petsGallery.appendChild(petCard);
        });

        attachButtonEvents();
    };

    const fetchPets = async (filteredPets = {}) => {
        const queryParams = new URLSearchParams(filteredPets).toString();
        try {
            const response = await fetch(`${API_URL}?${queryParams}&t=${Date.now()}`, {
                method: 'GET',
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
            });

            const result = await response.json();
            console.log('Mascotas actualizadas:', result);
            if (result.pets && result.pets.length > 0) {

                displayPets(result.pets);
            } else {
                petsGallery.innerHTML = '<p>No se encontraron mascotas con los filtros aplicados.</p>';
                // fetchPets(); 
            }
        } catch (error) {
            console.error('Error al obtener mascotas:', error);
            petsGallery.innerHTML = '<p>Error al cargar las mascotas.</p>';
        }
    };


    const addPet = async () => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            alert('Debes iniciar sesión para agregar una mascota.');
            return;
        }
        const newPet = {
            name: petNameInput.value,
            type: petTypeInput.value,
            age: parseInt(petAgeInput.value),
            size: petSizeInput.value,
            description: petDescriptionInput.value,
            status: 'Disponible',
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newPet),
            });

            if (response.ok) {
                petNameInput.value = '';
                petTypeInput.value = '';
                petAgeInput.value = '';
                petSizeInput.value = '';
                petDescriptionInput.value = '';
                fetchPets();
            } else {
                console.error('Error al agregar mascota:', await response.text());
            }
        } catch (error) {
            console.error('Error al agregar mascota:', error);
        }
    };

    const adoptPet = async (id) => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            alert('Debes iniciar sesión para adoptar una mascota.');
            return;
        };

        const userId = prompt('Ingrese el Nombre del usuario que adopta la mascota:');
        if (!userId) return;

        try {
            const response = await fetch(`${API_URL}/adopt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ petId: id, userId: userId })
            });

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            if (response.ok) {
                alert('¡Mascota adoptada exitosamente!');


                const petCard = document.querySelector(`.pet-card[data-id="${id}"]`);
                if (petCard) {
                    petCard.querySelector('.status').textContent = 'Adoptado';
                    petCard.querySelector('.adopt-button')?.remove();
                    petCard.querySelector('.delete-button')?.remove();
                    petCard.setAttribute('data-status', 'adoptado');
                }


            } else {
                console.error('Error al adoptar mascota:', result);
                alert('Hubo un problema al adoptar la mascota.');
            }
        } catch (error) {
            console.error('Error al adoptar mascota:', error);
            alert('Hubo un error al intentar adoptar la mascota.');
        }
    };

    const deletePet = async (id) => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            alert('Debes iniciar sesión para eliminar una mascota.');
            return;
        };

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                }
            });
            if (response.ok) {
                fetchPets();
            } else {
                console.error('Error al eliminar mascota:', await response.text());
            }

        } catch (error) {
            console.error('Error al eliminar mascota:', error);
        }
    };

    const updatePet = async (id) => {
        const token = localStorage.getItem('token'); // Obtener el token
        if (!token) {
            alert('Debes iniciar sesión para actualizar una mascota.');
            return;
        };
        const updatedName = prompt('Nuevo nombre:');
        const updatedType = prompt('Tipo:');
        const updatedAge = prompt('Nueva edad:');
        const updatedDescription = prompt('Nueva descripción:');
        const updatedSize = prompt('Nuevo tamaño (pequeño, mediano, grande):');


        const updatedPet = {
            name: updatedName,
            type: updatedType,
            age: parseInt(updatedAge),
            description: updatedDescription,
            size: updatedSize,

        };

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedPet),
            });

        } catch (error) {
            console.error('Error al actualizar mascota:', error);
        }
    };

    const attachButtonEvents = () => {
        document.querySelectorAll('.adopt-button').forEach((button) =>
            button.addEventListener('click', () => adoptPet(button.dataset.id))
        );

        document.querySelectorAll('.delete-button').forEach((button) =>
            button.addEventListener('click', () => deletePet(button.dataset.id))
        );

        document.querySelectorAll('.update-button').forEach((button) =>
            button.addEventListener('click', () => updatePet(button.dataset.id))
        );
    };

    addPetButton.addEventListener('click', addPet);

    searchButton.addEventListener('click', () => {
        const filters = {
            name: searchNameInput.value.trim(),
            type: typeFilter.value,
            status: statusFilter.value,
        };
        fetchPets(filters);
    });

    fetchPets();
});
