/**
 * aQuery - A simpler query system.
 *
 *  aQuery aims to provide a similar workflow and query system to
 *  the popular jQuery, without the added bloat. An aQuery object
 *  simply harnesses query selectors, a simple wrapper object,
 *  and a hi-jacked default DOM prototype to make its magic happen.
 */
var A, aQuery, aQueryInit;

A = aQuery = (aQueryInit = function (base) {
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

  // Mirror base type prototype
  , aproto = aQueryResult.prototype
  , obj = base
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

        // Store results and return
        this.$ = results;
        return this;
      };
    });
  }

  // Add prop() prototype
  aproto.prop = function(dotPath, value) {
    // Setup results
    var results = [];

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

      // Retrieving?
      if (!value) {
        // Retrieve
        results.push(obj[segments[seglen]]);
      } else {
        // Assign value
        results.push(obj[segments[seglen]] = value);
      }
    }

    this.$ = results;
    return this;
  };

  // Add at() prototype
  //  This method is not meant for daisy chaining.
  aproto.at = function(num) {
    num = parseInt(num);
    return this.collection[num];
  };

  // Create aQuery function
  var aQuery = function(query) {
    // Get the prototype?
    if (arguments.length === 0) {
      return aQueryResult.prototype;
    }

    // Re-base aQuery?
    if (typeof query === 'function') {
      return aQueryInit(query);
    }

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
})(HTMLElement);
