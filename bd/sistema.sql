-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-07-2026 a las 04:07:09
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `analisis_medicos`
--

CREATE TABLE `analisis_medicos` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `fecha_examen` date DEFAULT NULL,
  `tipo_examen` varchar(100) DEFAULT 'Sangre',
  `resultados_glucosa` decimal(6,2) DEFAULT NULL,
  `resultados_colesterol` decimal(6,2) DEFAULT NULL,
  `resultados_trigliceridos` decimal(6,2) DEFAULT NULL,
  `diagnostico_paciente` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `diagnostico_medico` text DEFAULT NULL,
  `medico_id` int(11) DEFAULT NULL,
  `fecha_diagnostico` datetime DEFAULT NULL,
  `resultados_leucocitos` decimal(6,2) DEFAULT NULL COMMENT 'Leucocitos urinarios (cél/μL)',
  `resultados_eritrocitos` decimal(6,2) DEFAULT NULL COMMENT 'Eritrocitos urinarios (cél/μL)',
  `resultados_pH` decimal(4,2) DEFAULT NULL COMMENT 'pH de orina (4.5-8.5 normal)',
  `presion_sistolica` int(11) DEFAULT NULL COMMENT 'Presión sistólica mmHg',
  `presion_diastolica` int(11) DEFAULT NULL COMMENT 'Presión diastólica mmHg',
  `frecuencia_cardiaca` int(11) DEFAULT NULL COMMENT 'Frecuencia cardíaca BPM',
  `hemoglobina` decimal(5,2) DEFAULT NULL COMMENT 'Hemoglobina g/dL',
  `hematocrito` decimal(5,2) DEFAULT NULL COMMENT 'Hematocrito %',
  `plaquetas` decimal(8,2) DEFAULT NULL COMMENT 'Plaquetas (miles/μL)',
  `leucocitos_sangre` decimal(6,2) DEFAULT NULL COMMENT 'Leucocitos en sangre (miles/μL)',
  `creatinina` decimal(5,2) DEFAULT NULL COMMENT 'Creatinina mg/dL',
  `urea` decimal(6,2) DEFAULT NULL COMMENT 'Urea mg/dL',
  `alt` decimal(6,2) DEFAULT NULL COMMENT 'ALT (TGP) UI/L',
  `ast` decimal(6,2) DEFAULT NULL COMMENT 'AST (TGO) UI/L'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `analisis_medicos`
--

INSERT INTO `analisis_medicos` (`id`, `cliente_id`, `fecha_examen`, `tipo_examen`, `resultados_glucosa`, `resultados_colesterol`, `resultados_trigliceridos`, `diagnostico_paciente`, `created_at`, `diagnostico_medico`, `medico_id`, `fecha_diagnostico`, `resultados_leucocitos`, `resultados_eritrocitos`, `resultados_pH`, `presion_sistolica`, `presion_diastolica`, `frecuencia_cardiaca`, `hemoglobina`, `hematocrito`, `plaquetas`, `leucocitos_sangre`, `creatinina`, `urea`, `alt`, `ast`) VALUES
(1, 2, '2026-04-09', 'Sangre de rutina', 95.00, 180.50, 140.00, 'Me sentí un poco mareado antes del examen', '2026-04-09 01:34:25', 'Diagnóstico de prueba: Paciente con niveles normales. Se recomienda ejercicio moderado y dieta balanceada. Seguimiento en 3 meses.', 9, '2026-04-08 23:57:13', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 3, '2026-04-09', 'Sangre de rutina', 95.00, 180.50, 140.00, 'Me sentí un poco mareado antes del examen', '2026-04-09 01:35:05', 'fasfa', 7, '2026-04-08 23:52:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 4, '2026-04-09', 'Sangre de rutina', 95.00, 180.50, 140.00, 'Me sentí un poco mareado antes del examen', '2026-04-09 01:36:15', 'fafgasg', 7, '2026-04-09 01:36:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 5, '2026-04-09', 'Sangre de Rutina', 9999.99, 9999.99, 42.00, '414124', '2026-04-09 02:02:42', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(5, 16, '2000-01-10', 'Sangre Completa', 100.00, 100.00, 100.00, NULL, '2026-04-09 04:26:22', 'fafsafasfs', 7, '2026-04-09 00:31:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 16, '2026-04-09', 'Sangre Completa', 95.50, 180.00, 120.00, 'Prueba directa desde JavaScript', '2026-04-09 04:29:54', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 16, '2026-04-09', 'Sangre Completa', 100.00, 100.00, NULL, NULL, '2026-04-09 04:30:16', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 16, '2026-04-09', 'Sangre Completa', 9999.99, NULL, NULL, NULL, '2026-04-09 04:30:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 16, '2026-04-09', 'Sangre Completa', 9999.99, NULL, NULL, NULL, '2026-04-09 04:31:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 16, '3000-10-20', 'Sangre Completa', 9999.99, 9999.99, 9999.99, 'MAÑANA LLUEVE', '2026-04-09 04:32:01', 'Paciente con niveles elevados de glucosa y colesterol. Se recomienda dieta baja en carbohidratos y ejercicio regular.', 19, '2026-04-09 01:18:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 16, '3000-10-20', 'Sangre Completa', 9999.99, 9999.99, 9999.99, 'MAÑANA LLUEVE', '2026-04-09 04:34:16', 'aaa', 7, '2026-04-09 01:36:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 17, '2026-04-09', 'Sangre', NULL, NULL, NULL, NULL, '2026-04-09 05:00:58', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 17, '2026-04-09', 'Sangre', NULL, NULL, NULL, NULL, '2026-04-09 05:01:15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 17, '2026-04-09', 'Sangre Completa', 110.00, 220.00, 160.00, 'Me siento cansado y con mareos ocasionales.', '2026-04-09 05:17:44', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(15, 11, '1000-10-10', 'Sangre Completa', 100.00, 100.00, 100.00, '1000', '2026-04-09 05:44:01', '100000000000000', 7, '2026-04-09 01:47:22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 24, '2026-03-10', 'Sangre Completa', 112.50, 195.00, 140.00, 'Me siento cansada y con visión borrosa después de comer.', '2026-04-09 10:24:46', 'Glucosa en rango límite pre-diabético. Se recomienda dieta baja en carbohidratos, ejercicio aeróbico 30 min/día y control mensual.', 23, '2026-04-09 10:24:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, 25, '2026-03-25', 'Perfil Lipídico', 95.00, 242.00, 165.00, 'Dolor leve en el pecho al hacer esfuerzo.', '2026-04-09 10:24:46', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 24, '2026-03-10', 'Sangre Completa', 112.50, 195.00, 140.00, 'Me siento cansada y con visión borrosa después de comer.', '2026-06-29 01:58:24', 'Glucosa en rango límite pre-diabético. Se recomienda dieta baja en carbohidratos, ejercicio aeróbico 30 min/día y control mensual.', 23, '2026-06-29 01:58:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, 25, '2026-03-25', 'Perfil Lipídico', 95.00, 242.00, 165.00, 'Dolor leve en el pecho al hacer esfuerzo.', '2026-06-29 01:58:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 26, '2026-04-01', 'Hormonal + Lípidos', 88.00, 178.00, 130.00, 'Siento fatiga constante y aumento de peso sin cambio de dieta.', '2026-06-29 01:58:24', 'Valores dentro de rangos normales. Se solicita perfil tiroideo para descartar hipotiroidismo. Cita de seguimiento en 30 días.', 23, '2026-06-29 01:58:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 24, '2026-04-05', 'Sangre Completa', 118.00, 201.00, 145.00, 'Control mensual. Sigo con la dieta indicada.', '2026-06-29 01:58:24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, 41, '2007-04-20', 'Sangre Completa', 757.00, 9999.99, 9999.99, 'GSDGDSG', '2026-07-01 03:20:12', 'UGJGVUKHGVJKC', 42, '2026-06-30 23:24:23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `genero` enum('M','F','Otro') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `usuario_id`, `nombre`, `apellido`, `cedula`, `telefono`, `direccion`, `fecha_nacimiento`, `genero`, `created_at`, `updated_at`) VALUES
(1, 1, 'Usuario', 'Prueba', '', '', '', NULL, NULL, '2026-04-09 01:33:23', '2026-04-09 01:33:23'),
(3, 3, 'Usuario', 'Prueba', '1775698505403', '', '', NULL, NULL, '2026-04-09 01:35:05', '2026-04-09 01:35:05'),
(4, 4, 'Usuario', 'Prueba', '1775698573834', '', '', NULL, NULL, '2026-04-09 01:36:15', '2026-04-09 01:36:15'),
(5, 5, 'juan123', '', '12345', '', '', NULL, NULL, '2026-04-09 01:56:47', '2026-04-09 01:56:47'),
(6, 6, 'foro_user', '', '44', '', '', NULL, NULL, '2026-04-09 02:20:24', '2026-04-09 02:20:24'),
(7, 8, 'Paciente Test', '', '12345678', '', '', NULL, NULL, '2026-04-09 03:42:58', '2026-04-09 03:42:58'),
(8, 11, 'jean', '', 'jean', '', '', NULL, NULL, '2026-04-09 03:53:59', '2026-04-09 03:53:59'),
(9, 16, 'roberto', '', '12934141', '', '', NULL, NULL, '2026-04-09 04:11:06', '2026-04-09 04:11:06'),
(13, 25, 'Juan', 'Rodríguez', '23456789', '04142222222', 'Calle 5 Casa 3', '1985-11-20', 'M', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(14, 26, 'Luisa', 'Martínez', '34567890', '04263333333', 'Urb. Las Mercedes', '2000-03-08', 'F', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(19, 34, 'Klaudia', '', '567893154', '', '', NULL, NULL, '2026-07-01 02:55:52', '2026-07-01 02:55:52'),
(22, 37, 'test_1782875093415', '', '99999999', '', '', NULL, NULL, '2026-07-01 03:04:53', '2026-07-01 03:04:53'),
(23, 39, 'Klaudia1', '', '5678931541', '', '', NULL, NULL, '2026-07-01 03:11:11', '2026-07-01 03:11:11'),
(24, 40, 'user1782875674947', '', '6038657349', '', '', NULL, NULL, '2026-07-01 03:14:35', '2026-07-01 03:14:35'),
(25, 41, 'Jeann', '', '3208148091', '', '', NULL, NULL, '2026-07-01 03:18:06', '2026-07-01 03:18:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `foros`
--

CREATE TABLE `foros` (
  `id` int(11) NOT NULL,
  `autor_id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `contenido` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `foros`
--

INSERT INTO `foros` (`id`, `autor_id`, `titulo`, `contenido`, `created_at`, `updated_at`) VALUES
(1, 5, 'fgetge', 'gagsags', '2026-04-09 02:02:18', '2026-04-09 02:02:18'),
(2, 5, 'gsagsags', 'fgagagsag', '2026-04-09 02:02:26', '2026-04-09 02:02:26'),
(3, 6, 'Mi Saludo', 'Hola Comunidad!', '2026-04-09 02:26:49', '2026-04-09 02:26:49'),
(4, 6, 'dXFSFA', 'FSASFASF', '2026-04-09 02:53:34', '2026-04-09 02:53:34'),
(5, 6, 'A', 'QAS qsas', '2026-04-09 02:53:41', '2026-04-09 02:53:41'),
(6, 7, 'fsaf', 'safsa', '2026-04-09 03:41:26', '2026-04-09 03:41:26'),
(8, 7, 'fags', 'fa', '2026-04-09 04:59:34', '2026-04-09 04:59:34'),
(9, 7, 'aaaaaa', 'aaaaaaaa', '2026-04-09 05:14:12', '2026-04-09 05:14:12'),
(10, 22, '¡Bienvenidos a HealthHub!', 'Esta plataforma conecta médicos y pacientes. Comparte tus dudas, síntomas y consejos de salud con toda la comunidad.', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(11, 24, '¿Cómo controlar los niveles de glucosa?', 'Desde que me diagnosticaron pre-diabetes busco formas naturales de mantener la glucosa estable. ¿Algún consejo de la comunidad?', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(12, 22, 'Tip del día: Hidratación', 'Beber 2 litros de agua al día mejora la concentración, la digestión y el estado de ánimo. ¡Pequeños hábitos, grandes cambios!', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(13, 22, '¡Bienvenidos a HealthHub!', 'Esta plataforma conecta médicos y pacientes. Comparte tus dudas, síntomas y consejos de salud con toda la comunidad.', '2026-06-29 01:58:24', '2026-06-29 01:58:24'),
(14, 24, '¿Cómo controlar los niveles de glucosa?', 'Desde que me diagnosticaron pre-diabetes busco formas naturales de mantener la glucosa estable. ¿Algún consejo de la comunidad?', '2026-06-29 01:58:24', '2026-06-29 01:58:24'),
(15, 22, 'Tip del día: Hidratación', 'Beber 2 litros de agua al día mejora la concentración, la digestión y el estado de ánimo. ¡Pequeños hábitos, grandes cambios!', '2026-06-29 01:58:24', '2026-06-29 01:58:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `foro_comentarios`
--

CREATE TABLE `foro_comentarios` (
  `id` int(11) NOT NULL,
  `foro_id` int(11) NOT NULL,
  `autor_id` int(11) NOT NULL,
  `comentario` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `foro_comentarios`
--

INSERT INTO `foro_comentarios` (`id`, `foro_id`, `autor_id`, `comentario`, `created_at`) VALUES
(1, 1, 6, 'gdsgd', '2026-04-09 02:51:21'),
(2, 1, 6, 'hola', '2026-04-09 02:51:26'),
(3, 1, 6, 'g', '2026-04-09 02:51:36'),
(4, 5, 7, 'fsafas', '2026-04-09 03:35:27'),
(5, 5, 7, 'fsafa', '2026-04-09 03:35:31'),
(6, 6, 7, 'fasfa', '2026-04-09 03:41:32'),
(7, 6, 7, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2026-04-09 03:41:59'),
(8, 6, 7, 'fafsa', '2026-04-09 05:14:03'),
(9, 9, 7, 'aa', '2026-04-09 05:14:15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `foro_medicamentos`
--

CREATE TABLE `foro_medicamentos` (
  `foro_id` int(11) NOT NULL,
  `medicamento_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos`
--

CREATE TABLE `medicamentos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `presentacion` varchar(100) DEFAULT NULL,
  `dosis` varchar(200) DEFAULT NULL,
  `laboratorio` varchar(200) DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `efectos_secundarios` text DEFAULT NULL,
  `contraindicaciones` text DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos`
--

INSERT INTO `medicamentos` (`id`, `nombre`, `descripcion`, `presentacion`, `dosis`, `laboratorio`, `categoria`, `efectos_secundarios`, `contraindicaciones`, `icono`, `color`, `created_at`) VALUES
(1, 'Ibuprofeno', 'Antiinflamatorio no esteroideo (AINE) utilizado para aliviar el dolor, reducir la fiebre y disminuir la inflamación. Actúa inhibiendo las enzimas COX-1 y COX-2.', 'Tabletas 400 mg y 600 mg', 'Adultos: 400-800 mg cada 6-8 horas. Máximo 3200 mg/día. Tomar con alimentos.', 'Bayer / Pfizer', 'Analgésico/AINE', 'Molestias gastrointestinales, náuseas, úlceras pépticas con uso prolongado, retención de líquidos, riesgo cardiovascular.', 'Úlcera péptica activa, insuficiencia renal grave, último trimestre del embarazo, hipersensibilidad a AINEs.', NULL, NULL, '2026-06-29 01:58:24'),
(2, 'Paracetamol', 'Analgésico y antipirético de uso común. Actúa a nivel central inhibiendo la síntesis de prostaglandinas. No tiene efecto antiinflamatorio significativo.', 'Tabletas 500 mg y 1000 mg; Jarabe 120 mg/5 mL; Supositorios', 'Adultos: 500-1000 mg cada 4-6 horas. Máximo 4 g/día. Niños: 10-15 mg/kg/dosis.', 'Bristol-Myers / Tylenol', 'Analgésico/Antipirético', 'Generalmente bien tolerado. En sobredosis: hepatotoxicidad grave. Raramente: reacciones alérgicas cutáneas.', 'Hepatopatía grave, alcoholismo crónico, hipersensibilidad al paracetamol.', NULL, NULL, '2026-06-29 01:58:24'),
(3, 'Amoxicilina', 'Antibiótico betalactámico de amplio espectro. Inhibe la síntesis de la pared celular bacteriana. Eficaz en infecciones respiratorias, urinarias y de piel.', 'Cápsulas 500 mg; Suspensión oral 250 mg/5 mL', 'Adultos: 500 mg cada 8 horas o 875 mg cada 12 horas. Curso de 7-10 días según infección.', 'GlaxoSmithKline / Amoxil', 'Antibiótico', 'Diarrea, náuseas, erupción cutánea, superinfección por cándida, colitis pseudomembranosa (rara).', 'Alergia a penicilinas o cefalosporinas, mononucleosis infecciosa.', NULL, NULL, '2026-06-29 01:58:24'),
(4, 'Metformina', 'Biguanida hipoglucemiante de primera línea para diabetes tipo 2. Reduce la glucosa hepática y mejora la sensibilidad a la insulina sin causar hipoglucemia.', 'Tabletas 500 mg, 850 mg, 1000 mg (liberación inmediata y prolongada)', 'Inicial: 500 mg con desayuno y cena. Máximo 2550-3000 mg/día.', 'Merck / Glucophage', 'Antidiabético', 'Náuseas, diarrea, vómitos, sabor metálico. Rara: acidosis láctica (en insuficiencia renal).', 'Insuficiencia renal (TFG < 30 mL/min), insuficiencia hepática, alcoholismo, insuficiencia cardíaca descompensada.', NULL, NULL, '2026-06-29 01:58:24'),
(5, 'Enalapril', 'Inhibidor de la enzima convertidora de angiotensina (IECA). Reduce la presión arterial y protege la función renal en diabéticos e hipertensos.', 'Tabletas 5 mg, 10 mg, 20 mg', 'Inicial: 5 mg/día. Mantenimiento: 10-40 mg/día en 1 o 2 dosis.', 'Merck / Vasotec', 'Antihipertensivo/IECA', 'Tos seca persistente (muy común), hipotensión de primera dosis, hiperpotasemia, angioedema (raro pero grave).', 'Embarazo (teratógeno), antecedente de angioedema por IECA, estenosis arterial renal bilateral.', NULL, NULL, '2026-06-29 01:58:24'),
(6, 'Atorvastatina', 'Estatina inhibidora de la HMG-CoA reductasa. Reduce el colesterol LDL y triglicéridos; eleva el HDL. Previene eventos cardiovasculares.', 'Tabletas 10 mg, 20 mg, 40 mg, 80 mg', 'Inicial: 10-20 mg una vez al día (noche). Rango: 10-80 mg/día.', 'Pfizer / Lipitor', 'Hipolipemiante', 'Mialgia, miopatía, elevación de transaminasas, raramente rabdomiólisis. Cefalea, trastornos gastrointestinales.', 'Hepatopatía activa, embarazo y lactancia, hipersensibilidad. Precaución con interacciones medicamentosas.', NULL, NULL, '2026-06-29 01:58:24'),
(7, 'Losartán', 'Antagonista del receptor de angiotensina II (ARA-II). Antihipertensivo que no causa tos. Protección cardiovascular y renal.', 'Tabletas 25 mg, 50 mg, 100 mg', 'Inicial: 50 mg una vez al día. Rango: 25-100 mg/día.', 'Merck / Cozaar', 'Antihipertensivo/ARA-II', 'Hiperpotasemia, hipotensión, mareo, deterioro de función renal. Menos tos que IECAs.', 'Embarazo (teratógeno), hiperpotasemia severa.', NULL, NULL, '2026-06-29 01:58:24'),
(8, 'Omeprazol', 'Inhibidor de la bomba de protones (IBP). Bloquea la secreción ácida gástrica. Tratamiento de úlceras, ERGE y gastroprotección en usuarios de AINEs.', 'Cápsulas 20 mg, 40 mg; Vial IV 40 mg', 'ERGE: 20 mg/día. Úlcera péptica: 20-40 mg/día. Erradicación H. pylori: 20 mg 2 veces/día.', 'AstraZeneca / Prilosec', 'Antiulceroso/IBP', 'Cefalea, diarrea, estreñimiento, náuseas. Uso prolongado: hipomagnesemia, hipocalcemia, fractura ósea.', 'Hipersensibilidad a IBPs, uso con nelfinavir. Precaución en hepatopatía severa.', NULL, NULL, '2026-06-29 01:58:24'),
(9, 'Amlodipino', 'Bloqueante de los canales de calcio dihidropiridínico. Antihipertensivo y antianginoso de acción prolongada. Bien tolerado en la mayoría de pacientes.', 'Tabletas 5 mg, 10 mg', 'Hipertensión/angina: inicial 5 mg/día. Máximo 10 mg/día. Toma única diaria.', 'Pfizer / Norvasc', 'Antihipertensivo/BCC', 'Edema periférico (tobillo), rubefacción, palpitaciones, cefalea, mareo. Raramente: hiperplasia gingival.', 'Hipersensibilidad a dihidropiridinas, shock cardiogénico, angina inestable severa.', NULL, NULL, '2026-06-29 01:58:24'),
(10, 'Metoprolol', 'Betabloqueante cardioselectivo B1. Reduce la frecuencia cardíaca y la presión arterial. Indicado en hipertensión, angina, post-infarto e insuficiencia cardíaca.', 'Tabletas 50 mg, 100 mg (liberación inmediata y prolongada)', 'Hipertensión: 50-200 mg/día en 1-2 dosis. IC: inicio 12.5-25 mg/día, incremento gradual.', 'AstraZeneca / Lopressor', 'Betabloqueante', 'Bradicardia, fatiga, frío en extremidades, broncoespasmo leve, disfunción eréctil, depresión.', 'Asma grave o EPOC, bradicardia sinusal, bloqueo AV 2-3 grado, shock cardiogénico.', NULL, NULL, '2026-06-29 01:58:24'),
(11, 'Azitromicina', 'Antibiótico macrólido de amplio espectro. Inhibe la síntesis proteica bacteriana. Tratamiento de infecciones respiratorias, ITS y de piel.', 'Cápsulas 250 mg, 500 mg; Suspensión 200 mg/5 mL', 'Adultos: 500 mg día 1, luego 250 mg días 2-5. ITS: 1 g dosis única.', 'Pfizer / Zithromax', 'Antibiótico', 'Náuseas, diarrea, dolor abdominal. Raramente: prolongación QT, hepatotoxicidad, reacciones alérgicas.', 'Hipersensibilidad a macrólidos, hepatopatía severa, arritmias cardíacas.', NULL, NULL, '2026-06-29 01:58:24'),
(12, 'Loratadina', 'Antihistamínico de segunda generación. Antagonista selectivo del receptor H1 periférico. No cruza la barrera hematoencefálica significativamente (no sedante).', 'Tabletas 10 mg; Jarabe 5 mg/5 mL', 'Adultos y niños >12 años: 10 mg una vez al día. Niños 2-12 años: 5 mg/día.', 'Schering-Plough / Claritin', 'Antihistamínico', 'Cefalea, somnolencia leve, sequedad de boca, taquicardia (rara).', 'Hipersensibilidad a loratadina. Precaución en insuficiencia hepática severa.', NULL, NULL, '2026-06-29 01:58:24'),
(13, 'Diazepam', 'Benzodiacepina de acción prolongada. Ansiolítico, sedante, anticonvulsivante y relajante muscular. Potencia la acción del GABA en el SNC.', 'Tabletas 2 mg, 5 mg, 10 mg; Solución IV 5 mg/mL', 'Ansiedad: 2-10 mg 2-4 veces/día. Convulsiones: 5-10 mg IV/IM. Máximo 30 mg/episodio.', 'Roche / Valium', 'Ansiolítico', 'Sedación, somnolencia, ataxia, confusión, dependencia física y psicológica, depresión respiratoria en sobredosis.', 'Miastenia gravis, insuficiencia respiratoria severa, apnea del sueño, embarazo 1er trimestre.', NULL, NULL, '2026-06-29 01:58:24'),
(14, 'Insulina Glargina', 'Insulina análoga de acción prolongada (24 horas). Sin pico pronunciado. Control glucémico basal en diabetes tipo 1 y 2. Administración subcutánea.', 'Solución inyectable 100 UI/mL (pluma precargada)', 'Individualizar dosis. Inicial en DM2: 10 UI/día SC a la misma hora. Ajustar según glucemia basal.', 'Sanofi / Lantus', 'Insulina', 'Hipoglucemia (principal riesgo), reacciones en sitio de inyección, lipodistrofia, aumento de peso.', 'Hipoglucemia activa. No mezclar con otras insulinas. Ajuste en insuficiencia renal o hepática.', NULL, NULL, '2026-06-29 01:58:24'),
(15, 'Prednisona', 'Corticosteroide oral de acción intermedia. Potente antiinflamatorio e inmunosupresor. Usado en enfermedades autoinmunes, alérgicas e inflamatorias.', 'Tabletas 5 mg, 20 mg, 50 mg', 'Dosis variable: 5-60 mg/día según indicación. Reducir gradualmente al suspender.', 'Pfizer / Deltasone', 'Corticosteroide', 'Hiperglucemia, hipertensión, osteoporosis, aumento de peso, síndrome de Cushing, úlcera péptica.', 'Infecciones sistémicas no controladas, tuberculosis activa, herpes simplex ocular.', NULL, NULL, '2026-06-29 01:58:24'),
(16, 'Ciprofloxacino', 'Antibiótico fluoroquinolona de amplio espectro. Inhibe la ADN girasa bacteriana. Eficaz en infecciones urinarias, gastrointestinales y respiratorias.', 'Tabletas 250 mg, 500 mg, 750 mg; Solución IV 2 mg/mL', 'ITU no complicada: 250-500 mg cada 12 horas por 3-7 días. Otras: 500-750 mg cada 12 horas.', 'Bayer / Cipro', 'Antibiótico', 'Náuseas, diarrea, cefalea. Raramente: tendinitis, prolongación QT, convulsiones, fotosensibilidad.', 'Menores de 18 años (excepto especial), embarazo, epilepsia no controlada. No tomar con antiácidos.', NULL, NULL, '2026-06-29 01:58:24'),
(17, 'Warfarina', 'Anticoagulante oral antagonista de la vitamina K. Previene trombos. Requiere monitorización del INR. Numerosas interacciones con alimentos y medicamentos.', 'Tabletas 1 mg, 2 mg, 2.5 mg, 5 mg', 'Dosis ajustada según INR (objetivo 2-3). Toma única diaria a la misma hora. Inicio 2-5 mg/día.', 'Bristol-Myers / Coumadin', 'Anticoagulante', 'Hemorragia (principal riesgo), necrosis cutánea, alopecia. Requiere monitorización periódica del INR.', 'Embarazo, hemorragia activa, HTA severa no controlada, cirugía reciente del SNC.', NULL, NULL, '2026-06-29 01:58:24'),
(18, 'Salbutamol', 'Agonista B2-adrenérgico de acción corta (SABA). Broncodilatador de rescate en asma y EPOC. Relaja el músculo liso bronquial en minutos.', 'Inhalador 100 mcg/dosis; Nebulización 5 mg/mL; Tabletas 2 mg, 4 mg', 'Crisis aguda: 2-4 pulsaciones cada 20 min por 3 dosis. Mantenimiento: 2 pulsaciones cada 4-6 horas.', 'GlaxoSmithKline / Ventolin', 'Broncodilatador', 'Temblor fino, taquicardia, cefalea, palpitaciones, hipopotasemia (dosis altas), nerviosismo.', 'Hipersensibilidad a salbutamol. Precaución en cardiopatía isquémica, hipertiroidismo.', NULL, NULL, '2026-06-29 01:58:24'),
(19, 'Levotiroxina', 'Hormona tiroidea sintética (T4). Tratamiento del hipotiroidismo y bocio. Reemplaza la hormona tiroidea endógena. Administración matinal en ayunas.', 'Tabletas 25 mcg, 50 mcg, 75 mcg, 100 mcg, 150 mcg', 'Individualizar. Inicio: 25-50 mcg/día. Incremento gradual cada 4-6 semanas. Controlar TSH.', 'Abbott / Synthroid', 'Hormona Tiroidea', 'Síntomas de hipertiroidismo si sobredosificación: taquicardia, insomnio, pérdida de peso, temblor.', 'Tirotoxicosis no tratada, infarto reciente, insuficiencia suprarrenal no tratada.', NULL, NULL, '2026-06-29 01:58:24'),
(20, 'Clopidogrel', 'Antiagregante plaquetario inhibidor del receptor P2Y12 del ADP. Previene trombosis arterial. Usado en síndrome coronario agudo, angioplastia e ictus isquémico.', 'Tabletas 75 mg, 300 mg', 'Profilaxis: 75 mg una vez al día. Dosis de carga SCA/stent: 300-600 mg. Combinado con aspirina.', 'Sanofi / Plavix', 'Antiagregante', 'Sangrado (principal riesgo), equimosis, hematomas, dispepsia, diarrea, raramente PTT.', 'Hemorragia activa, hipersensibilidad. Precaución en riesgo hemorrágico. Interacción con omeprazol.', NULL, NULL, '2026-06-29 01:58:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos_favoritos`
--

CREATE TABLE `medicamentos_favoritos` (
  `usuario_id` int(11) NOT NULL,
  `medicamento_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `especialidad` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`id`, `usuario_id`, `especialidad`, `cedula`, `telefono`, `created_at`, `updated_at`) VALUES
(1, 12, '', '99999999', NULL, '2026-04-09 04:04:49', '2026-04-09 04:04:49'),
(2, 13, '', '11111111', NULL, '2026-04-09 04:07:23', '2026-04-09 04:07:23'),
(3, 15, '', '22222222', NULL, '2026-04-09 04:08:06', '2026-04-09 04:08:06'),
(4, 22, 'Cardiología', '7654321', '04121234567', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(5, 23, 'Endocrinología', '8765432', '04141234567', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(8, 38, '', '88888888', '', '2026-07-01 03:05:23', '2026-07-01 03:05:23'),
(9, 42, '', '58198515', '', '2026-07-01 03:20:37', '2026-07-01 03:20:37'),
(10, 43, '', '32007262', '', '2026-07-07 01:04:40', '2026-07-07 01:04:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles_salud`
--

CREATE TABLE `perfiles_salud` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `peso_kg` decimal(5,2) DEFAULT NULL,
  `altura_cm` int(11) DEFAULT NULL,
  `tipo_sangre` varchar(10) DEFAULT NULL,
  `color_piel` varchar(50) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `antecedentes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `genero` varchar(10) DEFAULT NULL,
  `edad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfiles_salud`
--

INSERT INTO `perfiles_salud` (`id`, `cliente_id`, `peso_kg`, `altura_cm`, `tipo_sangre`, `color_piel`, `alergias`, `antecedentes`, `created_at`, `updated_at`, `genero`, `edad`) VALUES
(1, 2, 75.50, 180, 'O+', 'Trigueña', 'Ninguna', 'Asma leve en la infancia', '2026-04-09 01:34:25', '2026-04-09 01:34:25', NULL, NULL),
(2, 3, 75.50, 180, 'O+', 'Trigueña', 'Ninguna', 'Asma leve en la infancia', '2026-04-09 01:35:05', '2026-04-09 01:35:05', NULL, NULL),
(3, 4, 75.50, 180, 'O+', 'Trigueña', 'Ninguna', 'Asma leve en la infancia', '2026-04-09 01:36:15', '2026-04-09 01:36:15', NULL, NULL),
(4, 5, 999.99, 1412412, 'B+', '412421', '42142141', NULL, '2026-04-09 02:02:37', '2026-04-09 02:02:37', NULL, NULL),
(5, 12, 70.00, 175, 'O+', NULL, NULL, NULL, '2026-04-09 04:04:49', '2026-04-09 04:04:49', NULL, NULL),
(6, 13, 75.00, 180, 'A+', NULL, NULL, NULL, '2026-04-09 04:07:23', '2026-04-09 04:07:23', NULL, NULL),
(7, 15, 70.00, 175, 'A+', NULL, NULL, NULL, '2026-04-09 04:08:06', '2026-04-09 04:08:06', 'masculino', 35),
(8, 7, -0.10, 10, 'A+', 'moreno_claro', NULL, NULL, '2026-04-09 04:24:24', '2026-04-09 04:25:21', 'femenino', 23),
(9, 16, 100.00, 13, 'A+', 'moreno_medio', NULL, NULL, '2026-04-09 04:26:22', '2026-04-09 04:34:21', 'femenino', 12),
(10, 11, 120.00, 120, 'A+', 'blanco', NULL, NULL, '2026-04-09 05:44:01', '2026-04-09 10:25:45', 'masculino', NULL),
(11, 24, 62.50, 165, 'A+', 'moreno_claro', 'Penicilina', 'Diabetes tipo 2 familiar', '2026-04-09 10:24:46', '2026-04-09 10:24:46', NULL, NULL),
(12, 25, 85.00, 175, 'O+', 'blanco', NULL, 'Hipertensión arterial', '2026-04-09 10:24:46', '2026-04-09 10:24:46', NULL, NULL),
(13, 26, 55.00, 160, 'AB+', 'moreno_medio', 'Polen, Ácaros', NULL, '2026-04-09 10:24:46', '2026-04-09 10:24:46', NULL, NULL),
(17, 41, 10.00, 10, 'B+', 'moreno_claro', NULL, NULL, '2026-07-01 03:19:12', '2026-07-01 03:19:12', 'femenino', 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `medico_id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `contenido` text NOT NULL,
  `tipo` enum('diagnostico','tratamiento','receta','nota') DEFAULT 'diagnostico',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rutina_recomendada` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post_medicamentos`
--

CREATE TABLE `post_medicamentos` (
  `post_id` int(11) NOT NULL,
  `medicamento_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `rol` enum('Cliente','Medico','Administrador') DEFAULT 'Cliente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `email`, `rol`, `created_at`, `updated_at`) VALUES
(1, 'testuser_1775698402639', '$2a$10$3uHMu.727shVRa.WD0BYkeEFeQTL5VdlySt2Vw9/g9NGOE0ixxDOW', 'testuser_1775698402639@test.com', 'Cliente', '2026-04-09 01:33:23', '2026-04-09 01:33:23'),
(2, 'testuser_1775698464527', '$2a$10$nbjuE3YMDcnnnnqpaYJ/NOH2Sys93LXRNEP0uCq2O/nNUNHIkv1RW', 'testuser_1775698464527@test.com', 'Cliente', '2026-04-09 01:34:24', '2026-04-09 01:34:24'),
(3, 'testuser_1775698505402', '$2a$10$MLR.C3W0DWe/IcAOFOw70evTqR2VNS9DiR9cFQSj6HM4olrdC98s6', 'testuser_1775698505402@test.com', 'Cliente', '2026-04-09 01:35:05', '2026-04-09 01:35:05'),
(4, 'testuser_1775698573824', '$2a$10$yA5NcZ50y22NfSR3RmC1Ues0EcODOm34U5X51MwpYZgUY3CwqJYai', 'testuser_1775698573824@test.com', 'Cliente', '2026-04-09 01:36:15', '2026-04-09 01:36:15'),
(5, 'juan123', '$2a$10$owF5jkHAEr9ugUW7xoEwUeVF7NTWTnAeQ7YH7HVzs4eKbCqSRJ6rO', 'juan@test.com', 'Cliente', '2026-04-09 01:56:47', '2026-04-09 01:56:47'),
(6, 'foro_user', '$2a$10$ZlTi3Wpw5hR.Zzse7B.OQ.lUMqyzXT3.E2F/FJ8Sgl13e5cN8ULay', '4@test.com', 'Cliente', '2026-04-09 02:20:24', '2026-04-09 02:20:24'),
(7, '<c<', '$2a$10$Q01fJSctEbCq1koXOplBA.1kXxCzcN73tos./hvMzOa9kyykKyZ02', 'ASFSAFAS@GMAIL.COM', 'Medico', '2026-04-09 03:13:12', '2026-04-09 03:13:12'),
(8, 'paciente_test', '$2a$10$MNnJY5Yw555GcQva1bYQvu.NrDhizdm1AxjAreOTh7514ioLqjFRK', 'paciente@test.com', 'Cliente', '2026-04-09 03:42:58', '2026-04-09 03:42:58'),
(9, 'medico_test', '$2a$10$dA4aY0PO5J722hiIF1NbiO5.eEvodx4ECWWygPPJM.cpNVIXoNY36', 'medico@test.com', 'Medico', '2026-04-09 03:42:58', '2026-04-09 03:42:58'),
(10, 'admin_test', '$2a$10$7797PLZNgKkUewN7oDoS7ObOvgzJInzKuQwbz2HwLd9zxGNHtoB0O', 'admin@test.com', 'Administrador', '2026-04-09 03:42:58', '2026-04-09 03:42:58'),
(11, 'jean', '$2a$10$JK1EL0YP14BZ/ZUtPYisheeHzYNf9G595U03SFMUfMVZRMaLzcHKu', '21412421421@gmail.com', 'Cliente', '2026-04-09 03:53:59', '2026-04-09 05:38:35'),
(12, 'medico_clean', '$2a$10$testpassword123', 'medico_clean@test.com', 'Medico', '2026-04-09 04:04:49', '2026-04-09 04:06:44'),
(13, 'medico_simple', '$2a$10$test123456', '', 'Medico', '2026-04-09 04:07:23', '2026-04-09 04:07:23'),
(15, 'medico_working', '$2a$10$dA4aY0PO5J722hiIF1NbiO5.eEvodx4ECWWygPPJM.cpNVIXoNY36', 'medico_working@test.com', 'Medico', '2026-04-09 04:08:06', '2026-04-09 04:08:06'),
(16, 'roberto', '$2a$10$QHp5diD3HLVJVx6YbzhddOvAZ5G84vCr4ABbXmYdclsjpl9kQnrxO', 'meajq@mgggggg.com', 'Cliente', '2026-04-09 04:11:06', '2026-04-09 04:11:06'),
(17, 'cliente1', '$2a$10$mujVLFmFYJ/sUY3ifqgFwu6M6wI/Me5cztol7D5J3PSa5GtdTP9KO', 'cliente1@test.com', 'Cliente', '2026-04-09 04:57:36', '2026-04-09 04:57:36'),
(19, 'medico1', '$2a$10$xQZvW9tDMLoxMwlXHfWyFe8C3ZMG74HXrBYIEAIjUlFrdjdSjN8Ii', 'medico1@test.com', 'Medico', '2026-04-09 05:17:26', '2026-04-09 05:17:26'),
(20, 'testuser', '$2a$10$imHjcfdjkZbXO7WYm24k6.UnmeKl.mj5jh50Va7V3K/aoSoZO0huK', 'test@test.com', 'Cliente', '2026-04-09 05:37:30', '2026-04-09 05:37:30'),
(21, 'admin', '$2a$10$31K98SSzzx/fN0S6UziKvu.OhU9J4WeD7SS5dwok6Q98y59HkFUQ6', 'admin@salud.com', 'Administrador', '2026-04-09 10:24:45', '2026-04-09 10:24:45'),
(22, 'dr_garcia', '$2a$10$47ZZyzoKGVc2Rw8CtpAv9.nCvK.ot0ZoAINNPSp7L3HQFCshOZNRy', 'garcia@salud.com', 'Medico', '2026-04-09 10:24:45', '2026-04-09 10:24:45'),
(23, 'dr_lopez', '$2a$10$87/uclKcYarhNIU1FRqpbOQ3BFPEW14T2wp5v8gmxnkaQHUjanT4.', 'lopez@salud.com', 'Medico', '2026-04-09 10:24:45', '2026-04-09 10:24:45'),
(24, 'paciente1', '$2a$10$dTjIC86QGzOx5Qjs90W9xelEhUmUN7Os04aLhPBGDFkJ.l/9cAVMW', 'maria@gmail.com', 'Cliente', '2026-04-09 10:24:45', '2026-04-09 10:24:45'),
(25, 'paciente2', '$2a$10$tP3wh6jwioVuU/3bY68nF.6Xn3ZtQU33oRGz52wN9UL2ZiDewpNRK', 'juan@gmail.com', 'Cliente', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(26, 'paciente3', '$2a$10$FJ3cICNK4gOFR.MM1sqc0eKN.0NkzMtGOIzPIzd3rQTiyREvAeu0G', 'luisa@gmail.com', 'Cliente', '2026-04-09 10:24:46', '2026-04-09 10:24:46'),
(33, 'Jean12', '$2a$10$qDVzPeyEBPOW2yLCAqQAFOociZYWOWpQAr06rXWwCFZzzYqlWT1te', 'jeanaaa@gmaic.com', 'Cliente', '2026-06-29 03:10:09', '2026-06-29 03:10:09'),
(34, 'Klaudia', '$2a$10$MeKSarmFWj7zQTuzLin7dO3dWni4Nm8E4KjhATL1Vfl/WiyfPGqkm', 'klaudia@gmail.com', 'Cliente', '2026-07-01 02:55:52', '2026-07-01 02:55:52'),
(35, 'test_1782875003207', '$2a$10$6KfQQ81oylx/IZy1a9PZweAV2QTp5MgNKBoJnwCiflZkBjOYjOjJm', 'test_1782875003207@test.com', 'Cliente', '2026-07-01 03:03:23', '2026-07-01 03:03:23'),
(36, 'tester_1782875016270', '$2a$10$RkhC7E0qAWRaNGoTLShZFOvU/ai9wJTRSU.P4hUGgUpT1.5/d9fei', 'tester_1782875016270@test.com', 'Cliente', '2026-07-01 03:03:36', '2026-07-01 03:03:36'),
(37, 'test_1782875093415', '$2a$10$pfZFyZCpGZniS/PsbuxixeaVJWTxjmyAY9pNPdeM3qh/0rJnJ7kY2', 'test_1782875093415@test.com', 'Cliente', '2026-07-01 03:04:53', '2026-07-01 03:04:53'),
(38, 'dr_test_1782875123327', '$2a$10$yJySrLNyr7g.rrOYT5T6lOvM/8PHFgMQztu/XLnjP0fzwDltArlue', 'dr_1782875123327@test.com', 'Medico', '2026-07-01 03:05:23', '2026-07-01 03:05:23'),
(39, 'Klaudia1', '$2a$10$Pcybb0TzzC1ecSclApIxXOs.Wewi5PLt8UV/nEtYF7iMdqwddju3e', 'klaudi1a@gmail.com', 'Cliente', '2026-07-01 03:11:11', '2026-07-01 03:11:11'),
(40, 'user1782875674947', '$2a$10$lcqk72dUmxTbCEPr5UDi4ecp8cCs///ALuWmVXVuPJbFP4UOONOry', 'user1782875674947@test.com', 'Cliente', '2026-07-01 03:14:35', '2026-07-01 03:14:35'),
(41, 'Jeann', '$2a$10$NGwEKTTGf.fiC2eXShbKnOsWC0SnQ6iNMaxheXwBKzRfvCJbudKxG', 'jrajiorwajnof@gmail.com', 'Cliente', '2026-07-01 03:18:06', '2026-07-01 03:18:06'),
(42, 'AAAAAAAAA', '$2a$10$JGfC6n0FdwEsxzwQA/hbv.Y4N3riBnQkUdxXHIISRBYPSnbaor8Eq', 'aaaaaaaaa@gmail.com', 'Medico', '2026-07-01 03:20:36', '2026-07-01 03:20:36'),
(43, 'Jean_WWW', '$2a$10$jhk292LnSiXlI64uhag/wuJgoWoSbuwZic0TWxnnGOpkppHsub.5G', 'jean@gmail.com', 'Medico', '2026-07-07 01:04:40', '2026-07-07 01:04:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `analisis_medicos`
--
ALTER TABLE `analisis_medicos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- Indices de la tabla `foros`
--
ALTER TABLE `foros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `foro_comentarios`
--
ALTER TABLE `foro_comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foro_id` (`foro_id`),
  ADD KEY `autor_id` (`autor_id`);

--
-- Indices de la tabla `foro_medicamentos`
--
ALTER TABLE `foro_medicamentos`
  ADD PRIMARY KEY (`foro_id`,`medicamento_id`),
  ADD KEY `medicamento_id` (`medicamento_id`);

--
-- Indices de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `medicamentos_favoritos`
--
ALTER TABLE `medicamentos_favoritos`
  ADD PRIMARY KEY (`usuario_id`,`medicamento_id`),
  ADD KEY `medicamento_id` (`medicamento_id`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD UNIQUE KEY `cedula` (`cedula`);

--
-- Indices de la tabla `perfiles_salud`
--
ALTER TABLE `perfiles_salud`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cliente_id` (`cliente_id`);

--
-- Indices de la tabla `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `medico_id` (`medico_id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Indices de la tabla `post_medicamentos`
--
ALTER TABLE `post_medicamentos`
  ADD PRIMARY KEY (`post_id`,`medicamento_id`),
  ADD KEY `medicamento_id` (`medicamento_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `analisis_medicos`
--
ALTER TABLE `analisis_medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `foros`
--
ALTER TABLE `foros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `foro_comentarios`
--
ALTER TABLE `foro_comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `perfiles_salud`
--
ALTER TABLE `perfiles_salud`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `analisis_medicos`
--
ALTER TABLE `analisis_medicos`
  ADD CONSTRAINT `analisis_medicos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `foros`
--
ALTER TABLE `foros`
  ADD CONSTRAINT `foros_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `foro_comentarios`
--
ALTER TABLE `foro_comentarios`
  ADD CONSTRAINT `foro_comentarios_ibfk_1` FOREIGN KEY (`foro_id`) REFERENCES `foros` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `foro_comentarios_ibfk_2` FOREIGN KEY (`autor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `foro_medicamentos`
--
ALTER TABLE `foro_medicamentos`
  ADD CONSTRAINT `foro_medicamentos_ibfk_1` FOREIGN KEY (`foro_id`) REFERENCES `foros` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `foro_medicamentos_ibfk_2` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `medicamentos_favoritos`
--
ALTER TABLE `medicamentos_favoritos`
  ADD CONSTRAINT `medicamentos_favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `medicamentos_favoritos_ibfk_2` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `perfiles_salud`
--
ALTER TABLE `perfiles_salud`
  ADD CONSTRAINT `perfiles_salud_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`medico_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `post_medicamentos`
--
ALTER TABLE `post_medicamentos`
  ADD CONSTRAINT `post_medicamentos_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `post_medicamentos_ibfk_2` FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
