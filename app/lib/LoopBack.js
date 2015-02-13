module.exports.Model = {
	save : function(cb) {
		var self = this;
		var url = this.config.api_url + this.config.method_name;
		if (this.get("id")) {
			url += "/update?where=" + Ti.Network.encodeURIComponent(JSON.stringify({
				id : this.get("id")
			}));
			_send({
				type : "POST",
				data : self.toJSON(),
				url : url,
				callback : function(data) {
					if (data.error) {
						console.log(JSON.stringify(data));
						cb && cb(data.error, data.result);
					} else {
						cb && cb(null, data.result);
					}
				}
			});
		} else {
			_send({
				type : "POST",
				data : self.toJSON(),
				url : url,
				callback : function(data) {
					if (data.error) {
						console.log(JSON.stringify(data));
						cb && cb(data.error, data.result);
					} else {
						self.set(data.result);
						cb && cb(null, data.result);
					}

				}
			});
		}
	},
	remove : function(cb, id) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/" + (id || this.get("id"));
		_send({
			type : "DELETE",
			data : self.toJSON(),
			url : url,
			callback : function(data) {
				if (data.error) {
					console.log(JSON.stringify(data));
					cb && cb(data.error, data.result);
				} else {
					cb && cb(null, data.result);
				}
			}
		});
	},
	relationRemove : function(relation, relId, cb) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + ( relId ? "/" + relId : "");
		_send({
			type : "DELETE",
			url : url,
			callback : function(data) {
				if (data.error) {
					cb && cb(data.error, data.result);
				} else {
					cb && cb(null, data.result);
				}
			}
		});
	},
	relationCount : function(relation, cb) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + "/count";
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.result) {
					cb(null, data.result.count);
				} else {
					cb(data.error);
				}
			}
		});
	},
	relationCreate : function(relation, data, cb) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation;
		_send({
			type : "POST",
			url : url,
			data : JSON.stringify(data),
			callback : function(data) {
				if (data.result) {
					cb(null, data.result);
				} else {
					cb(data.error);
				}
			}
		});
	},
	relationFind : function(relation, cb, filter) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + (filter ? "?filter=" + Ti.Network.encodeURIComponent(JSON.stringify(filter)) : "");
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.error) {
					cb && cb(data.error, data.result);
				} else {
					cb && cb(null, data.result);
				}
			}
		});
	},
	relationLink : function(relation, relId, cb, data) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + "/rel/" + relId;
		var sendParams = {
			type : "PUT",
			url : url,
			callback : function(data) {
				if (data.error) {
					cb && cb(data.error, data.result);
				} else {
					cb && cb(null, data.result);
				}
			}
		};
		if (_.isObject(data)) {
			sendParams.data = JSON.stringify(data);
		}
		_send(sendParams);
	},
	relationUnlink : function(relation, relId, cb) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/" + this.get("id") + "/" + relation + "/rel/" + relId;
		_send({
			type : "DELETE",
			url : url,
			callback : function(data) {
				if (data.error) {
					cb && cb(data.error, data.result);
				} else {
					cb && cb(null, data.result);
				}
			}
		});
	},
	isNewRecord : function() {
	},
	updateAttribute : function(name, value, cb) {
		this.set(name, value);
		this.save(cb);
	},
	updateAttributes : function(data, cb) {
		this.set(data.result);
		this.save(cb);
	},
	reload : function(cb, id, include) {
		var self = this;
		var filter = {
			where : {
				id : id || this.get("id")
			},
			limit : 1
		};
		if (include) {
			filter.include = include;
		}
		var url = this.config.api_url + (this.config.modelReplacements && this.config.modelReplacements.find ? this.config.modelReplacements.find : this.config.method_name) + "?filter=" + JSON.stringify(filter);
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.result) {
					self.set(_.first(data.result));
					if (_.isFunction(cb)) {
						cb(null, _.first(data.result));
					}
				} else if (data.error) {
					if (_.isFunction(cb)) {
						cb(data.error);
					}
				}
			}
		});

	},
	setId : function(val) {
	},
	getIdName : function() {
		return this.idAttribute;
	},
	querie : function(method, params, cb) {
		var url = this.config.api_url + this.config.method_name + "/" + this.id + "/" + method;
		url += "?filter=" + JSON.stringify(params);
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.result) {
					cb(data.result);
				} else {
					cb(null);
				}
			}
		});

	}
};

module.exports.Collection = {
	create : function(data, cb) {
		var url = this.config.api_url + this.config.method_name;
		_send({
			type : "POST",
			data : data,
			url : url,
			callback : function(data) {
				cb(data);
			}
		});
	},
	upsert : function(data, cb) {
		var url = this.config.api_url + this.config.method_name;
		_send({
			type : "PUT",
			data : data,
			url : url,
			callback : function(data) {
				cb(data.result);
			}
		});
	},
	updateOrCreate : function(data, cb) {
		this.upsert(data.result, callback);
	},
	findOrCreate : function(query, data, cb) {
		var self = this;
		this.findOne(query, function(obj) {
			if (obj) {
				cb(obj);
			} else {
				self.create(data.result, cb);
			}
		});
	},
	exists : function(id, cb) {
		var url = this.config.api_url + this.config.method_name + "/" + id + "/exists";
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.result) {
					if (_.isFunction(cb)) {
						cb(null, data.result && data.result.exists, data.result);
					}
				} else if (data.error) {
					if (_.isFunction(cb)) {
						cb(data.error, data);
					}
				}
			}
		});
	},
	findById : function(id, cb) {
		var url = this.config.api_url + this.config.method_name + "/" + id;
		_send({
			type : "GET",
			url : url,
			callback : cb
		});
	},
	find : function(params, cb) {
		this.customFind(this.config.modelReplacements && this.config.modelReplacements.find ? this.config.modelReplacements.find : this.config.method_name, params, cb);
	},

	findIdMethod : function(id, method, params, cb) {
		var prefix = id + "/" + method;
		this.customFind(prefix, params, cb);
	},
	findOne : function(params, cb) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/findOne";
		if (cb) {
			url += "?filter=" + Ti.Network.encodeURIComponent(JSON.stringify(params));
		} else {
			cb = arguments[0];
		}
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.result) {
					var newCollection = new self.constructor();
					newCollection.add(data.result);
					cb(newCollection.at(0));
				} else {
					cb(null);
				}
			}
		});
	},
	count : function(where, cb) {
		var self = this;
		var url = this.config.api_url + this.config.method_name + "/count";
		if (cb) {
			url = url + "?where=" + Ti.Network.encodeURIComponent(JSON.stringify(where));
		} else {
			cb = arguments[0];
		}
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.result) {
					cb(null, data.result.count);
				} else {
					cb(data.error);
				}
			}
		});
	},
	customFind : function(prefix, params, cb) {
		var self = this;
		var url = this.config.api_url + prefix;
		if (cb) {
			url += "?filter=" + Ti.Network.encodeURIComponent(JSON.stringify(params));
		} else {
			cb = arguments[0];
		}
		_send({
			type : "GET",
			url : url,
			callback : function(data) {
				if (data.result) {
					var newCollection = new self.constructor();
					newCollection.reset(data.result);
					cb(newCollection);
				} else {
					cb(null);
				}
			}
		});
	},
	initialize : function(info) {
		info = info || {};
		this.limit = info.limit || "all";
		this.offset = 0;
		this._filter = info;
	},
	loadMore : function() {
		var self = this;
		this.offset = this.length;
		this._filter.offset = this.offset;
		this.find(this._filter, function(collection) {
			if (!collection) {
				self.trigger("error_loading");
				return;
			}
			if (_.isFunction(self.beforeReset)) {
				self.beforeReset(collection);
			}
			self.add(collection.toJSON());
			if (collection.length == self.limit) {
				self.trigger("loadmore");
			} else {
				self.trigger("all_loaded");
			}
		});
	},
	reload : function() {
		var self = this;
		this.offset = 0;
		this._filter.offset = this.offset;
		this.find(this._filter, function(collection) {
			if (!collection) {
				self.trigger("error_loading");
				return;
			}
			if (_.isFunction(self.beforeReset)) {
				self.beforeReset(collection);
			}
			self.reset(collection.toJSON());

			if (self.limit != "all" && collection.models.length == self.limit) {
				self.trigger("loadmore");
			} else if (collection.models.length && (self.limit == "all" || collection.models.length < self.limit)) {
				self.trigger("all_loaded");
			} else if (!collection.models.length) {
				self.trigger("collection_empty");
			}
		});
	},
	fromFilter : function(filter) {
		var self = this;
		var pluck = filter[this.config.where_alias];
		if (pluck) {
			this.find({
				where : {
					id : pluck
				}
			}, function(collection) {
				if (collection) {
					self.reset(collection.toJSON());
				}
			});
		}
	}
};

var errorDialogIsShow = false;
function _send(info) {
	var xhr = Ti.Network.createHTTPClient({
		//timeout: 3000,
		onload : function() {
			if (this.responseText) {
				Ti.API.info("status:", this.status);
				Ti.API.debug("this.responseText:", this.responseText);
				var resp = {};
				try {
					var data = JSON.parse(this.responseText);
					resp.status = this.status || 200;
					resp.result = data;
				} catch(e) {
					Ti.API.error('failed to parse JSON:', e.message);
					resp.status = 500;
					resp.error = L("error_" + resp.status);
				} finally {
					info.callback(resp);
				}

			} else {
				info.callback({
					status : this.status || 200,
					result : {}
				});
			}
		},
		onerror : function(e) {
			Ti.API.info("onerror status:", this.status);
			Ti.API.debug("responseText: ", this.responseText);
			var resp = {};
			var errorData = {};
			try {
				errorData = JSON.parse(this.responseText);
				resp = {
					status : this.status,
					error : L("error_" + this.status)
				};
			} catch(e) {
				Ti.API.error('failed to parse JSON:', e.message);
				resp = {
					status : this.status == 0 ? 0 : 500,
					error : L("error_" + resp.status)
				};
				errorData.error = {
					message : this.status == 0 ? L("check_vpn") : e.message
				};
			} finally {
				Ti.API.info('IGNORE ERROR', info.ignoreError)
				if (!errorDialogIsShow && !info.ignoreError && (resp.status == 0 || resp.status == 500 || (!info.ignore401 && (Ti.App.id == Alloy.CFG.bundleId.dev || Ti.App.id == Alloy.CFG.bundleId.local)))) {
					errorDialogIsShow = true;
					var dialog = Ti.UI.createAlertDialog({
						persistent : true,
						ok : 'Закрыть',
						title : L("error_" + this.status),
						message : errorData.error.message  +"\n\n" + url
					});

					dialog.addEventListener("click", function(e) {
						errorDialogIsShow = false;
					});

					dialog.show();
				}

				info.callback(resp);
			}
		}
	});
	if (info.data) {
		Ti.API.debug(' >>> data:', info.data);
		Ti.API.info(' >>> data.stringified:', JSON.stringify(info.data));
	}
	var at = Alloy.Globals && Alloy.Globals.User ? Alloy.Globals.User.get("accessToken") : null;
	var url = info.url;
	xhr.open(info.type, url);
	if (at) {
		xhr.setRequestHeader('Authorization', at);
	}
	Ti.API.info('>>> url:', Ti.Network.decodeURIComponent(url));
	xhr.send(info.data);
}

module.exports.send = _send;
