'use strict';

var remindersControllers = angular.module('remindersControllers', []);

remindersControllers.controller('RemindersListController', ['$scope', 'Alarm',
  function RemindersListController($scope, Alarm) {
    var that = this,
        config = {
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm'
        };

    // current reminder
    $scope.reminder = {};

    // load existing reminders from Alarm API
    $scope.reminders = {};

    $scope.initSnooze = function (id, text) {
      // if App was closed when alarm went off then reminder won't
      // be loaded into our $scope.reminders.
      // let's add it manualy so it could be edited
      if ( ! $scope.reminders[id]) {
        that.addTempReminder(id, text);
      }

      $scope.setCurrent(id);
      $scope.openModal('snooze-reminder');
    };

    // create "searchable" reminders object (by id)
    // seperate date object into date/time
    // so we could work with forms easier
    this.prepareReminders = function (reminders) {
      reminders.forEach(function (reminder) {
        var date = moment(reminder.date);
        $scope.reminders[reminder.id] = {
          id: reminder.id,
          text: reminder.data.text,
          date: date.format(config.dateFormat),
          time: date.format(config.timeFormat),
        };
      });
    };

    this.displayError = function (error) {
      window.alert(error);
    };

    this.addTempReminder = function (id, text) {
      $scope.reminders[id] = {
        id: id,
        text: text
      };
    };

    $scope.setCurrent = function (id) {
      $scope.reminder = $scope.reminders[id];
    };

    $scope.unsetCurrent = function () {
      $scope.reminder = {};
    };

    $scope.add = function(reminder) {
      // save reminder
      Alarm.add(getDate(reminder), 'ignoreTimezone', {text: reminder.text})
        .then(function (reminderId) {
          // attach id, we'll need it when removing/editing reminder
          reminder.id = reminderId;

          $scope.reminders[reminder.id] = angular.copy(reminder);

          $scope.unsetCurrent();

        }, this.displayError);
    };

    $scope.update = function (reminder) {
      // Alarm API doesn't have the ability to update alarms
      // therefore we need to delete/add
      Alarm.remove(reminder.id);

      delete $scope.reminders[reminder.id];

      $scope.add(reminder);
    };

    $scope.done = function () {
      $scope.delete();
    };

    $scope.delete = function () {
      var id = $scope.reminder.id;
      Alarm.remove(id);

      delete $scope.reminders[id];

      $scope.unsetCurrent();
    };

    $scope.snooze = function (min) {
      var newDate = moment().add('minutes', min);

      $scope.reminder.date = newDate.format(config.dateFormat);
      $scope.reminder.time = newDate.format(config.timeFormat);
      $scope.update($scope.reminder);

      $scope.closeModal('snooze-reminder');
    };

    $scope.empty = function () {
      var count = 0;
      angular.forEach($scope.reminders, function() {
        count++;
      });
      return !count;
    };

    $scope.closeModal = function (id) {
      angular.element(document.querySelector('#' + id)).removeClass('active');
    };
    $scope.openModal = function (id) {
      angular.element(document.querySelector('#' + id)).addClass('active');
    };

    var getDate = function (reminder) {
      return getMoment(reminder).toDate();
    };

    // construct moment object from reminder's date/time properties
    var getMoment = function (reminder) {
      return moment(reminder.date + 'T' + reminder.time);
    };

    // kick things off
    Alarm.getAll().then(this.prepareReminders, this.displayError);
  }
]);
