// Lista temporal de claves de astronautas
const astronautas = [
    "123456",
    "234356",
    "987654"
];

const inputClave = document.getElementById("input-clave");
const listaCoincidencias = document.getElementById("lista-coincidencias");
const btnLogin = document.getElementById("btn-login");
const formLogin = document.getElementById("form-login");

// Función para validar si la clave existe y está completa
function validarIngreso() {
    const valorActual = inputClave.value.trim();
    const existe = astronautas.includes(valorActual);

    // El botón se habilita solo si la clave coincide exactamente con la lista
    btnLogin.disabled = !existe;
    return existe;
}

if (inputClave && listaCoincidencias && btnLogin) {
    // Cada vez que el usuario teclea en el buscador
    inputClave.addEventListener("input", () => {
        const texto = inputClave.value.trim();
        listaCoincidencias.innerHTML = ""; // Limpiar lista anterior

        validarIngreso();

        if (texto === "") return;

        // Filtrar claves que contengan lo que se está escribiendo
        const filtrados = astronautas.filter(clave =>
            clave.includes(texto)
        );

        // Crear elementos de la lista desplegable
        filtrados.forEach(clave => {
            const li = document.createElement("li");
            li.textContent = clave;

            // Al hacer clic en una coincidencia, se rellena el input y valida
            li.addEventListener("click", () => {
                inputClave.value = clave;
                listaCoincidencias.innerHTML = "";
                validarIngreso();
            });

            listaCoincidencias.appendChild(li);
        });
    });
}

// Acción al presionar "Ingresar al sistema"
if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        if (validarIngreso()) {
            // Guarda la clave activa para usarla en el dashboard
            localStorage.setItem("astronautaActivo", inputClave.value.trim());

            // Redirige al dashboard
            window.location.href = "dashboard.html";
        }
    });
}


// ==========================================
// DASHBOARD (solo se ejecuta si existen estos elementos)
// ==========================================

const panelNotificaciones = document.getElementById("panel-notificaciones");
const panelTitulo = document.getElementById("panel-titulo");

// Cada elemento que abre el panel y el título que debe mostrar
const botonesPanel = {
    "card-personal-data": "Notificaciones",
    "sistema-sueno": "Sueño",
    "sistema-corazon": "Corazón",
    "sistema-oseo": "Óseo",
    "sistema-radiacion": "Radiación",
    "sistema-musculos": "Músculos",
    "sistema-metabolismo": "Metabolismo"
};

let panelActual = null; // id del botón que tiene abierto el panel

if (panelNotificaciones && panelTitulo) {
    Object.entries(botonesPanel).forEach(([id, titulo]) => {
        const boton = document.getElementById(id);
        if (!boton) return;

        boton.addEventListener("click", () => {
            if (panelActual === id) {
                // Segundo clic en el mismo botón: cerrar
                panelNotificaciones.classList.remove("abierto");
                panelActual = null;
            } else {
                // Abrir (o cambiar de título si ya estaba abierto)
                panelTitulo.textContent = titulo;
                panelNotificaciones.classList.add("abierto");
                panelActual = id;
            }
        });
    });
}