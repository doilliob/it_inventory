//========================================
// Классы программного обеспечения
//========================================
var SoftwareClasses = Backbone.Model.extend({
	defaults: {
		id: 0,
		name: 'НЕ ОПРЕДЕЛЕНО',
		picture: 'НЕ ОПРЕДЕЛЕНО'
	}
});

//========================================
// Модель, содержащая данные лицензии
//========================================
var licenseModel = Backbone.Model.extend({
	defaults: {
		lic_num: '', 
    	lic_name: 'Microsoft OPEN License ',
    	product_name: 'Microsoft Windows XP Home Professional SP1 SP2 SP3 Vista Home Basic Business 7 Starter Home Basic Professional 8 8.1',
    	class_id: null,
    	category: null,
    	lic_count: 0
	},
	urlRoot: 'inventory/bconnectors/license.php'
});

//========================================
// Модель, содержащая оборудование
//========================================
var HardwareModel = Backbone.Model.extend({
	defaults: {

		class_id: 1,
		inventory_num: '',
		model: '',
		level: 1,
		floor: '0',
		description: '',
		employee_id: 0,
		inventory_user: 0,
		present_alarm: 0
	},
	urlRoot: 'inventory/bconnectors/hardware.php'
});

//=========================================
// Модель, содержащая сотрудников
//=========================================
var EmployeeModel = Backbone.Model.extend({
	defaults: {
		name: '',
		post: ''
	}
});

//========================================
// Модель, содержащая ПО
//========================================
var SoftwareModel = Backbone.Model.extend({
	defaults: {
		class_id: 0,
        hardware_id: 0,
        name: 'Microsoft Windows XP Home Professional SP1 SP2 SP3 Vista Home Basic Business 7 Starter Home Basic Professional 8 8.1',
        serial: '',
        license_id: 0
	},
	urlRoot: 'inventory/bconnectors/software.php'
});


//========================================
// Модель, содержащая загруженные файлы
//========================================
var AttachedModel = Backbone.Model.extend({
	defaults: {
		description:'',
		filename:'',
		filesize:'',
		filetype:'',
		hardware_id:0,
		software_id:0
	},
	urlRoot: 'inventory/bconnectors/attached.php'
});


//========================================
// Модель, содержащая организации
//========================================
var OrgModel = Backbone.Model.extend({
	defaults: {
		name: ''
	},
	urlRoot: 'inventory/bconnectors/organisations.php'
});

//========================================
// Модель, содержащая миграции техники
//========================================
var MigrationModel = Backbone.Model.extend({
	defaults: {
		hardware_id: null,
		migration_date: null,
		from_level: '',
		from_floor: '',
		from_inventory_num: '',
		from_employee_id: '',
		from_inventory_user: '',
		to_level: '',
		to_floor: '',
		to_inventory_num: '',
		to_employee_id: null,
		to_inventory_user: null,
	},
	urlRoot: 'inventory/bconnectors/migration.php'
});