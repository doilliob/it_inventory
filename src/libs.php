 <?php 

function portal_header() {  
	return file_get_contents('templates/header.html');
}  

function portal_footer() {  
	return file_get_contents('templates/footer.html');
}  

function slide_menu() {  
	return file_get_contents('templates/slidemenu.html');
}  

function navigation() {
	$slidemenu = slide_menu();
	$nav =  file_get_contents('templates/navigation.html');
	return str_replace('{slidemenu}',$slidemenu,$nav);
}

function get_hw_classes() {
	$arr;
	$query = "select * from classes order by name";
	$result = mysql_query($query);
	if($result)
		while($row = mysql_fetch_assoc($result))
			$arr[ $row['id'] ] = $row['name'];
	return $arr; 
}

function get_hw_pictures() {
	$arr;
	$query = "select * from classes order by name";
	$result = mysql_query($query);
	if($result)
		while($row = mysql_fetch_assoc($result))
			$arr[ $row['id'] ] = $row['picture'];
	return $arr; 
}

function get_employee() {
	$arr;
	$query = "select * from employee order by name";
	$result = mysql_query($query);
	if($result)
		while($row = mysql_fetch_assoc($result))
			$arr[ $row['id'] ] = $row['name'];
	return $arr; 
}

function get_hw_info($id)
{
	$arr;
	$query = "SELECT * FROM hardware WHERE id=".$id." LIMIT 1";
	$result = mysql_query($query);
	if( $result )
		$arr = mysql_fetch_assoc($result);
	return $arr;
}

class HW_Tree {
	public $id;
	public $level;
	public $floor;
	public $model;
	public $category;
	public $inventory_num;
	public $picture;

	public function initVars($i,$lev,$fl,$c,$inv,$mod,$pic) {
		$this->id = $i;
		$this->level = $lev;
		$this->floor = $fl;
		$this->category = $c;
		$this->inventory_num = $inv;
		$this->model = $mod; 
		$this->picture = $pic;
	}
}

function get_hw_for_tree(){
	$arr = array();
	$classes = get_hw_classes();
	$pictures = get_hw_pictures();
	$query = "SELECT id,level,floor,class_id,inventory_num,model FROM hardware ORDER BY level,floor,class_id";
	$result = mysql_query($query);
	if($result)
		while($row = mysql_fetch_assoc($result)) {
			$category = split(' \- ',$classes[ $row['class_id'] ]);
        	$category = $category[1];
			$tmp = new HW_Tree;
			$tmp->initVars( $row['id'], 
							$row['level'], 
							$row['floor'], 
							$category, 
							$row['inventory_num'],
							$row['model'],
							$pictures[ $row['class_id']]);
			array_push($arr, $tmp);
		}
	return $arr;
}

// Возвращяет количество кабинетов из данного списка оборудовани
// для данного этажа
function get_floors_for_level($level, $HWTree)
{
	$arr = array();
	$floors;
	foreach ($HWTree as $TrElem)
		if( $TrElem->level == $level )
			$floors[$TrElem->floor] = 1;

	if($floors)
	foreach ($floors as $key => $value)
		array_push($arr, $key);

	return $arr;
}

// Возвращает оборудование для данного этажа и 
// данного кабинета
function get_hw_for_level_floor($level,$floor,$HWTree) {
	$arr = array();
	foreach( $HWTree as $TrElem) 
		if( ($TrElem->floor == $floor) && ($TrElem->level == $level))
			array_push($arr, $TrElem);
	return $arr;
}


function make_tree_view($name)
{
	$template = '<div id="'.$name.'">  
					<ul>
                	  <li class="jstree-open">ГБОУ СПО "СМК им.Н.Ляпиной"
                        <ul>';
    
    $hardware = get_hw_for_tree();
    $levels = array(1,2,3,4);
    // для каждого этажа
    foreach ($levels as $l) 
    {
    	$template .= ' <li> Этаж '.$l.' ';
    	$floors = get_floors_for_level($l,$hardware);
    	// количество кабинетов > 0
    	if( count($floors) > 0 )
    	{
    		$template .= ' <ul> ';
    		// для каждого кабинета
    		foreach ($floors as $f) 
    		{
    			$template .= ' <li> Кабинет '.$f.' ';
    			$hw = get_hw_for_level_floor($l,$f,$hardware);
    			if(count($hw) > 0) 
    			{
    				$template .= ' <ul> ';
    				foreach ($hw as $TrElem)
    				{
    					$template .= ' <li ';
    					if ($TrElem->picture != '')
    						$template .= ' data-jstree=\'{"icon":"'.$TrElem->picture.'"}\' ';
    					$template .= ' onclick="document.location = \'index.php?page=hardware_edit&id='.$TrElem->id.'&\';" > ';
    					$template .= $TrElem->inventory_num." - ".$TrElem->category." ".$TrElem->model;
    					$template .= ' </li> ';
    				}
    				$template .= ' </ul> ';
    			}
    			$template .= ' </li> '; 
    		}
    	    $template .= ' </ul> ';
    		
    	} 
    	$template .= '</li>'; // этаж
    }

    $template .= '</ul> </li> </ul> </div>'; // Колледж
    return $template;
}



function get_hw_files($id)
{
	$arr;
	$query = "SELECT * FROM uploads WHERE hardware_id=".$id;
	$result = mysql_query($query);
	if(  $result )
		while( $row = mysql_fetch_assoc($result) )
			$arr[ $row['id'] ] = $row['filename'];
	return $arr;
}

// Добавляет новое оборудование в базу
function add_new_hw(){
	// Добавляем информацию в базу
	$level = $_POST['level'];
	$floor = $_POST['floor'];
	$class = $_POST['class'] ;
	$inventory_num = $_POST['inventory_num'];
	$model = $_POST['model'];
	$description = $_POST['description'];
	$employee = $_POST['employee'];

	$query = "INSERT INTO hardware (class_id, inventory_num, model, level, floor, description,employee_id) ".
	"VALUES ($class, '$inventory_num', '$model', $level, '$floor', '$description', $employee)";
	mysql_query($query) or die("INSERT NEW HARDWARE ERROR!!! ".$query." ".mysql_error());
	$hardware_id = mysql_insert_id();

	// Добавляем если есть файл в базу
	 if($_FILES['configfile']['size'] > 0)
	{
		$fileName = $_FILES['configfile']['name'];
		$tmpName  = $_FILES['configfile']['tmp_name'];
		$fileSize = $_FILES['configfile']['size'];
		$fileType = $_FILES['configfile']['type'];
		
		$fileDesc = "Файл конфигурации нового оборудования";

		$fp      = fopen($tmpName, 'r');
		$content = fread($fp, filesize($tmpName));
		$content = addslashes($content);
		fclose($fp);

		if(!get_magic_quotes_gpc())
		{
		    $fileName = addslashes($fileName);
		}

		$query = "INSERT INTO uploads (filename, filesize, filetype, data, description, hardware_id) ".
		"VALUES ('$fileName', '$fileSize', '$fileType', '$content','$fileDesc',$hardware_id)";

		mysql_query($query);
	}
}

function add_and_edit_hw(){
	// Добавляем информацию в базу
	$level = $_POST['level'];
	$floor = $_POST['floor'];
	$class = $_POST['class'] ;
	$inventory_num = $_POST['inventory_num'];
	$model = $_POST['model'];
	$description = $_POST['description'];
	$employee = $_POST['employee'];

	$query = "INSERT INTO hardware (class_id, inventory_num, model, level, floor, description,employee_id) ".
	"VALUES ($class, '$inventory_num', '$model', $level, '$floor', '$description', $employee)";
	mysql_query($query) or die("INSERT NEW HARDWARE ERROR!!! ".$query." ".mysql_error());
	$hardware_id = mysql_insert_id();

	// Добавляем если есть файл в базу
	 if($_FILES['configfile']['size'] > 0)
	{
		$fileName = $_FILES['configfile']['name'];
		$tmpName  = $_FILES['configfile']['tmp_name'];
		$fileSize = $_FILES['configfile']['size'];
		$fileType = $_FILES['configfile']['type'];
		
		$fileDesc = "Файл конфигурации нового оборудования";

		$fp      = fopen($tmpName, 'r');
		$content = fread($fp, filesize($tmpName));
		$content = addslashes($content);
		fclose($fp);

		if(!get_magic_quotes_gpc())
		{
		    $fileName = addslashes($fileName);
		}

		$query = "INSERT INTO uploads (filename, filesize, filetype, data, description, hardware_id) ".
		"VALUES ('$fileName', '$fileSize', '$fileType', '$content','$fileDesc',$hardware_id)";

		mysql_query($query);
	}
	// Задаем страницу редактирования
	$_GET['page'] = 'hardware_edit';
	$_GET['id'] = $hardware_id;
}

function edit_hw(){
	// Обновляем информацию в базе
	$hw_id = $_POST['hw_id'];
	$level = $_POST['level'];
	$floor = $_POST['floor'];
	$class = $_POST['class'] ;
	$inventory_num = $_POST['inventory_num'];
	$model = $_POST['model'];
	$description = $_POST['description'];
	$employee = $_POST['employee'];

	$query = "UPDATE hardware 
			SET class_id=$class, 
				 inventory_num='$inventory_num', 
				 model='$model', 
				 level=$level, 
				 floor='$floor', 
				 description='$description',
				 employee_id=$employee  
			WHERE id=$hw_id";
	mysql_query($query) or die("MySQL: Ошибка обновления записи!!! ".$query." ".mysql_error());
	

	// Добавляем если есть файл в базу
	 if($_FILES['configfile']['size'] > 0)
	{
		$fileName = $_FILES['configfile']['name'];
		$tmpName  = $_FILES['configfile']['tmp_name'];
		$fileSize = $_FILES['configfile']['size'];
		$fileType = $_FILES['configfile']['type'];
		
		$fileDesc = "Файл конфигурации оборудования";

		$fp      = fopen($tmpName, 'r');
		$content = fread($fp, filesize($tmpName));
		$content = addslashes($content);
		fclose($fp);

		if(!get_magic_quotes_gpc())
		{
		    $fileName = addslashes($fileName);
		}

		$query = "INSERT INTO uploads (filename, filesize, filetype, data, description, hardware_id) ".
		"VALUES ('$fileName', '$fileSize', '$fileType', '$content','$fileDesc',$hw_id)";

		mysql_query($query);
	}
}


function get_hw_files_count($id)
{
	$count = 0;
	$query = "SELECT count(*) AS filecount FROM uploads WHERE hardware_id=".$id;
	$result = mysql_query($query);
	if(  $result )
	  $count = mysql_fetch_assoc($result);
	return $count['filecount'];
}

function check_pre_action(){
	
	if(  isset($_POST['new_hardware']) ) add_new_hw(); 
	if(  isset($_POST['edit_hardware']) ) edit_hw(); 
	if(  isset($_POST['add_and_edit']) ) add_and_edit_hw();
	
}


?>
