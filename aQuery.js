/**
 * aQuery - A simpler query system.
 *
 *  aQuery aims to provide a similar workflow and query system to
 *  the popular jQuery, without the added bloat. An aQuery object
 *  simply harnesses query selectors, a simple wrapper object,
 *  and a hi-jacked default DOM prototype to make its magic happen.
 */
var aQuery, A;
A = aQuery = (function () {
  'use strict';

  // Store slice
  var slice = [].slice

  // Create query result class
  , aQueryResult = function(arr) {
    // Sanity check
    if (arr === undefined
        || arr === null
        || !(Array.isArray(arr) || arr instanceof NodeList)) {
      this.collection = [];
    } else {
      this.collection = arr;
    }

    // Store length
    this.length = this.collection.length;
  }

  // Mirror HTMLElement prototype
  , aproto = aQueryResult.prototype
  , obj = HTMLElement
  , proto = obj.prototype;

  // Traverse prototype hierarchy
  for (;
      proto !== undefined;
      proto = (obj = Object.getPrototypeOf(obj)).prototype) {
    // Iterate prototype elements
    Object.keys(proto).forEach(function(key) {
      // Scope-ify the function itself
      var fn = proto[key];

      // Is it an actual prototype function?
      if (!proto.hasOwnProperty(key) || typeof fn !== 'function') {
        return;
      }

      // Wrap with array-version of method
      aproto[key] = function() {
        // Make args an actual array and prepare a results array
        var args = slice.call(arguments)
        , results = [];

        // Iterate collection of elements
        for (var i = 0, len = this.collection.length; i < len; i++) {
          results.push(fn.apply(this.collection[i], args));
        };

        return results;
      };
    });
  }

  // Add attr() prototype
  aproto.attr = function(dotPath, value) {
    // Iterate collection
    for(var i = 0, len = this.collection.length; i < len; i++) {
      // Get object
      var item = this.collection[i]

      // Resolve dotpath
      , obj = item
      , segments = dotPath.split('.')
      , seglen = segments.length - 1;
      for(var j = 0;
          j < seglen;
          obj = obj[segments[j++]]) {
        var jj = j + 1;
        obj[segments[jj]] = obj[segments[jj]] || {};
      }

      // Assign value
      obj[segments[seglen]] = value;
    }
  };

  // Add at() prototype
  aproto.at = function(num) {
    num = parseInt(num);
    return this.collection[num];
  };

  // Create aQuery function
  var aQuery = function(query) {
    var collection;

    // Sanity check
    if (typeof query !== 'string' || query.trim() === '') {
      collection = [];
    } else {
      collection = document.querySelectorAll(query);
    }

    // Return new query result
    return new aQueryResult(collection);
  }

  return aQuery;
})();
