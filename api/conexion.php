
<?php

class Conexion {

    private $host;
    private $db;
    private $usuario;
    private $pass;
    private $charset;
    private $puerto;

    public function __construct() {
        $rutaEnv = dirname(__DIR__) . '/.env';
        $configEnv = [];

        if (is_file($rutaEnv)) {
            $configEnv = parse_ini_file($rutaEnv, false, INI_SCANNER_RAW);
            if ($configEnv === false) {
                throw new RuntimeException('No se pudo leer el archivo .env');
            }
        }

        $configurar = static function ($clave, $valorPredeterminado) use ($configEnv) {
            $valor = getenv($clave);
            if ($valor === false || $valor === '') {
                $valor = $configEnv[$clave] ?? '';
            }

            return $valor !== '' ? trim($valor) : $valorPredeterminado;
        };

        $this->host = $configurar('DB_HOST', '127.0.0.1');
        $this->db = $configurar('DB_NAME', 'hackathon');
        $this->usuario = $configurar('DB_USER', 'root');
        $this->pass = $configurar('DB_PASSWORD', '');
        $this->charset = 'utf8mb4';
        $this->puerto = $configurar('DB_PORT', '3307');
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
