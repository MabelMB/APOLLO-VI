
<?php

$rutaEnv = __DIR__ . '/.env';

if (!file_exists($rutaEnv)) {
    die("No se encontró el archivo .env");
}

$lineas = file($rutaEnv, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lineas as $linea) {
    $linea = trim($linea);

    // Ignorar comentarios
    if (str_starts_with($linea, '#')) {
        continue;
    }

    // Separar nombre y valor
    [$clave, $valor] = explode('=', $linea, 2);

    $_ENV[trim($clave)] = trim($valor);
}
