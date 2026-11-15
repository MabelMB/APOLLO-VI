<?php
require_once 'conexion.php';

$conexionObj = new Conexion();
$db = $conexionObj->conectar();

echo "¡Conexión exitosa al servidor!<br><br>";

try {
    $consulta = $db->query("SELECT * FROM test");
    $resultados = $consulta->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Datos encontrados en la tabla test:<br>";
    echo "<pre>";
    print_r($resultados);
    echo "</pre>";
} catch (PDOException $e) {
    echo "Conectó a la base de datos, pero hubo un error al leer la tabla 'test': " . $e->getMessage();
}
?>