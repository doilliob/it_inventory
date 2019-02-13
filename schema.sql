-- phpMyAdmin SQL Dump
-- version 4.7.8
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Фев 13 2019 г., 13:09
-- Версия сервера: 5.5.60-log
-- Версия PHP: 5.6.35

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `support`
--

-- --------------------------------------------------------

--
-- Структура таблицы `classes`
--

CREATE TABLE `classes` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `picture` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `employee`
--

CREATE TABLE `employee` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `post` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `hardware`
--

CREATE TABLE `hardware` (
  `id` int(10) UNSIGNED NOT NULL,
  `class_id` int(11) NOT NULL,
  `inventory_num` varchar(20) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `level` varchar(50) DEFAULT NULL,
  `floor` text,
  `description` text,
  `employee_id` int(11) DEFAULT NULL,
  `inventory_user` int(11) DEFAULT NULL,
  `present_alarm` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Дублирующая структура для представления `licensed`
-- (См. Ниже фактическое представление)
--
CREATE TABLE `licensed` (
`id` int(10) unsigned
,`count` bigint(21)
);

-- --------------------------------------------------------

--
-- Структура таблицы `licenses`
--

CREATE TABLE `licenses` (
  `id` int(10) UNSIGNED NOT NULL,
  `lic_num` varchar(100) NOT NULL,
  `lic_name` text NOT NULL,
  `product_name` text NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `lic_count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `migration`
--

CREATE TABLE `migration` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration_date` datetime NOT NULL,
  `hardware_id` int(11) NOT NULL,
  `from_level` varchar(50) NOT NULL,
  `from_floor` text NOT NULL,
  `from_inventory_num` varchar(20) NOT NULL,
  `from_employee_id` int(11) NOT NULL,
  `from_inventory_user` int(11) NOT NULL,
  `to_level` varchar(20) NOT NULL,
  `to_floor` text NOT NULL,
  `to_inventory_num` varchar(20) NOT NULL,
  `to_employee_id` int(11) NOT NULL,
  `to_inventory_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Дублирующая структура для представления `migration_humanity`
-- (См. Ниже фактическое представление)
--
CREATE TABLE `migration_humanity` (
`inventory_num` varchar(20)
,`name` text
,`model` varchar(100)
,`id` int(10) unsigned
,`migration_date` datetime
,`hardware_id` int(11)
,`from_level` varchar(50)
,`from_floor` text
,`from_inventory_num` varchar(20)
,`from_employee_id` int(11)
,`from_inventory_user` int(11)
,`to_level` varchar(20)
,`to_floor` text
,`to_inventory_num` varchar(20)
,`to_employee_id` int(11)
,`to_inventory_user` int(11)
);

-- --------------------------------------------------------

--
-- Структура таблицы `organisations`
--

CREATE TABLE `organisations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `software`
--

CREATE TABLE `software` (
  `id` int(10) UNSIGNED NOT NULL,
  `class_id` int(11) NOT NULL,
  `hardware_id` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `serial` varchar(100) NOT NULL,
  `license_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `software_classes`
--

CREATE TABLE `software_classes` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `picture` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `software_licenses`
--

CREATE TABLE `software_licenses` (
  `id` int(10) UNSIGNED NOT NULL,
  `organization` varchar(255) NOT NULL,
  `microsoft_category` varchar(255) NOT NULL,
  `microsoft_family` varchar(255) NOT NULL,
  `microsoft_version` varchar(255) NOT NULL,
  `microsoft_type` varchar(255) NOT NULL,
  `microsoft_fact` int(11) NOT NULL,
  `microsoft_notfull` int(11) NOT NULL,
  `lic_num` varchar(255) NOT NULL,
  `lic_name` varchar(255) NOT NULL,
  `lic_start_date` date NOT NULL DEFAULT '2017-01-01',
  `lic_stop_date` date NOT NULL DEFAULT '2017-01-01',
  `product_name` text NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `lic_count` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `software_licenses_keys`
--

CREATE TABLE `software_licenses_keys` (
  `id` int(10) UNSIGNED NOT NULL,
  `license_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_key` varchar(255) NOT NULL,
  `product_activation` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `software_licenses_use`
--

CREATE TABLE `software_licenses_use` (
  `id` int(10) UNSIGNED NOT NULL,
  `license_id` int(11) NOT NULL,
  `inventory_num` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `license_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `software_uploads`
--

CREATE TABLE `software_uploads` (
  `id` int(10) UNSIGNED NOT NULL,
  `filename` varchar(255) NOT NULL,
  `filesize` int(11) NOT NULL,
  `filetype` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `software_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `software_uploads_data`
--

CREATE TABLE `software_uploads_data` (
  `id` int(10) UNSIGNED NOT NULL,
  `file_id` int(11) UNSIGNED NOT NULL,
  `file_data` longblob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `uploads`
--

CREATE TABLE `uploads` (
  `id` int(4) NOT NULL,
  `description` char(50) DEFAULT NULL,
  `data` longblob,
  `filename` char(50) DEFAULT NULL,
  `filesize` char(50) DEFAULT NULL,
  `filetype` char(50) DEFAULT NULL,
  `hardware_id` int(11) DEFAULT NULL,
  `software_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура для представления `licensed`
--
DROP TABLE IF EXISTS `licensed`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `licensed`  AS  select `licenses`.`id` AS `id`,count(`software`.`license_id`) AS `count` from (`licenses` join `software`) where (`licenses`.`id` = `software`.`license_id`) ;

-- --------------------------------------------------------

--
-- Структура для представления `migration_humanity`
--
DROP TABLE IF EXISTS `migration_humanity`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `migration_humanity`  AS  select `hardware`.`inventory_num` AS `inventory_num`,`classes`.`name` AS `name`,`hardware`.`model` AS `model`,`migration`.`id` AS `id`,`migration`.`migration_date` AS `migration_date`,`migration`.`hardware_id` AS `hardware_id`,`migration`.`from_level` AS `from_level`,`migration`.`from_floor` AS `from_floor`,`migration`.`from_inventory_num` AS `from_inventory_num`,`migration`.`from_employee_id` AS `from_employee_id`,`migration`.`from_inventory_user` AS `from_inventory_user`,`migration`.`to_level` AS `to_level`,`migration`.`to_floor` AS `to_floor`,`migration`.`to_inventory_num` AS `to_inventory_num`,`migration`.`to_employee_id` AS `to_employee_id`,`migration`.`to_inventory_user` AS `to_inventory_user` from ((`classes` join `migration`) join `hardware`) where ((`hardware`.`class_id` = `classes`.`id`) and (`hardware`.`id` = `migration`.`hardware_id`)) order by `migration`.`migration_date` desc ;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `hardware`
--
ALTER TABLE `hardware`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Индексы таблицы `licenses`
--
ALTER TABLE `licenses`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `migration`
--
ALTER TABLE `migration`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `organisations`
--
ALTER TABLE `organisations`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `software`
--
ALTER TABLE `software`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `software_classes`
--
ALTER TABLE `software_classes`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `software_licenses`
--
ALTER TABLE `software_licenses`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `software_licenses_keys`
--
ALTER TABLE `software_licenses_keys`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `software_licenses_use`
--
ALTER TABLE `software_licenses_use`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `software_uploads`
--
ALTER TABLE `software_uploads`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `software_uploads_data`
--
ALTER TABLE `software_uploads_data`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `uploads`
--
ALTER TABLE `uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `hardware_id` (`hardware_id`),
  ADD KEY `software_id` (`software_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT для таблицы `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=765;

--
-- AUTO_INCREMENT для таблицы `hardware`
--
ALTER TABLE `hardware`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1138;

--
-- AUTO_INCREMENT для таблицы `licenses`
--
ALTER TABLE `licenses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT для таблицы `migration`
--
ALTER TABLE `migration`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=995;

--
-- AUTO_INCREMENT для таблицы `organisations`
--
ALTER TABLE `organisations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `software`
--
ALTER TABLE `software`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=606;

--
-- AUTO_INCREMENT для таблицы `software_classes`
--
ALTER TABLE `software_classes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT для таблицы `software_licenses`
--
ALTER TABLE `software_licenses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT для таблицы `software_licenses_keys`
--
ALTER TABLE `software_licenses_keys`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=303;

--
-- AUTO_INCREMENT для таблицы `software_licenses_use`
--
ALTER TABLE `software_licenses_use`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

--
-- AUTO_INCREMENT для таблицы `software_uploads`
--
ALTER TABLE `software_uploads`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- AUTO_INCREMENT для таблицы `software_uploads_data`
--
ALTER TABLE `software_uploads_data`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- AUTO_INCREMENT для таблицы `uploads`
--
ALTER TABLE `uploads`
  MODIFY `id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1634;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
