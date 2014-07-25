# aQuery
**aQuery** is a lightweight DOM manipulation framework that simply wraps
query selections and proxies calls to their methods one-to-many instead of
one-to-one.

This allows scripts to manipulate many elements in one fell swoop, collecting
their results if necessary or daisy-chaining calls to quickly build them up.

Unlike jQuery, **aQuery can be applied to any type** (but defaults to
HTMLElement). aQuery also provides access to the underlying prototype, allowing
one to build up the API used on collections of objects, or create a completely
new API for custom types.

## Usage
`aQuery` (or just `A`) is a function that lives in the global namespace. Upon
invocation, it provides one of three things:

- `A(string/mixed)` -         Performs a query on the document and returns a
                              **query result**
- `A()` -                     Provides the underlying **prototype** (API)
                              object which propagates new methods to all
                              existing queries
- `A(function[, function])` - Generates a **_new_ aQuery object** built to
                              operate on the specified type

aQuery result objects are specially formed objects that mirror the underlying
type's prototype methods and wraps them to invoke with each element of the
collection as the context, collecting any/all results and returning that as
an array.

When generating a new aQuery object (third form), an optional **enumeration
function** can be specified. This function is passed the parameter from the
first form _when the parameter is specified and isn't a function_. If no
enumeration function is specified, un-checked arrays become the only valid
parameter type and are passed directly to new result objects. Enumerators
must return an array.

> 'Array', as used in the previous paragraph, simply means an object
> with a `.length` attribute.

### Default aQuery object
As noted before, the default `aQuery` (or `A`) object is fitted around
[`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement),
and provides an enumerator that is bound to
[`document.querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Element.querySelectorAll).

Since the query system looks for `.length` rather than checking for a literal
array, `NodeList`s and other non-array arrays (such as `arguments`) are all
supported by default.

### Results and daisy chaining
aQuery API functions can return whatever they'd like; however, the convention
is to return `this` in order to allow for daisy chaining (the only built-in
exception being `.at()`).

Because of this, results are stored as an array in `.$`.

## Examples
Below are just a few examples of various aQuery operations:

#### Make all `<strong>` tags have a black background and white text
~~~javascript
A('strong').prop('style.color', '#FFF')
           .prop('style.background', '#000');
~~~

> This simply selects all `<strong>` tags on the page, uses the aQuery
> built-in API call `.prop()` to enumerate a dot path and assign the given
> value to it. A dot path is simply the string-form object notation you'd
> normally use to access an object.

#### Remove all tags with the class `.hidden`
~~~javascript
A('.hidden').remove();
~~~

> Since `remove()` is part of the `HTMLElement` spec, it is thus bound
> and available to us to call.

#### Click every `<button>`
~~~javascript
var e = document.createEvent('MouseEvents');
e.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0,
        false, false, false, false, 0, null);

A('button').dispatchEvent(e);
~~~

> First, a
> [mouse click event](https://developer.mozilla.org/en-US/docs/Web/API/event.initMouseEvent)
> is created, and then we call upon aQuery to find every button and dispatch
> it.

#### Test a string against multiple regexes
~~~javascript
var Regs = A(RegExp);
var results = Regs([/./, /.+/, /[a-z]+/i]).test('hello').$;
~~~

> We create a new aQuery object given the type `RegExp`, and give it
> an array of various regex pattern objects. With that collection, we
> test the string `'hello'` against all of them and store the results.

#### Create a completely new API
~~~javascript
// Create a simple storage class
function MyClass() {
  this.str = "";
}

// Create a setter
MyClass.prototype.set = function(newStr) {
  this.str = newStr;
};

// Create a new base aQuery object that wraps our class
var StrQuery = A(MyClass);

// Add a custom method to our API that appends a string
//  We do this by calling `StrQuery()` with no arguments,
//  which returns the underlying prototype object.
StrQuery().cat = function(suffix) {
  // Assumes the collection type is an array
  //  Generally not good practice (use a traditional loop
  //  where possible).
  this.$ = this.collection.map(function(obj) {
    return obj.str + suffix;
  });
  return this;
};

// Setup and call!
var strs = [
  new MyClass(),
  new MyClass(),
  new MyClass()
];
strs = StrQuery(strs).set('foo') // Set all to 'foo'
                     .cat('bar') // Concat 'bar'
                     .$;         // Get results
~~~

`strs` is now equal to `['foobar', 'foobar', 'foobar']`.

> This example demonstrates the flexibility of the prototyping system
> Javascript harnesses by default. Each aQuery object has its own underlying
> prototype, allowing for different implementations for different base
> types - along with allowing the developer to customize collections management
> per-deployment.
