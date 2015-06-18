## selector - lightweight dom selection AMD module

selector.js is similar to the well-known jQuery library, but targeted at RequireJS and stripped down to only handle dom selection, simple event binding, and some css style methods.  Selector.js is only 3KB minified (compared to jQuery v2.1.4's 83KB).

Basically the AMD factory returns a constructor function whose first argument accepts a selector string, nodelist, htmlcollection, or array of elements.  When called it creates a new instance of "QueryList" which is populated with any found/passed elements.  QueryList is array like and supports many of Array's prototype methods.

QueryList prototype contains:

* Event binding/detaching methods
    * on
    * off
    * trigger

* Class manipulation methods
    * hasClass
    * addClass
    * removeClass

* Inline CSS
    * css

* Array prototype methods
    * every
    * filter
    * forEach
    * map
    * pop
    * push
    * shift
    * slice
    * some
    * splice
    * unshift