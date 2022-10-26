"use strict";

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var UDPWebSocket_1 = require("./UDPWebSocket");
// Type of WebSocket being handled
var WebSocketType;
(function (WebSocketType) {
  WebSocketType[WebSocketType["TCP"] = 0] = "TCP";
  WebSocketType[WebSocketType["UDP"] = 1] = "UDP"; // UDPWebSocket
})(WebSocketType = exports.WebSocketType || (exports.WebSocketType = {}));
// Handles WebSocket or UDPWebSocket with JSON packets

var WebSocketHandler = function () {
  function WebSocketHandler(_url) {
    var _type = arguments.length <= 1 || arguments[1] === undefined ? WebSocketType.TCP : arguments[1];
    _classCallCheck(this, WebSocketHandler);
    this._url = _url;
    this._type = _type;
    this._callbacks = new Map();
    this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket_1.UDPWebSocket(this._url);
  }
  _createClass(WebSocketHandler, [{
    key: "connect",
    value: function connect() {
      var _this = this;
      return new Promise(function (resolve, reject) {
        _this._ws.onmessage = function (ev) {
          var packet = JSON.parse(ev.data);
          _this.dispatch(packet);
        };
        _this._ws.onclose = function (ev) {};
        _this._ws.onopen = function (ev) {
          resolve();
        };
        _this._ws.onerror = function (ev) {
          reject(ev);
        };
        if (_this._ws.readyState === WebSocket.OPEN) {
          resolve();
        }
      });
    }
  }, {
    key: "bind",
    value: function bind(event, callback) {
      this._callbacks.set(event, callback);
    }
  }, {
    key: "send",
    value: function send(packet) {
      this._ws.send(JSON.stringify(packet));
    }
  }, {
    key: "dispatch",
    value: function dispatch(packet) {
      var callback = this._callbacks.get(packet.event);
      if (callback !== undefined) {
        callback(packet.data);
      }
    }
  }]);
  return WebSocketHandler;
}();
exports.WebSocketHandler = WebSocketHandler;
// Handles WebSocket or UDPWebSocket with ArrayBuffer packets

var BinaryWebSocketHandler = function () {
  function BinaryWebSocketHandler(_url) {
    var _type = arguments.length <= 1 || arguments[1] === undefined ? WebSocketType.TCP : arguments[1];
    _classCallCheck(this, BinaryWebSocketHandler);
    this._url = _url;
    this._type = _type;
    this._callbacks = new Array();
    this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket_1.UDPWebSocket(this._url);
    // this._ws.binaryType = 'arraybuffer';
  }

  _createClass(BinaryWebSocketHandler, [{
    key: "connect",
    value: function connect() {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        _this2._ws.onmessage = function (ev) {
          _this2.dispatch(ev.data);
        };
        _this2._ws.onclose = function (ev) {};
        _this2._ws.onopen = function (ev) {
          _this2._ws.binaryType = 'arraybuffer';
          resolve();
        };
        _this2._ws.onerror = function (ev) {
          reject(ev);
        };
        if (_this2._type === WebSocketType.TCP && _this2._ws.readyState === WebSocket.OPEN) {
          resolve();
        }
        if (_this2._type === WebSocketType.UDP && _this2._ws.readyState === 'open') {
          resolve();
        }
      });
    }
  }, {
    key: "bind",
    value: function bind(event, callback) {
      this._callbacks[event] = callback;
    }
  }, {
    key: "send",
    value: function send(buffer) {
      this._ws.send(buffer);
    }
  }, {
    key: "dispatch",
    value: function dispatch(buffer) {
      var view = new DataView(buffer);
      this._callbacks[view.getUint8(0)](buffer);
    }
  }]);
  return BinaryWebSocketHandler;
}();
exports.BinaryWebSocketHandler = BinaryWebSocketHandler;