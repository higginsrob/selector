/*
  =================================================
  selector - lightweight dom selection AMD module
  =================================================
  @license Open source under MIT
  Copyright 2015 Robert Higgins All rights reserved
  =================================================
*/

define(function() {

  "use strict";

  var type = function(obj){
    return Object.prototype.toString.call(obj).slice(8,-1);
  };

  var isElement = function(obj){
    var objectType = type(obj);
    return (
        objectType.substr(0,4) === "HTML" &&
        objectType.substr(-7) === "Element"
      ) ||
      objectType === "Window" ||
      objectType === "global" ||
      objectType === "HTMLDocument";
  };

  var QueryList = function(selector, context){
    var self = this;
    self.length = 0;
    if(isElement(selector)){
      self[0] = selector;
      self.length = 1;
    } else {
      var objectType = type(selector);
      if(objectType === "String"){
        if(!context) context = document;
        var nodelist = context.querySelectorAll(selector);
        Array.prototype.forEach.call(nodelist, function(node, index){
          self[index] = node;
        });
        self.length = nodelist.length;
      } else if(objectType === "NodeList" || objectType === "HTMLCollection"){
        Array.prototype.forEach.call(selector, function(node, index){
          self[index] = node;
        });
        self.length = selector.length;
      } else if(objectType === "Array" || selector instanceof QueryList){
        var index = 0;
        selector.forEach(function(node){
          if(isElement(node)){
            self[index] = node;
            index++;
          }
        });
        self.length = index;
      } else if(objectType === "Function"){
        if(document.readyState === "complete"){
          selector();
        } else {
          var ready = window.setInterval(function() {
            if(document.readyState === "complete") {
              window.clearInterval(ready);
              selector();
            }
          }, 8);
        }
      } else {
        console.error('Error: lquery element type: ' + objectType);
      }
    }
    return this;
  };

  // Array prototype methods  ***

  QueryList.prototype.every = Array.prototype.every;
  QueryList.prototype.filter = Array.prototype.filter;
  QueryList.prototype.forEach = Array.prototype.forEach;
  QueryList.prototype.map = Array.prototype.map;
  QueryList.prototype.pop = Array.prototype.pop;
  QueryList.prototype.push = Array.prototype.push;
  QueryList.prototype.shift = Array.prototype.shift;
  QueryList.prototype.slice = Array.prototype.slice;
  QueryList.prototype.some = Array.prototype.some;
  QueryList.prototype.splice = Array.prototype.splice;
  QueryList.prototype.unshift = Array.prototype.unshift;

  // event methods

  QueryList.prototype.on = function(events, listener, useCapture){
    if(type(events) === 'String' && type(listener) === 'Function'){
      this.forEach(function(node){
        var event_array = events.split(" ");
        event_array.forEach(function(event){
          node.addEventListener(event, listener, useCapture === true);
        });
      });
    }
    return this;
  };

  QueryList.prototype.off = function(events, listener, useCapture){
    if(type(events) === 'String' && type(events) === 'Function'){
      this.forEach(function(node){
        var event_array = events.split(" ");
        event_array.forEach(function(event){
          node.removeEventListener(event, listener, useCapture === true);
        });
      });
    }
    return this;
  };

  QueryList.prototype.trigger = function(eventName, eventType){
    if(type(eventName) === 'String'){
      this.forEach(function(node){
        var event;
        if(node.dispatchEvent) {
          try{
            node.dispatchEvent(new Event(eventName));
          } catch(e){
            event = document.createEvent(eventType || "UIEvent");
            event.initEvent(eventName, true, false);
            node.dispatchEvent(event);
          }
        } else if (node.fireEvent) {
          event = document.createEventObject();
          node.fireEvent('on' + eventName, event);
        }
      });
    }
    return this;
  };

  // style methods

  QueryList.prototype.hasClass = function(className){
    if(this[0] && type(className) === 'String'){
      return new RegExp('(\\s|^)'+ className +'(\\s|$)').test(this[0].className);
    }
  };

  QueryList.prototype.addClass = function(className){
    if(type(className) === 'String'){
      this.forEach(function(node){
        if(new RegExp('(\\s|^)'+ className +'(\\s|$)').test(node.className) !== true){
          node.className += (node.className ? ' ' : '') + className;
        }
      });
    }
    return this;
  };

  QueryList.prototype.removeClass = function(className){
    if(type(className) === 'String'){
      this.forEach(function(node){
        if(new RegExp('(\\s|^)'+ className +'(\\s|$)').test(node.className)){
          node.className = node.className.replace(new RegExp('(\\s|^)'+ className +'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
        }
      });
    }
    return this;
  };

  QueryList.prototype.css = function(obj){
    if(type(obj) === 'Object'){
      this.forEach(function(node){
        Object.keys(obj).forEach(function(key){
          node.style[key] = obj[key];
        });
      });
    }
    return this;
  };

  return function(selector, context){
    return new QueryList(selector, context);
  };

});