import axios from 'axios'
import Vue from 'vue'
Vue.prototype.$http = axios
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"
String.prototype.format = function(args) {
  var result = this;
  if (arguments.length > 0) {
    if (arguments.length == 1 && typeof (args) == "object") {
      for (var key in args) {
        if (args[key] != undefined) {
          var reg = new RegExp("({" + key + "})", "g");
          result = result.replace(reg, args[key]);
        }
      }
    }
    else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != undefined) {
          var reg = new RegExp("({)" + i + "(})", "g");
          result = result.replace(reg, arguments[i]);
        }
      }
    }
  }
  return result;
};
/**
 * @param {T} elt
 * @return {number}
 * @template T
 */
Array.prototype.indexOf = function(elt) {
  /** @type {number} */
  var i = 0;
  for (;i < this.length;i++) {
    if (this[i] == elt) {
      return i;
    }
  }
  return-1;
};
/**
 * @param {?} aString
 * @return {undefined}
 */
Array.prototype.removeVal = function(aString) {
  /** @type {number} */
  var index = this.indexOf(aString);
  if (index > -1) {
    this.splice(index, 1);
  }
};
/**
 * @param {number} dx
 * @return {?}
 */
Array.prototype.remove = function(dx) {
  if (isNaN(dx) || dx > this.length) {
    return false;
  }
  /** @type {number} */
  var i = 0;
  /** @type {number} */
  var a = 0;
  for (;i < this.length;i++) {
    if (this[i] != this[dx]) {
      this[a++] = this[i];
    }
  }
  this.length -= 1;
};
/**
 * @return {?}
 */
Array.prototype.clone = function() {
  return this.concat();
};
axios.interceptors.response.use(function(response) {
  return 200 != response.status && actual.a.Message({
    showClose : true,
    message : "\u8bf7\u6c42\u51fa\u9519\u5566",
    type : "error"
  }), response.data;
}, function(error) {
  return actual.a.Message({
    showClose : true,
    message : "\u8bf7\u6c42\u51fa\u9519\u5566",
    type : "error"
  }), target.a.reject(error);
});
Vue.filter("toFixed", function(y) {
  return isNaN(y) ? y : (console.debug(y.toFixed(2)), y.toFixed(2));
});
Vue.filter("format", function(dt) {
  /** @type {string} */
  var format = "yyyy-mm-dd";
  var map = {
    "M+" : dt.getMonth() + 1,
    "d+" : dt.getDate(),
    "h+" : dt.getHours(),
    "m+" : dt.getMinutes(),
    "s+" : dt.getSeconds(),
    "q+" : Math.floor((dt.getMonth() + 3) / 3),
    S : dt.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    /** @type {string} */
    format = format.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  var letter;
  for (letter in map) {
    if ((new RegExp("(" + letter + ")")).test(format)) {
      /** @type {string} */
      format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? map[letter] : ("00" + map[letter]).substr(("" + map[letter]).length));
    }
  }
  return format;
});
/**
 * @param {string} format
 * @return {?}
 */
Date.prototype.format = function(format) {
  var map = {
    "M+" : this.getMonth() + 1,
    "d+" : this.getDate(),
    "h+" : this.getHours(),
    "m+" : this.getMinutes(),
    "s+" : this.getSeconds(),
    "q+" : Math.floor((this.getMonth() + 3) / 3),
    S : this.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  var letter;
  for (letter in map) {
    if ((new RegExp("(" + letter + ")")).test(format)) {
      format = format.replace(RegExp.$1, 1 == RegExp.$1.length ? map[letter] : ("00" + map[letter]).substr(("" + map[letter]).length));
    }
  }
  return format;
};
