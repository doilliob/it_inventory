/******************************************************************************************************
* В БД содержатся записи о продуктах программного обеспечения.
* Несколько продуктов могут иметь один номер лицензии.
*
*
******************************************************************************************************/


//========================================
// КОНФИГУРАЦИЯ
//========================================
var CompanyName = 'ОРГАНИЗАЦИЯ';
var CompanyOrganizations = ['Главный корпус', '2 корпус','3 корпус'];
var ApplicationPath = 'software';


//========================================
// Вид, содержащий информацию о ПО
//========================================
var LicenseView = Backbone.View.extend({
	model: LicenseModel,
	subTemplate: null,
	globalsCollections: null,
	subClassesCollection: null,
	
	initialize: function () {
		this.subTemplate = getTemplate(ApplicationPath + '/templates/licenses.html');
		this.model.on("change", this.render, this);
	},

	setGlobals: function (collections) {
		this.globalsCollections = collections;
		this.subClassesCollection = collections.software_classes;
	},

	render: function () {
		var data = {
					'organization':  this.model.get('organization'),
					'microsoft_category': this.model.get('microsoft_category'),
					'microsoft_family': this.model.get('microsoft_family'),
					'microsoft_version': this.model.get('microsoft_version'),
					'microsoft_type': this.model.get('microsoft_type'),
					'microsoft_fact': this.model.get('microsoft_fact'),
					'microsoft_notfull': this.model.get('microsoft_notfull'),
					'lic_num': this.model.get('lic_num'),
			    	'lic_name': this.model.get('lic_name'),
			    	'lic_start_date': this.model.get('lic_start_date'),
			    	'lic_stop_date': this.model.get('lic_stop_date'),
			    	'product_name': this.model.get('product_name'),
			    	'class_id': this.model.get('class_id'),
			    	'lic_count': this.model.get('lic_count'), 
					'classes': [],
					'organizations': CompanyOrganizations
				};

		this.subClassesCollection.each(function(elem) {
			data.classes.push(elem.toJSON());
		});
		
		this.$el.html(this.subTemplate(data));
		return this;
	},

	events: {
		//"change .hwinfo" : "saveModel"
		"click #SaveInfo" : "saveModel"
	},
    
	saveModel: function () {
		var data = {
			'organization':  this.$('#organization').val(),
			'microsoft_category': this.$('#microsoft_category').val(),
			'microsoft_family': this.$('#microsoft_family').val(),
			'microsoft_version': this.$('#microsoft_version').val(),
			'microsoft_type': this.$('#microsoft_type').val(),
			'microsoft_fact': this.$('#microsoft_fact').val(),
			'microsoft_notfull': this.$('#microsoft_notfull').val(),
			'lic_num': this.$('#lic_num').val(),
	    	'lic_name': this.$('#lic_name').val(),
	    	'lic_start_date': this.$('#lic_start_date').val(),
	    	'lic_stop_date': this.$('#lic_stop_date').val(),
	    	'product_name': this.$('#product_name').val(),
	    	'class_id': this.$('#class_id').val(),
	    	'lic_count': this.$('#lic_count').val()
		};
	
		
		this.model.set(data);
		this.model.save();
 	    // Для сохранения состояния дерева
		saveTreeState(this.model);
		this.globalsCollections.software_licenses.add(this.model);
		this.globalsCollections.software_licenses.trigger('add');
		CloseWindow();
	}
});

//========================================
// Вид, содержащий прикрепленные файлы
//========================================
var AttachedView = Backbone.View.extend({
	subTemplate: null,
	attachedCollection:null,
	modalPanelTemplate:null,
	software_id: null,

	initialize: function () {
		this.subTemplate = getTemplate(ApplicationPath + '/templates/panel.html');
		this.modalPanelTemplate = getTemplate(ApplicationPath + '/templates/modal_panel.html');
	},

	setGlobals: function (collection) {
		this.attachedCollection = collection.software_attached;
		this.attachedCollection.on("change", this.render,this);
		this.software_id = this.model.get('id');
	},

	render: function () {
		this.$el.empty();
		this.$el.append('\
					<div width=100%>\
				    	<hr>\
						<form id="AddFilesForm" method="POST" action="' + ApplicationPath + '/upload.php" enctype="multipart/form-data">\
						    <input type=hidden name="software_id" value="' + this.software_id + '">\
						    <input type=file name="upload_file"><br>\
							<input type=submit class="btn btn-success" value="Загрузить" name="UploadFile" id="UploadSubmit">\
						</form>\
					</div>\
					<hr>\
				');

		for( var i = 0; i < attachedCollection.length; i++)
			if (attachedCollection.at(i).get('software_id') == this.software_id) {
				var elem = attachedCollection.at(i);
				var col = 3;
				var footer = elem.get('filename').substring(0,15);
				var header = '';
				var href = '';
				
				if( (elem.get('filetype').split('/'))[0] == 'image' )
				{
					href += '<img class="attachedImage" id="' + elem.get('id') 
					+'" src="' + ApplicationPath + '/getfile.php?id=' + elem.get('id') + '&small=yes&" >';
				}else{
					href += '<a target="_blank" href="' + ApplicationPath + '/getfile.php?id=' + elem.get('id') +'&">';
					href += '<img src="' + ApplicationPath + '/img/file.png" width=150 height=150>';
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
			<a target="_blank" href="' + ApplicationPath + '/getfile.php?id=' + id +'&"> \
			  <img id="' + id +'" src="' + ApplicationPath + '/getfile.php?id=' + id + '&" width=100%> \
			</a>\
			';
		var panel = NewWindowWithContent(this.modalPanelTemplate());
		panel.find('#Content').html(html);
	}
});


//=======================================
// Дерево просмотра лицензий
//=======================================
var SoftwareTreeView  = Backbone.View.extend({
	softwareLicensesCollection: null,
	softwareClassesCollection: null,
	softwareLicenseUseCollection: null,
	softwareSelected: null,
	softwareSelectedClass: null,
	localCallback: null,
	viewByLicense: true,

	initialize: function () {},

	setGlobals: function (collections) {
		this.softwareLicensesCollection = collections.software_licenses;
		this.softwareLicensesCollection.on("change", this.render, this);
		this.softwareLicensesCollection.on("add", this.render, this);
		this.softwareLicensesCollection.on("remove", this.render, this);
		this.softwareLicenseUseCollection = collections.software_licenses_use;
		this.softwareLicenseUseCollection.on("change", this.render, this);
		this.softwareLicenseUseCollection.on("add", this.render, this);
		this.softwareLicenseUseCollection.on("remove", this.render, this);
		this.softwareClassesCollection =  collections.software_classes;
		this.softwareSelected = collections.selected;
		this.softwareSelectedClass = collections.selected_class;
		this.viewByLicense = collections.view_by_license;
		return this;
	},

	setCallback: function (Callback) {
		this.localCallback = Callback;
		return this;
	},

	//======================================
	// Отображение по продуктам
	//======================================
	renderByProduct: function() {
		// Имя функции просмотра элемента
		var localCallback = this.localCallback;
		// Коллекция лицензий
		var softwareLicensesCollection = this.softwareLicensesCollection;
		// Коллекция типов
		var softwareClassesCollection = this.softwareClassesCollection;
		// Параметры сохраненного состояния дерева
		var softwareSelectedClass = this.softwareSelectedClass;
		// Использование лицензии
		var softwareLicenseUseCollection = this.softwareLicenseUseCollection;

		
		// Узлы дерева
		var data = [];
		// Добавляем верхний узел 
		data[0] = 
			{ "id" : "smkNode", 
			  "parent" : "#", 
			  "text" : ' ' + CompanyName + ' ', 
			  "icon" : ApplicationPath + '/img/building24.png',
			  "state" : {"opened" : true} };
		
    	
    	//=================================================
    	//  ОРГАНИЗАЦИИ
    	//=================================================
    	var org_num = 0;
    	CompanyOrganizations.forEach(function(organization){
    		var org_id = 'org' + org_num;
    		// Добавляем ветку организации
    		data[data.length] = 
    		{
				  "id" : org_id, 
				  "parent" : "smkNode", 
				  "text" : organization,
				  "icon" : ApplicationPath + "/img/building24.png",
				  "state" : {"opened" : true} 
			};
			//=================================================
	    	// КЛАССЫ ПО
	    	//=================================================
			// Делаем массив с классами ПО в данной организации
			var software_classes = {};
			softwareLicensesCollection.each(function(license){
				if(license.get('organization') == organization)
				{
					var class_id = license.get('class_id');
					var software_class = softwareClassesCollection.get( class_id );
					software_classes[ class_id ] = { 'id': software_class.get('id'), 'name': software_class.get('name'), 'picture': software_class.get('picture') };				
				}
			});

      // Сортируем id классов относительно имени класса
      software_classes_ids = Object.keys(software_classes).sort(function(a,b){
        aa = software_classes[a];
        bb = software_classes[b];
        if (aa.name > bb.name) return 1;
        if (aa.name < bb.name) return -1;
        return 0;
      });
			// Проходим по каждому классу
      software_classes_ids.forEach(function(software_classes_id){
				software_class = software_classes[software_classes_id];
				var class_id = org_id + 'class' + software_class.id;
				var node_name = software_class.name;
				var class_pic = (software_class.picture == null) ? ApplicationPath + "/img/software.png" : software_class.picture;

				var state =  {"opened": ((softwareSelectedClass.class == software_class.id) && (organization == softwareSelectedClass.organization)) ? true : false };

				// Добавляем класс
				data[data.length] = 
	    		{
					  "id" : class_id, 
					  "parent" : org_id, 
					  "text" : node_name,
					  "icon" : class_pic,
					  "state" : state
				};


				// Для каждого продукта данной организации данного класса
				softwareLicensesCollection.each(function(license){
					if( (license.get('organization') == organization) && (license.get('class_id') == software_class.id))
					{
						// Подсчет использований
						var lic_use = 0;
						var use_license_id = license.get('id');
						softwareLicenseUseCollection.each(function(pc){
							if(pc.get('license_id') == use_license_id)
								lic_use += (pc.get('license_count')/1);
						}); //--/--

						var lic_id = class_id + 'lic' + license.get('id');
						
						var date_now = new Date();
						var date_stop_lic = new Date(license.get('lic_stop_date'));
						var lic_stop_date = license.get('lic_stop_date');
						var product_name = (date_stop_lic < date_now) ? '<strike>' + license.get('product_name') + ' (' + license.get('microsoft_type') + ') ' + '</strike>' : license.get('product_name') + ' (' + license.get('microsoft_type') + ') ';

						var lic_node_name = '[' + license.get('lic_num') + '] ' + product_name + ' ' + ' [<font color=red>' + lic_use + '</font><font color=green>/' + (license.get('lic_count') - lic_use)
    					+ '</font>] (' + lic_stop_date + ') <img src="' + ApplicationPath + '/img/software_edit.png" onclick="javascript:' + localCallback + '(' + license.get('id') + ');" />';

    					var state =  {"selected": (softwareSelectedClass.product == license.get('id')) ? true : false };
						// Добавляем продукт
						data[data.length] = 
			    		{
							  "id" : lic_id, 
							  "parent" : class_id, 
							  "text" : lic_node_name,
							  "icon" : class_pic,
							  "state" : state
						};
						//=================================================
		    			//  СВОЙСТВА ПРОДУКТА
		    			//=================================================
		    			var prod_prop_count = 0;
		    			var product_id = lic_id;
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : lic_id, 
						  "text" : '<strong> Категория (Microsoft): </strong>' + license.get('microsoft_category'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Семейство (Microsoft): </strong>' + license.get('microsoft_family'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Версия (Microsoft): </strong>' + license.get('microsoft_version'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Тип (Microsoft): </strong>' + license.get('microsoft_type'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Фактическое количество (Microsoft): </strong>  <font color=blue>' + license.get('microsoft_fact'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Неполные лицензии (Microsoft): </strong>  <font color=blue>' + license.get('microsoft_notfull'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Количество лицензий всего: </strong> <font color=blue>' + license.get('lic_count'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> <font color=red> Потрачено: ' + lic_use + '</font> / <font color=green> Осталось: ' + (license.get('lic_count') - lic_use) + ' </font> </strong>', 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						//===========================================================


					}
				}); //softwareLicensesCollection.each
			}); //software_classes.for

    		// Счетчик оганизаций
    		org_num = org_num + 1;

    	}); // CompanyOrganizations.forEach
		 
		 this.$el.jstree({ 'core' : { 'data' : data }  });
		 this.$el.jstree('destroy');
		 this.$el.jstree({ 'core' : { 'data' : data }  });
		 return this;
	},

	//======================================
	// Отображение по номерам лицензий
	//======================================
	renderByLicenses: function() {
		// Имя функции просмотра элемента
		var localCallback = this.localCallback;
		// Коллекция лицензий
		var softwareLicensesCollection = this.softwareLicensesCollection;
		// Параметры сохраненного состояния дерева
		var softwareSelected = this.softwareSelected;
		// Коллекция использования лицензий
		var softwareLicenseUseCollection = this.softwareLicenseUseCollection;

		// Делаем массив с классами ПО
		var software_classes = {};
		this.softwareClassesCollection.each(function(soft_class){
			software_classes[soft_class.get('id')] = { 'name': soft_class.get('name'), 'picture': soft_class.get('picture') };
		});

		// Узлы дерева
		var data = [];
		// Добавляем верхний узел 
		data[0] = 
			{ "id" : "smkNode", 
			  "parent" : "#", 
			  "text" : ' ' + CompanyName + ' ', 
			  "icon" : ApplicationPath + '/img/building24.png',
			  "state" : {"opened" : true} };
		
    	
    	//=================================================
    	//  ОРГАНИЗАЦИИ
    	//=================================================
    	var org_num = 0;
    	CompanyOrganizations.forEach(function(organization){
    		var org_id = 'org' + org_num;
    		// Добавляем ветку организации
    		data[data.length] = 
    		{
				  "id" : org_id, 
				  "parent" : "smkNode", 
				  "text" : organization,
				  "icon" : ApplicationPath + "/img/building24.png",
				  "state" : {"opened" : true} 
			};
			//Собираем номера лицензий в данной организации
			var licenseNumCollection = {};
			softwareLicensesCollection.each(function(license){
    			if(license.get('organization') == organization)
    				licenseNumCollection[license.get('lic_num')] = 1;
    		});
    		//=================================================
	    	//  ЛИЦЕНЗИИ
	    	//=================================================
    		// Для каждой найденной лицензии создаем подраздел дерева
    		for(var licNum in licenseNumCollection)
    		{
    			var state =  {"opened": ((softwareSelected.license == licNum) && (organization == softwareSelected.organization)) ? true : false };
    			// Добавляем узел
    			var lic_id = org_id + '_lic_' + licNum;
    			data[data.length] = 
	    		{
					  "id" : lic_id, 
					  "parent" : org_id, 
					  "text" : licNum,
					  "icon" : ApplicationPath + "/img/software_box.png",
					  "state" : state
				};	
				//=================================================
		    	//  ПРОДУКТЫ
		    	//=================================================
				// Для каждой лицензии ищем продукты
    			softwareLicensesCollection.each(function(license){
    				if(license.get('lic_num') == licNum)
    				{

				    	var lic_use = 0;
						var use_license_id = license.get('id');
						softwareLicenseUseCollection.each(function(pc){
							if(pc.get('license_id') == use_license_id)
								lic_use += (pc.get('license_count')/1);
						});

						var date_now = new Date();
						var date_stop_lic = new Date(license.get('lic_stop_date'));
						var product_name = (date_stop_lic < date_now) ? '<strike>' + license.get('product_name') + ' (' + license.get('microsoft_type') + ') ' +  '</strike>' : license.get('product_name')+ ' (' + license.get('microsoft_type') + ') ' ;

				    	var product_id = 'prod' + license.get('id');
    					var lic_count = license.get('lic_count');
    					var class_name = software_classes[license.get('class_id')].name;
    					var class_pic =  software_classes[license.get('class_id')].picture;
					var lic_stop_date = license.get('lic_stop_date');
    					class_pic = (class_pic == null) ? ApplicationPath + '/img/software.png' : class_pic;

    					state = ( softwareSelected.product == license.get('id') ) ? {"opened": false, "selected": true} : {"opened": false};
    					var node_name = product_name + ' [<font color=red>' + lic_use + '</font><font color=green>/' + (license.get('lic_count') - lic_use)
    					+ '</font>] (' + lic_stop_date + ') <img src="' + ApplicationPath + '/img/software_edit.png" onclick="javascript:' + localCallback + '(' + license.get('id') + ');" />';

    					//=================================================
		    			//  ПРОДУКТ
		    			//=================================================
    					data[data.length] = 
						{ 
						  "id" : product_id, 
						  "parent" : lic_id, 
						  "text" : node_name, 
						  "icon" : class_pic,
						  "state" : state
						  //"li_attr" : {"onclick" : "javascript:" + localCallback + "(" + license.get('id') + ");"}
						};
						//=================================================
		    			//  СВОЙСТВА ПРОДУКТА
		    			//=================================================
		    			var prod_prop_count = 0;
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Категория (Microsoft): </strong>' + license.get('microsoft_category'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Семейство (Microsoft): </strong>' + license.get('microsoft_family'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Версия (Microsoft): </strong>' + license.get('microsoft_version'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Тип (Microsoft): </strong>' + license.get('microsoft_type'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Фактическое количество (Microsoft): </strong>  <font color=blue>' + license.get('microsoft_fact'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Неполные лицензии (Microsoft): </strong>  <font color=blue>' + license.get('microsoft_notfull'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> Количество лицензий всего: </strong> <font color=blue>' + license.get('lic_count'), 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						data[data.length] = 
						{ 
						  "id" : product_id + prod_prop_count++, 
						  "parent" : product_id, 
						  "text" : '<strong> <font color=red> Потрачено: ' + lic_use + '</font> / <font color=green> Осталось: ' + (license.get('lic_count') - lic_use) + ' </font> </strong>', 
						  "icon" : ApplicationPath + '/img/software_info.png',
						  "state" : {"opened" : false} 
						};
						//===========================================================
    				}
    			});
    		}
    		// Счетчик оганизаций
    		org_num = org_num + 1;
    	}); // CompanyOrganizations.forEach
		 
		 this.$el.jstree({ 'core' : { 'data' : data }  });
		 this.$el.jstree('destroy');
		 this.$el.jstree({ 'core' : { 'data' : data }  });
		 return this;
	},

	render: function () {
		if(this.viewByLicense.view)
			this.renderByLicenses();
		else
			this.renderByProduct();
		return this;
	}
});
//=====================================================================

//=====================================================================
// Функция просмотра свойств продукта
//=====================================================================
function showInfo(id) 
{

	// Отрисовка панельки
	var template = getTemplate(ApplicationPath + '/templates/pill.html');
	panel = NewWindowWithContent(template());

	// Получение модели
	var lmodel = Globals.software_licenses.get(id);
	
	// Для сохранения состояния дерева
	saveTreeState(lmodel);

	// Отрисовка продукта
	var licenseView = new LicenseView({model: lmodel});
	licenseView.setGlobals(Globals);
	licenseView.setElement(panel.find('#softwareTab').find('p')).render();

	var licenseKeysView = new LicenseKeysView({model: lmodel});
	licenseKeysView.setGlobals(Globals);
	licenseKeysView.setElement(panel.find('#keysTab').find('p')).render();

	var licenseUseView = new LicenseUseView({model: lmodel});
	licenseUseView.setGlobals(Globals);
	licenseUseView.setElement(panel.find('#computersTab').find('p')).render();

	var attachedView = new AttachedView({model: lmodel});
	attachedView.setGlobals(Globals);
	attachedView.setElement(panel.find('#attachedTab').find('p')).render();


	panel.find('#deleteTab').click(function(){
		if(confirm("Вы действительно хотите удалить продукт?"))
		{
		  // Удаление прикрепленных файлов
		  Globals.software_attached.each(function(attach){
		  	if(attach.get('software_id') == lmodel.get('id'))
		  		attach.destroy();
		  });

		  // Удаление ключей
		  Globals.software_licenses_keys.each(function(key){
		  	if(key.get('license_id') == lmodel.get('id'))
		  		key.destroy();
		  });

		  // Для сохранения состояния дерева
		  saveTreeState(lmodel);

		  // Удаление лицензии
		  lmodel.destroy();
		  CloseWindow();
		}
	});
};

//=====================================================================
// Функция добавления лицензии
//=====================================================================
function addLicense()
{
	
	// Отрисовка панельки
	var template = getTemplate(ApplicationPath + '/templates/pill.html');
	panel = NewWindowWithContent(template());

	// Получение модели
	var lmodel = new LicenseModel();
	
	// Отрисовка продукта
	var LView = new LicenseView({model: lmodel});
	LView.setGlobals(Globals);
	LView.setElement(panel.find('#softwareTab').find('p')).render();

	panel.find('#attachedTab').hide();
	panel.find('#deleteTab').hide();

};

//=====================================================================
// Функция сохранение состояния дерева
//=====================================================================
function saveTreeState(model)
{
	// Для сохранения состояния дерева
	Globals.selected.product = model.get('id');
	Globals.selected.organization = model.get('organization');
	Globals.selected.license = model.get('lic_num');
	Globals.selected_class.organization = model.get('organization');
	Globals.selected_class.class = model.get('class_id');
	Globals.selected_class.product = model.get('id');
};


//=======================================
// Просмотр ключей для лицензии
//=======================================
var LicenseKeysView  = Backbone.View.extend({
	softwareLicenseKeysCollection: null,
	subTemplate: null,

	initialize: function () {
		this.subTemplate = getTemplate(ApplicationPath + '/templates/software_licenses_keys.html');
	},

	setGlobals: function (collections) {
		this.softwareLicenseKeysCollection = collections.software_licenses_keys;
		this.softwareLicenseKeysCollection.on("change", this.render, this);
		this.softwareLicenseKeysCollection.on("add", this.render, this);
		this.softwareLicenseKeysCollection.on("remove", this.render, this);
		return this;
	},

	events: {
		'click #addKey' : 'addKey',
		'click .deleteKey' : 'deleteKey',
		'click .saveKey' : 'saveKey'
	},

	addKey: function() {
		var key = new LicenseKeysModel();
		key.set({'license_id' : this.model.get('id')});
		key.save();
		this.softwareLicenseKeysCollection.add(key);
	},

	deleteKey: function(event){
		var id = event.target.attributes.id.value;
		if(confirm("Вы действительно хотите удалить ключ?"))
		{
			var key = this.softwareLicenseKeysCollection.get(id);
			this.softwareLicenseKeysCollection.remove(id);
			key.destroy();
		}
	},

	saveKey: function(event){
		var id = event.target.attributes.id.value;
		var key = this.softwareLicenseKeysCollection.get(id);
		
		key.set({
			'product_name' : this.$el.find('#product_name_' + id).val(),
			'product_key' : this.$el.find('#product_key_' + id).val(),
			'product_activation' : this.$el.find('#product_activation_' + id).val()
		});

		key.save();
	},

	render: function() {
		var license_id = this.model.get('id');
		var model = this.model;
		var subTemplate = this.subTemplate;
		var el = this.$el;
		var deleteKey = this.deleteKey;

		el.html('');
		el.append('<div class="row"> ');
		el.append('    <div class="col-md-5">Наименование продукта</div> ');
		el.append('    <div class="col-md-3">Ключ продукта</div> ');
		el.append('    <div class="col-md-2">Число активаций</div> ');
		el.append('    <div class="col-md-2">Операции</div> ');
		el.append('</div> ');
		this.softwareLicenseKeysCollection.each(function(key){
			if(key.get('license_id') == license_id)
			{
				var data = {
					'id': key.get('id'),
					'product_name': key.get('product_name'),
					'product_key': key.get('product_key'),
					'product_activation': key.get('product_activation')
				};
				el.append(subTemplate(data));
			}
		});
		el.append('<hr>');
		el.append('<button class="btn btn-success" id="addKey">Добавить</button>');
		return this;
	}
});

//=======================================
// Просмотр использований лицензии
//=======================================
var LicenseUseView  = Backbone.View.extend({
	softwareLicenseUseCollection: null,
	subTemplate: null,

	initialize: function () {
		this.subTemplate = getTemplate(ApplicationPath + '/templates/software_licenses_use.html');
	},

	setGlobals: function (collections) {
		this.softwareLicenseUseCollection = collections.software_licenses_use;
		this.softwareLicenseUseCollection.on("change", this.render, this);
		this.softwareLicenseUseCollection.on("add", this.render, this);
		this.softwareLicenseUseCollection.on("remove", this.render, this);
		return this;
	},

	events: {
		'click #addPC' : 'addPC',
		'click .deletePC' : 'deletePC',
		'click .savePC' : 'savePC'
	},

	addPC: function() {
		var pc = new LicenseUseModel();
		pc.set({'license_id' : this.model.get('id')});
		pc.save();
		this.softwareLicenseUseCollection.add(pc);
	},

	deletePC: function(event){
		var id = event.target.attributes.id.value;
		if(confirm("Вы действительно хотите удалить компьютер?"))
		{
			var pc = this.softwareLicenseUseCollection.get(id);
			this.softwareLicenseUseCollection.remove(id);
			pc.destroy();
		}
	},

	savePC: function(event){
		var id = event.target.attributes.id.value;
		var pc = this.softwareLicenseUseCollection.get(id);
		
		pc.set({
			'inventory_num' : this.$el.find('#inventory_num_' + id).val(),
			'description' : this.$el.find('#description_' + id).val(),
			'license_count' : this.$el.find('#license_count_' + id).val()
		});

		pc.save();
	},

	render: function() {
		var license_id = this.model.get('id');
		var model = this.model;
		var subTemplate = this.subTemplate;
		var el = this.$el;

		el.html('');
		el.append('<div class="row"> ');
		el.append('    <div class="col-md-5">Инвентарный номер</div> ');
		el.append('    <div class="col-md-3">Описание</div> ');
		el.append('    <div class="col-md-2">Число активаций</div> ');
		el.append('    <div class="col-md-2">Операции</div> ');
		el.append('</div> ');
		this.softwareLicenseUseCollection.each(function(pc){
			if(pc.get('license_id') == license_id)
			{
				var data = {
					'id': pc.get('id'),
					'inventory_num': pc.get('inventory_num'),
					'description': pc.get('description'),
					'license_count': pc.get('license_count')
				};
				el.append(subTemplate(data));
			}
		});
		el.append('<hr>');
		el.append('<button class="btn btn-success" id="addPC">Добавить компьютер</button>');
		return this;
	}
});
