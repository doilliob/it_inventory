//************************************
// START
//************************************

var licenseCollection = new LicenseCollection();
var softwareClassesCollection = new SoftwareClassesCollection();
var attachedCollection = new AttachedCollection();
var licenseKeysCollection = new LicenseKeysCollection();
var licenseUseCollection = new LicenseUseCollection();


// Автоматическая загрузка коллекций перед стартом приложения
var initializeCollections = [ licenseCollection, 
				   			  softwareClassesCollection,
				   			  attachedCollection,
				   			  licenseKeysCollection,
				   			  licenseUseCollection ];


var Globals = { 	"software_licenses" : licenseCollection, 
					"software_licenses_keys": licenseKeysCollection, 
					"software_licenses_use": licenseUseCollection,
	   			    "software_classes"  : softwareClassesCollection,
	   			    "software_attached" : attachedCollection,
	   			    "selected" : { "organization": null, "license": null, "product": null},
	   			    "selected_class" : { "organization": null, "class": null, "product": null},
	   			    "tree" : null,
	   			    "view_by_license": { "view": true }
	   			};


function StartApplicationFunc() {
	
	var template = getTemplate('software/templates/panel.html');
	$('#software').html(template({
		"col":10,
		"header": "Инвентаризация программного обеспечения",
		"body": "<div id='TreePlace'></div>",
		"footer": ""
	}));

	// Добавить лицензию
	var panelNavigation = '<button type="button" id="addLicense" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span> | Добавить лицензию</button>';
	panelNavigation += ' <button type="button" id="changeView" class="btn btn-warning"><span class="glyphicon glyphicon-ok"></span> | Изменить вид</button>';

	//panelNavigation += 	'  <button type="button" id="showStat"    class="btn btn-warning"><span class="glyphicon glyphicon-align-justify"></span> | Общая статистика</button>';
	//panelNavigation += 	'  &nbsp;<input type=text width="100px" id="SearchString" />&nbsp;<button type="button" id="showSearch" class="btn btn-info"><span class="glyphicon glyphicon-search"></span> | Поиск по номеру </button> ';
	//panelNavigation += '  &nbsp;<button type="button" id="showMigrations" class="btn btn-success"><span class="glyphicon glyphicon-eye-open"></span> | Перемещения техники</button>';
	panelNavigation += ' <hr>';
	$('#panel-body').html(panelNavigation);
	$('#panel-body').append('<div id="TreePlace"></div>');


	Globals.tree = new SoftwareTreeView();
	Globals.tree.setElement('#TreePlace');
	Globals.tree.setGlobals(Globals);
	Globals.tree.setCallback('showInfo');
	Globals.tree.render();	

	// Привязка событий к панели навигации
	$('#addLicense').bind("click",addLicense);
	$('#changeView').bind("click",changeView);

};

function changeView()
{
	Globals.view_by_license.view = !Globals.view_by_license.view;
	Globals.tree.render();	
}

fetchAllCollection(initializeCollections, StartApplicationFunc);
