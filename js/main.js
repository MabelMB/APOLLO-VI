// // ==========================================
// // LOGIN (solo se ejecuta si existe el formulario de login)
// // ==========================================

// // Lista temporal de claves de astronautas (luego Backend la conectará con MySQL)
// const astronautas = [
//     "123456",
//     "234356",
//     "987654"
// ];

// const inputClave = document.getElementById("input-clave");
// const listaCoincidencias = document.getElementById("lista-coincidencias");
// const btnLogin = document.getElementById("btn-login");
// const formLogin = document.getElementById("form-login");

// // Función para validar si la clave existe y está completa
// function validarIngreso() {
//     const valorActual = inputClave.value.trim();
//     const existe = astronautas.includes(valorActual);

//     // El botón se habilita solo si la clave coincide exactamente con la lista
//     btnLogin.disabled = !existe;
//     return existe;
// }

// if (inputClave && listaCoincidencias && btnLogin) {
//     // Cada vez que el usuario teclea en el buscador
//     inputClave.addEventListener("input", () => {
//         const texto = inputClave.value.trim();
//         listaCoincidencias.innerHTML = ""; // Limpiar lista anterior

//         validarIngreso();

//         if (texto === "") return;

//         // Filtrar claves que contengan lo que se está escribiendo
//         const filtrados = astronautas.filter(clave =>
//             clave.includes(texto)
//         );

//         // Crear elementos de la lista desplegable
//         filtrados.forEach(clave => {
//             const li = document.createElement("li");
//             li.textContent = clave;

//             // Al hacer clic en una coincidencia, se rellena el input y valida
//             li.addEventListener("click", () => {
//                 inputClave.value = clave;
//                 listaCoincidencias.innerHTML = "";
//                 validarIngreso();
//             });

//             listaCoincidencias.appendChild(li);
//         });
//     });
// }

// // Acción al presionar "Ingresar al sistema"
// if (formLogin) {
//     formLogin.addEventListener("submit", (e) => {
//         e.preventDefault();

//         if (validarIngreso()) {
//             // Guarda la clave activa para usarla en el dashboard
//             localStorage.setItem("astronautaActivo", inputClave.value.trim());

//             // Redirige al dashboard
//             window.location.href = "main.html";
//         }
//     });
// }


// // ==========================================
// // DASHBOARD (solo se ejecuta si existen estos elementos)
// // ==========================================

// const panelNotificaciones = document.getElementById("panel-notificaciones");
// const panelTitulo = document.getElementById("panel-titulo");
// const mainGrid = document.querySelector(".main-grid");
// const imgCuerpo = document.getElementById("img-cuerpo");

// // Cada elemento que abre el panel y el título que debe mostrar
// const botonesPanel = {
//     "card-personal-data": "Notificaciones",
//     "sistema-sueno": "Sueño",
//     "sistema-corazon": "Corazón",
//     "sistema-oseo": "Óseo",
//     "sistema-radiacion": "Radiación",
//     "sistema-musculos": "Músculos",
//     "sistema-metabolismo": "Metabolismo"
// };

// // Qué tema (degradado + PNJ) activa cada botón.
// // Los botones que no están aquí usan el tema "inicio".
// const temasPorBoton = {
//     "sistema-oseo": "oseo",
//     "sistema-radiacion": "radiacion",
//     "sistema-musculos": "musculos"
// };

// // Imagen del PNJ según el tema y el sexo (archivos dentro de la carpeta img/)
// const imagenesPnj = {
//     inicio:    { mujer: "femaleBase.png",       hombre: "maleBase.png" },
//     oseo:      { mujer: "femaleBoneStruct.png", hombre: "maleBoneStruct.png" },
//     radiacion: { mujer: "femaleRadiation.png",  hombre: "maleRadiation.png" },
//     musculos:  { mujer: "femaleMuscles.png",    hombre: "maleMuscles.png" }
// };

// // Lee el sexo desde el dato del dashboard (F = mujer, cualquier otro = hombre)
// function obtenerSexo() {
//     const dato = document.getElementById("dato-sexo");
//     const texto = dato ? dato.textContent.trim().toUpperCase() : "";
//     return texto === "F" ? "mujer" : "hombre";
// }

// // Cambia el degradado (vía data-tema en el CSS) y la imagen del PNJ
// function aplicarTema(tema) {
//     if (!mainGrid || !imgCuerpo) return;
//     mainGrid.dataset.tema = tema;
//     imgCuerpo.src = "img/" + imagenesPnj[tema][obtenerSexo()];
// }

// // Tema por defecto al entrar al dashboard
// aplicarTema("inicio");

// let panelActual = null; // id del botón que tiene abierto el panel

// if (panelNotificaciones && panelTitulo) {
//     Object.entries(botonesPanel).forEach(([id, titulo]) => {
//         const boton = document.getElementById(id);
//         if (!boton) return;

//         boton.addEventListener("click", () => {
//             // PERSONAL DATA (notificaciones) no cambia el fondo ni el PNJ
//             const esSistema = id !== "card-personal-data";

//             if (panelActual === id) {
//                 // Segundo clic en el mismo botón: cerrar
//                 panelNotificaciones.classList.remove("abierto");
//                 panelActual = null;
//                 if (esSistema) aplicarTema("inicio");
//             } else {
//                 // Abrir (o cambiar de título si ya estaba abierto)
//                 panelTitulo.textContent = titulo;
//                 panelNotificaciones.classList.add("abierto");
//                 panelActual = id;
//                 if (esSistema) aplicarTema(temasPorBoton[id] || "inicio");
//             }
//         });
//     });
// }

// ==========================================
// LOGIN (solo se ejecuta si existe el formulario de login)
// ==========================================

const inputClave = document.getElementById("input-clave");
const listaCoincidencias = document.getElementById("lista-coincidencias");
const btnLogin = document.getElementById("btn-login");
const formLogin = document.getElementById("form-login");

let listaClaves = [];

async function cargarClaves() {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "enviarastronautas" })
        });
        const data = await response.json();

        if (!data || data.validacion === false) {
            console.error("Error del servidor:", data?.error);
            return;
        }

        listaClaves = data.astronautas.map(a => String(a.idAstronauta));
    } catch (error) {
        console.error("Error al cargar astronautas:", error);
    }
}

// Función para validar si la clave existe y está completa
function validarIngreso() {
    const valorActual = inputClave.value.trim();
    const existe = listaClaves.includes(valorActual); // FIX #6

    // El botón se habilita solo si la clave coincide exactamente con la lista
    btnLogin.disabled = !existe;
    return existe;
}

if (inputClave && listaCoincidencias && btnLogin) {
    cargarClaves();

    // Cada vez que el usuario teclea en el buscador
    inputClave.addEventListener("input", () => {
        const texto = inputClave.value.trim();
        listaCoincidencias.innerHTML = ""; // Limpiar lista anterior

        validarIngreso();

        if (texto === "") return;

        // Filtrar claves que contengan lo que se está escribiendo
        const filtrados = listaClaves.filter(clave =>
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
            localStorage.setItem("astronautaActivo", inputClave.value.trim());

            window.location.href = "main.html";
        }
    });
}


// ==========================================
// DASHBOARD (solo se ejecuta si existen estos elementos)
// ==========================================

const panelNotificaciones = document.getElementById("panel-notificaciones");
const panelTitulo = document.getElementById("panel-titulo");
const mainGrid = document.querySelector(".main-grid");
const imgCuerpo = document.getElementById("img-cuerpo");

const botonesPanel = {
    "card-personal-data": "Notificaciones",
    "sistema-sueno": "Sueño",
    "sistema-corazon": "Corazón",
    "sistema-oseo": "Óseo",
    "sistema-radiacion": "Radiación",
    "sistema-musculos": "Músculos",
    "sistema-metabolismo": "Metabolismo"
};

const temasPorBoton = {
    "sistema-oseo": "oseo",
    "sistema-radiacion": "radiacion",
    "sistema-musculos": "musculos"
};

// Imagen del PNJ según el tema y el sexo (archivos dentro de la carpeta img/)
const imagenesPnj = {
    inicio:    { mujer: "femaleBase.png",       hombre: "maleBase.png" },
    oseo:      { mujer: "femaleBoneStruct.png", hombre: "maleBoneStruct.png" },
    radiacion: { mujer: "femaleRadiation.png",  hombre: "maleRadiation.png" },
    musculos:  { mujer: "femaleMuscles.png",    hombre: "maleMuscles.png" }
};

function obtenerSexo() {
    const dato = document.getElementById("dato-sexo");
    const texto = dato ? dato.textContent.trim().toUpperCase() : "";
    return ["F", "FEMENINO", "MUJER"].includes(texto) ? "mujer" : "hombre";
}

// Cambia el degradado (vía data-tema en el CSS) y la imagen del PNJ
function aplicarTema(tema) {
    if (!mainGrid || !imgCuerpo) return;
    mainGrid.dataset.tema = tema;
    imgCuerpo.src = "img/" + imagenesPnj[tema][obtenerSexo()];
}

// ------------------------------------------
// Panel lateral (notificaciones / sistemas)
// ------------------------------------------
let panelActual = null;

if (panelNotificaciones && panelTitulo) {
    document.addEventListener("click", (e) => {
        const id = Object.keys(botonesPanel).find(
            (idBoton) => e.target.closest("#" + idBoton)
        );
        if (!id) return;

        const titulo = botonesPanel[id];

        const esSistema = id !== "card-personal-data";

        if (panelActual === id) {
            panelNotificaciones.classList.remove("abierto");
            panelActual = null;
            if (esSistema) aplicarTema("inicio");
        } else {
            panelTitulo.textContent = titulo;
            panelNotificaciones.classList.add("abierto");
            panelActual = id;
            if (esSistema) aplicarTema(temasPorBoton[id] || "inicio");
        }
    });
}

// ------------------------------------------
// DATOS PERSONALES DEL ASTRONAUTA
// ------------------------------------------
async function mostrarDatosPersonales(idAstronauta) {

    try {

        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "devolver_astronauta",
                idAstronauta: idAstronauta
            })
        });

        if (!response.ok) {
            throw new Error("Error al consultar los datos");
        }

        const data = await response.json();

        console.log("Respuesta del servidor:", data);
        console.log("ID enviado:", idAstronauta);

        if (!data || data.validacion === false) {
            console.error("Error del servidor:", data?.error ?? "No se encontró el astronauta");
            return;
        }

        const barraLateral = document.getElementById("panel-datos-izquierda");

        if (!barraLateral) {
            console.error("No se encontró panel-datos-izquierda");
            return;
        }

        console.log("Astronauta recibido:", data);
        const diasEnOrbita = Number(data.diasEnOrbita);
        const diasSeguros = calcularDiasSeguros(data.porcentajeCancer, diasEnOrbita);
        const diasSegurosLabel = data.porcentajeCancer == null
            ? "Sin datos de radiación"
            : (diasSeguros ?? "No calculable");

        barraLateral.innerHTML = `

            <div id="card-${data.clave}" class="info-box">
                <h3>NAME</h3>
                <p id="astronauta-${data.clave}">${data.nombre}</p>
            </div>

            <div id="card-personal-data" class="info-box">
                <h3>PERSONAL DATA</h3>
                <ul>
                    <li>Edad: <span id="dato-edad">${data.edad}</span> años</li>
                    <li>Sexo: <span id="dato-sexo">${data.genero}</span></li>
                    <li>Nacionalidad: <span id="dato-nacionalidad">${data.nacionalidad}</span></li>
                </ul>
            </div>

            <div id="card-mission-${data.idMission}" class="info-box">
                <h3>MISSION DATA</h3>
                <ul>
                    <li>Misión: <span id="dato-mision">${data.nombreMision}</span></li>
                    <li>Días en órbita: <span id="dato-dias">${diasEnOrbita}</span></li>
                    <li>Días seguros restantes: <span id="dato-dias-seguros">${diasSegurosLabel}</span></li>
                </ul>
            </div>

        `;

        aplicarTema("inicio");

    } catch (error) {

        console.error("Error al mostrar datos personales:", error);

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const panel = document.getElementById("panel-datos-izquierda");
    if (!panel) return;

    const astronautaActivo = localStorage.getItem("astronautaActivo");

    if (astronautaActivo) {
        mostrarDatosPersonales(astronautaActivo);
    } else {
        console.error("No hay un astronauta activo");
    }

});

function calcularDiasSeguros(porcentajeCancer, diasOrbita, limite = 3, factor = 1) {
    const porcentaje = Number(porcentajeCancer);
    const dias = Number(diasOrbita);
    if (!Number.isFinite(porcentaje) || !Number.isFinite(dias) || dias <= 0 || porcentaje <= 0) return null;

    const tasaDiaria = (porcentaje / dias) * factor; // factor > 1 si hay tormenta solar, etc.
    const margen = limite - porcentaje;

    if (margen <= 0) return 0;              // ya se alcanzó el límite
    return Math.floor(margen / tasaDiaria);
}