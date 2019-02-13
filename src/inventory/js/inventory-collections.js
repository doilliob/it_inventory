//========================================
// Коллекции, содержащие все лицензии
//========================================
var LicenseCollection = Backbone.Collection.extend({
	model: licenseModel,
	url: 'inventory/bconnectors/licenses.php'
});



//========================================
// Коллекция, содержащая все оборудование
//========================================
var HardwareCollection = Backbone.Collection.extend({
	model: HardwareModel,
	url: 'inventory/bconnectors/hardwares.php'
});


//========================================
// Коллекция, содержащая модели ПО
//========================================
var SoftwareCollection = Backbone.Collection.extend({
	model: SoftwareModel,
	url: 'inventory/bconnectors/softwares.php'
});

//========================================
// Коллекция, содержащая модели 
// прикрепленных файлов
//========================================
var AttachedCollection = Backbone.Collection.extend({
	model: AttachedModel,
	url: 'inventory/bconnectors/attacheds.php'
});

//========================================
// Коллекция, содержащая модели 
// работников
//========================================
var EmployeeCollection = Backbone.Collection.extend({
	model: EmployeeModel,
	url: 'inventory/bconnectors/employees.php',
	comparator: 'name'
});

//========================================
// Коллекция, содержащая модели 
// классов ПО
//========================================
var SoftwareClassesCollection = Backbone.Collection.extend({
	model: SoftwareClasses,
	url: 'inventory/bconnectors/classes.php',
	comparator: 'name'
});

//========================================
// Коллекция, содержащая модели 
// организаций
//========================================
var OrgCollection = Backbone.Collection.extend({
	model: OrgModel,
	url: 'inventory/bconnectors/organisations.php/collection',
	comparator: 'id'
});

//========================================
// Коллекция, содержащая модели 
// миграций
//========================================
var MigrationCollection = Backbone.Collection.extend({
	model: MigrationModel,
	url: 'inventory/bconnectors/migrations.php',
	comparator: 'migration_date'
});