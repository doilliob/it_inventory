//************************************
// START
//************************************

var softwareCollection = new SoftwareCollection();
var licenseCollection = new LicenseCollection();
var hardwareCollection = new HardwareCollection();
var softwareClassesCollection = new SoftwareClassesCollection();
var attachedCollection = new AttachedCollection();
var employeeCollection = new EmployeeCollection();
var orgCollection = new OrgCollection();





var initializeCollections = [ softwareCollection, 
				   			  licenseCollection, 
				   			  hardwareCollection, 
				   			  softwareClassesCollection,
				   			  attachedCollection,
				   			  employeeCollection,
				   			  orgCollection];

var Globals = { 	"software" : softwareCollection, 
	   			    "licenses" : licenseCollection, 
	   			    "hardware" : hardwareCollection, 
	   			    "classes"  : softwareClassesCollection,
	   			    "attached" : attachedCollection,
	   			    "employee" : employeeCollection,
	   			    "org"	   : orgCollection,
	   			    "tree" : null,
	   			    "hardware_id" : null };


function StartApplicationFunc() {
	console.log("Attention");
	orgCollection.each(function(elem){
		console.log(elem.toJSON());
	});
	

	var template = getTemplate('inventory/templates/panel.html');
	$('#software').html(template({
		"col":10,
		"header": "Инвентаризация аппаратного и программного обеспечения",
		"body": "",
		"footer": ""
	}));
	
	var panelNavigation = '<button type="button" id="addHardware" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span> | Добавить устройство</button>';
	panelNavigation += 	'  &nbsp;<input type=text width="100px" id="SearchString" />&nbsp;<button type="button" id="showSearch" class="btn btn-info"><span class="glyphicon glyphicon-search"></span> | Н </button> ';
	panelNavigation += 	'  &nbsp;<input type=text width="100px" id="SearchModelString" />&nbsp;<button type="button" id="showModelSearch" class="btn btn-info"><span class="glyphicon glyphicon-search"></span> | М </button> ';
	panelNavigation += 	'  <button type="button" id="showStat"    class="btn btn-warning"><span class="glyphicon glyphicon-align-justify"></span> | Общая статистика</button>';
	panelNavigation += '  &nbsp;<button type="button" id="showMigrations" class="btn btn-success"><span class="glyphicon glyphicon-eye-open"></span> | Перемещения техники</button>';
	panelNavigation += ' <hr>';
	$('#panel-body').html(panelNavigation);
	$('#panel-body').append('<div id="TreePlace"></div>');
	Globals.tree = new TreeView();
	Globals.tree.setElement('#TreePlace')
	   .setGlobals(Globals)
	   .setCallback("showInfo")
	   .render();
	$('#addHardware').bind("click",addHardware);
	$('#showStat').bind("click",showStat);
	$('#showSearch').bind("click",showSearch);
	$('#showModelSearch').bind("click",showModelSearch);
	$('#showMigrations').bind("click",showMigrations);
};


fetchAllCollection(initializeCollections, StartApplicationFunc);


function showInfo(id) 
{
	var template = getTemplate('inventory/templates/pill.html');
	Globals.hardware_id = id;

	panel = NewWindowWithContent(template());

	var hardwareView = new HardwareView({model: Globals.hardware.get(id)});
	hardwareView.setGlobals(Globals);
	hardwareView.setElement(panel.find('#hardwareTab').find('p')).render();

	var softwareTableView = new SoftwareTableView();
	softwareTableView.setGlobals(Globals);
	softwareTableView.setElement(panel.find('#softwareTab').find('p')).render();

	var attachedView = new AttachedView();
	attachedView.setGlobals(Globals);
	attachedView.setElement(panel.find('#attachedTab').find('p')).render();

	var migrationView = new MigrationView();
	migrationView.setGlobals(Globals);
	migrationView.setElement(panel.find('#migrationTab').find('p')).render();

	panel.find('#deleteTab').click(function(){
		if(confirm("Вы действительно хотите удалить устройство?"))
		{
		  var arr = [];
		  Globals.software.each(function(elem){
		  	if( elem.get('hardware_id') == id ) {
		  		arr.push(elem);
		  	}
		  });
		  arr.forEach(function(item, i, arr) { item.destroy(); });

		  arr = [];
		  Globals.attached.each(function(elem){
		  	if( elem.get('hardware_id') == id ) {
		  		arr.push(elem);
		  	}
		  });
		  arr.forEach(function(item, i, arr) { item.destroy(); });

		  Globals.hardware.get(id).destroy();
		  CloseWindow();
		}
	});
};

function addHardware(){
	var Hardware = new HardwareModel();
	Hardware.set({'level':'Этаж 1','floor': '0'});
	Hardware.save().done(function () {
			Globals.hardware.add(Hardware);
			showInfo(Hardware.get('id'));
	});
};

function showStat(){
	var view = new GeneralStatView().setGlobals(Globals);
	panel = NewWindow(view);
};

function showSearch(){
	var str = $('#SearchString').val();
	var view = new ResultSearchView().setGlobals(Globals).setString(str);
	panel = NewWindow(view);
};

function showModelSearch(){
	var str = $('#SearchModelString').val();
	var view = new ResultModelSearchView().setGlobals(Globals).setString(str);
	panel = NewWindow(view);
};

function showMigrations(){
	var view = new AllMigrationsView().setGlobals(Globals);
	panel = NewWindow(view);
}

