document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchNameInput = document.getElementById('search-name');
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    const petsGallery = document.getElementById('pets-gallery');

    // Función para obtener mascotas del backend
    const fetchPets = async (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`/pets?${queryParams}`);
        const pets = await response.json();
        renderPets(pets);
    };

    // Función para renderizar las tarjetas de mascotas
    const renderPets = (pets) => {
        petsGallery.innerHTML = ''; // Limpiar la galería
        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.classList.add('pet-card');

            petCard.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}">
                <h3>${pet.name}</h3>
                <p>Tipo: ${pet.type}</p>
                <p class="status">${pet.status}</p>
            `;

            petsGallery.appendChild(petCard);
        });
    };

    // Evento de búsqueda
    searchButton.addEventListener('click', () => {
        const filters = {
            name: searchNameInput.value,
            type: typeFilter.value,
            status: statusFilter.value
        };
        fetchPets(filters);
    });

    // Cargar todas las mascotas inicialmente
    fetchPets();
});
