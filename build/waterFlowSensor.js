"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _artikGpio = require("./artik-gpio");

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

                    var flowMilliLitres = roundNb(_this2.flowRate / 60 * 1000);
                    _this2.totalMillilitres += flowMilliLitres;

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
            return roundNb(this.totalMillilitres);
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
                total: this.totalMillilitres
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
            this.totalMillilitres = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndhdGVyRmxvd1NlbnNvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOEJBLElBQU0sb0JBQW9CLEdBQXBCO0FBQ04sSUFBTSxXQUFXLEVBQVg7QUFDTixJQUFNLG9CQUFvQixJQUFwQjtBQUNOLElBQU0sZUFBZSxTQUFmLFlBQWU7V0FBTSxJQUFLLElBQUosRUFBRCxDQUFXLE9BQVg7Q0FBTjs7SUFFQTs7O0FBQ2pCLGFBRGlCLGVBQ2pCLENBQVksR0FBWixFQUFpQjs4QkFEQSxpQkFDQTs7MkVBREEsNEJBRVAsTUFETzs7QUFFYixjQUFLLEtBQUwsR0FGYTtBQUdiLGNBQUssVUFBTCxHQUFrQixJQUFsQixDQUhhOztLQUFqQjs7aUJBRGlCOztxQ0FPSjtBQUNULGlCQUFLLElBQUwsR0FBWSx3QkFBUyxLQUFLLEdBQUwsRUFBVSxFQUFuQixDQUFaLENBRFM7QUFFVCxpQkFBSyxJQUFMLENBQVUsT0FBVixDQUFrQixvQkFBSyxTQUFMLENBQWUsS0FBZixDQUFsQixDQUZTOzs7O2lDQUtKOzs7QUFDTCxpQkFBSyxJQUFMLENBQVUsRUFBVixDQUFhLG9CQUFLLEtBQUwsQ0FBVyxPQUFYLEVBQW9CO3VCQUFNLE9BQUssVUFBTDthQUFOLENBQWpDLENBREs7QUFFTCxpQkFBSyxFQUFMLEdBQVUsWUFBWSxZQUFNO0FBQ3hCLG9CQUFJLE9BQUssVUFBTCxHQUFrQixDQUFsQixFQUFxQjtBQUNyQiwyQkFBSyxhQUFMLEdBQXFCLGNBQXJCLENBRHFCO0FBRXJCLHFCQUFDLE9BQUssVUFBTCxJQUFtQixPQUFLLGNBQUwsRUFBcEIsQ0FGcUI7O0FBSXJCLHdCQUFJLGNBQWMsT0FBSyxVQUFMLEdBQWtCLGlCQUFsQixDQUpHO0FBS3JCLDJCQUFLLFFBQUwsR0FBZ0IsS0FBSyxLQUFMLENBQVcsV0FBWCxDQUFoQixDQUxxQjtBQU1yQiwyQkFBSyxZQUFMLEdBQW9CLEtBQUssS0FBTCxDQUFXLFdBQUMsR0FBYyxRQUFkLEdBQTBCLEdBQTNCLENBQS9CLENBTnFCO0FBT3JCLDJCQUFLLFVBQUwsR0FBa0IsQ0FBbEIsQ0FQcUI7O0FBU3JCLHdCQUFJLGtCQUFrQixRQUFRLE1BQUMsQ0FBSyxRQUFMLEdBQWdCLEVBQWhCLEdBQXNCLElBQXZCLENBQTFCLENBVGlCO0FBVXJCLDJCQUFLLGdCQUFMLElBQXlCLGVBQXpCLENBVnFCOztBQVlyQiwyQkFBSyxJQUFMLENBQVUsZ0JBQWdCLEtBQWhCLENBQXNCLE1BQXRCLENBQVYsQ0FacUI7aUJBQXpCO2FBRGtCLEVBZW5CLElBZk8sQ0FBVixDQUZLOzs7O2tDQW9CQztBQUNOLGlCQUFLLElBQUwsQ0FBVSxrQkFBVixDQUE2QixvQkFBSyxLQUFMLENBQVcsT0FBWCxDQUE3QixDQURNO0FBRU4saUJBQUssaUJBQUwsQ0FBdUIsZ0JBQWdCLEtBQWhCLENBQXNCLE1BQXRCLENBQXZCLENBRk07QUFHTiwwQkFBYyxLQUFLLFVBQUwsQ0FBZCxDQUhNOzs7O3NDQU1JO0FBQ1YsbUJBQU8sS0FBSyxRQUFMLENBREc7Ozs7OENBSVE7QUFDbEIsbUJBQU8sUUFBUSxLQUFLLGdCQUFMLENBQWYsQ0FEa0I7Ozs7MENBSVA7QUFDakIsbUJBQU8sS0FBSyxZQUFMLENBRFU7Ozs7a0NBSUw7QUFDTixtQkFBTztBQUNILHVCQUFPLEtBQUssUUFBTDtBQUNQLDhCQUFjLEtBQUssWUFBTDtBQUNkLHFCQUFLLENBQUw7QUFDQSw0QkFBWSxDQUFaO0FBQ0EscUJBQUssQ0FBTDtBQUNBLDRCQUFZLENBQVo7QUFDQSx1QkFBTyxLQUFLLGdCQUFMO2FBUFgsQ0FETTs7OzsyQkFZUCxVQUFVO0FBQ1QsaUJBQUssV0FBTCxDQUFpQixnQkFBZ0IsS0FBaEIsQ0FBc0IsTUFBdEIsRUFBOEIsUUFBL0MsRUFEUzs7OztnQ0FJTDtBQUNKLGlCQUFLLFVBQUwsR0FBa0IsQ0FBbEIsQ0FESTtBQUVKLGlCQUFLLFFBQUwsR0FBZ0IsQ0FBaEIsQ0FGSTtBQUdKLGlCQUFLLGdCQUFMLEdBQXdCLENBQXhCLENBSEk7QUFJSixpQkFBSyxZQUFMLEdBQW9CLENBQXBCLENBSkk7QUFLSixpQkFBSyxhQUFMLEdBQXFCLENBQXJCLENBTEk7Ozs7d0NBUVE7QUFDWiwwQkFBYyxLQUFLLFVBQUwsQ0FBZCxDQURZO0FBRVosaUJBQUssVUFBTCxHQUFrQixJQUFsQixDQUZZO0FBR1osaUJBQUssWUFBTCxHQUFvQixDQUFwQixDQUhZO0FBSVosaUJBQUssUUFBTCxHQUFnQixDQUFoQixDQUpZO0FBS1osaUJBQUssSUFBTCxDQUFVLGdCQUFnQixLQUFoQixDQUFzQixNQUF0QixDQUFWLENBTFk7Ozs7eUNBUUM7OztBQUNiLGlCQUFLLFVBQUwsR0FBa0IsWUFBWSxZQUFNO0FBQ2hDLGlDQUFpQixPQUFLLGFBQUwsR0FBcUIsaUJBQXRDLElBQTJELE9BQUssYUFBTCxFQUEzRCxDQURnQzthQUFOLEVBRTNCLGlCQUZlLENBQWxCLENBRGE7Ozs7V0FsRkE7Ozs7OztBQXlGckIsZ0JBQWdCLEtBQWhCLEdBQXdCO0FBQ3BCLFlBQVEsd0JBQVI7Q0FESjs7QUFJQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0I7QUFDbEIsV0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFNLEdBQU4sQ0FBWCxHQUF3QixHQUF4QixDQURXO0NBQXRCIiwiZmlsZSI6IndhdGVyRmxvd1NlbnNvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbiBDb3B5cmlnaHQgKGMpIDIwMTYgQmFydGxvbWllaiBLb3BlciA8YmtvcGVyQGdtYWlsLmNvbT5cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG5cbiBXYXRlciBGbG93IFNlbnNvclxuIE1vZGVsOiBZRi1TMjAxXG4gKi9cblxuaW1wb3J0IEdwaW8gZnJvbSBcIi4vYXJ0aWstZ3Bpb1wiO1xuaW1wb3J0IERldmljZSBmcm9tIFwiLi9kZXZpY2VcIjtcblxuY29uc3QgY2FsaWJyYXRpb25GYWN0b3IgPSA3LjU7XG5jb25zdCBtYXhTcGVlZCA9IDEwO1xuY29uc3Qgd2F0Y2hkb2dUaHJlc2hvbGQgPSAxMjUwO1xuY29uc3QgZ2V0VGltZXN0YW1wID0gKCkgPT4gKG5ldyBEYXRlKS5nZXRUaW1lKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhdGVyRmxvd1NlbnNvciBleHRlbmRzIERldmljZSB7XG4gICAgY29uc3RydWN0b3IocGluKSB7XG4gICAgICAgIHN1cGVyKHBpbik7XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgdGhpcy53YXRjaGRvZ0lkID0gbnVsbDtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmdwaW8gPSBuZXcgR3Bpbyh0aGlzLnBpbiwgMTApO1xuICAgICAgICB0aGlzLmdwaW8ucGluTW9kZShHcGlvLmRpcmVjdGlvbi5JTlBVVCk7XG4gICAgfVxuXG4gICAgdHVybk9uKCkge1xuICAgICAgICB0aGlzLmdwaW8ub24oR3Bpby5ldmVudC5GQUxMSU5HLCAoKSA9PiB0aGlzLnB1bHNlQ291bnQrKyk7XG4gICAgICAgIHRoaXMuaXYgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5wdWxzZUNvdW50ID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFRpbWVzdGFtcCA9IGdldFRpbWVzdGFtcCgpO1xuICAgICAgICAgICAgICAgICF0aGlzLndhdGNoZG9nSWQgJiYgdGhpcy5fd2F0Y2hkb2dTdGFydCgpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGZsb3dSYXRlUmF3ID0gdGhpcy5wdWxzZUNvdW50IC8gY2FsaWJyYXRpb25GYWN0b3I7XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93UmF0ZSA9IE1hdGgucm91bmQoZmxvd1JhdGVSYXcpO1xuICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudFNwZWVkID0gTWF0aC5yb3VuZCgoZmxvd1JhdGVSYXcgLyBtYXhTcGVlZCkgKiAxMDApO1xuICAgICAgICAgICAgICAgIHRoaXMucHVsc2VDb3VudCA9IDA7XG5cbiAgICAgICAgICAgICAgICBsZXQgZmxvd01pbGxpTGl0cmVzID0gcm91bmROYigodGhpcy5mbG93UmF0ZSAvIDYwKSAqIDEwMDApO1xuICAgICAgICAgICAgICAgIHRoaXMudG90YWxNaWxsaWxpdHJlcyArPSBmbG93TWlsbGlMaXRyZXM7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoV2F0ZXJGbG93U2Vuc29yLmV2ZW50LkNIQU5HRSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cblxuICAgIHR1cm5PZmYoKSB7XG4gICAgICAgIHRoaXMuZ3Bpby5yZW1vdmVBbGxMaXN0ZW5lcnMoR3Bpby5ldmVudC5GQUxMSU5HKTtcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcihXYXRlckZsb3dTZW5zb3IuZXZlbnQuQ0hBTkdFKTtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLndhdGNoZG9nSWQpO1xuICAgIH1cblxuICAgIGdldEZsb3dSYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mbG93UmF0ZTtcbiAgICB9XG5cbiAgICBnZXRUb3RhbE1pbGxpbGl0cmVzKCkge1xuICAgICAgICByZXR1cm4gcm91bmROYih0aGlzLnRvdGFsTWlsbGlsaXRyZXMpO1xuICAgIH1cblxuXHRnZXRQZXJjZW50U3BlZWQoKSB7XG5cdFx0cmV0dXJuIHRoaXMucGVyY2VudFNwZWVkO1xuXHR9XG5cbiAgICBnZXREYXRhKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3BlZWQ6IHRoaXMuZmxvd1JhdGUsXG4gICAgICAgICAgICBwZXJjZW50U3BlZWQ6IHRoaXMucGVyY2VudFNwZWVkLFxuICAgICAgICAgICAgYXZnOiAwLFxuICAgICAgICAgICAgcGVyY2VudEF2ZzogMCxcbiAgICAgICAgICAgIG1heDogMCxcbiAgICAgICAgICAgIG1heFBlcmNlbnQ6IDAsXG4gICAgICAgICAgICB0b3RhbDogdGhpcy50b3RhbE1pbGxpbGl0cmVzXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbihsaXN0ZW5lcikge1xuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKFdhdGVyRmxvd1NlbnNvci5ldmVudC5DSEFOR0UsIGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5wdWxzZUNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5mbG93UmF0ZSA9IDA7XG4gICAgICAgIHRoaXMudG90YWxNaWxsaWxpdHJlcyA9IDA7XG4gICAgICAgIHRoaXMucGVyY2VudFNwZWVkID0gMDtcbiAgICAgICAgdGhpcy5sYXN0VGltZXN0YW1wID0gMDtcbiAgICB9XG5cbiAgICBfd2F0Y2hkb2dTdG9wKCkge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMud2F0Y2hkb2dJZCk7XG4gICAgICAgIHRoaXMud2F0Y2hkb2dJZCA9IG51bGw7XG4gICAgICAgIHRoaXMucGVyY2VudFNwZWVkID0gMDtcbiAgICAgICAgdGhpcy5mbG93UmF0ZSA9IDA7XG4gICAgICAgIHRoaXMuZW1pdChXYXRlckZsb3dTZW5zb3IuZXZlbnQuQ0hBTkdFKTtcbiAgICB9XG5cbiAgICBfd2F0Y2hkb2dTdGFydCgpIHtcbiAgICAgICAgdGhpcy53YXRjaGRvZ0lkID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgZ2V0VGltZXN0YW1wKCkgLSB0aGlzLmxhc3RUaW1lc3RhbXAgPiB3YXRjaGRvZ1RocmVzaG9sZCAmJiB0aGlzLl93YXRjaGRvZ1N0b3AoKTtcbiAgICAgICAgfSwgd2F0Y2hkb2dUaHJlc2hvbGQpO1xuICAgIH1cbn1cblxuV2F0ZXJGbG93U2Vuc29yLmV2ZW50ID0ge1xuICAgIENIQU5HRTogXCJXYXRlckZsb3dTZW5zb3I6Y2hhbmdlXCJcbn07XG5cbmZ1bmN0aW9uIHJvdW5kTmIobnVtKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobnVtICogMTAwKSAvIDEwMDtcbn0iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
