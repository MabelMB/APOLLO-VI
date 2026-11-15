// Lista temporal de claves de astronautas (luego Backend la conectará con MySQL)
const astronautas = [
    "123456",
    "234356",
    "987654"
];

const inputClave = document.getElementById("input-clave");
const listaCoincidencias = document.getElementById("lista-coincidencias");
const btnLogin = document.getElementById("btn-login");

// Función para validar si la clave existe y está completa
function validarIngreso() {
    const valorActual = inputClave.value.trim();
    const existe = astronautas.includes(valorActual);
    
    // El botón se habilita solo si la clave coincide exactamente con la lista
    btnLogin.disabled = !existe;
    return existe;
}

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

// Acción al presionar "Ingresar al sistema"
const formLogin = document.getElementById("form-login");
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

const tarjetaPersonal = document.getElementById('card-personal-data');
const panelNotificaciones = document.getElementById('panel-notificaciones');

if (tarjetaPersonal && panelNotificaciones) {
    tarjetaPersonal.addEventListener('click', () => {
        panelNotificaciones.classList.toggle('abierto');
    });
}

