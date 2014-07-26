'use strict';

var remindersServices = angular.module('remindersServices', []);

remindersServices.factory('Alarm', ['$q', function ($q) {

  return {
    getAll: function() {
      var deferred = $q.defer();

      var request = navigator.mozAlarms.getAll();
      request.onsuccess = function () {
        deferred.resolve(this.result);
      };

      request.onerror = function () {
        deferred.reject(this.error.name);
      };

      return deferred.promise;
    },

    add: function (date, respectTimezone, data) {
      var deferred = $q.defer();

      var request = navigator.mozAlarms.add(date, respectTimezone, data);
      request.onsuccess = function () {
        deferred.resolve(this.result);
      };

      request.onerror = function () {
        deferred.reject(this.error.name);
      };

      return deferred.promise;
    },

    remove: function (id) {
      navigator.mozAlarms.remove(id);
    }
  };

}]);