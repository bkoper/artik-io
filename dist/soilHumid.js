"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Soil humidity sensor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

// ~940 not humid
// ~870 humid ok
// ~800 very humid
// ~750 to humid

var SoilHumidity = function (_Device) {
    _inherits(SoilHumidity, _Device);

    function SoilHumidity(digitalPinNb, analogPinNb) {
        _classCallCheck(this, SoilHumidity);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SoilHumidity).call(this, digitalPinNb));

        _this.digitalPin = _this.gpio;
        _this.digitalPin.pinMode(_artikGpio2.default.direction.INPUT);
        _this.analogPin = new _artikGpio2.default(analogPinNb);
        _this.pullingId = setInterval(_this._updateCurrentIntense.bind(_this), 50);
        _this.currentIntense = 0;
        return _this;
    }

    _createClass(SoilHumidity, [{
        key: "getIntense",
        value: function getIntense() {
            return this.currentIntense;
        }
    }, {
        key: "on",
        value: function on(event, callback) {
            this.digitalPin.on(event, callback);
        }
    }, {
        key: "off",
        value: function off(event, callback) {
            this.digitalPin.off(event, callback);
        }
    }, {
        key: "turnOff",
        value: function turnOff() {
            this.digitalPin.removeListener(_artikGpio2.default.event.CHANGE, this._updateCurrentIntense);
            _get(Object.getPrototypeOf(SoilHumidity.prototype), "turnOff", this).call(this);
        }
    }, {
        key: "_updateCurrentIntense",
        value: function _updateCurrentIntense() {
            var _this2 = this;

            this.analogPin.analogRead().then(function (val) {
                return _this2.currentIntense = val;
            });
        }
    }]);

    return SoilHumidity;
}(_device2.default);

exports.default = SoilHumidity;


SoilHumidity.events = {
    STATUS_CHANGE: _artikGpio2.default.event.CHANGE,
    SOIL_HUMID: _artikGpio2.default.event.FALLING,
    SOIL_NOT_HUMID: _artikGpio2.default.event.RISING
};