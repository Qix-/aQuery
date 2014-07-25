# aQuery
**aQuery** is a lightweight DOM manipulation framework that simply wraps
query selections and proxies calls to their methods one-to-many instead of
one-to-one.

This allows scripts to manipulate many elements in one fell swoop, collecting
their results if necessary or daisy-chaining calls to quickly build them up.

Unlike jQuery, **aQuery can be applied to any type** (but defaults to
HTMLElement). aQuery also provides access to the underlying prototype, allowing
one to build up the API used on collections of objects.

## Usage
`aQuery` (or just `A`) is a function lives in the global namespace. Upon
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
