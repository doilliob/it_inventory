<?php 
    // Конфигурация БД
    //include_once 'config.php';
    // Инициализация БД
    //include_once 'initdb.php';
    // Подключение библиотек
    include_once 'libs.php'; 

    // Роутинг
    switch ($_GET['page']) {
            case 'software': $application_path = 'software'; break;
            case 'hardware': $application_path = 'inventory'; break;
    }
    // Отрисовка страницы
	include_once 'page.php';
    // Закрытие БД
    //include_once 'closedb.php';
?>
