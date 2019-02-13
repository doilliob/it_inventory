
//========================================
// Вид информации о ПО
//========================================
var SoftwareView = Backbone.View.extend({
	subTemplate: null,
	subClassesCollection: null,
	subLicenseCollection: null,
	subSoftwareCollection:null,
	globalsCollections: null,

	setGlobals: function (collections) {
		this.globalsCollections = collections;
		this.subClassesCollection = collections.classes;
		this.subLicenseCollection = collections.licenses;
		this.subSoftwareCollection = collections.software;
		return this;
	},

	initialize: function () {
		this.subTemplate = getTemplate('inventory/templates/soft_info.html');
		this.model.on("change", this.render, this);
	},

	render: function () {
		var model = { class_id: this.model.get('class_id'),
        			  hardware_id: this.model.get('hardware_id'),
        			  name: this.model.get('name'), 
        			  serial: this.model.get('serial'),
        			  license_id: this.model.get('license_id'),
        			  classes: [],
        			  licenses: [] };

		var classes = this.subClassesCollection;
		var class_id = this.model.get('class_id');
		model.classes.push({"id":0, "name": "НЕ ОПРЕДЕЛЕН"});
		classes.each(function (element){
			model.classes.push({"id":element.get("id"), "name": element.get("name")});
		});

		
		model.licenses.push({"id":0, "lic_num" : "", "product_name": "НЕ ОПРЕДЕЛЕНО" });
		this.subLicenseCollection.each( function (elem) {
			model.licenses.push({"id": elem.get('id'), "lic_num": elem.get('lic_num'), "product_name": elem.get('product_name')});
		});
		this.$el.html( this.subTemplate(model));
		return this;
	},

	events: {
		"click #removeSoftware" : "removeSoftware",
		"change #name": "saveModel",
		"change #serial": "saveModel",
		"change #class_id": "saveModel",
		"change #license_id" : "saveModel",
		"click #chooseLicense": "chooseLicense"
	},

	removeSoftware: function () {
		if(confirm('Удалить данное ПО?'))
		{
			 this.subSoftwareCollection.remove(this.model);
		     this.model.destroy();
		     this.subSoftwareCollection.trigger("change");
		     CurrentWindow.modal("hide");
		}  
	},

	saveModel: function () {
		this.model.set({"name": this.$('#name').val()});
		this.model.set({"serial": this.$('#serial').val()});
		this.model.set({"class_id": this.$('#class_id').val()});
		this.model.set({"license_id": this.$('#license_id').val()});
		this.model.save();
	},

	chooseLicense: function () {
		var view = new LicenseTableView({model: this.model});
		view.setGlobals(this.globalsCollections);
		NewWindow(view);
	}


});


//========================================
// Вид добавить ПО
//========================================
var SoftwareAddView = Backbone.View.extend({
	subTemplate: null,
	subClassesCollection: null,
	subLicenseCollection: null,
	subSoftwareCollection:null,
	globalsCollections: null,
	hardware_id: null,

	setGlobals: function (collections) {
		this.globalsCollections = collections;
		this.hardware_id = collections.hardware_id;
		this.model.set({"hardware_id": this.hardware_id});
		this.subClassesCollection = collections.classes;
		this.subLicenseCollection = collections.licenses;
		this.subSoftwareCollection = collections.software;
		this.model.on("change", this.render, this);

		return this;
	},

	initialize: function () {
		this.model = new SoftwareModel();
		this.subTemplate = getTemplate('inventory/templates/soft_add.html');
	},

	render: function () {
		var mdl =    { class_id: this.model.get('class_id'),
        			  hardware_id: this.model.get('hardware_id'),
        			  name: this.model.get('name'), 
        			  serial: this.model.get('serial'),
        			  license_id: this.model.get('license_id'),
        			  classes: [],
        			  licenses: [] };

		var classes = this.subClassesCollection;
		var class_id = this.model.get('class_id');
		
		mdl.classes.push({"id":0, "name": "НЕ ОПРЕДЕЛЕН"});
		classes.each(function (element){
			mdl.classes.push({"id":element.get("id"), "name": element.get("name")});
		});
		
		mdl.licenses.push({"id":0, "lic_num" : "", "product_name": "НЕ ОПРЕДЕЛЕНО" });
		this.subLicenseCollection.each( function (elem) {
			mdl.licenses.push({"id": elem.get('id'), "lic_num": elem.get('lic_num'), "product_name": elem.get('product_name')});
		});
		
		this.$el.html( this.subTemplate(mdl));
		return this;
	},

	events: {
		"click #addSoftware" : "addSoftware",
		"change #name": "updateModel",
		"change #serial": "updateModel",
		"change #class_id": "updateModel",
		"change #license_id": "updateModel",
		"click #chooseLicense": "chooseLicense"
	},

	addSoftware: function () {
		this.subSoftwareCollection.add(this.model);
		this.model.save();
		this.model.trigger("change");
		var subSoftwareCollection = this.subSoftwareCollection;
		subSoftwareCollection.fetch({
			success: function () {
				subSoftwareCollection.trigger("change");
			}
		});
		
		CurrentWindow.modal("hide");
	},

	updateModel: function () {
		this.model.set({"name": this.$('#name').val()});
		this.model.set({"serial": this.$('#serial').val()});
		this.model.set({"class_id": this.$('#class_id').val()});
		this.model.set({"license_id": this.$('#license_id').val()});
	},

	chooseLicense: function () {
		var view = new LicenseTableView({model: this.model});
		view.setGlobals(this.globalsCollections);
		NewWindow(view);
	}

});

//========================================
// Вид строки таблицы
//========================================
var SoftwareTableRowView = Backbone.View.extend({
	tagName: 'tr',
	className: 'SoftTableRow',
	subTemplate: {},
	Globals: null,
	defaults: {
		numview: 0,
		licenzed: ''
	},
	setParams: function(num,lic) {
		this.numview = num;
		this.licenzed = lic;
	},
	initialize: function () {
		this.subTemplate = _.template('\
			<td><%=numview%> </td> \
			<td><%=name%></td> \
			<td><%=licenzed%></td> \
		');
		this.model.on("change", this.render,this);
		this.$el.unbind("click");
		var this_class = this;
		this.$el.on("click", function () {
			this_class.showInfo(this_class.model);
		});
	},

	setGlobals: function (collections) {
		this.Globals = collections;
		return this;
	},

	render: function () {
		var model = { "numview": this.numview,
					  "name": this.model.get('name'),
					  "licenzed": this.licenzed };
		this.$el.html(this.subTemplate(model));
		return this;
	},
	showInfo: function () {
		var softView = new SoftwareView({model: this.model});
		softView.setGlobals(this.Globals);
		NewWindow(softView);
	}
});


//========================================
// Вид, содержащий таблицу ПО
//========================================
var SoftwareTableView = Backbone.View.extend({
	subTemplate: {},
	subSoftwareCollection: null,
	globalsCollections: null,
	hardware_id: null,

	setGlobals: function (collections) {
		this.globalsCollections = collections;
		this.hardware_id = collections.hardware_id;
		this.subSoftwareCollection = collections.software;
		this.subSoftwareCollection.on("remove",this.render,this);
		this.subSoftwareCollection.on("add",this.render,this);
		this.subSoftwareCollection.on("change:license_id",this.render,this);
		return this;
	},

	initialize: function () {
		this.subTemplate = getTemplate('inventory/templates/soft_table.html');
	},

	events: {
		"click #addSoftware" : "addDialog"
	},

	render: function () {
		var this_class = this;
		this.$el.html( this.subTemplate() );

		var num = 1;
		for( var i=0; i < this.subSoftwareCollection.length; i++ )
		{
			var elem = this.subSoftwareCollection.at(i);
			if( elem.get('hardware_id') == this.hardware_id )
			{
				var view = new SoftwareTableRowView({model:elem})
				view.setParams(num++,(elem.get('license_id') == 0) ? "НЕТ" : "ЛИЦЕНЗИРОВАНО");
				view.setGlobals(this.globalsCollections);
				this.$el.find('#TableBody').append(view.render().el);
			}
		}
		return this;
	},

	addDialog: function () {
		var view = new SoftwareAddView();
		view.setGlobals(this.globalsCollections);
		NewWindow(view);
	},
});


//========================================
// Вид, содержащий прикрепленные файлы
//========================================
var AttachedView = Backbone.View.extend({
	subTemplate: null,
	globalsCollections: null,
	attachedCollection:null,
	modalPanelTemplate:null,

	initialize: function () {
		this.subTemplate = getTemplate('inventory/templates/panel.html');
		this.modalPanelTemplate = getTemplate('inventory/templates/modal_panel.html');
	},

	setGlobals: function (collection) {
		this.globalsCollections = collection;
		this.attachedCollection = collection.attached;
		this.attachedCollection.on("change", this.render,this);
	},

	render: function () {
		var hd_id = this.globalsCollections.hardware_id;
		this.$el.empty();

		this.$el.append('\
					<div width=100%>\
				    	<hr>\
						<form id="AddFilesForm" method="POST" action="inventory/upload.php" enctype="multipart/form-data">\
						    <input type=hidden name="hw_id" value="' + this.globalsCollections.hardware_id + '">\
						    <input type=file name="upload_file"><br>\
							<input type=submit class="btn btn-success" value="Загрузить" name="UploadFile" id="UploadSubmit">\
						</form>\
					</div>\
					<hr>\
				');

		for( var i = 0; i < attachedCollection.length; i++)
			if (attachedCollection.at(i).get('hardware_id') == hd_id) {
				var elem = attachedCollection.at(i);
				var col = 3;
				var footer = elem.get('filename').substring(0,15);
				var header = '';
				var href = '';
				if( (elem.get('filetype').split('/'))[0] == 'image' )
				{
					href += '<img class="attachedImage" id="' + elem.get('id') 
					+'" src="getfile.php?id=' + elem.get('id') + '&small=yes&" >';
				}else{
					href += '<a target="_blank" href="getfile.php?id=' + elem.get('id') +'&">';
					href += '<img src="img/file.png" width=150 height=150>';
					href += "</a>";
				}

				this.$el.append(this.subTemplate({
					"col": col,
					"header": header,
					"body": href,
					"footer": footer
				}));
			}



		// Привязываем загрузку файла
		var this_class = this;
		var collection = this.attachedCollection;
     	this.$el.find("#AddFilesForm").ajaxForm({
     		error: function (error) {
     			console.log("error");
     			console.log(error);
     		},
     		complete: function (response) {
     			console.log("success");
     			collection.fetch({
     				success: function()
     				{
     					collection.trigger("change");
     				}
     			});
     		}
     	});	

		return this;
	},

	events: {
		"click .attachedImage" : "showInfo"
	},

	showInfo: function (elem) {
		var id = elem.target.id;
		var html = '\
			<a target="_blank" href="getfile.php?id=' + id +'&"> \
			  <img id="' + id +'" src="getfile.php?id=' + id + '&" width=100%> \
			</a>\
			';
		var panel = NewWindowWithContent(this.modalPanelTemplate());
		panel.find('#Content').html(html);
	}
});


//========================================
// Вид, содержащий информацию аппаратную
//========================================
var HardwareView = Backbone.View.extend({
	subTemplate: null,
	globalsCollections: null,
	subEmployeeCollection: null,
	subClassesCollection: null,

	initialize: function () {
		this.subTemplate = getTemplate('inventory/templates/hardware.html');
		this.model.on("change", this.render, this);
	},

	setGlobals: function (collections) {
		this.globalsCollections = collections;
		this.subEmployeeCollection = collections.employee;;
		this.subClassesCollection = collections.classes;
	},

	render: function () {
		console.log(this.model.get('id'));
		var data = {
					'class_id': this.model.get('class_id'),
					'inventory_num': this.model.get('inventory_num'),
					'model': this.model.get('model'),
					'level': this.model.get('level'),
					'floor': this.model.get('floor'),
					'description': this.model.get('description'),
					'employee_id': this.model.get('employee_id'),
					'inventory_user': this.model.get('inventory_user'),
					'present_alarm' : this.model.get('present_alarm'),
					'classes': [],
					'employee': [],
					'levels': ['Этаж 1','Этаж 2','Этаж 3','Этаж 4','Новое здание','Ремонт','Для списания','Склад']
				};

		this.subClassesCollection.each(function(elem) {
			data.classes.push(elem.toJSON());
		});
		this.subEmployeeCollection.each(function(elem){
			data.employee.push(elem.toJSON());
		});
		
		this.$el.html(this.subTemplate(data));
		return this;
	},

	events: {
		//"change .hwinfo" : "saveModel"
		"click #SaveHardwareInfo" : "saveModel"
	},

	saveModel: function () {
		var data = {
			'class_id' : this.$('#class_id').val(),
			'inventory_num': this.$('#inventory_num').val(),
			'model': this.$('#model').val(),
			'level': this.$('#level').val(),
			'floor': this.$('#floor').val(),
			'description': this.$('#description').val(),
			'employee_id': this.$('#employee_id').val(),
			'inventory_user': this.$('#inventory_user').val(),
			'present_alarm' : (this.$('#present_alarm')[0].checked == true) ? 1 : 0
		};

		// Если не только что созданный блок		
		if( !( (this.model.get('level') == 'Этаж 1') && (this.model.get('floor') == '0') ) )
		{
			// Если ключевые значения обновлены
			if(  (this.model.get('inventory_num') != data['inventory_num']) ||
				 (this.model.get('level') != data['level']) ||
				 (this.model.get('floor') != data['floor']) ||
				 (this.model.get('employee_id') != data['employee_id']) ||
				 (this.model.get('inventory_user') != data['inventory_user'])
			  ) this.makeMigration(data);
		}


		this.model.set(data);
		this.model.save({
			error: function (elem) {
				console.log("Ошибка сохранения АО [HardwareView]");
				console.log(elem);
			}
		});
	},

	// Отслеживание перемещений данного АО
	makeMigration: function(data) {
		var migrationDate = {
			hardware_id: this.model.get('id'),
			migration_date: null,
			from_level: this.model.get('level'),
			from_floor: this.model.get('floor'),
			from_inventory_num: this.model.get('inventory_num'),
			from_employee_id: this.model.get('employee_id'),
			from_inventory_user: this.model.get('inventory_user'),
			to_level: data['level'],
			to_floor: data['floor'],
			to_inventory_num: data['inventory_num'],
			to_employee_id: data['employee_id'],
			to_inventory_user: data['inventory_user'],
		};
		var migration = new MigrationModel();
		migration.set(migrationDate);
		migration.save(
			{
				error: function(error){ console.log('ERROR');console.log(error);}
			});
		console.log(migration);
		console.log('Maked migration for hardware with id=' + this.model.get('id'));
	}


});


//=======================================
// 			КЛАСС TreeView
//=======================================
var TreeView  = Backbone.View.extend({
	HWCollection: null,
	ClassesCollection: null,
	Callback: null,
	globalCollections: null,
	employeeCollection: null,
	HWCollection: null,
	ClassesCollection:null,
	subSoftwareCollection: null,

	initialize: function () {

	},

	setGlobals: function (collections) {
		this.globalCollections = collections;
		this.HWCollection =  collections.hardware;
		this.ClassesCollection = collections.classes;
		this.subSoftwareCollection = collections.software;
		this.employeeCollection = collections.employee;
		this.HWCollection.on("change", this.render, this);
		this.HWCollection.on("add", this.render, this);
		this.HWCollection.on("remove", this.render, this);
		this.subSoftwareCollection.on("change", this.render, this);
		this.subSoftwareCollection.on("add", this.render, this);
		this.subSoftwareCollection.on("remove", this.render, this);

		return this;
	},

	setCallback: function (Callback) {
		this.Callback = Callback;
		return this;
	},

	render: function () {
		var current_item = this.HWCollection.get(this.globalCollections.hardware_id);
		var this_class = this;
		var classes = {};
		var employees = {};
		var subSoftwareCollection = this.subSoftwareCollection;
		var HWCollection = this.HWCollection;
		var levels = ['Этаж 1','Этаж 2','Этаж 3','Этаж 4','Новое здание','Ремонт','Для списания','Склад'];
		var level_dictionary = {};
		var floor_dictionary = {};
		var data = [];

		// Загрузка классов
		classes[0] = { name : "НЕ ОПРЕДЕЛЕН - НЕ ОПРЕДЕЛЕН" };
		this.ClassesCollection.each(function (elem) {
			classes[elem.get('id')] = {"name":elem.get('name'), "picture": elem.get('picture')};
		});
		// Загрузка сотрудников
		employees[0] = "НЕТ НЕТ";
		this.employeeCollection.each(function (elem) {
			employees[elem.get('id')] = elem.get('name');
		});
		// Загрузка словаря этажей
		var level_count = 1;
		levels.forEach(function (lev) {
			level_dictionary[lev] = level_count++;
		});
		// Загрузка словаря комнат
		this.HWCollection.each(function (elem) {
			floor_dictionary[elem.get('floor')] = elem.get('id');
		}); 
		
		// Добавляем верхний узел 
		data[0] = 
			{ "id" : "smkNode", 
			  "parent" : "#", 
			  "text" : ' ОРГАНИЗАЦИЯ ', 
			  "icon" : 'img/building24.png',
			  "state" : {"opened" : true} };

		levels.forEach(function (lev)
		{
			// проверка на нелицензионное ПО
			var trigger = false;
			var hw_for_level = HWCollection.where({'level': lev });
			for(var n in hw_for_level){
				if( subSoftwareCollection.where({ "hardware_id" : hw_for_level[n].get('id'), "license_id": "0" }).length > 0 ) 
			 		trigger = true;
			}//----------------------------

			data[data.length] = (current_item && (current_item.get('level') == lev )) ?
					{
					  "id" : "level" + level_dictionary[lev] , 
					  "parent" : "smkNode", 
					  "text" : lev,
					  "icon" : trigger ? "img/afolder.png" : "img/folder.png",
					  "state" : {"opened" : true} } : 
					{
					 "id" : "level" + level_dictionary[lev] , 
				  	 "parent" : "smkNode", 
				  	 "icon" : trigger ? "img/afolder.png" : "img/folder.png",
				  	 "text" : lev };	
		});
		

		var floors = [];
		this.HWCollection.each(function (elem) {
			floors[level_dictionary[elem.get('level')].toString() + floor_dictionary[elem.get('floor')].toString()] = 
				{ "level" : elem.get('level'), 
				  "floor" : elem.get('floor'),
				  "id" : level_dictionary[elem.get('level')].toString() + floor_dictionary[elem.get('floor')].toString() };
		});

		//Сортировка кабинетов
		floors.sort(function (a, b) {
		  if( /\d+/.test(a.floor) && /\d+/.test(b.floor) )
		  {
		  	if (parseInt(a.floor) > parseInt(b.floor)) return 1;
		  	if (parseInt(a.floor) < parseInt(b.floor)) return -1;	
		  	return 0;
		  }
		  if (a.floor > b.floor) return 1;
		  if (a.floor < b.floor) return -1;
		  return 0;
		});
		
		floors.forEach(function (floor) 
		{

		  // проверка на нелицензионное ПО
		  var trigger = false;
		  var hw_for_floor = HWCollection.where({ "floor": floor.floor, "level": floor.level });
		  for(var n in hw_for_floor){
		  	if(subSoftwareCollection.where({ "hardware_id" : hw_for_floor[n].get('id'), "license_id": "0" }).length > 0 ) 
		  		trigger = true;
		  }//-----------------------------


		  data[data.length] = ( current_item && (current_item.get('floor') == floor.floor) ) ?
			     { "id" : "floor" + floor.id, 
				  "parent" : "level" + level_dictionary[floor.level], 
				  "text" : "Кабинет " + floor.floor,
				  "icon" : trigger ? 'img/adoor.png' : 'img/door.png',
				  "state" : { "opened" : true }} :
				 { "id" : "floor" + floor.id, 
				  "parent" : "level" + level_dictionary[floor.level], 
				  "icon" : trigger ? 'img/adoor.png' : 'img/door.png',
				  "text" : "Кабинет " + floor.floor };
		});
			

		this.HWCollection.each(function (elem) {
			var floor_id = level_dictionary[elem.get('level')].toString() + floor_dictionary[elem.get('floor')].toString();
			var inventory_num = elem.get('inventory_num');
			var model = elem.get('model');
			var id = elem.get('id');
			var class_id = elem.get('class_id');
			var employee_user = (elem.get('employee_id') == null) ? "НЕТ" : employees[elem.get('employee_id')].split(' ')[0];
			var inventory_user = (elem.get('inventory_user') == null) ? "НЕТ" : employees[elem.get('inventory_user')].split(' ')[0];
			var owner = (inventory_user == employee_user) ? "(" + inventory_user + ")" :  "(" + employee_user + "-" + inventory_user + ")"; 
			if ( elem.get('present_alarm') == 1 ) { 
				owner = owner + " - <font color=red>ОТСУТСТВУЕТ</font>"; 
			}
			var name = (classes[class_id].name.split(' - '))[1];
			var icon = classes[class_id].picture;

			// проверка на нелицензионное ПО
			var trigger = false;
			if( subSoftwareCollection.where({"hardware_id" : id, "license_id": "0" }).length > 0)
				trigger = true;
			if( trigger ) 
			{
				var tmp = icon.split('/');
				icon = tmp[0] + '/a' + tmp[1]; 
			}
			//-------------------------------

			var tmp_elem  = ( current_item && (current_item.get('id') == id) ) ?
			{	"id" : "item" + id, 
				"parent" : "floor" + floor_id, 
				"text" : "<font color=green>" + inventory_num + "</font> " + name + " " + model + " " + owner, 
				"icon" : icon,
				"state" : { "selected" : true },
				"li_attr" : {"onclick" : "javascript:" + this_class.Callback + "(" + id + ");"}} :
			{	"id" : "item" + id, 
				"parent" : "floor" + floor_id, 
				"text" :  "<font color=green>" + inventory_num + "</font> " + name + " " + model + " " + owner, 
				"icon" : icon,
				"li_attr" : {"onclick" : "javascript:" + this_class.Callback + "(" + id + ");"}};

			data[data.length] = tmp_elem;
			//console.log(tmp_elem);
		});


		 
		 this.$el.jstree({ 'core' : { 'data' : data }  });
		 this.$el.jstree('destroy');
		 this.$el.jstree({ 'core' : { 'data' : data }  });
		return this;
	}
});
//=====================================================================

//========================================
// Вид, содержащий общую статистику
//========================================
var GeneralStatView = Backbone.View.extend({
	HWCollection: null,
	ClassesCollection: null,

	setGlobals: function (collections) {
		this.HWCollection = collections.hardware;
		this.ClassesCollection = collections.classes;	
		return this;
	},

	render: function () {
		var html = '';
		html += ' <div class="col-lg-10">  \
		             <div class="panel panel-default">  \
		               <div class="panel-heading"><h3>Общая статистика</h3></div> \
		               <div class="panel-body"> \
		';
		// Обработка
		var hws = this.HWCollection;
		this.ClassesCollection.each(function (hw_class) {
			if( hw_class.get('name').indexOf('Аппаратное обеспечение') >= 0 )
			{
				html += "<p>" + hw_class.get('name').split(' - ')[1] + " : ";
				var i = 0;
				hws.each(function(hw){
					if( hw.get('class_id') == hw_class.get('id') ) i += 1;
				});
				html += i + "</p>";
			};
		});
		// Закрытие
		html += '      </div>   \
		            </div>  \
		         <div> ';
		//Рендер
		this.$el.html( html );
	}
});

//========================================
// Вид, содержащий результаты поиска
//========================================
var ResultSearchView = Backbone.View.extend({
	HWCollection: null,
	ClassesCollection: null,
	SearchString: '',

	setGlobals: function (collections) {
		this.HWCollection = collections.hardware;
		this.ClassesCollection = collections.classes;	
		return this;
	},

	setString: function (str) {
		this.SearchString = str;
		return this;
	},

	render: function () {
		var html = '';
		html += ' <div class="col-lg-12">  \
		             <div class="panel panel-default">  \
		             <div class="panel-heading"><h3>Результат поиска</h3></div> \
		               <div class="panel-body"> \
		               <table class="table table-bordered"> \
		               	 <tr> \
		               	 	<td> Инвентарный номер </td> \
		               	 	<td> Уровень </td> \
		               	 	<td> Кабинет </td> \
							<td> Класс </td> \
		               	 	<td> Модель </td> \
		               	 	<td> Описание </td> \
		               	 </tr> \
		';
		// Обработка
		var str = this.SearchString;
		this.HWCollection.each(function (elem) {
			//console.log(elem.get('inventory_num'));
			//console.log('!!!!' + str);
			if( elem.get('inventory_num').toString().toUpperCase().indexOf(str.toString().toUpperCase()) != -1 )
			{
				html += ' <tr> \
						  <td> ' + elem.get('inventory_num') + ' </td> \
						  <td> ' + elem.get('level') + ' </td> \
						  <td> ' + elem.get('floor') + ' </td> \
						  <td> ' + Globals.classes.get(elem.get('class_id')).get('name') + ' </td> \
						  <td> ' + elem.get('model') + ' </td> \
						  <td> <textarea width="200px" readonly>' + elem.get('description') + '</textarea> </td> \
						  </tr> \
				';
			}
		});
		


		// Закрытие
		html += '       </table> \
					   </div>   \
		            </div>  \
		         <div> ';
		//Рендер
		this.$el.html( html );
	}
});


//========================================
// Вид, содержащий таблицу перемещений АО
//========================================
var MigrationView = Backbone.View.extend({
	globalsCollections: null,
	employeeCollection: null,
	current_hardware: null,
	migrations: null,

	initialize: function(){
		this.migrations = new MigrationCollection();
		this.migrations.fetch();
	},

	setGlobals: function (collections) {
		this.globalsCollections = collections;
		this.current_hardware = collections.hardware.get(collections.hardware_id);
		this.employeeCollection = collections.employee;
		this.migrations.on('add',this.render,this);
		this.migrations.on('remove',this.render,this);
		return this;
	},

	render: function () {
		// Текущее АО
		var current_item = this.current_hardware;

		// Получение списка работников
		var employees = [];
		this.employeeCollection.each(function(emp){
			employees[emp.get('id')] = emp.get('name');
		});

		// Шапка таблицы
		var html = ' <div class="col-lg-12">  \
		             <div class="panel panel-default">  \
		             <div class="panel-heading"><h3>Таблица перемещений</h3></div> \
		               <div class="panel-body"> \
		               <table class="table table-bordered"> \
		               	 <tr> \
		               	 	<td> Дата </td> \
		               	 	<td> Откуда </td> \
		               	 	<td> Куда </td> \
		               	 </tr> \
		';
		
		// Обработка *****************************************

		// Выделение цветом
		var chColor = function (elem, path, ret){
			if( elem.get('from_' + path) != elem.get('to_' + path))
				return '<font color="red">' + ret + '</font>';
			return ret;
		}
		// Добавление полей
		this.migrations.each(function (elem){
			if( elem.get('hardware_id') == current_item.get('id'))
			{
				html += '<tr>';
				html += '   <td> ' + elem.get('migration_date') + '</td>';
				html += '   <td> ';
				html +=       'Инвентарный номер: ' + elem.get('from_inventory_num') + '<br>';
				html +=       'Уровень: ' + elem.get('from_level') + '<br>';
				html +=       'Кабинет: ' + elem.get('from_floor') + '<br>';
				html +=       'Пользователь: ' + employees[elem.get('from_employee_id')] + '<br>';
				html +=       'Ответственный по ведомости: ' + employees[elem.get('from_inventory_user')] + '<br>';
				html += '   </td>';
				html += '   <td> ';
				html +=       'Инвентарный номер: ' + chColor(elem,'inventory_num',elem.get('to_inventory_num')) + '<br>';
				html +=       'Уровень: ' + chColor(elem,'level',elem.get('to_level')) + '<br>';
				html +=       'Кабинет: ' + chColor(elem,'floor',elem.get('to_floor')) + '<br>';
				html +=       'Пользователь: ' + chColor(elem,'employee_id',employees[elem.get('to_employee_id')]) + '<br>';
				html +=       'Ответственный по ведомости: ' + chColor(elem,'inventory_user',employees[elem.get('to_inventory_user')]) + '<br>';
				html += '   </td>';
				html += '</tr>';
			}
		});

		// Закрытие
		html += '       </table> \
					   </div>   \
		            </div>  \
		         <div> ';

		this.$el.html(html);
		return this;
	}
});


//========================================
// Вид, содержащий таблицу перемещений АО
//========================================
var AllMigrationsView = Backbone.View.extend({
	employeeCollection: null,
	migrations: null,

	initialize: function(){

	},

	setGlobals: function (collections) {
		this.employeeCollection = collections.employee;
		this.migrations = new MigrationCollection();
		this.migrations.fetch();
		this.migrations.on('add',this.render,this);
		this.migrations.on('remove',this.render,this);
		return this;
	},

	render: function () {

		var sortFun = function (a, b){
		  aDate = a.get('migration_date').split('-');
		  bDate = b.get('migration_date').split('-');
		  if((new Date(aDate[0],aDate[1],aDate[2])) > (new Date(bDate[0],bDate[1],bDate[2])))
		     return 1 // Или любое число, меньшее нуля
		  if((new Date(aDate[0],aDate[1],aDate[2])) < (new Date(bDate[0],bDate[1],bDate[2])))
		     return -1  // Или любое число, большее нуля
		  return 0
		};

		var allmigrations = [];
		this.migrations.each(function(elem){
			allmigrations.push(elem);
		});
		allmigrations.sort(sortFun);

		// Получение списка работников
		var employees = [];
		this.employeeCollection.each(function(emp){
			employees[emp.get('id')] = emp.get('name');
		});

        // Шапка таблицы
		var html = ' <div class="col-lg-12">  \
		             <div class="panel panel-default">  \
		             <div class="panel-heading"><h3>Таблица перемещений</h3></div> \
		               <div class="panel-body"> \
		               <table class="table table-bordered"> \
		               	 <tr> \
		               	 	<td> Дата </td> \
		               	 	<td> Откуда </td> \
		               	 	<td> Куда </td> \
		               	 </tr> \
		';
		

		// Выделение цветом
		var chColor = function (elem, path, ret){
			if( elem.get('from_' + path) != elem.get('to_' + path))
				return '<font color="red">' + ret + '</font>';
			return ret;
		}
		// Добавление полей
		allmigrations.forEach(function (elem){
				html += '<tr>';
				html += '   <td> ' + elem.get('migration_date') + '</td>';
				html += '   <td> ';
				html +=       'Инвентарный номер: ' + elem.get('from_inventory_num') + '<br>';
				html +=       'Уровень: ' + elem.get('from_level') + '<br>';
				html +=       'Кабинет: ' + elem.get('from_floor') + '<br>';
				html +=       'Пользователь: ' + employees[elem.get('from_employee_id')] + '<br>';
				html +=       'Ответственный по ведомости: ' + employees[elem.get('from_inventory_user')] + '<br>';
				html += '   </td>';
				html += '   <td> ';
				html +=       'Инвентарный номер: ' + chColor(elem,'inventory_num',elem.get('to_inventory_num')) + '<br>';
				html +=       'Уровень: ' + chColor(elem,'level',elem.get('to_level')) + '<br>';
				html +=       'Кабинет: ' + chColor(elem,'floor',elem.get('to_floor')) + '<br>';
				html +=       'Пользователь: ' + chColor(elem,'employee_id',employees[elem.get('to_employee_id')]) + '<br>';
				html +=       'Ответственный по ведомости: ' + chColor(elem,'inventory_user',employees[elem.get('to_inventory_user')]) + '<br>';
				html += '   </td>';
				html += '</tr>';
		});

		// Закрытие
		html += '       </table> \
					   </div>   \
		            </div>  \
		         <div> ';
		//Рендер
		this.$el.html( html );
	}

});


//========================================
// Вид, содержащий результаты поиска по модели
//========================================
var ResultModelSearchView = Backbone.View.extend({
	HWCollection: null,
	ClassesCollection: null,
	SearchString: '',

	setGlobals: function (collections) {
		this.HWCollection = collections.hardware;
		this.ClassesCollection = collections.classes;	
		return this;
	},

	setString: function (str) {
		this.SearchString = str;
		return this;
	},

	render: function () {
		var html = '';
		html += ' <div class="col-lg-12">  \
		             <div class="panel panel-default">  \
		             <div class="panel-heading"><h3>Результат поиска</h3></div> \
		               <div class="panel-body"> \
		               <table class="table table-bordered"> \
		               	 <tr> \
						    <td> # </td> \
		               	 	<td> Инвентарный номер </td> \
		               	 	<td> Уровень </td> \
		               	 	<td> Кабинет </td> \
							<td> Класс </td> \
		               	 	<td> Модель </td> \
		               	 	<td> Описание </td> \
		               	 </tr> \
		';
		// Обработка
		var counter = 1;
		var str = this.SearchString;
		this.HWCollection.each(function (elem) {
			//console.log(elem.get('inventory_num'));
			//console.log('!!!!' + str);
			if( elem.get('model').toString().toUpperCase().indexOf(str.toString().toUpperCase()) != -1 )
			{
				html += ' <tr> \
						  <td> ' + counter++ + '</td> \
						  <td> ' + elem.get('inventory_num') + ' </td> \
						  <td> ' + elem.get('level') + ' </td> \
						  <td> ' + elem.get('floor') + ' </td> \
						  <td> ' + Globals.classes.get(elem.get('class_id')).get('name') + ' </td> \
						  <td> ' + elem.get('model') + ' </td> \
						  <td> <textarea width="200px" readonly>' + elem.get('description') + '</textarea> </td> \
						  </tr> \
				';
				//counter = counter + 1;
			}
		});
		


		// Закрытие
		html += '       </table> \
					   </div>   \
		            </div>  \
		         <div> ';
		//Рендер
		this.$el.html( html );
	}
});