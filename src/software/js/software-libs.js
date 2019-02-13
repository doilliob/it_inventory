//*****************************************************
// ENGINE
//*****************************************************
var WindowsStack = [];
var CurrentWindow = null;


function CloseWindow() 
{
  if( WindowsStack.length == 0) {
  	CurrentWindow.modal("hide");
  	CurrentWindow.unbind();
	CurrentWindow.remove();
  	CurrentWindow = null;
  	return;
  }
  CurrentWindow = WindowsStack.pop();
  CurrentWindow.modal("show");
  CurrentWindow.on('hidden.bs.modal', function () {
		CurrentWindow.unbind();
		CurrentWindow.remove();
		CloseWindow();
  });
};

function NewWindow(view)
{
	var template = getTemplate('software/templates/modal_panel.html'); 
	var panel = $(template());

	if(CurrentWindow != null)
	{
		WindowsStack.push(CurrentWindow);
		CurrentWindow.unbind('hidden.bs.modal');
		CurrentWindow.modal("hide");
	} 
	CurrentWindow = panel;
	panel.modal("show");
	view.setElement(panel.find('#Content')).render();
	panel.on('hidden.bs.modal', function () {
		panel.remove();
		CloseWindow();
  	});
};

function NewWindowWithContent(content)
{
	var panel = $(content);

	if(CurrentWindow != null)
	{
		WindowsStack.push(CurrentWindow);
		CurrentWindow.unbind('hidden.bs.modal');
		CurrentWindow.modal("hide");
	} 
	CurrentWindow = panel;
	panel.modal("show");
	panel.on('hidden.bs.modal', function () {
		panel.remove();
		CloseWindow();
  	});
  	return panel;
};

function fetchAllCollection(collections, initFun)
{
	if( collections.length == 0) {
		initFun();
		return;
	}
	var Collection = collections.pop();
	Collection.fetch().done(function (){
		return fetchAllCollection(collections, initFun);
	});
};
//*********************************************************

//========================================
// Функция присылающая темплейт из файла
//========================================
function getTemplate(filename)
{
	var tmpl;
	$.ajax({
	    url: filename,
	    async:false,
	    success: function(data){
	      tmpl = _.template(data);
	    }
	});
	return tmpl;
};
