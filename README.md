# aQuery
**aQuery** is a lightweight DOM manipulation framework that simply wraps
query selections and proxies calls to their methods one-to-many instead of
one-to-one.

This allows scripts to manipulate many elements in one fell swoop, collecting
their results if necessary or daisy-chaining calls to quickly build them up.

Unlike jQuery, **aQuery can be applied to any type** (but defaults to
HTMLElement). aQuery also provides access to the underlying prototype, allowing
one to build up the API used on collections of objects.
