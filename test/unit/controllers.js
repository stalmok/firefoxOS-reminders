'use strict';

describe('Controller: RemindersListController', function () {

  // load the controller's module
  beforeEach(module('remindersApp'));

  var ctrl,
    scope,
    reminder = {
      id:1,
      text: 'abc',
      date: '1995-12-17',
      time: '03:24'
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    ctrl = $controller('RemindersListController', {
      $scope: scope
    });

  }));

  it('should init and attach current reminder to the scope', function () {
    expect(scope.reminder).toEqual({});
  });

  it('should init and attach reminders to the scope', function () {
    expect(scope.reminders).toEqual({});
  });

  it('prepareReminders(reminders) should populate reminders object with properly structured data', function () {
    ctrl.prepareReminders([
      {id:1, date: new Date("1995-12-17T03:24:00"), respectTimezone: 'honorTimezone', data:{text: 'abc'}}
    ]);

    expect(scope.reminders).toEqual({1: reminder});
  });

  it('setCurrent(id) should populate reminder object from reminders by id', function () {
    scope.reminders = {
      1: reminder
    };

    scope.setCurrent(1);

    expect(scope.reminder).toEqual(reminder);
  });

  it('unsetCurrent() should reset reminder object', function () {
    scope.reminder = reminder;

    scope.unsetCurrent();

    expect(scope.reminder).toEqual({});
  });

  it('initSnooze(id, text) should set current reminder even if reminder is not in scope.reminders', function () {
    scope.reminders = {
      1: reminder
    };
    scope.initSnooze(1);
    expect(scope.reminder).toEqual(reminder);

    spyOn(ctrl, 'addTempReminder');

    scope.initSnooze(3, 'abc');

    expect(ctrl.addTempReminder).toHaveBeenCalled();
  });

  it('displayError(error) should call window.alert(error)', function () {
    spyOn(window, 'alert');

    ctrl.displayError('abc');

    expect(window.alert).toHaveBeenCalledWith('abc');
  });

  it('addTempReminder(id, text) should add reminder to scope.reminders', function () {
    ctrl.addTempReminder(3, 'abc');
    expect(scope.reminders[3]).toEqual({id: 3, text: 'abc'});
  });

  it('add(reminder) should call Alarm.add with proper attributes', inject(function (Alarm) {
    spyOn(Alarm, 'add').andCallThrough();

    scope.add(reminder);

    expect(Alarm.add).toHaveBeenCalledWith(
      new Date(reminder.date + 'T' + reminder.time),
      'ignoreTimezone',
      {text: reminder.text}
    );
  }));

  it('update(reminder) should delete and add reminder', inject(function (Alarm) {
    spyOn(Alarm, 'remove');
    spyOn(scope, 'add');

    scope.update(reminder);

    expect(Alarm.remove).toHaveBeenCalledWith(reminder.id);
    expect(scope.add).toHaveBeenCalledWith(reminder);
  }));

  it('empty() should return true if scope.reminders is empty, false otherwise', function () {
    expect(scope.empty()).toBe(true);

    scope.reminders[reminder.id] = reminder;
    expect(scope.empty()).toBe(false);
  });
});
