<?php
require_once "conexion.php";

header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$action = $_GET['action'] ?? $_POST['action'] ?? $data['action'] ?? null;

$respuesta = ["validacion" => false, "error" => "Acción no válida"];

$con = new Conexion();
$db = $con->conectar();

switch ($action) {
    case 'enviarastronautas':
    $query = $db->prepare("
        SELECT idAstronauta, nombre FROM Astronauta
    ");

    if ($query->execute()) {
        $astronautas = $query->fetchAll(PDO::FETCH_ASSOC);
        
        if ($astronautas) {
            $respuesta = [
                "validacion" => true,
                "astronautas" => $astronautas
            ];
        } else {
            $respuesta = ["validacion" => false, "error" => "No hay astronautas registrados"];
        }
    }
    break;

    case 'ingreso':
        $clave = $data['clave'] ?? null;
        if (!empty($clave)) {
            $query = $db->prepare("
                SELECT a.*, m.*
                FROM Astronauta a
                JOIN Mision m ON a.idMision = m.idMision
                WHERE a.idAstronauta = ?
            ");
            
            if ($query->execute([$clave])) {
                $row = $query->fetch(PDO::FETCH_ASSOC);

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
                    $respuesta = ["validacion" => false, "error" => "Clave o ID de astronauta no encontrado"];
                }
            }
        }
        


        break;
}

echo json_encode($respuesta);
?>