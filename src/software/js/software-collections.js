//========================================
// Коллекция, содержащая модели 
// классов ПО
//========================================
var SoftwareClassesCollection = Backbone.Collection.extend({
	model: SoftwareClasses,
	url: 'software/rest/RESTClass.php/software_classes',
  comparator: 'name'
});

//========================================
// Коллекции, содержащие все лицензии
//========================================
var LicenseCollection = Backbone.Collection.extend({
	model: LicenseModel,
	url: 'software/rest/RESTClass.php/software_licenses',
	comparator: 'lic_num'
});

//========================================
// Коллекция, содержащая модели 
// прикрепленных файлов
//========================================
var AttachedCollection = Backbone.Collection.extend({
	model: AttachedModel,
	url: 'software/rest/RESTClass.php/software_uploads'
});

//========================================
// Коллекция, содержащая модели 
// ключей на ПО
//========================================
var LicenseKeysCollection = Backbone.Collection.extend({
	model: LicenseKeysModel,
	url: 'software/rest/RESTClass.php/software_licenses_keys'
});


//========================================
// Коллекция, содержащая модели 
// использования ПО
//========================================
var LicenseUseCollection = Backbone.Collection.extend({
	model: LicenseUseModel,
	url: 'software/rest/RESTClass.php/software_licenses_use'
});

