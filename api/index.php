<?php
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
                        a.idAliment,
                        a.fecha,
                        a.estadoDesayuno,
                        a.estadoComida,
                        a.estadoCena
                    FROM alimentacion a
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $registros = $query->fetchAll(PDO::FETCH_ASSOC);
                $respuesta = [
                    "validacion" => true,
                    "registros" => $registros
                ];
            } else {
                $respuesta = [
                    "validacion" => false,
                    "error" => "El ID de astronauta está vacío"
                ];
            }
            break;

        case 'devolver_actRecreativa':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        a.idAstronauta,
                        r.idAct,
                        r.nombre,
                        r.descripcion,
                        r.horasDiarias,
                        r.fecha,
                        r.estado
                        
                    FROM Astronauta a
                    JOIN ActRecreativa r ON a.idAstronauta = r.idAstronauta
                    WHERE a.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $registros = $query->fetchAll(PDO::FETCH_ASSOC);
                $respuesta = [
                    "validacion" => true,
                    "registros" => $registros
                ];
            } else {
                $respuesta = [
                    "validacion" => false,
                    "error" => "El ID de astronauta está vacío"
                ];
            }
            break;

        case 'devolver_hidratacion':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        h.idHidratacion,
                        h.litrosDia,
                        h.fecha,
                        h.descripcion,
                        h.estado
                    FROM hidratacion h
                    WHERE h.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $registros = $query->fetchAll(PDO::FETCH_ASSOC);
                $respuesta = [
                    "validacion" => true,
                    "registros" => $registros
                ];
            } else {
                $respuesta = [
                    "validacion" => false,
                    "error" => "El ID de astronauta está vacío"
                ];
            }
            break;

        case 'devolver_animo':
        $clave = $data['idAstronauta'] ?? null;
        if (!empty($clave)) {
            $query = $db->prepare("
                SELECT
                    idAnimo,
                    idAstronauta,
                    descripcion,
                    estado,
                    fecha
                FROM animo
                WHERE idAstronauta = ?
            ");
            $query->execute([$clave]);
            $rows = $query->fetchAll(PDO::FETCH_ASSOC);

            if ($rows) {
                $respuesta = [
                    "validacion" => true,
                    "registros" => $rows
                ];
            } else {
                $respuesta = [
                    "validacion" => false,
                    "error" => "No se encontraron registros de ánimo"
                ];
            }
        } else {
            $respuesta = [
                "validacion" => false,
                "error" => "El ID de astronauta está vacío"
            ];
        }
        break;

        case 'devolverActividadFísica':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        e.idEjercicio,
                        e.horasDuracion,
                        e.fecha,
                        e.estado,
                        e.peso,
                        e.nivelEsfuerzo,
                        e.descripcion
                    FROM ejercicio e
                    WHERE e.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $registros = $query->fetchAll(PDO::FETCH_ASSOC);
                $respuesta = [
                    "validacion" => true,
                    "registros" => $registros
                ];
            } else {
                $respuesta = [
                    "validacion" => false,
                    "error" => "El ID de astronauta está vacío"
                ];
            }
            break;

        case 'devolver_notificacion':
            $clave = $data['idAstronauta'] ?? null;
            if (!empty($clave)) {
                $query = $db->prepare("
                    SELECT
                        n.idNotificacion,
                        n.nombreCategoria,
                        n.nombreZona,
                        n.descripcion
                    FROM notificacion n
                    WHERE n.idAstronauta = ?
                ");
                $query->execute([$clave]);
                $registros = $query->fetchAll(PDO::FETCH_ASSOC);
                $respuesta = [
                    "validacion" => true,
                    "registros" => $registros
                ];
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
                $query = $db->prepare("
                    SELECT
                        e.masaMuscular,
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
                        "masaMuscular" => $row['masaMuscular'],
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

        case 'eliminar_notificacion':
            $idNotificacion = $data['idNotificacion'] ?? null;
            if (!empty($idNotificacion)) {
                $query = $db->prepare("DELETE FROM notificacion WHERE idNotificacion = ?");
                $resultado = $query->execute([$idNotificacion]);

                if ($resultado) {
                    $respuesta = [
                        "validacion" => true,
                        "mensaje" => "Notificación eliminada correctamente"
                    ];
                } else {
                    $respuesta = [
                        "validacion" => false,
                        "error" => "No se pudo eliminar el registro de la base de datos"
                    ];
                }
            } else {
                $respuesta = [
                    "validacion" => false,
                    "error" => "El ID de la notificación está vacío"
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