
<?php

header('Content-Type: application/json; charset=utf-8');

require_once "conexion.php";

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?? [];

$action = $_GET['action'] ?? $_POST['action'] ?? $data['action'] ?? null;

$respuesta = [
    "validacion" => false,
    "error" => "Acción no válida"
];

try {

    $con = new Conexion();
    $db = $con->conectar();

    switch ($action) {

        // 1. ENVIAR LISTA DE ASTRONAUTAS
        case 'enviarastronautas':

            $query = $db->prepare("
                SELECT idAstronauta, nombre
                FROM Astronauta
            ");

            $query->execute();

            $astronautas = $query->fetchAll();

            if ($astronautas) {

                $respuesta = [
                    "validacion" => true,
                    "astronautas" => $astronautas
                ];

            } else {

                $respuesta = [
                    "validacion" => false,
                    "error" => "No hay astronautas registrados"
                ];

            }

            break;


        // 2. VALIDAR INICIO DE SESIÓN
        case 'validar_login':

            $clave = $data['idAstronauta'] ?? null;

            if (!empty($clave)) {

                $query = $db->prepare("
                    SELECT
                        a.nombre,
                        a.fechaNacimiento,
                        a.rol,
                        a.nacionalidad,
                        a.genero,
                        m.nombreMision,
                        m.distanciaTierra,
                        m.fechaInicio,
                        m.tiempo,
                        m.destino,
                        m.gravedad,
                        m.estadoSol,
                        m.supernova,
                        m.vanlleRadiation,
                        m.estado
                    FROM Astronauta a
                    JOIN Mision m ON a.idMision = m.idMision
                    WHERE a.idAstronauta = ?
                ");

                $query->execute([$clave]);

                $row = $query->fetch();

                if ($row) {

                    $respuesta = [
                        "validacion" => true,
                        "nombre" => $row['nombre'],
                        "fechaNacimiento" => $row['fechaNacimiento'],
                        "rol" => $row['rol'],
                        "nacionalidad" => $row['nacionalidad'],
                        "genero" => $row['genero'],
                        "nombreMision" => $row['nombreMision'],
                        "distanciaTierra" => $row['distanciaTierra'],
                        "fechaInicio" => $row['fechaInicio'],
                        "tiempo" => $row['tiempo'],
                        "destino" => $row['destino'],
                        "gravedad" => $row['gravedad'],
                        "estadoSol" => $row['estadoSol'],
                        "supernova" => $row['supernova'],
                        "vanlleRadiation" => $row['vanlleRadiation'],
                        "estado" => $row['estado']
                    ];

                } else {

                    $respuesta = [
                        "validacion" => false,
                        "error" => "Clave o ID de astronauta no encontrado"
                    ];

                }

            } else {

                $respuesta = [
                    "validacion" => false,
                    "error" => "El ID de astronauta está vacío"
                ];

            }

            break;
    }

} catch (PDOException $e) {

    error_log($e->getMessage());

    http_response_code(500);

    $respuesta = [
        "validacion" => false,
        "error" => "Error al consultar la base de datos"
    ];

} catch (Exception $e) {

    error_log($e->getMessage());

    http_response_code(500);

    $respuesta = [
        "validacion" => false,
        "error" => "Error interno del servidor"
    ];

}

echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);

?>
