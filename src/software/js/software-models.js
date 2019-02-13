//========================================
// Классы программного обеспечения
//========================================
var SoftwareClasses = Backbone.Model.extend({
	defaults: {
		id: null,
		name: 'НЕ ОПРЕДЕЛЕНО',
		picture: 'НЕ ОПРЕДЕЛЕНО'
	},
	urlRoot: 'software/rest/RESTClass.php/software_classes'
});


//========================================
// Модель, содержащая данные лицензии
//========================================
var LicenseModel = Backbone.Model.extend({
	defaults: {
		id: null,
		organization:'',
		microsoft_category: 'Applications Servers Systems',
		microsoft_family:'Windows Terminal Remote Desktop Services Server Office Professional Standard Core',
		microsoft_version:'Windows Terminal Remote Desktop Services Server Office Professional Standard Core 2003 2007 2008 2012 2016 r1 r2 Device User CAL',
		microsoft_type: 'Полная Компонент Легализация Обновление',
		microsoft_fact: 0,
		microsoft_notfull: 0,
		lic_num: '',
    	lic_name: 'Microsoft OPEN ESD License ',
    	lic_start_date: '2009-01-01',
    	lic_stop_date: '2009-01-01',
    	product_name: 'Microsoft Windows XP Home Professional SP1 SP2 SP3 Vista Home Basic Business 7 Starter Home Basic Professional 8 8.1',
    	class_id: null,
    	lic_count: 0
	},
	urlRoot: 'software/rest/RESTClass.php/software_licenses'
});


//========================================
// Модель, содержащая загруженные файлы
//========================================
var AttachedModel = Backbone.Model.extend({
	defaults: {
		id: null,
		description:'',
		filename:'',
		filesize:'',
		filetype:'',
		software_id: null
	},
	urlRoot: 'software/rest/RESTClass.php/software_uploads'
});


//========================================
// Ключи продуктов для каждой лицензии
//========================================
var LicenseKeysModel = Backbone.Model.extend({
	defaults: {
		id: null,
		license_id: null,
		product_name: 'Microsoft Windows XP Home Professional SP1 SP2 SP3 Vista Home Basic Business 7 Starter Home Basic Professional 8 8.1',
		product_key: '',
		product_activation: 0
	},
	urlRoot: 'software/rest/RESTClass.php/software_licenses_keys'
});

//========================================
// Использование лицензии
//========================================
var LicenseUseModel = Backbone.Model.extend({
	defaults: {
		id: null,
		license_id: null,
		inventory_num: '',
		description: '',
		license_count: 0
	},
	urlRoot: 'software/rest/RESTClass.php/software_licenses_use'
});
