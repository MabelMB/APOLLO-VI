// Lista temporal de astronautas
const astronautas = [
    "Alexis Reyes",
    "Mabel Menchaca",
    "Sadisa Balderas",
    "Galilea Nieto",
    "Carolina Zapata",
    "Irazema Suarez"
];

const inputNombre = document.getElementById("input-nombre");
const listaCoincidencias = document.getElementById("lista-coincidencias");

//Cada vez que el usuario teclea en el buscador
inputNombre.addEventListener("input", () => {
    const texto = inputNombre.value.trim().toLowerCase();
    listaCoincidencias.innerHTML = ""; // Limpiar lista anterior

    if (texto === "") return;

    // Filtrar nombres que contengan lo que se está escribiendo
    const filtrados = astronautas.filter(nombre => 
        nombre.toLowerCase().includes(texto)
    );

    filtrados.forEach(nombre => {
        const li = document.createElement("li");
        li.textContent = nombre;

        // Al hacer clic en una coincidencia, se rellena el input y se ocultara la lista
        li.addEventListener("click", () => {
            inputNombre.value = nombre;
            listaCoincidencias.innerHTML = "";
        });

        listaCoincidencias.appendChild(li);
    });
});