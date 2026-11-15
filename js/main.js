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
    const existe = listaClaves.includes(valorActual);

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
const DURACION_ZOOM = 1000;     // milisegundos: debe coincidir con el "1s" de transition en el CSS
let temporizadorZoom = null;

const botonesPanel = {
    "card-personal-data": "Notificaciones",
    "sistema-sueno": "Sueño",
    "sistema-corazon": "Corazón",
    "sistema-oseo": "Óseo",
    "sistema-radiacion": "Radiación",
    "sistema-musculos": "Músculos",
    "sistema-metabolismo": "Metabolismo"
};

// Qué tema (degradado + PNJ) activa cada botón.
const temasPorBoton = {
    "sistema-sueno": "sueno",
    "sistema-corazon": "corazon",
    "sistema-oseo": "oseo",
    "sistema-radiacion": "radiacion",
    "sistema-musculos": "musculos",
    "sistema-metabolismo": "metabolismo"
};

// Imagen del PNJ según el tema y el sexo (archivos dentro de la carpeta img/)
// La carpeta no contiene variantes femeninas para estas vistas; se reutilizan las imágenes disponibles.
const imagenesPnj = {
    inicio:      { mujer: "maleBase.png",       hombre: "maleBase.png" },
    sueno:       { mujer: "maleBase.png",       hombre: "maleBase.png" },
    corazon:     { mujer: "maleBase.png",       hombre: "maleBase.png" },
    metabolismo: { mujer: "maleBase.png",       hombre: "maleBase.png" },
    oseo:        { mujer: "maleBoneStruct.png", hombre: "maleBoneStruct.png" },
    radiacion:   { mujer: "maleRadiation.png",  hombre: "maleRadiation.png" },
    musculos:    { mujer: "maleMuscles.png",    hombre: "maleMuscles.png" }
};

// Temas con acercamiento: clase de zoom, imagen que aparece encima y sus archivos
const detallesPorTema = {
    sueno:       { zoom: "zoom-sueno",       elemento: "img-cabeza",
                   imagenes: { mujer: "femaleHead.png",   hombre: "maleHead.png" } },
    corazon:     { zoom: "zoom-corazon",     elemento: "img-torax",
                   imagenes: { mujer: "femaleTorax.png",  hombre: "maleTorax.png" } },
    metabolismo: { zoom: "zoom-metabolismo", elemento: "img-abdomen",
                   imagenes: { mujer: "femaleAbdomen.png", hombre: "maleAbdomen.png" } }
};

function obtenerSexo() {
    const dato = document.getElementById("dato-sexo");
    const texto = dato ? dato.textContent.trim().toUpperCase() : "";
    return ["F", "FEMENINO", "MUJER"].includes(texto) ? "mujer" : "hombre";
}

// Cambia el degradado (vía data-tema en el CSS) y las imágenes del PNJ
function aplicarTema(tema) {
    if (!mainGrid || !imgCuerpo) return;

    const sexo = obtenerSexo();
    const detalle = detallesPorTema[tema];   // undefined si el tema no tiene acercamiento

    clearTimeout(temporizadorZoom);          // cancela una animación pendiente

    mainGrid.dataset.tema = tema;
    imgCuerpo.src = "img/" + imagenesPnj[tema][sexo];

    // Asigna (y precarga) las imágenes de detalle según el sexo
    Object.values(detallesPorTema).forEach((d) => {
        const el = document.getElementById(d.elemento);
        if (el) el.src = "img/" + d.imagenes[sexo];
    });

    // Estado limpio: sin zoom, base visible y todas las imágenes de detalle ocultas
    Object.values(detallesPorTema).forEach((d) => imgCuerpo.classList.remove(d.zoom));
    imgCuerpo.classList.remove("oculta");
    document.querySelectorAll(".img-detalle").forEach((el) => el.classList.remove("visible"));

    // Si el tema tiene acercamiento: zoom y, al terminar, aparece la imagen encima
    if (detalle) {
        imgCuerpo.classList.add(detalle.zoom);
        temporizadorZoom = setTimeout(() => {
            imgCuerpo.classList.add("oculta");
            const el = document.getElementById(detalle.elemento);
            if (el) el.classList.add("visible");
        }, DURACION_ZOOM);
    }
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

        if (panelActual === id && panelNotificaciones.classList.contains("abierto")) {
            panelNotificaciones.classList.remove("abierto");
            panelActual = null;
            if (esSistema) aplicarTema("inicio");
        } else {
            panelTitulo.textContent = titulo;
            panelTitulo.style.color = "#38bdf8";
            panelNotificaciones.classList.add("abierto");
            panelActual = id;
            if (esSistema) {
                aplicarTema(temasPorBoton[id] || "inicio");
                cargarDatosZona(id.replace("sistema-", ""), id);
            }
        }

        if (id === "card-personal-data" && panelActual === id) {
            const idAstronauta = sessionStorage.getItem("idAstronauta")
                || localStorage.getItem("astronautaActivo");
            const contenedor = document.getElementById("contenido-panel-dinamico");

            if (idAstronauta) {
                cargarNotificaciones(idAstronauta);
            } else if (contenedor) {
                contenedor.textContent = "Inicia sesión para consultar tus notificaciones.";
            }
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

    const astronautaActivo = sessionStorage.getItem("idAstronauta")
        || localStorage.getItem("astronautaActivo");

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

function gestionarCategorias(categoria) {
    const contenedor = document.getElementById("activities-scroll-container");
    if (!contenedor) {
        console.error("No se encontró activities-scroll-container");
        return;
    }

    const idAstronauta = sessionStorage.getItem("idAstronauta")
        || localStorage.getItem("astronautaActivo");

    if (!idAstronauta) {
        contenedor.innerHTML = "<p>Inicia sesión para consultar tus actividades.</p>";
        console.error("No hay un astronauta activo para consultar actividades obligatorias");
        return;
    }

    contenedor.innerHTML = "<p>Cargando actividades...</p>";

    switch (categoria) {
        case 'ejercicio':
            devolverActividadFísica(idAstronauta);
            break;
            
        case 'animo':
            devolver_animo(idAstronauta);
            break;
            
        case 'alimentacion':
            devolver_alimentacion(idAstronauta);
            break;
            
        case 'hidratacion':
            devolver_hidratacion(idAstronauta);
            break;
            
        default:
            console.warn("Categoría desconocida");
    }
}


async function devolverActividadFísica(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "devolverActividadFísica",
                idAstronauta: idAstronauta
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || `Error HTTP ${response.status}`);
        }
        if (!data || data.validacion === false) {
            throw new Error(data?.error || "No se pudieron cargar las actividades físicas");
        }

        const contenedor = document.getElementById("activities-scroll-container");

        if (!contenedor) {
            console.error("No se encontró activities-scroll-container");
            return;
        }

        if (!Array.isArray(data.registros)) {
            throw new Error("La API no devolvió una lista válida de actividades físicas");
        }

        contenedor.innerHTML = "";

        if (data.registros.length === 0) {
            contenedor.innerHTML = "<p>No hay actividades físicas registradas.</p>";
            return;
        }

        data.registros.forEach(actividad => {
            contenedor.innerHTML += `
                <article class="activity-card-box" id="actividad-obligatoria-${actividad.idEjercicio}">
                    <div class="activity-header-row" id="actividad-header-${actividad.idEjercicio}">
                        <h4>Actividad física</h4>
                        <h4>${actividad.fecha}</h4>
                    </div>
                    <p>Descripcion: ${actividad.descripcion}</p>
                    <p>Horas: ${actividad.horasDuracion} hrs </p>
                    <p>Esfuerzo ${actividad.nivelEsfuerzo}</p>
                    <p>Peso: ${actividad.peso}</p>
                </article>
            `;
        });
        
        aplicarTema("inicio");

    } catch (error) {
        console.error("Error al mostrar actividades físicas:", error);
    }
}

async function devolver_alimentacion(idAstronauta) {
    try {

        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "alimentacion",
                idAstronauta: idAstronauta
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || `Error HTTP ${response.status}`);
        }
        if (!data || data.validacion === false) {
            throw new Error(data?.error || "No se pudieron cargar los datos de alimentación");
        }

        const contenedor = document.getElementById("activities-scroll-container");

        if (!contenedor) {
            console.error("No se encontró activities-scroll-container");
            return;
        }

        if (!Array.isArray(data.registros)) {
            throw new Error("La API no devolvió una lista válida de alimentación");
        }

        contenedor.innerHTML = "";

        if (data.registros.length === 0) {
            contenedor.innerHTML = "<p>No hay registros de alimentación.</p>";
            return;
        }

        data.registros.forEach(actividad => {
            contenedor.innerHTML += `
                <article class="activity-card-box" id="actividad-obligatoria-${actividad.idAliment}">
                    <div class="activity-header-row" id="actividad-header-${actividad.idAliment}">
                        <h4>${actividad.fecha}</h4>
                    </div>
                    <p>Estado Desayuno: ${actividad.estadoDesayuno}</p>
                    <p>Estado Comida: ${actividad.estadoComida}</p>
                    <p>Estado Cena: ${actividad.estadoCena}</p>
                </article>
            `;
        });
        
        aplicarTema("inicio");

    } catch (error) {
        console.error("Error al mostrar datos de alimentación:", error);
    }
}

async function devolver_animo(idAstronauta) {
    try {

        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "devolver_animo",
                idAstronauta: idAstronauta
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || `Error HTTP ${response.status}`);
        }
        if (!data || data.validacion === false) {
            throw new Error(data?.error || "No se pudieron cargar los registros de ánimo");
        }

        const contenedor = document.getElementById("activities-scroll-container");

        if (!contenedor) {
            console.error("No se encontró activities-scroll-container");
            return;
        }

        if (!Array.isArray(data.registros)) {
            throw new Error("La API no devolvió una lista válida de registros de ánimo");
        }

        contenedor.innerHTML = "";

        if (data.registros.length === 0) {
            contenedor.innerHTML = "<p>No hay registros de ánimo.</p>";
            return;
        }

        data.registros.forEach(actividad => {
            contenedor.innerHTML += `
                <article class="activity-card-box" id="actividad-obligatoria-${actividad.idAnimo}">
                    <div class="activity-header-row" id="actividad-header-${actividad.idAnimo}">
                        <h4>${actividad.fecha}</h4>
                    </div>
                    <p>${actividad.descripcion}</p>
                    <p>ID: ${actividad.idAnimo}</p>
                    <p>Estado: ${actividad.estado}</p>
                </article>
            `;
        });
        
        aplicarTema("inicio");

    } catch (error) {
        console.error("Error al mostrar registros de ánimo:", error);
    }
}

async function devolver_hidratacion(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "devolver_hidratacion",
                idAstronauta: idAstronauta
            })
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || `Error HTTP ${response.status}`);
        }
        if (!data || data.validacion === false) {
            throw new Error(data?.error || "No se pudieron cargar los registros de hidratación");
        }

        const contenedor = document.getElementById("activities-scroll-container");
        if (!contenedor) {
            throw new Error("No se encontró activities-scroll-container");
        }
        if (!Array.isArray(data.registros)) {
            throw new Error("La API no devolvió una lista válida de registros de hidratación");
        }

        contenedor.innerHTML = "";
        if (data.registros.length === 0) {
            contenedor.innerHTML = "<p>No hay registros de hidratación.</p>";
            return;
        }

        data.registros.forEach(actividad => {
            contenedor.innerHTML += `
                <article class="activity-card-box" id="actividad-obligatoria-${actividad.idHidratacion}">
                    <div class="activity-header-row" id="actividad-header-${actividad.idHidratacion}">
                        <h4>${actividad.fecha}</h4>
                    </div>
                    <p>${actividad.descripcion}</p>
                    <p>Litros al día: ${actividad.litrosDia}</p>
                    <p>Estado: ${actividad.estado}</p>
                </article>
            `;
        });
    } catch (error) {
        console.error("Error al mostrar registros de hidratación:", error);
    }
}

async function cargarActRecreativas(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "devolver_actRecreativa",
                idAstronauta: idAstronauta
            })
        });

        const data = await response.json();

        console.log("Respuesta del servidor:", data);
        console.log("ID enviado:", idAstronauta);

        if (!response.ok) {
            throw new Error(data?.error || `Error HTTP ${response.status}`);
        }

        if (!data || data.validacion === false) {
            throw new Error(data?.error || "No se encontraron actividades recreativas");
        }

        const contenedor = document.getElementById("actividades-recreativas");

        if (!contenedor) {
            throw new Error("No se encontró el contenedor de actividades recreativas");
        }

        contenedor.innerHTML = "";

        if (!Array.isArray(data.registros)) {
            throw new Error("La API no devolvió una lista válida de actividades recreativas");
        }

        if (data.registros.length === 0) {
            contenedor.innerHTML = `
                <div class="cont-temp-bibl" style="height:400px; display: flex; align-items: center; justify-content: center;">
                    <p>No tienes actividades recreativas agregadas.</p>
                </div>
            `;
            return;
        }

        data.registros.forEach(act => {
            contenedor.innerHTML += `
                <article class="activity-card-box" id="actrecreativa-${act.idAct}">
                    <div class="activity-header-row" id="actividad-header-${act.idAct}">
                        <h4>${act.nombre}</h4>
                        <h4>Estado: ${act.estado}</h4>
                    </div>
                    <p><strong>Descripción:</strong> ${act.descripcion}</p>
                    <p>Horas diarias: ${act.horasDiarias}</p>
                    <p>Fecha: ${act.fecha}</p>
                </article>
            `;
        });

        if (typeof aplicarTema === "function") {
            aplicarTema("inicio");
        }

    } catch (error) {
        console.error("Error al mostrar actividades recreativas:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("activities-scroll-container")) {
        gestionarCategorias("ejercicio");
    }

    const contenedor = document.getElementById("actividades-recreativas");
    if (!contenedor) return;

    const idAstronautaActual = sessionStorage.getItem("idAstronauta")
        || localStorage.getItem("astronautaActivo");

    if (!idAstronautaActual) {
        console.error("No hay un astronauta activo para cargar sus actividades recreativas");
        return;
    }

    cargarActRecreativas(idAstronautaActual);
});

async function cargarNotificaciones(idAstronauta) {
    const contenedor = document.getElementById("contenido-panel-dinamico");
    const panelNotificaciones = document.getElementById("panel-notificaciones");

    if (!contenedor || !panelNotificaciones) {
        console.error("No se encontraron los elementos del panel de notificaciones");
        return;
    }

    contenedor.textContent = "Cargando notificaciones...";

    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "devolver_notificacion",
                idAstronauta: idAstronauta
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.error || `Error HTTP ${response.status}`);
        }

        if (!data || data.validacion === false) {
            throw new Error(data?.error || "No se encontraron notificaciones");
        }

        if (!Array.isArray(data.registros)) {
            throw new Error("La API no devolvió una lista válida de notificaciones");
        }

        if (panelActual !== "card-personal-data" || !panelNotificaciones.classList.contains("abierto")) {
            return;
        }

        const hayNotificaciones = data.registros.length > 0;

        if (!hayNotificaciones) {
               contenedor.innerHTML = `
                <div class="contenido-panel-dinamico" style="height:400px; display: flex; align-items: center; justify-content: center;">
                    <p>No tienes notificaciones.</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = "";
        data.registros.forEach(notificacion => {
            const zonaOCategoria = notificacion.nombreZona || notificacion.nombreCategoria || "General";

            contenedor.innerHTML += `
                <article class="activity-card-box" id="notificacion-${notificacion.idNotificacion}">
                    <div class="activity-header-row" id="notificacion-header-${notificacion.idNotificacion}">
                        <h4>${zonaOCategoria}</h4>
                    </div>
                    <p><strong>Descripción:</strong> ${notificacion.descripcion}</p>
                    <button onclick="cerrarNotificacion(${notificacion.idNotificacion})" style="background: transparent; border: none; color: #fff; cursor: pointer; font-size: 1rem;">&times;</button>
                </article>
            `;
        });
        const elementoNombre = document.getElementById("astronauta-nombre");
        if (elementoNombre) {
            elementoNombre.style.color = hayNotificaciones ? "#ff0000" : "#ffffff";
        }

    } catch (error) {
        console.error("Error al mostrar notificaciones:", error);
        if (panelActual === "card-personal-data" && panelNotificaciones.classList.contains("abierto")) {
            contenedor.textContent = "No se pudieron cargar las notificaciones.";
        }
    }
}

function cerrarPanel() {
    const panel = document.getElementById('panel-notificaciones');
    panel.classList.remove('abierto');
}

async function cerrarNotificacion(idNotificacion) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                action: "eliminar_notificacion",
                idNotificacion: idNotificacion
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}: No se pudo eliminar de la base de datos`);
        }

        const data = await response.json();

        if (!data || data.validacion === false) {
            throw new Error(data?.error || "El servidor rechazó la eliminación");
        }

        console.log("Notificación eliminada de la BD:", data);
        const tarjeta = document.getElementById(`notificacion-${idNotificacion}`);

        if (tarjeta) {
            tarjeta.style.transition = "opacity 0.3s ease";
            tarjeta.style.opacity = "0";

            setTimeout(() => {
                tarjeta.remove();
                console.log(`Tarjeta ${idNotificacion} removida de la interfaz.`);
            }, 300);
        }

        cargarNotificaciones(sessionStorage.getItem("idAstronauta") || localStorage.getItem("astronautaActivo"));

    } catch (error) {
        console.error("Error al cerrar la notificación:", error);
    }
}

function crearBarraGraficaZona(etiqueta, valor, maximo, unidad, valorVisible = valor) {
    if (valor === null || valor === undefined || valor === ""
        || valorVisible === null || valorVisible === undefined || valorVisible === "") {
        return "";
    }

    const numero = Number(valor);
    const escala = Number(maximo);
    const numeroVisible = Number(valorVisible);

    if (!Number.isFinite(numero) || !Number.isFinite(escala) || escala <= 0 || !Number.isFinite(numeroVisible)) {
        return "";
    }

    const porcentaje = Math.min(100, Math.max(0, (numero / escala) * 100));
    const valorFormateado = numeroVisible.toLocaleString("es-MX", {
        maximumFractionDigits: 2
    });
    const escalaFormateada = escala.toLocaleString("es-MX", {
        maximumFractionDigits: 2
    });
    const unidadTexto = unidad ? ` ${unidad}` : "";

    return `
        <div class="sleep-bar-metric">
            <label>${etiqueta}<strong style="float: right;">${valorFormateado}${unidadTexto}</strong></label>
            <div class="sleep-progress-bar" role="img" aria-label="${etiqueta}: ${valorFormateado}${unidadTexto}; escala gráfica de 0 a ${escalaFormateada}${unidadTexto}">
                <div class="sleep-progress-fill" style="width: ${porcentaje.toFixed(2)}%;"></div>
            </div>
            <small style="color: #9ca3af;">Escala gráfica: 0–${escalaFormateada}${unidadTexto}</small>
        </div>
    `;
}

function crearGraficaCircularZona(etiqueta, valor, maximo, unidad) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }

    const numero = Number(valor);
    const escala = Number(maximo);

    if (!Number.isFinite(numero) || !Number.isFinite(escala) || escala <= 0) {
        return "";
    }

    const porcentaje = Math.min(100, Math.max(0, (numero / escala) * 100));
    const valorFormateado = numero.toLocaleString("es-MX", {
        maximumFractionDigits: 3
    });

    return `
        <div style="display: flex; flex-direction: column; align-items: center; margin: 20px 0;">
            <svg width="140" height="140" viewBox="0 0 120 120" role="img" aria-label="${etiqueta}: ${valorFormateado} ${unidad}">
                <circle cx="60" cy="60" r="48" fill="none" stroke="#334155" stroke-width="14"></circle>
                <circle cx="60" cy="60" r="48" fill="none" stroke="#38bdf8" stroke-width="14"
                    pathLength="100" stroke-dasharray="${porcentaje.toFixed(3)} 100"
                    transform="rotate(-90 60 60)"></circle>
                <text x="60" y="58" text-anchor="middle" fill="#ffffff" font-size="16">${valorFormateado}</text>
                <text x="60" y="78" text-anchor="middle" fill="#cbd5e1" font-size="11">${unidad}</text>
            </svg>
            <span style="color: #cbd5e1; font-size: 0.8rem;">Escala gráfica: 0–${escala} ${unidad}</span>
        </div>
    `;
}

async function mostrarDatosSueño(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "datos_suenio", idAstronauta: idAstronauta })
        });
        if (!response.ok) throw new Error("Error al consultar los datos");
        const data = await response.json();
        if (!data || data.validacion === false) return;

        // Inyectamos los datos dinámicos en el panel de sueño
        datosPaneles.sueno = `
            <h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 15px;">MONITOREO DE SUEÑO</h2>
            <p style="color: #cbd5e1; font-size: 0.85rem;">Ritmo circadiano: <strong>${data.ritmoCirc} h</strong></p>
            ${crearBarraGraficaZona("Duración del sueño", data.duracionSuenio, 8, "h")}
            ${crearBarraGraficaZona("Latencia del sueño", data.latenciaSuenio, 60, "min")}
            ${crearBarraGraficaZona("Calidad del sueño", data.calidadSuenio, 5, "/ 5")}
            ${crearBarraGraficaZona("Regularidad", data.regularidadSue, 100, "%")}
            ${crearBarraGraficaZona("Fragmentación", data.fragmentacionSue, 100, "%")}
            <p style="color: #cbd5e1; font-size: 0.85rem; margin-top: 10px;">Presión intracraneal: <strong style="color:#fff;">${data.presionIntracraneal} mmHg</strong></p>
            <p style="color: #38bdf8; font-size: 0.8rem; margin-top: 10px;">Estado: ${data.estado}</p>
        `;
    } catch (error) {
        console.error("Error en datos_suenio:", error);
        throw error;
    }
}

async function mostrarDatosCorazon(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "datos_corazon", idAstronauta: idAstronauta })
        });
        if (!response.ok) throw new Error("Error al consultar los datos");
        const data = await response.json();
        if (!data || data.validacion === false) return;

        datosPaneles.corazon = `
            <h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 15px;">CORAZÓN</h2>
            ${crearBarraGraficaZona("Frecuencia cardíaca", data.frecuenciaCard, 200, "BPM")}
            ${crearBarraGraficaZona("Rendimiento cardiovascular", data.cardiovascular, 10, "L/min")}
            <p style="color: #38bdf8; font-size: 0.8rem;">Estado: ${data.estado}</p>
        `;
    } catch (error) {
        console.error("Error en datos_corazon:", error);
        throw error;
    }
}

async function mostrarDatosOseo(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "datos_osea", idAstronauta: idAstronauta })
        });
        if (!response.ok) throw new Error("Error al consultar los datos");
        const data = await response.json();
        if (!data || data.validacion === false) return;

        datosPaneles.oseo = `
            <h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 15px;">MASA ÓSEA</h2>
            <p style="color: #cbd5e1; font-size: 0.85rem;">Densidad ósea: <strong>${data.densidadOsea} g/cm²</strong></p>
            ${crearBarraGraficaZona("Densimetría ósea", data.densimetriaOsea, 1, "")}
            ${crearBarraGraficaZona("Factor de riesgo", data.factorRiesgo, 100, "")}
            ${crearBarraGraficaZona("Carga aplicada", data.cargaAplicada, 100, "")}
            <p style="color: #cbd5e1; font-size: 0.85rem;">Resistencia ósea: <strong>${data.resistenciaOsea}</strong></p>
            <p style="color: #38bdf8; font-size: 0.8rem;">Estado: ${data.estado}</p>
        `;
    } catch (error) {
        console.error("Error en datos_osea:", error);
        throw error;
    }
}

async function mostrarDatosRadiacion(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "datos_radiacion", idAstronauta: idAstronauta })
        });
        if (!response.ok) throw new Error("Error al consultar los datos");
        const data = await response.json();
        if (!data || data.validacion === false) return;

        datosPaneles.radiacion = `
            <h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 10px;">RADIATION</h2>
            <p style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 5px;">Exceso de Riesgo de Cáncer de por Vida (ELCR)</p>
            <span style="color: #22c55e; font-size: 0.95rem; display: block; margin-bottom: 15px; font-weight: 500;">${data.estado}</span>
            ${crearGraficaCircularZona("ELCR", data.porcentajeCancer, 0.01, "%")}
        `;
    } catch (error) {
        console.error("Error en datos_radiacion:", error);
        throw error;
    }
}

async function mostrarDatosMusculos(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "datos_musculos", idAstronauta: idAstronauta })
        });
        if (!response.ok) throw new Error("Error al consultar los datos");
        const data = await response.json();
        if (!data || data.validacion === false) return;

        const tejidoGrasa = data.tejidoGrasa;
        const porcentajeGrasa = tejidoGrasa === null || tejidoGrasa === undefined || tejidoGrasa === ""
            ? null
            : Number(tejidoGrasa) <= 1
                ? Number(tejidoGrasa) * 100
                : Number(tejidoGrasa);

        datosPaneles.musculos = `
            <h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 15px;">MASA MUSCULAR</h2>
            ${crearBarraGraficaZona("Masa muscular", data.masaMuscular, 50, "kg")}
            ${crearBarraGraficaZona("Tejido graso", porcentajeGrasa, 100, "%")}
            ${crearBarraGraficaZona("Cambio neto de masa", Math.abs(Number(data.cambioMasa)), 3, "kg", data.cambioMasa)}
            ${crearBarraGraficaZona("Fuerza muscular", data.fuerzaMuscular, 500, "N")}
            <p style="color: #38bdf8; font-size: 0.8rem;">Estado: ${data.estado}</p>
        `;
    } catch (error) {
        console.error("Error en datos_musculos:", error);
        throw error;
    }
}

async function mostrarDatosMetabolismo(idAstronauta) {
    try {
        const response = await fetch("api/index.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "datos_metabolismo", idAstronauta: idAstronauta })
        });
        if (!response.ok) throw new Error("Error al consultar los datos");
        const data = await response.json();
        if (!data || data.validacion === false) return;

        datosPaneles.metabolismo = `
            <h2 style="color: #fff; font-size: 1.2rem; margin-bottom: 15px;">METABOLISMO</h2>
            ${crearBarraGraficaZona("Glucosa", data.nivelGlucosa, 200, "mg/dL")}

            <div style="display: flex; gap: 30px; margin-bottom: 25px;">
                <div><span style="color: #9ca3af; font-size: 0.75rem;">MASA CORPORAL</span><h4 style="color:#fff; font-size: 1.1rem;">${data.peso} kg</h4></div>
                <div><span style="color: #9ca3af; font-size: 0.75rem;">ALTURA</span><h4 style="color:#fff; font-size: 1.1rem;">${data.altura} m</h4></div>
            </div>

            ${crearBarraGraficaZona("Calorías", data.calorias, 3000, "kcal")}
            ${crearBarraGraficaZona("Gasto energético", data.gastoEnergetico, 3000, "kcal")}
            <p style="color: #38bdf8; font-size: 0.8rem; margin-top: 10px;">Estado: ${data.estado}</p>
        `;
    } catch (error) {
        console.error("Error en datos_metabolismo:", error);
        throw error;
    }
}

const cargadoresDatosZona = {
    sueno: mostrarDatosSueño,
    corazon: mostrarDatosCorazon,
    oseo: mostrarDatosOseo,
    radiacion: mostrarDatosRadiacion,
    musculos: mostrarDatosMusculos,
    metabolismo: mostrarDatosMetabolismo
};

async function cargarDatosZona(tipo, idPanel) {
    const contenedor = document.getElementById("contenido-panel-dinamico");
    const idAstronauta = sessionStorage.getItem("idAstronauta")
        || localStorage.getItem("astronautaActivo");
    const cargarDatos = cargadoresDatosZona[tipo];

    if (!contenedor) return;

    if (!idAstronauta) {
        contenedor.textContent = "Inicia sesión para consultar los datos de esta zona.";
        return;
    }

    if (!cargarDatos) {
        contenedor.textContent = "No se encontró el cargador de datos para esta zona.";
        return;
    }

    delete datosPaneles[tipo];
    contenedor.textContent = "Cargando información...";

    try {
        await cargarDatos(idAstronauta);

        if (panelActual !== idPanel || !panelNotificaciones.classList.contains("abierto")) {
            return;
        }

        contenedor.innerHTML = datosPaneles[tipo]
            || "<p>No hay datos registrados para esta zona.</p>";
    } catch (error) {
        console.error(`No se pudieron cargar los datos de la zona ${tipo}:`, error);

        if (panelActual === idPanel && panelNotificaciones.classList.contains("abierto")) {
            contenedor.textContent = "No se pudieron cargar los datos de esta zona.";
        }
    }
}