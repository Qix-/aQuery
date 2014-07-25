'use strict';
/**
 * aQuery - A simpler query system.
 *
 *  aQuery aims to provide a similar workflow and query system to
 *  the popular jQuery, without the added bloat. An aQuery object
 *  simply harnesses query selectors, a simple wrapper object,
 *  and a hi-jacked default DOM prototype to make its magic happen.
 */

var aQuery = (function() {
  // Store slice
  var _slice = [].slice

  // Create query result class
  , aQueryResult = function(arr) {
    this.collection = arr;
  }

  // Mirror HTMLElement prototype
  , aproto = aQueryResult.prototype
  , obj = HTMLElement;
  for(var proto = obj.prototype;
      proto !== undefined;
      proto = (obj = Object.getPrototypeOf(obj)).prototype) {
    Object.keys(proto).forEach(function(key) {
      // Scope'd
      var fn = proto[key];

      // Is it an actual prototype function?
      if (!proto.hasOwnProperty(key) || typeof fn !== 'function') {
        return;
      }

      // Wrap
      aproto[key] = function() {
        var args = _slice.call(arguments);
        var results = [];
        for(var i = 0, len = this.collection.length; i < len; i++) {
          results.push(fn.apply(this.collection[i], args));
        };
        return results;
      };
    });
  }
})();
