"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _artikIo = require("./artik-io");

var _artikIo2 = _interopRequireDefault(_artikIo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                The MIT License (MIT)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Copyright (c) 2016 Bartlomiej Koper <bkoper@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Permission is hereby granted, free of charge, to any person obtaining a copy
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                of this software and associated documentation files (the 'Software'), to deal
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                in the Software without restriction, including without limitation the rights
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                copies of the Software, and to permit persons to whom the Software is
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                furnished to do so, subject to the following conditions:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                The above copyright notice and this permission notice shall be included in
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                all copies or substantial portions of the Software.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                THE SOFTWARE.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var staticValues = {
    value: {
        HIGH: 1,
        LOW: 0
    },
    direction: {
        INPUT: "in",
        OUTPUT: "out"
    },
    event: {
        CHANGE: "change",
        RISING: "rising",
        FALLING: "falling"
    }
};
var directionSet = new Set();
directionSet.add(staticValues.direction.OUTPUT).add(staticValues.direction.INPUT);
var valuesSet = new Set();
valuesSet.add(staticValues.value.HIGH).add(staticValues.value.LOW);

var GPIO_BASE_PATH = _path2.default.join("/", "sys", "class", "gpio");
var GPIO_BASE_RAW_PATH = _path2.default.join("/", "sys", "devices", "12d10000.adc", "iio:device0");
var GPIO_EXPORT = _path2.default.join(GPIO_BASE_PATH, "export");
var GPIO_UNEXPORT = _path2.default.join(GPIO_BASE_PATH, "unexport");

var getPinPath = function getPinPath(pin) {
    var subfolder = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];
    return _path2.default.join(GPIO_BASE_PATH, "gpio" + pin, subfolder);
};
var getRawPinPath = function getRawPinPath(pin) {
    return _path2.default.join(GPIO_BASE_RAW_PATH, "in_voltage" + pin + "_raw");
};

function validate(setVariable, value) {
    if (!setVariable.has(value)) {
        throw new Error("Invalid value: " + value);
    }
}

var Gpio = function (_EventEmitter) {
    _inherits(Gpio, _EventEmitter);

    function Gpio(pin) {
        var debounceTime = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

        _classCallCheck(this, Gpio);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Gpio).call(this));

        _this.pin = pin;
        _this.debouceTime = debounceTime;
        _this.value = 0;
        return _this;
    }

    _createClass(Gpio, [{
        key: "load",
        value: function load() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _fs2.default.access(getPinPath(_this2.pin), _fs2.default.F_OK, function (err) {
                    if (!err) {
                        resolve();
                    } else if (err.errno === -2) {
                        _fs2.default.writeFile(GPIO_EXPORT, _this2.pin, function (err) {
                            return err ? reject(err) : resolve();
                        });
                    } else {
                        reject(err);
                    }
                });
            });
        }
    }, {
        key: "unload",
        value: function unload() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                _fs2.default.writeFile(GPIO_UNEXPORT, _this3.pin, function (err) {
                    return err ? reject(err) : resolve();
                });
            });
        }
    }, {
        key: "pinMode",
        value: function pinMode() {
            var _this4 = this;

            var direction = arguments.length <= 0 || arguments[0] === undefined ? staticValues.direction.INPUT : arguments[0];

            validate(directionSet, direction);

            this.load(this.pin).then(function () {
                return _fs2.default.writeFile(getPinPath(_this4.pin, "direction"), direction);
            }).catch(function (err) {
                return console.warn(err);
            });
        }
    }, {
        key: "digitalWrite",
        value: function digitalWrite() {
            var _this5 = this;

            var val = arguments.length <= 0 || arguments[0] === undefined ? staticValues.value.LOW : arguments[0];

            validate(valuesSet, val);

            return new Promise(function (resolve, reject) {
                _fs2.default.writeFile(getPinPath(_this5.pin, "value"), val, function (err) {
                    return err ? reject(err) : resolve();
                });
            });
        }
    }, {
        key: "digitalRead",
        value: function digitalRead() {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                _fs2.default.readFile(getPinPath(_this6.pin, "value"), "utf8", function (err, data) {
                    return err ? reject(err) : resolve(data);
                });
            });
        }
    }, {
        key: "analogRead",
        value: function analogRead() {
            var _this7 = this;

            return new Promise(function (resolve, reject) {
                _fs2.default.readFile(getRawPinPath(_this7.pin), "utf8", function (err, data) {
                    return err ? reject(err) : resolve(data);
                });
            });
        }
    }, {
        key: "on",
        value: function on() {
            var event = arguments.length <= 0 || arguments[0] === undefined ? staticValues.event.CHANGE : arguments[0];
            var cb = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            !this._getListenersNb() && this._startEventPinPulling();
            this.addListener(event, cb);
        }
    }, {
        key: "off",
        value: function off() {
            var event = arguments.length <= 0 || arguments[0] === undefined ? staticValues.event.CHANGE : arguments[0];
            var cb = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

            this.removeListener(event, cb);
            !this._getListenersNb() && this._stopEventPinPulling();
        }
    }, {
        key: "_getListenersNb",
        value: function _getListenersNb() {
            return this.listenerCount(staticValues.event.CHANGE) + this.listenerCount(staticValues.event.RISING) + this.listenerCount(staticValues.event.FALLING);
        }
    }, {
        key: "_startEventPinPulling",
        value: function _startEventPinPulling() {
            var _this8 = this;

            this.intervalId = setInterval(function () {
                _this8.digitalRead().then(function (val) {
                    var newValue = +val;
                    if (_this8.value !== newValue) {
                        _this8.emit(staticValues.event.CHANGE, newValue);
                        newValue === staticValues.value.HIGH ? _this8.emit(staticValues.event.RISING, newValue) : _this8.emit(staticValues.event.FALLING, newValue);
                        _this8.value = newValue;
                    }
                });
            }, this.debouceTime);
        }
    }, {
        key: "_stopEventPinPulling",
        value: function _stopEventPinPulling() {
            clearInterval(this.intervalId);
        }
    }]);

    return Gpio;
}(_events2.default);

exports.default = Gpio;


Object.assign(Gpio, staticValues, _artikIo2.default);