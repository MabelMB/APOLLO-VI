<?php

// FIX #8: evita que warnings/notices de PHP se impriman antes del JSON
// y rompan response.json() en el navegador. Los errores van al log.
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . "/conexion.php";

$json = file_get_contents('php://input');
$data = json_decode($json, true) ?? [];

$action = $_GET['action'] ?? $_POST['action'] ?? $data['action'] ?? null;

// $respuesta = [
//     "validacion" => false,
//     "error" => "Acción no válida"
// ];

try {

    $con = new Conexion();
    $db = $con->conectar();

    switch ($action) {

        case 'enviarastronautas':
            $query = $db->prepare("
                SELECT idAstronauta, nombre
                FROM Astronauta
            ");
            $query->execute();
            $astronautas = $query->fetchAll(PDO::FETCH_ASSOC);
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

        case 'validar_login':
            $clave = trim((string) ($data['idAstronauta'] ?? $_POST['idAstronauta'] ?? ''));
            if ($clave !== '') {
                $query = $db->prepare("
                    SELECT idAstronauta, nombre
                    FROM Astronauta
                    WHERE idAstronauta = ?
                ");
                $query->execute([$clave]);
                $astronauta = $query->fetch(PDO::FETCH_ASSOC);

                if ($astronauta) {
                    $respuesta = [
                        "validacion" => true,
                        "astronauta" => $astronauta
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

        case 'devolver_astronauta':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                // FIX #1: se agregan a.idAstronauta y m.idMision al SELECT
                //         (el código de abajo los usaba pero no se consultaban).
                // FIX #2: se calcula "edad" desde fechaNacimiento.
                $query = $db->prepare("
                    SELECT
                        a.idAstronauta,
                        a.nombre,
                        a.fechaNacimiento,
                        TIMESTAMPDIFF(YEAR, a.fechaNacimiento, CURDATE()) AS edad,
                        a.rol,
                        a.nacionalidad,
                        a.genero,
                        m.idMision,
                        m.nombreMision,
                        m.distanciaTierra,
                        m.fechaInicio,
                        m.tiempo,
                        GREATEST(DATEDIFF(CURDATE(), m.fechaInicio), 0) AS diasEnOrbita,
                        c.porcentajeCancer,
                        m.destino,
                        m.gravedad,
                        m.estadoSol,
                        m.supernova,
                        m.vanlleRadiation,
                        m.estado
                    FROM Astronauta a
                    JOIN Mision m ON a.idMision = m.idMision
                    LEFT JOIN Cuerpo c ON c.idAstronauta = a.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "clave" => $row['idAstronauta'],
                        "nombre" => $row['nombre'],
                        "fechaNacimiento" => $row['fechaNacimiento'],
                        "edad" => $row['edad'], // FIX #2
                        "rol" => $row['rol'],
                        "nacionalidad" => $row['nacionalidad'],
                        "genero" => $row['genero'],
                        "idMission" => $row['idMision'],
                        "nombreMision" => $row['nombreMision'],
                        "distanciaTierra" => $row['distanciaTierra'],
                        "fechaInicio" => $row['fechaInicio'],
                        "tiempo" => $row['tiempo'],
                        "diasEnOrbita" => $row['diasEnOrbita'],
                        "porcentajeCancer" => $row['porcentajeCancer'],
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

        case 'alimentacion':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                // FIX #7: coma sobrante después de a.estadoCena
                $query = $db->prepare("
                    SELECT
                        a.fecha,
                        a.estadoDesayuno,
                        a.estadoComida,
                        a.estadoCena
                    FROM alimentacion a
                    JOIN actobligatoria o ON a.idAct = o.idAct
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "fecha" => $row['fecha'],
                        "estadoDesayuno" => $row['estadoDesayuno'],
                        "estadoComida" => $row['estadoComida'],
                        "estadoCena" => $row['estadoCena']
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

        case 'hidratacion':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                // FIX #7: coma sobrante después de h.fecha
                $query = $db->prepare("
                    SELECT
                        h.litrosDia,
                        h.fecha
                    FROM hidratacion h
                    JOIN actobligatoria o ON h.idAct = o.idAct
                    WHERE h.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "fecha" => $row['fecha'],
                        "litrosDia" => $row['litrosDia']
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

        case 'animo':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                // FIX #7: coma sobrante después de a.estado
                $query = $db->prepare("
                    SELECT
                        a.fecha,
                        a.estado
                    FROM animo a
                    JOIN actobligatoria o ON a.idAct = o.idAct
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "fecha" => $row['fecha'],
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

        case 'ejercicio':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        e.horasDuracion,
                        e.fecha,
                        e.estado,
                        e.peso,
                        e.nivelEsfuerzo,
                        o.nombre
                    FROM ejercicio e
                    JOIN actobligatoria o ON e.idAct = o.idAct
                    WHERE e.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $rows = $query->fetchAll(PDO::FETCH_ASSOC);
                if ($rows) {
                    // FIX #7: fetchAll devuelve un ARREGLO de filas, no una fila.
                    // Antes se hacía $row['fecha'] (índice inexistente).
                    // Ahora se devuelve la lista completa en "registros".
                    $respuesta = [
                        "validacion" => true,
                        "registros" => $rows
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

        case 'actrecreativa':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        a.nombre,
                        a.descripcion,
                        a.horasDiarias,
                        a.fecha,
                        a.estado
                    FROM actrecreativa a
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $rows = $query->fetchAll(PDO::FETCH_ASSOC);
                if ($rows) {
                    // FIX #7: mismo problema que en 'ejercicio' (fetchAll).
                    $respuesta = [
                        "validacion" => true,
                        "registros" => $rows
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

        case 'notificacion':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        n.nombreCategoria,
                        n.nombreZona,
                        n.descripcion
                    FROM notificacion n
                    WHERE n.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "nombreCategoria" => $row['nombreCategoria'],
                        "nombreZona" => $row['nombreZona'],
                        "descripcion" => $row['descripcion']
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

        case 'datos_suenio':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        c.ritmoCirc,
                        c.duracionSuenio,
                        c.latenciaSuenio,
                        c.calidadSuenio,
                        c.regularidadSue,
                        c.fragmentacionSue,
                        c.presionIntracraneal,
                        c.estado
                    FROM Astronauta a
                    JOIN Cabeza c ON a.idAstronauta = c.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "ritmoCirc" => $row['ritmoCirc'],
                        "duracionSuenio" => $row['duracionSuenio'],
                        "latenciaSuenio" => $row['latenciaSuenio'],
                        "calidadSuenio" => $row['calidadSuenio'],
                        "regularidadSue" => $row['regularidadSue'],
                        "fragmentacionSue" => $row['fragmentacionSue'],
                        "presionIntracraneal" => $row['presionIntracraneal'],
                        "estado" => $row['estado'],
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

        case 'datos_corazon':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        t.frecuenciaCard,
                        t.cardiovascular,
                        t.estado
                    FROM Astronauta a
                    JOIN Torax t ON a.idAstronauta = t.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "frecuenciaCard" => $row['frecuenciaCard'],
                        "cardiovascular" => $row['cardiovascular'],
                        "estado" => $row['estado'],
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

        case 'datos_osea':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        e.densidadOsea,
                        e.densimetriaOsea,
                        e.factorRiesgo,
                        e.cargaAplicada,
                        e.resistenciaOsea,
                        e.estado
                    FROM Astronauta a
                    JOIN Esqueleto e ON a.idAstronauta = e.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "densidadOsea" => $row['densidadOsea'],
                        "densimetriaOsea" => $row['densimetriaOsea'],
                        "factorRiesgo" => $row['factorRiesgo'],
                        "cargaAplicada" => $row['cargaAplicada'],
                        "resistenciaOsea" => $row['resistenciaOsea'],
                        "estado" => $row['estado'],
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

        case 'datos_radiacion':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                // FIX #7: faltaba la coma entre c.porcentajeCancer y c.estado
                $query = $db->prepare("
                    SELECT
                        c.porcentajeCancer,
                        c.estado
                    FROM Astronauta a
                    JOIN Cuerpo c ON a.idAstronauta = c.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "porcentajeCancer" => $row['porcentajeCancer'],
                        "estado" => $row['estado'],
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

        case 'datos_musculos':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                // FIX #7: verifica en tu BD si la columna se llama
                // "masaMoscular" (como está) o "masaMuscular" (probable typo).
                // Si es masaMuscular, cámbialo aquí y en el arreglo de abajo.
                $query = $db->prepare("
                    SELECT
                        e.masaMoscular,
                        e.tejidoGrasa,
                        e.cambioMasa,
                        e.fuerzaMuscular,
                        e.estado
                    FROM Astronauta a
                    JOIN Extremidad e ON a.idAstronauta = e.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    $respuesta = [
                        "validacion" => true,
                        "masaMoscular" => $row['masaMoscular'],
                        "tejidoGrasa" => $row['tejidoGrasa'],
                        "cambioMasa" => $row['cambioMasa'],
                        "fuerzaMuscular" => $row['fuerzaMuscular'],
                        "estado" => $row['estado'],
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

        case 'datos_metabolismo':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                // FIX #7: coma sobrante después de b.estado
                $query = $db->prepare("
                    SELECT
                        b.nivelGlucosa,
                        b.gastoEnergetico,
                        b.calorias,
                        b.peso,
                        b.altura,
                        b.estado
                    FROM Astronauta a
                    JOIN Abdomen b ON a.idAstronauta = b.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $row = $query->fetch(PDO::FETCH_ASSOC);
                if ($row) {
                    // FIX #7: "peso" estaba duplicado en el arreglo
                    $respuesta = [
                        "validacion" => true,
                        "nivelGlucosa" => $row['nivelGlucosa'],
                        "gastoEnergetico" => $row['gastoEnergetico'],
                        "calorias" => $row['calorias'],
                        "peso" => $row['peso'],
                        "altura" => $row['altura'],
                        "estado" => $row['estado'],
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

        default:
            http_response_code(400);
            $respuesta = [
                "validacion" => false,
                "error" => "Acción no válida"
            ];
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