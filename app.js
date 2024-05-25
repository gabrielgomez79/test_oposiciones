// Cargar y convertir el archivo XLSX a JSON
function readXlsxFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);
            resolve(jsonData);
        };
        reader.onerror = (err) => {
            reject(err);
        };
        reader.readAsArrayBuffer(file);
    });
}

// Variables globales
let preguntas = [];
let temaSeleccionado = '';
let preguntasTema = [];
let preguntaActual = {};

// Inicializar la aplicación
document.getElementById('start-quiz').addEventListener('click', startQuiz);
document.getElementById('submit-answer').addEventListener('click', checkAnswer);

// Función para iniciar el quiz
function startQuiz() {
    temaSeleccionado = document.getElementById('tema').value;
    preguntasTema = preguntas.filter(p => p.TEMA === temaSeleccionado);
    if (preguntasTema.length > 0) {
        document.getElementById('quiz-container').style.display = 'block';
        mostrarPregunta();
    }
}

// Función para mostrar una pregunta
function mostrarPregunta() {
    const index = Math.floor(Math.random() * preguntasTema.length);
    preguntaActual = preguntasTema[index];
    document.getElementById('pregunta').textContent = preguntaActual.PREGUNTA;
    document.getElementById('respuesta').value = '';
    document.getElementById('feedback').textContent = '';
}

// Función para comprobar la respuesta
function checkAnswer() {
    const respuestaUsuario = document.getElementById('respuesta').value.trim();
    if (respuestaUsuario.toLowerCase() === preguntaActual.RESPUESTA.toLowerCase()) {
        document.getElementById('feedback').textContent = '¡Correcto!';
    } else {
        document.getElementById('feedback').textContent = `Incorrecto. La respuesta correcta es: ${preguntaActual.RESPUESTA}`;
    }
}

// Leer el archivo XLSX cuando se selecciona
/* document.getElementById('tema').addEventListener('change', (event) => {
    const fileInput = event.target.files[0];
    if (fileInput) {
        readXlsxFile(fileInput).then((data) => {
            preguntas = data;
            cargarTemas();
        }).catch((error) => {
            console.error('Error leyendo el archivo:', error);
        });
    }
}); */

// Leer el archivo XLSX cuando se carga la página
window.onload = () => {
    fetch('preguntas.xlsx')
        .then(response => response.blob()) // Convertir la respuesta a un Blob
        .then(blob => readXlsxFile(blob))
        .then(jsonData => {
            preguntas = jsonData;
            cargarTemas();
        })
        .catch(error => console.error('Error leyendo el archivo:', error));
};

// Función para cargar los temas en el selector
function cargarTemas() {
    const temas = [...new Set(preguntas.map(p => p.TEMA))];
    const temaSelect = document.getElementById('tema');
    temaSelect.innerHTML = '';
    temas.forEach(tema => {
        const option = document.createElement('option');
        option.value = tema;
        option.textContent = tema;
        temaSelect.appendChild(option);
    });
}
