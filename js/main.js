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
const imagenesPnj = {
    inicio:      { mujer: "femaleBase.png",       hombre: "maleBase.png" },
    sueno:       { mujer: "femaleBase.png",       hombre: "maleBase.png" },
    corazon:     { mujer: "femaleBase.png",       hombre: "maleBase.png" },
    metabolismo: { mujer: "femaleBase.png",       hombre: "maleBase.png" },
    oseo:        { mujer: "femaleBoneStruct.png", hombre: "maleBoneStruct.png" },
    radiacion:   { mujer: "femaleRadiation.png",  hombre: "maleRadiation.png" },
    musculos:    { mujer: "femaleMuscles.png",    hombre: "maleMuscles.png" }
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

function gestionarCategorias(categoria, idAstronauta) {
    const contenedor = document.getElementById("activities-scroll-container");
    if (contenedor) {
        contenedor.innerHTML = "<p>Cargando datos espaciales...</p>";
    }
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

        const contenedor = document.getElementById("activities-scroll-container");

        if (!contenedor) {
            console.error("No se encontró activities-scroll-container");
            return;
        }
        
        contenedor.innerHTML = "";

        data.registros.forEach(actividad => {
            contenedor.innerHTML += `
                <article class="activity-card-box" id="actividad-obligatoria-${actividad.idEjercicio}">
                    <div class="activity-header-row" id="actividad-header-${actividad.idEjercicio}">
                        <h4>${actividad.nombreActividad}</h4>
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
        console.error("Error al mostrar datos de ejercicio:", error);
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

        const contenedor = document.getElementById("activities-scroll-container");

        if (!contenedor) {
            console.error("No se encontró activities-scroll-container");
            return;
        }
        
        contenedor.innerHTML = "";

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

        console.error("Error al mostrar datos personales:", error);

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

        const contenedor = document.getElementById("activities-scroll-container");

        if (!contenedor) {
            console.error("No se encontró activities-scroll-container");
            return;
        }
        
        contenedor.innerHTML = "";

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

        console.error("Error al mostrar datos personales:", error);

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

        const contenedor = document.getElementById("activities-scroll-container");

        if (!contenedor) {
            console.error("No se encontró activities-scroll-container");
            return;
        }
        
        contenedor.innerHTML = "";

        data.registros.forEach(actividad => {
            contenedor.innerHTML += `
                <article class="activity-card-box" id="actividad-obligatoria-${actividad.idHidratacion}">
                    <div class="activity-header-row" id="actividad-header-${actividad.idHidratacion}">
                        <h4>${actividad.fecha}</h4>
                    </div>
                    <p>${actividad.descripcion}</p>
                    <p>ID: ${actividad.idHidratacion}</p>
                    <p>Litros dia: ${actividad.litrosDia}</p>
                </article>
            `;
        });
        
        aplicarTema("inicio");

    } catch (error) {

        console.error("Error al mostrar datos personales:", error);

    }

}

function cargarActRecreativas() {
    var contenedor = document.querySelector('activities-scroll-container');	
	fetch('php/index.php', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
					action: 'extraer_biblioteca',
					id_usuario: id_usuario
				})
			})
			.then(response => response.json())
			.then(data => {
				if (data.length === 0) {
					contenedor.innerHTML += `
						<div class="cont-temp-bibl" style="height:400px;"> 
							<p> No tienes actividades recreativas agregadas. </p>
						</div>
					`;
					return;
				}
				
				contenedor.innerHTML = '';
                data.forEach(act => {
                    contenedor.innerHTML += `
                        <div class="tarjeta" id="actrecreativa-${act.idAct}">
                            <h3>${act.nombre}</h3>
                            <p>${act.descripcion}</p>
                            <p>Horas diarias: ${act.horasDiarias}</p>
                            <p>Fecha: ${act.fecha}</p>
                            <p>Estado: ${act.estado}</p>
                        </div>
                    `;
                });
			})
		.catch(error => console.error('Error:', error)); 
}