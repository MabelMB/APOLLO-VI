
<?php

require_once __DIR__ . '/../config.php';

$host = $_ENV['DB_HOST'];
$puerto = $_ENV['DB_PORT'];
$basedatos = $_ENV['DB_NAME'];
$usuario = $_ENV['DB_USER'];
$password = $_ENV['DB_PASSWORD'];

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$puerto;dbname=$basedatos;charset=utf8mb4",
        $usuario,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_SSL_CA => ini_get('openssl.cafile'),
            PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true
        ]
    );

} catch (PDOException $e) {
    error_log($e->getMessage());
    die("No se pudo establecer la conexión.");
}
