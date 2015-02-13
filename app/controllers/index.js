var ListViewBinder = require("ListViewBinder");

Alloy.CFG.api_url = "http://askguide.ipublisher.su:3002/api/";


var UserModel = Backbone.Model.extend({});
Alloy.Globals.User = new UserModel({
	accessToken : "NJI0luTBj1ma749o31xfubj1AG40WEiGTH4ix8fNuA1wVmh7LeJwB7Y4MMT0micz"
});


function onClick(e) {
	var model = $.collection.at(e.itemIndex);
	Ti.API.info('model', model.toJSON());
	
	/*
	var controller = Alloy.createController("someController", {
		$model: m
	});
	*/
}

$.collection = Alloy.createCollection("Point");
$.binder = new ListViewBinder({
    listview : $.list,
    section : $.section,
    collection : $.collection,
    useSetItems: true,
    pull : $.ptr,
});
$.binder.bind();

$.collection.initialize({
	limit: 10
});
$.collection.reload();


$.index.open();
