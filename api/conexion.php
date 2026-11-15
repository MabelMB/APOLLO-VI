
<?php

class Conexion {

    private $host;
    private $db;
    private $usuario;
    private $pass;
    private $charset;
    private $puerto;

    public function __construct() {
        $this->host = '127.0.0.1';
        $this->db = 'hackathon';
        $this->usuario = 'root';
        $this->pass = '';
        $this->charset = 'utf8mb4';
        $this->puerto = '3307';
    }

    public function conectar() {

        $com = "mysql:host=" . $this->host .
               ";port=" . $this->puerto .
               ";dbname=" . $this->db .
               ";charset=" . $this->charset;

        $enlace = new PDO(
            $com,
            $this->usuario,
            $this->pass,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );

        return $enlace;
    }
}

?>
