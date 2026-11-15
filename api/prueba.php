
<?php

require_once 'conexion.php';

$resultado = $pdo->query(
    "SELECT * FROM prueba_conexion"
);

foreach ($resultado as $fila) {
    echo $fila['id'] . " - ";
    echo $fila['nombre'] . " - ";
    echo $fila['mensaje'] . "<br>";
}
