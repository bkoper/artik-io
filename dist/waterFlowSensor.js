"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _artikGpio = require("../lib/artik-gpio");

var _artikGpio2 = _interopRequireDefault(_artikGpio);

var _device = require("./device");

var _device2 = _interopRequireDefault(_device);

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Water Flow Sensor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Model: YF-S201
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var calibrationFactor = 7.5;
var maxSpeed = 10;
var watchdogThreshold = 1250;
var getTimestamp = function getTimestamp() {
    return new Date().getTime();
};

var WaterFlowSensor = function (_Device) {
    _inherits(WaterFlowSensor, _Device);

    function WaterFlowSensor(pin) {
        _classCallCheck(this, WaterFlowSensor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WaterFlowSensor).call(this, pin));

        _this.reset();
        _this.watchdogId = null;
        return _this;
    }

    _createClass(WaterFlowSensor, [{
        key: "initialize",
        value: function initialize() {
            this.gpio = new _artikGpio2.default(this.pin, 10);
            this.gpio.pinMode(_artikGpio2.default.direction.INPUT);
        }
    }, {
        key: "turnOn",
        value: function turnOn() {
            var _this2 = this;

            this.gpio.on(_artikGpio2.default.event.FALLING, function () {
                return _this2.pulseCount++;
            });
            this.iv = setInterval(function () {
                if (_this2.pulseCount > 0) {
                    _this2.lastTimestamp = getTimestamp();
                    !_this2.watchdogId && _this2._watchdogStart();

                    var flowRateRaw = _this2.pulseCount / calibrationFactor;
                    _this2.flowRate = Math.round(flowRateRaw);
                    _this2.percentSpeed = Math.round(flowRateRaw / maxSpeed * 100);
                    _this2.pulseCount = 0;

                    var flown = roundNb(_this2.flowRate / 60);
                    _this2.total += flown;

                    _this2.emit(WaterFlowSensor.event.CHANGE);
                }
            }, 1000);
        }
    }, {
        key: "turnOff",
        value: function turnOff() {
            this.gpio.removeAllListeners(_artikGpio2.default.event.FALLING);
            this.removeAllListener(WaterFlowSensor.event.CHANGE);
            clearInterval(this.watchdogId);
        }
    }, {
        key: "getFlowRate",
        value: function getFlowRate() {
            return this.flowRate;
        }
    }, {
        key: "getTotalMillilitres",
        value: function getTotalMillilitres() {
            return roundNb(this.total);
        }
    }, {
        key: "getPercentSpeed",
        value: function getPercentSpeed() {
            return this.percentSpeed;
        }
    }, {
        key: "getData",
        value: function getData() {
            return {
                speed: this.flowRate,
                percentSpeed: this.percentSpeed,
                avg: 0,
                percentAvg: 0,
                max: 0,
                maxPercent: 0,
                total: parseFloat(this.total).toFixed(2)
            };
        }
    }, {
        key: "on",
        value: function on(listener) {
            this.addListener(WaterFlowSensor.event.CHANGE, listener);
        }
    }, {
        key: "reset",
        value: function reset() {
            this.pulseCount = 0;
            this.flowRate = 0;
            this.total = 0;
            this.percentSpeed = 0;
            this.lastTimestamp = 0;
        }
    }, {
        key: "_watchdogStop",
        value: function _watchdogStop() {
            clearInterval(this.watchdogId);
            this.watchdogId = null;
            this.percentSpeed = 0;
            this.flowRate = 0;
            this.emit(WaterFlowSensor.event.CHANGE);
        }
    }, {
        key: "_watchdogStart",
        value: function _watchdogStart() {
            var _this3 = this;

            this.watchdogId = setInterval(function () {
                getTimestamp() - _this3.lastTimestamp > watchdogThreshold && _this3._watchdogStop();
            }, watchdogThreshold);
        }
    }]);

    return WaterFlowSensor;
}(_device2.default);

exports.default = WaterFlowSensor;


WaterFlowSensor.event = {
    CHANGE: "WaterFlowSensor:change"
};

function roundNb(num) {
    return Math.round(num * 100) / 100;
}