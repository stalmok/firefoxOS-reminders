'use strict';

//var remindersApp =
angular.module('remindersApp', [
  'ngTouch',

  'remindersControllers',
  'remindersServices',
  'remindersFilters',
  'remindersDirectives'
]);

// it's time to notify user
navigator.mozSetMessageHandler('alarm', function (alarm) {
  var text = alarm.data.text;
  var notification = new Notification('Don\'t forget:', {body: text});

  notification.onclick = function () {
    var request = window.navigator.mozApps.getSelf();
    request.onsuccess = function() {
      // launch app and show snooze modal
      // where user can snooze/remove/edit reminder
      request.result.launch();

      var scope = angular.element(document.querySelector('body')).scope();

      scope.initSnooze(alarm.id, text);

      notification.close();
    };
  };
});
