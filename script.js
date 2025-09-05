// Obtener elementos del DOM
const noteInput = document.getElementById('new-note-input');  // Input de texto para la nueva nota
const addButton = document.getElementById('add-note-button');  // Botón para agregar la nueva nota
const notesContainer = document.getElementById('notes-container');  // Contenedor donde se agregan las notas
const toggleThemeButton = document.getElementById('toggle-theme-button');  // Botón para cambiar el tema
const body = document.body;  // El body del documento

// Definir los colores disponibles para las notas
const colors = ['note-yellow', 'note-blue', 'note-pink', 'note-green'];  // Se pueden agregar más colores aquí

// Función para crear un elemento de nota
function createNoteElement(text, colorClass) {
    const noteDiv = document.createElement('div');  // Crear un div para la nota
    noteDiv.classList.add('note', colorClass);  // Añadir las clases 'note' y el color correspondiente
    noteDiv.textContent = text;  // Asignar el texto de la nota

    // Crear el botón de eliminación
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');  // Añadir clase para el estilo
    deleteButton.textContent = 'x';  // Contenido del botón (letra "x")

    noteDiv.appendChild(deleteButton);  // Añadir el botón de eliminación al div de la nota
    return noteDiv;  // Retornar el div de la nota
}

// Función para guardar las notas en localStorage
function saveNotes() {
    const notes = [];
    // Iterar sobre todas las notas en el contenedor
    document.querySelectorAll('.note').forEach(note => {
        const text = note.textContent.replace('x', '').trim();  // Obtener el texto de la nota
        // Buscar la clase que indica el color de la nota
        const color = Array.from(note.classList).find(cls => cls.startsWith('note-'));
        notes.push({ text, color });  // Guardar texto y color en el array
    });
    localStorage.setItem('notes', JSON.stringify(notes));  // Guardar las notas en localStorage
}

// Función para cargar las notas desde localStorage
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');  // Obtener las notas guardadas
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);  // Parsear el string JSON en un array
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);  // Crear una nota con su texto y color
            notesContainer.appendChild(newNote);  // Agregar la nueva nota al contenedor
        });
    }
}

// Función para establecer el tema inicial (oscuro o claro)
function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';  // Verificar si el modo oscuro está activado
    if (isDarkMode) {
        body.classList.add('dark-mode');  // Añadir la clase de modo oscuro al body
        toggleThemeButton.textContent = 'Modo Claro';  // Cambiar el texto del botón
    }
}

// Deshabilitar el botón de agregar si no hay texto en el input
noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';  // Si el input está vacío, deshabilitar el botón
});

// Cambiar el tema entre oscuro y claro al hacer clic en el botón
toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');  // Alternar la clase de modo oscuro
    const isDarkMode = body.classList.contains('dark-mode');  // Verificar si está en modo oscuro
    localStorage.setItem('isDarkMode', isDarkMode);  // Guardar la preferencia de tema en localStorage
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';  // Cambiar el texto del botón
});

// Agregar una nueva nota al hacer clic en el botón
addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();  // Obtener el texto de la nueva nota
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];  // Elegir un color aleatorio
        const newNote = createNoteElement(noteText, randomColor);  // Crear el elemento de la nueva nota
        notesContainer.appendChild(newNote);  // Agregar la nueva nota al contenedor
        noteInput.value = '';  // Limpiar el input
        addButton.disabled = true;  // Deshabilitar el botón de agregar
        saveNotes();  // Guardar las notas en localStorage
    }
});

// Eliminar una nota al hacer clic en el botón de eliminación
notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {  // Verificar si el clic fue en un botón de eliminación
        event.target.parentElement.remove();  // Eliminar el div de la nota
        saveNotes();  // Guardar el estado actualizado de las notas
    }
});

// Editar el texto de una nota al hacer doble clic sobre ella
notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1);  // Obtener el texto actual (sin la "x")
        target.textContent = '';  // Limpiar el contenido de la nota
        target.classList.add('editing');  // Añadir la clase de edición

        const textarea = document.createElement('textarea');  // Crear un textarea para editar el texto
        textarea.value = currentText;  // Asignar el texto actual al textarea
        target.appendChild(textarea);  // Añadir el textarea a la nota
        textarea.focus();  // Enfocar el textarea para que el usuario empiece a escribir

        function saveEdit() {
            const newText = textarea.value.trim();  // Obtener el nuevo texto
            target.textContent = newText;  // Actualizar el texto de la nota
            target.classList.remove('editing');  // Eliminar la clase de edición

            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);  // Volver a agregar el botón de eliminación

            saveNotes();  // Guardar las notas en localStorage
        }

        // Guardar los cambios cuando el usuario hace blur (sale del textarea) o presiona Enter
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();  // Prevenir el salto de línea
                saveEdit();  // Guardar la edición
            }
        });
    }
});

// Efectos visuales cuando el ratón pasa sobre las notas
notesContainer.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('note')) {  // Si el ratón está sobre una nota
        event.target.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';  // Agregar sombra
    }
});

// Restaurar la sombra cuando el ratón sale de la nota
notesContainer.addEventListener('mouseout', (event) => {
    if (event.target.classList.contains('note')) {  // Si el ratón sale de una nota
        event.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';  // Eliminar la sombra
    }
});

// Establecer el tema inicial y cargar las notas guardadas
setInitialTheme();
loadNotes();
