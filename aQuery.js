/**
 * aQuery - A simpler query system.
 *
 *  aQuery aims to provide a similar workflow and query system to
 *  the popular jQuery, without the added bloat. An aQuery object
 *  simply harnesses query selectors, a simple wrapper object,
 *  and a hi-jacked default DOM prototype to make its magic happen.
 *
 *  PERFS:
 *  http://jsperf.com/instanceof-vs-array-isarray
 *  http://jsperf.com/fn-vs-sub
 */
var A, aQuery, aQueryInit;

A = aQuery = (function() { 
  var A = (aQueryInit = function (base, enumerator) {

    // Store slice
    var slice = [].slice
    , hasEnumerator = arguments.length >= 2

    // Create query result class
    , aQueryResult = function(arr) {
      // Sanity check
      if (arr.length === undefined) {
        this.collection = [];
        console.warn('value passed to new result isn\' a collection '
          + 'for ' + (base.name || '[anonymous base type]'));
      } else if (arr instanceof aQueryResult) {
        this.collection = arr.collection;
      } else {
        this.collection = arr;
      }

      // Store length
      this.length = this.collection.length;
    }

    // Mirror base type prototype
    , aproto = aQueryResult.prototype
    , proto = base.prototype;

    // Traverse prototype hierarchy
    do {
      // Iterate prototype elements
      Object.getOwnPropertyNames(proto).forEach(function(key) {
        // Check that it's enumerable and that it's not some
        //  magic value we shouldn't be emulating
        var descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (!descriptor.enumerable || descriptor.get || descriptor.set) {
          return;
        }

        // Scope-ify the function itself
        var fn;
        try {
          // We wrap this in a try block due to some browsers
          //  throwing errors about interface issues.
          fn = proto[key];
        } catch(e) {
          return;
        }

        // Is it an actual prototype function?
        if (typeof fn !== 'function') {
          return;
        }

        // Wrap with array-version of method
        aproto[key] = function() {
          // Make args an actual array and prepare a results array
          var args = slice.call(arguments);

          // Static invocation?
          if (this.constructor.name !== aQueryResult.name) {
            return fn.apply(this, args);
          }

          var results = [];

          // Iterate collection of elements
          for (var i = 0, len = this.collection.length; i < len; i++) {
            results.push(fn.apply(this.collection[i], args));
          };

          // Store results and return
          this.$ = results;
          return this;
        };
      });
    } while(proto = proto.__proto__);

    // Add prop() prototype
    aproto.prop = function(dotPath, value) {
      // Setup results
      var results = [];

      // Iterate collection
      for(var i = 0, len = this.collection.length; i < len; i++) {
        // Get object
        var item = this.collection[i];

        // Query result?
        if (item instanceof aQueryResult) {
          item.prop(dotPath, value);
          results = results.concat(item.$);
          continue;
        }

        // Resolve dotpath
        var obj = item
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

    // Add each() prototype
    //  Do NOT rely on Array.forEach()!
    //  aQuery is built to support -any- array or object
    //  with a .length property!
    //
    //  Use this function instead.
    aproto.each = function(fn) {
      var results = [];

      for (var i = 0, len = this.collection.length; i < len; i++) {
        results.push(fn(this.collection[i], i, this.collection));
      }

      this.$ = results;
      return this;
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
      if (!hasEnumerator) {
        collection = query;

        // Sanity check
        if (collection.length === undefined) {
          collection = [];
          console.warn('enumerator not specified; only array queries can be made '
            + 'for ' + (base.home || '[anonymous base type]'));
        }
      } else {
        // Call with aQuery as context
        collection = enumerator.call(this, query);

        // Sanity check
        if (collection.length === undefined) {
          collection = [];
          console.warn('enumerator result not an array for '
            + (base.name || '[anonymous base type]'));
        }
      }

      // Return new query result
      return new aQueryResult(collection);
    }

    return aQuery;
  })(HTMLElement, querySelectorAllEnumerator);

  // Default enumerator
  function querySelectorAllEnumerator(query) {
    switch (true) {
      case typeof query === 'string':
        return document.querySelectorAll(query);
      case typeof query.length === 'number':
        return query;
      case query instanceof HTMLElement:
        return [query];
      default:
        var typeName = (typeof query.constructor !== 'undefined'
            ? query.constructor.name
            : query);
        throw 'unknown query type for querySelectorAll enumerator: ' +
            typeName;
    }
  }

  return A;
})();
