var Alloy = require("alloy");

exports.definition = {
	config : {
		adapter : {
			type : "properties",
		},
		api_url : Alloy.CFG.api_url,
		method_name : "Points",
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, require("LoopBack").Model);
		_.extend(Model.prototype, {
			translate : function() {
				var o = this.toJSON();
				//Ti.API.info('o=', o)
				var r = {
					title: {
						text: o.name
					},
					
					value: {
						text: o.id
					},
					
					properties : {
						accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
					}
					
				};
				return r;
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, require("LoopBack").Collection);
		_.extend(Collection.prototype, {
			
		});

		return Collection;
	}
}; 