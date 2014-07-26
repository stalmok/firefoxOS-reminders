'use strict';

var remindersDirectives = angular.module('remindersDirectives', []);

remindersDirectives.directive('reminderTime', function($interval) {

  return function link(scope, element, attrs) {
    var format = 'llll',  // date format
        stopTime; // so that we can cancel the time updates

    // used to update the UI
    function updateTime() {
      element.text(getMoment().format(format) + ' (' + getMoment().fromNow() + ')');
    }

    function getMoment() {
      return moment(attrs.date + ' ' + attrs.time);
    }

    // show text immediately
    updateTime();

    // moment.fromNow can change every minute
    stopTime = $interval(updateTime, 60000);

    // listen on DOM destroy (removal) event, and cancel the next UI update
    // to prevent updating time ofter the DOM element was removed.
    element.bind('$destroy', function() {
      $interval.cancel(stopTime);
    });
  };

});