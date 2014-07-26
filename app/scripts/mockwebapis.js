'use strict';

function log (method, args) {
  args = Array.prototype.slice.call(args);
  console.log('WebAPIs Mock: calling navigator.' + method + '(' + args.join(', ') + ')');
}

if ( ! navigator.mozAlarms) {
  navigator.mozAlarms = {
    getAll: function () {
      log('mozAlarms.getAll', arguments);

      var response = {
        result: [],
        onsuccess:function () {},
        onerror:function () {}
      };

      window.setTimeout(function(){
        response.result = [
          {id:10, date: new Date().setHours(17), respectTimezone: 'honorTimezone', data:{text: 'def'}},
          {id:11, date: new Date().setHours(18), respectTimezone: 'honorTimezone', data:{text: 'abc'}},
          {id:12, date: new Date(), respectTimezone: 'honorTimezone', data:{text: 'ghj'}}
        ];
        response.onsuccess(response.result);
      }, 10);

      return response;
    },
    add: function () {
      log('mozAlarms.add', arguments);

      // mock onsuccess
      window.setTimeout(function(){
        response.result = 10;
        response.onsuccess({
          target: {
            result: 10
          }
        });
      }, 10);

      var response = {
        onsuccess:function () {},
        onerror:function () {}
      };
      return response;
    },
    remove: function () {
      log('mozAlarms.remove', arguments);
    },
  };
}

if ( ! navigator.mozSetMessageHandler) {
  navigator.mozSetMessageHandler = function () {
    log('mozSetMessageHandler', arguments);
  };
}
