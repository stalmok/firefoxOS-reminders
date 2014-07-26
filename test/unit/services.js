'use strict';

describe('Reminders services', function() {

  // load modules
  beforeEach(module('remindersApp'));

  // Test service availability
  it('check the existence of Alarm service', inject(function(Alarm) {
      expect(Alarm).toBeDefined();
    })
  );

  it('Alarm service should have getAll, add and remove methods defined', inject(function(Alarm) {
      expect(Alarm.getAll).toBeDefined();
      expect(Alarm.add).toBeDefined();
      expect(Alarm.remove).toBeDefined();
    })
  );

  it('getAll and add methods of Alarm service should return promises', inject(function(Alarm) {
      var promise = Alarm.getAll();
      expect(promise.then).toBeDefined();

      promise = Alarm.add();
      expect(promise.then).toBeDefined();
    })
  );

  it('Alarm.getAll should call navigator.mozAlarms.getAll', inject(function(Alarm) {
      spyOn(navigator.mozAlarms, 'getAll').andCallThrough();

      Alarm.getAll();
      expect(navigator.mozAlarms.getAll).toHaveBeenCalled();
    })
  );

  it('Alarm.add should call navigator.mozAlarms.add', inject(function(Alarm) {
      spyOn(navigator.mozAlarms, 'add').andCallThrough();

      Alarm.add();
      expect(navigator.mozAlarms.add).toHaveBeenCalled();
    })
  );

  it('Alarm.remove should call navigator.mozAlarms.remove', inject(function(Alarm) {
      spyOn(navigator.mozAlarms, 'remove').andCallThrough();

      Alarm.remove();
      expect(navigator.mozAlarms.remove).toHaveBeenCalled();
    })
  );
});