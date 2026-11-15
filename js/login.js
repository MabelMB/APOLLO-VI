document.addEventListener('DOMContentLoaded', async () => {
    const inputClave = document.getElementById('input-clave');
    const listaDropdown = document.getElementById('lista-coincidencias');
    const btnLogin = document.getElementById('btn-login');
    const formLogin = document.getElementById('form-login');

    if (!inputClave || !listaDropdown || !btnLogin || !formLogin) {
        console.error('Falta algún elemento del formulario en login.html');
        return;
    }

    let astronautasDB = []; // 1. Declaramos la variable primero

    btnLogin.disabled = true; // Deshabilitamos el botón de inicio

    // 2. HACEMOS LA PETICIÓN AL SERVIDOR PARA TRAER LOS ASTRONAUTAS
    try {
        const res = await fetch('php/index.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'enviarastronautas' })
        });
        
        const resultado = await res.json();
        
        // Asignamos los datos a la variable (ajusta '.astronautas' si el PHP devuelve el arreglo directo)
        astronautasDB = Array.isArray(resultado) ? resultado : (resultado.astronautas || []);
        
    } catch (error) {
        console.error('Error al cargar lista de astronautas:', error);
    }

// 3. FILTRAR COINCIDENCIAS AL ESCRIBIR EN EL INPUT
    inputClave.addEventListener('input', () => {
        const texto = inputClave.value.trim().toLowerCase(); // Pasamos a minúsculas y quitamos espacios
        listaDropdown.innerHTML = '';
        btnLogin.disabled = true; // Se bloquea si vuelve a escribir

        if (texto === '') return;

        // Filtramos convirtiendo el ID de la base de datos a texto de forma segura
        const coincidencias = astronautasDB.filter(astro => {
            const idStr = String(astro.idAstronauta || '').toLowerCase();
            return idStr.includes(texto);
        });

        coincidencias.forEach(astro => {
            const li = document.createElement('li');
            li.textContent = astro.idAstronauta; // Muestra el número del ID
            
            // Al hacer clic en una opción de la lista:
            li.addEventListener('click', () => {
                inputClave.value = astro.idAstronauta;
                listaDropdown.innerHTML = ''; // Oculta la lista
                btnLogin.disabled = false;    // ¡Habilita el botón de login!
            });

            listaDropdown.appendChild(li);
        });
    });

    // 4. ENVIAR EL LOGIN AL HACER CLIC EN "INGRESAR AL SISTEMA"
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idSeleccionado = inputClave.value.trim();

        try {
            const response = await fetch('php/index.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'validar_login',
                    idAstronauta: idSeleccionado 
                })
            });

            const data = await response.json();

            // Usamos la propiedad exacta "validacion" que programó Mabel
            if (data.validacion === true) {
                sessionStorage.setItem('idAstronauta', idSeleccionado);
                sessionStorage.setItem('datosAstronauta', JSON.stringify(data));
                
                window.location.href = 'main.html';
            } else {
                alert('Acceso denegado. No se pudo validar el astronauta.');
            }
        } catch (error) {
            console.error('Error en validación:', error);
        }
    });
});