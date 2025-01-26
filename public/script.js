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
        petsGallery.innerHTML = ''; // Limpiar la galería
        pets.forEach((pet) => {
            const petCard = document.createElement('div');
            petCard.classList.add('pet-card');

            let imagePath;
            switch (pet.type.toLowerCase()) {
                case 'cat':
                    imagePath = './image/gato.png';
                    break;
                case 'dog':
                    imagePath = './image/perro.png';
                    break;
                case 'rabbit':
                    imagePath = './image/conejo.png';
                    break;
                default:
                    imagePath = './image/animales.png';
            }

            petCard.innerHTML = `
                <img src="${imagePath}" alt="${pet.name}">
                <h3>${pet.name}</h3>
                <p>Tipo: ${pet.type}</p>
                <p>Edad: ${pet.age} años</p>
                <p>Tamaño: ${pet.size}</p>
                <p>Descripción: ${pet.description}</p>
                <p class="status">${pet.adopted ? 'Adoptado' : 'Disponible'}</p>
                <div class="pet-actions">
                    <button class="update-button" data-id="${pet.id}">Actualizar</button>
                    <button class="delete-button" data-id="${pet.id}">Eliminar</button>
                    ${!pet.adopted ? `<button class="adopt-button" data-id="${pet.id}">Adoptar</button>` : ''}
                </div>
            `;
            petsGallery.appendChild(petCard);
        });

        attachButtonEvents();
    };

    const fetchPets = async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        try {
            const response = await fetch(`${API_URL}?${queryParams}`);
            const result = await response.json();
            displayPets(result.pets);
        } catch (error) {
            console.error('Error al obtener mascotas:', error);
        }
    };

    const addPet = async () => {
        const newPet = {
            name: petNameInput.value,
            type: petTypeInput.value,
            age: parseInt(petAgeInput.value),
            size: petSizeInput.value,
            description: petDescriptionInput.value,
            adopted: false,
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        const userId = prompt('Ingrese el Nombre del usuario que adopta la mascota:');
        try {
            const response = await fetch(`${API_URL}/adopt`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ petId: id, userId: userId  }) 
            });
            if (response.ok) {
                fetchPets();
            }
        } catch (error) {
            console.error('Error al adoptar mascota:', error);
        }
    };

    const deletePet = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchPets();
        } catch (error) {
            console.error('Error al eliminar mascota:', error);
        }
    };

    const updatePet = async (id) => {
        const updatedName = prompt('Nuevo nombre:');
        const updatedType = prompt('Tipo:');
        const updatedAge = prompt('Nueva edad:');
        const updatedDescription = prompt('Nueva descripción:');
        const updatedSize = prompt('Nuevo tamaño (small, medium, large):');
        const updatedStatus = prompt('Nuevo status (adoptada(o) ó disponible):');

        const updatedPet = {
            name: updatedName,
            type: updatedType,
            age: parseInt(updatedAge),
            description: updatedDescription,
            size: updatedSize,
            status: updatedStatus
        };

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPet),
            });
            fetchPets();
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
            name: searchNameInput.value.trim() || undefined,
            type: typeFilter.value !== 'all' ? typeFilter.value : undefined,
            adopted: statusFilter.value === 'adopted' ? true : statusFilter.value === 'available' ? false : undefined,
        };
        fetchPets(filters);
    });

    fetchPets();
});
