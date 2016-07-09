'use strict';
angular.module('main')
	.factory('DataStore', function ($localForage, $q) {
		var generateKey = function () {
			var alphanum = ['a', 'b', 'c', 'd', 'e', 'f', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
			var key = [];
			for (var i = 0; i < 4; i++) {
				key.push('');
				for (var j = 0; j < 8; j++) {
					key[key.length - 1] += alphanum[Math.floor(Math.random() * alphanum.length)];
				}
			}
			return key.join('-');
		};
		var uniqueKey = function (keys) {
			var key;
			do {
				key = generateKey();
			} while (keys[key]);
			return key;
		};
		var $types = {};
		var DataStore = function (type) {
			if ($types[type]) {
				return $types[type].callbacks;
			}
			$types[type] = {
				keysLoaded: null,
				keys: {},
				callbacks: {
					save: function (entity) {
						var result = $q.defer();
						$types[type].keysLoaded.then(function () {
							entity = angular.copy(entity);
							entity.$type = type;
							angular.forEach(Object.keys(entity), function (property) {
								if (DataStore.Ref.isEntity(entity[property])) {
									entity[property] = DataStore.Ref(entity[property].$type, entity[property].$id);
								}
							});
							if (!angular.isString(entity.$id)) {
								entity.$id = uniqueKey($types[type].keys);
								$types[type].keys[entity.$id] = true;
							}
							$localForage.setItem(type + '-' + entity.$id, entity).then(result.resolve, result.reject);
						}, result.reject);
						return result.promise;
					},
					remove: function (entity) {
						var result = $q.defer();
						$types[type].keysLoaded.then(function () {
							if (angular.isUndefined(entity)) {
								result.reject();
								return;
							}
							if (angular.isString(entity)) {
								entity = {
									$id: entity
								};
							}
							if (!angular.isString(entity.$id)) {
								result.reject();
								return;
							}
							delete $types[type].keys[entity.$id];
							$localForage.removeItem(type + '-' + entity.$id).then(result.resolve, result.reject);
						}, result.reject);
						return result.promise;
					},
					load: function (id, cache) {
						var result = $q.defer();
						if (angular.isObject(cache) && angular.isObject(cache[type]) && angular.isDefined(cache[type][id])) {
							result.resolve(cache[type][id]);
							return result.promise;
						}
						$types[type].keysLoaded.then(function () {
							if (!angular.isString(id)) {
								result.reject();
								return;
							}
							$localForage.getItem(type + '-' + id).then(function (item) {
								if (angular.isObject(cache)) {
									cache[type] = cache[type] || {};
									cache[type][id] = item;
								}
								var dependencies = [];
								angular.forEach(Object.keys(item), function (property) {
									if (DataStore.Ref.isRef(item[property])) {
										var promise = DataStore(item[property].$ref).load(item[property].$id, cache || {});
										dependencies.push(promise);
										promise.then(function (value) {
											item[property] = value;
										});
									}
								});
								if (dependencies.length > 0) {
									$q.all(dependencies).then(function () {
										result.resolve(item);
									}, result.reject);
								} else {
									result.resolve(item);
								}
							}, result.reject);
						}, result.reject);
						return result.promise;
					},
					all: function () {
						var result = $q.defer();
						$types[type].keysLoaded.then(function () {
							var dependencies = [];
							var entities = [];
							angular.forEach(Object.keys($types[type].keys), function (id) {
								var promise = $types[type].callbacks.load(id);
								dependencies.push(promise);
								promise.then(function (entity) {
									entities.push(entity);
								});
							});
							$q.all(dependencies).then(function () {
								result.resolve(entities);
							}, result.reject);
						}, result.reject);
						return result.promise;
					},
					clear: function () {
						var promises = [];
						$types[type].callbacks.all().then(function (entities) {
							angular.forEach(entities, function (entity) {
								promises.push($types[type].callbacks.remove(entity));
							});
						});
						return $q.all(promises);
					}
				}
			};
			var loadingKeys = $q.defer();
			$types[type].keysLoaded = loadingKeys.promise;
			$localForage.keys().then(function (keys) {
				angular.forEach(keys, function (key) {
					var entityType = key.split('-')[0];
					var id = key.substring(entityType.length + 1);
					if (entityType === type) {
						$types[type].keys[id] = true;
					}
				});
				loadingKeys.resolve();
			}, loadingKeys.reject);
			return $types[type].callbacks;
		};
		DataStore.Ref = function (type, id) {
			return {
				$ref: type,
				$id: id
			};
		};
		DataStore.Ref.isRef = function (object) {
			return angular.isObject(object) && angular.isString(object.$ref) && angular.isString(object.$id);
		};
		DataStore.Ref.isEntity = function (object) {
			return angular.isObject(object) && angular.isString(object.$type) && angular.isString(object.$id);
		};
		DataStore.types = function () {
			var deferred = $q.defer();
			$localForage.keys().then(function (keys) {
				var types = [];
				angular.forEach(keys, function (key) {
					var type = key.split('-')[0];
					if (types.indexOf(type) === -1) {
						types.push(type);
					}
				});
				types.sort();
				deferred.resolve(types);
			});
			return deferred.promise;
		};
		DataStore.clear = function () {
			return $localForage.clear();
		};
		return DataStore;
	});
