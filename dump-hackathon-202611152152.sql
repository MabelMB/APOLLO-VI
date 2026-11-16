-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: hackathon
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `abdomen`
--

DROP TABLE IF EXISTS `abdomen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `abdomen` (
  `idZona` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `nivelGlucosa` double NOT NULL,
  `gastoEnergetico` double DEFAULT NULL,
  `calorias` double NOT NULL,
  `peso` double NOT NULL,
  `altura` double NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idZona`),
  KEY `fk_astronautaAb` (`idAstronauta`),
  CONSTRAINT `fk_astronautaAb` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=604 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `abdomen`
--

LOCK TABLES `abdomen` WRITE;
/*!40000 ALTER TABLE `abdomen` DISABLE KEYS */;
INSERT INTO `abdomen` VALUES (601,200101,90,2700,2500,62,1.72,'Balanceado'),(602,200102,105,2900,2400,68.5,1.78,'Revisión calórica'),(603,200103,85,2600,2600,60,1.68,'Óptimo');
/*!40000 ALTER TABLE `abdomen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actobligatoria`
--

DROP TABLE IF EXISTS `actobligatoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actobligatoria` (
  `idAct` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`idAct`),
  UNIQUE KEY `uq_astro_tipo` (`idAstronauta`,`nombre`),
  CONSTRAINT `fk_astronautaAO` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actobligatoria`
--

LOCK TABLES `actobligatoria` WRITE;
/*!40000 ALTER TABLE `actobligatoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `actobligatoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actrecreativa`
--

DROP TABLE IF EXISTS `actrecreativa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actrecreativa` (
  `idAct` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `horasDiarias` double DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  PRIMARY KEY (`idAct`),
  KEY `fk_astronautaAR` (`idAstronauta`),
  CONSTRAINT `fk_astronautaAR` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=400004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actrecreativa`
--

LOCK TABLES `actrecreativa` WRITE;
/*!40000 ALTER TABLE `actrecreativa` DISABLE KEYS */;
INSERT INTO `actrecreativa` VALUES (400001,200101,'Lectura y Bitácora','Lectura de novelas de ciencia ficción y registro personal en gravedad reducida.',1.5,'2026-11-14','Completado'),(400002,200101,'Guitarra y Acústica','Práctica de acordes y melodía para relajación mental de la tripulación.',1,'2026-11-14','Pendiente'),(400003,200101,'Ajedrez 3D','Partida de estrategia tridimensional para estimulación cognitiva.',1,'2026-11-14','Completado');
/*!40000 ALTER TABLE `actrecreativa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alimentacion`
--

DROP TABLE IF EXISTS `alimentacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alimentacion` (
  `idAliment` int(11) NOT NULL,
  `idAstronauta` int(11) NOT NULL,
  `descripcion` varchar(150) NOT NULL,
  `fecha` date NOT NULL,
  `estadoDesayuno` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `estadoComida` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `estadoCena` varchar(20) NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`idAliment`),
  KEY `fk_alimentacion_astro` (`idAstronauta`),
  CONSTRAINT `fk_alimentacion_astro` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alimentacion`
--

LOCK TABLES `alimentacion` WRITE;
/*!40000 ALTER TABLE `alimentacion` DISABLE KEYS */;
INSERT INTO `alimentacion` VALUES (700001,200101,'Plan nutricional de alta densidad calórica espacial','2026-11-14','Completado','Pendiente','Pendiente'),(700002,200102,'Ración controlada de carbohidratos y proteínas deshidratadas','2026-11-14','Completado','Completado','Completado'),(700003,200103,'Menú especial balanceado bajo en sodio','2026-11-14','Completado','Pendiente','Pendiente');
/*!40000 ALTER TABLE `alimentacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animo`
--

DROP TABLE IF EXISTS `animo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animo` (
  `idAnimo` int(11) NOT NULL,
  `idAstronauta` int(11) NOT NULL,
  `descripcion` varchar(150) NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `fecha` date NOT NULL,
  PRIMARY KEY (`idAnimo`),
  KEY `fk_animo_astro` (`idAstronauta`),
  CONSTRAINT `fk_animo_astro` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animo`
--

LOCK TABLES `animo` WRITE;
/*!40000 ALTER TABLE `animo` DISABLE KEYS */;
INSERT INTO `animo` VALUES (600001,200101,'Evaluación psicológica matutina y test de enfoque espacial','Completado','2026-11-14'),(600002,200102,'Sesión de relajación y control de estrés por aislamiento','Pendiente','2026-11-14'),(600003,200103,'Bitácora emocional de bienestar y convivencia de tripulación','Completado','2026-11-14');
/*!40000 ALTER TABLE `animo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `astronauta`
--

DROP TABLE IF EXISTS `astronauta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `astronauta` (
  `idAstronauta` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `rol` varchar(50) DEFAULT NULL,
  `nacionalidad` varchar(20) DEFAULT NULL,
  `genero` varchar(20) NOT NULL,
  `idMision` int(11) DEFAULT NULL,
  PRIMARY KEY (`idAstronauta`),
  KEY `fk_mision` (`idMision`),
  CONSTRAINT `fk_mision` FOREIGN KEY (`idMision`) REFERENCES `mision` (`idMision`)
) ENGINE=InnoDB AUTO_INCREMENT=200104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `astronauta`
--

LOCK TABLES `astronauta` WRITE;
/*!40000 ALTER TABLE `astronauta` DISABLE KEYS */;
INSERT INTO `astronauta` VALUES (200101,'Elena Vance','1990-05-14','Comandante','Mexicana','Femenino',300001),(200102,'Marcus Brody','1985-11-22','Ingeniero de Vuelo','Canadiense','Masculino',300001),(200103,'Aisha Morales','1992-09-03','Especialista en Ciencia','Española','Femenino',300002);
/*!40000 ALTER TABLE `astronauta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabeza`
--

DROP TABLE IF EXISTS `cabeza`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabeza` (
  `idZona` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `ritmoCirc` double DEFAULT NULL,
  `duracionSuenio` double DEFAULT NULL,
  `latenciaSuenio` double DEFAULT NULL,
  `calidadSuenio` int(11) DEFAULT NULL,
  `regularidadSue` double DEFAULT NULL,
  `fragmentacionSue` double DEFAULT NULL,
  `presionIntracraneal` double DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idZona`),
  KEY `fk_astronautaCa` (`idAstronauta`),
  CONSTRAINT `fk_astronautaCa` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabeza`
--

LOCK TABLES `cabeza` WRITE;
/*!40000 ALTER TABLE `cabeza` DISABLE KEYS */;
INSERT INTO `cabeza` VALUES (101,200101,7.6,7,15,4,76,21,8.9,'Estable'),(102,200102,6.8,6,25,5,65,34,9.4,'Precaución'),(103,200103,8.1,8,10,3,90,12,8.2,'Óptimo');
/*!40000 ALTER TABLE `cabeza` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuerpo`
--

DROP TABLE IF EXISTS `cuerpo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuerpo` (
  `idZona` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `porcentajeCancer` double NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idZona`),
  KEY `fk_astronautaCu` (`idAstronauta`),
  CONSTRAINT `fk_astronautaCu` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=100004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuerpo`
--

LOCK TABLES `cuerpo` WRITE;
/*!40000 ALTER TABLE `cuerpo` DISABLE KEYS */;
INSERT INTO `cuerpo` VALUES (401,200101,0.005,'No amenazante'),(402,200102,0.012,'Monitoreo activo'),(403,200103,0.003,'No amenazante'),(100001,200101,0.01,'Normal'),(100002,200102,0.02,'Normal'),(100003,200103,0.01,'Normal');
/*!40000 ALTER TABLE `cuerpo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicio`
--

DROP TABLE IF EXISTS `ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicio` (
  `idEjercicio` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `descripcion` varchar(150) NOT NULL,
  `horasDuracion` double DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `peso` double DEFAULT NULL,
  `nivelEsfuerzo` int(11) DEFAULT NULL,
  PRIMARY KEY (`idEjercicio`),
  KEY `fk_ejercicio_astro` (`idAstronauta`),
  CONSTRAINT `fk_ejercicio_astro` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=700003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicio`
--

LOCK TABLES `ejercicio` WRITE;
/*!40000 ALTER TABLE `ejercicio` DISABLE KEYS */;
INSERT INTO `ejercicio` VALUES (500001,200101,'Rutina de resistencia en banda sin fin con gravedad simulada',NULL,'2026-11-14','Completado',NULL,NULL),(500002,200102,'Ejercicios de fuerza con bandas elásticas para prevenir atrofia',NULL,'2026-11-14','Pendiente',NULL,NULL),(500003,200103,'Cardio moderado en bicicleta estática de alta eficiencia',NULL,'2026-11-14','Completado',NULL,NULL),(700001,200101,'30 min de cinta en gravedad artificial y estiramientos',1.2,'2026-11-14','Completado',72.5,4),(700002,200101,'Rutina de fuerza con bandas de resistencia',1,'2026-11-14','Pendiente',72.5,5);
/*!40000 ALTER TABLE `ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `esqueleto`
--

DROP TABLE IF EXISTS `esqueleto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `esqueleto` (
  `idZona` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `densidadOsea` double NOT NULL,
  `densimetriaOsea` double NOT NULL,
  `factorRiesgo` double DEFAULT NULL,
  `cargaAplicada` double DEFAULT NULL,
  `resistenciaOsea` double DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idZona`),
  KEY `fk_astronautaEs` (`idAstronauta`),
  CONSTRAINT `fk_astronautaEs` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `esqueleto`
--

LOCK TABLES `esqueleto` WRITE;
/*!40000 ALTER TABLE `esqueleto` DISABLE KEYS */;
INSERT INTO `esqueleto` VALUES (301,200101,1.4,0.3,45,80,1,'Estable'),(302,200102,1.2,-0.5,70,60,1,'En observación'),(303,200103,1.5,0.6,20,90,1,'Óptimo');
/*!40000 ALTER TABLE `esqueleto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extremidad`
--

DROP TABLE IF EXISTS `extremidad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extremidad` (
  `idZona` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `masaMuscular` double NOT NULL,
  `tejidoGrasa` double DEFAULT NULL,
  `cambioMasa` double DEFAULT NULL,
  `fuerzaMuscular` double DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idZona`),
  KEY `fk_extremidadAst` (`idAstronauta`),
  CONSTRAINT `fk_extremidadAst` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=504 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extremidad`
--

LOCK TABLES `extremidad` WRITE;
/*!40000 ALTER TABLE `extremidad` DISABLE KEYS */;
INSERT INTO `extremidad` VALUES (501,200101,30,0.15,-1.4,300,'Estable'),(502,200102,27.5,0.18,-2.1,250,'Fatiga leve'),(503,200103,33,0.13,-0.5,350,'Fuerte');
/*!40000 ALTER TABLE `extremidad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hidratacion`
--

DROP TABLE IF EXISTS `hidratacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hidratacion` (
  `idHidratacion` int(11) NOT NULL,
  `idAstronauta` int(11) NOT NULL,
  `descripcion` varchar(150) NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'Pendiente',
  `litrosDia` double NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`idHidratacion`),
  KEY `fk_hidratacion_astro` (`idAstronauta`),
  CONSTRAINT `fk_hidratacion_astro` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hidratacion`
--

LOCK TABLES `hidratacion` WRITE;
/*!40000 ALTER TABLE `hidratacion` DISABLE KEYS */;
INSERT INTO `hidratacion` VALUES (900001,200101,'Completar 2.8 litros de agua purificada reciclada en el día','Completado',2.8,'2026-11-14'),(900002,200101,'Registro de consumo post-entrenamiento de líquidos','Pendiente',1,'2026-11-14'),(900007,200103,'Monitoreo de ingesta hídrica estándar de la misión','Completado',3,'2026-11-14'),(900008,200101,'Completar 2.8 litros de agua purificada reciclada en el día','Completado',2.8,'2026-11-14'),(900009,200102,'Consumo de electrolitos post-entrenamiento de fuerza','Pendiente',2.5,'2026-11-14');
/*!40000 ALTER TABLE `hidratacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mision`
--

DROP TABLE IF EXISTS `mision`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mision` (
  `idMision` int(11) NOT NULL AUTO_INCREMENT,
  `nombreMision` varchar(50) NOT NULL,
  `distanciaTierra` double NOT NULL,
  `fechaInicio` date NOT NULL,
  `tiempo` int(11) DEFAULT NULL,
  `destino` varchar(50) NOT NULL,
  `gravedad` double NOT NULL,
  `estadoSol` int(11) NOT NULL,
  `supernova` double DEFAULT NULL,
  `vanlleRadiation` int(11) DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  PRIMARY KEY (`idMision`)
) ENGINE=InnoDB AUTO_INCREMENT=300003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mision`
--

LOCK TABLES `mision` WRITE;
/*!40000 ALTER TABLE `mision` DISABLE KEYS */;
INSERT INTO `mision` VALUES (300001,'Artemis Exploracion Lunar',384400,'2026-03-01',4320,'Luna',1.62,1,0,12,'Activa'),(300002,'Ares I: Martian Pioneer',54600000,'2026-06-15',6700,'Marte',3.72,1,0,45,'Planificacion');
/*!40000 ALTER TABLE `mision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacion`
--

DROP TABLE IF EXISTS `notificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacion` (
  `idNotificacion` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `nombreCategoria` varchar(50) DEFAULT NULL,
  `nombreZona` varchar(50) DEFAULT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`idNotificacion`),
  KEY `fk_astronautaNot` (`idAstronauta`),
  CONSTRAINT `fk_astronautaNot` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=800010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacion`
--

LOCK TABLES `notificacion` WRITE;
/*!40000 ALTER TABLE `notificacion` DISABLE KEYS */;
INSERT INTO `notificacion` VALUES (800003,200103,'Salud Mental',NULL,'Completar test de aislamiento y convivencia en tripulación.'),(800004,200101,'Salud Mental',NULL,'Completar evaluación psicológica de aislamiento prolongado.'),(800005,200101,NULL,'Módulo de Soporte Vital','Verificaciòn de filtros de aire en el sector primario.'),(800006,200102,'Hidratación',NULL,'Alerta de consumo hídrico por debajo del promedio diario sugerido.'),(800007,200102,NULL,'Cámara de Presión','Mantenimiento preventivo de válvulas de sellado hermético.'),(800008,200103,'Actividad Física',NULL,'Ejecutar rutina obligatoria en la bicicleta estática para evitar atrofia.'),(800009,200103,NULL,'Laboratorio de Hidroponía','Revisión de niveles de nutrientes en los cultivos espaciales.');
/*!40000 ALTER TABLE `notificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `torax`
--

DROP TABLE IF EXISTS `torax`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `torax` (
  `idZona` int(11) NOT NULL AUTO_INCREMENT,
  `idAstronauta` int(11) NOT NULL,
  `frecuenciaCard` double NOT NULL,
  `cardiovascular` double NOT NULL,
  `estado` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`idZona`),
  KEY `fk_astronautaT` (`idAstronauta`),
  CONSTRAINT `fk_astronautaT` FOREIGN KEY (`idAstronauta`) REFERENCES `astronauta` (`idAstronauta`)
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `torax`
--

LOCK TABLES `torax` WRITE;
/*!40000 ALTER TABLE `torax` DISABLE KEYS */;
INSERT INTO `torax` VALUES (201,200101,90,5,'Normal'),(202,200102,110,6.2,'Elevado'),(203,200103,75,4.8,'Óptimo');
/*!40000 ALTER TABLE `torax` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hackathon'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-15 21:52:13
