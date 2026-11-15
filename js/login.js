
document.addEventListener('DOMContentLoaded', async () => {

    const inputClave = document.getElementById('input-clave');
    const listaDropdown = document.getElementById('lista-coincidencias');
    const btnLogin = document.getElementById('btn-login');
    const formLogin = document.getElementById('form-login');
    const contenedorAlertas = document.getElementById('contenedor-alertas');

    const API = 'api/index.php';

    if (!inputClave || !listaDropdown || !btnLogin || !formLogin || !contenedorAlertas) {
        console.error('Falta algún elemento del formulario en login.html');
        return;
    }

    let astronautasDB = [];

    btnLogin.disabled = true;

    const mostrarError = (mensaje) => {
        contenedorAlertas.textContent = mensaje;
    };

    // 1. OBTENER LA LISTA DE ASTRONAUTAS
    try {

        const res = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'enviarastronautas'
            })
        });

        const resultado = await res.json();

        if (!res.ok) {
            throw new Error(resultado.error || 'Error en el servidor');
        }

        if (resultado.validacion !== true || !Array.isArray(resultado.astronautas)) {
            throw new Error(resultado.error || 'No se pudo obtener la lista de astronautas.');
        }

        astronautasDB = resultado.astronautas;

    } catch (error) {

        console.error('Error al cargar lista de astronautas:', error);
        mostrarError('No se pudo cargar la lista de astronautas. Verifica la conexión con el servidor y la base de datos.');

    }


    // 2. FILTRAR COINCIDENCIAS AL ESCRIBIR
    inputClave.addEventListener('input', () => {

        const texto = inputClave.value.trim().toLowerCase();

        listaDropdown.innerHTML = '';
        btnLogin.disabled = true;

        if (texto === '') return;

        const coincidencias = astronautasDB.filter(astro => {

            const idStr = String(astro.idAstronauta || '').toLowerCase();

            return idStr.includes(texto);

        });

        coincidencias.forEach(astro => {

            const li = document.createElement('li');

            li.textContent = astro.idAstronauta;

            li.addEventListener('click', () => {

                inputClave.value = astro.idAstronauta;

                listaDropdown.innerHTML = '';

                btnLogin.disabled = false;

            });

            listaDropdown.appendChild(li);

        });

    });


    // 3. VALIDAR EL INICIO DE SESIÓN
    formLogin.addEventListener('submit', async (e) => {

        e.preventDefault();

        const idSeleccionado = inputClave.value.trim();

        if (idSeleccionado === '') {

            alert('Selecciona un ID de astronauta.');

            return;

        }

        try {

            const response = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'validar_login',
                    idAstronauta: idSeleccionado
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en el servidor');
            }

            if (data.validacion === true) {

                sessionStorage.setItem('idAstronauta', idSeleccionado);
                localStorage.setItem('astronautaActivo', idSeleccionado);

                sessionStorage.setItem(
                    'datosAstronauta',
                    JSON.stringify(data)
                );

                window.location.href = 'main.html';

            } else {

                mostrarError(data.error || 'Acceso denegado. No se pudo validar el astronauta.');

            }

        } catch (error) {

            console.error('Error en validación:', error);

            mostrarError('No fue posible comunicarse con el servidor. Verifica que Apache y MySQL estén activos.');

        }

    });

});
