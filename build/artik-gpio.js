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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFydGlrLWdwaW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkJBLElBQU0sZUFBZTtBQUNqQixXQUFPO0FBQ0gsY0FBTSxDQUFOO0FBQ0EsYUFBSyxDQUFMO0tBRko7QUFJQSxlQUFXO0FBQ1AsZUFBTyxJQUFQO0FBQ0EsZ0JBQVEsS0FBUjtLQUZKO0FBSUEsV0FBTztBQUNILGdCQUFRLFFBQVI7QUFDQSxnQkFBUSxRQUFSO0FBQ0EsaUJBQVMsU0FBVDtLQUhKO0NBVEU7QUFlTixJQUFNLGVBQWUsSUFBSSxHQUFKLEVBQWY7QUFDTixhQUFhLEdBQWIsQ0FBaUIsYUFBYSxTQUFiLENBQXVCLE1BQXZCLENBQWpCLENBQWdELEdBQWhELENBQW9ELGFBQWEsU0FBYixDQUF1QixLQUF2QixDQUFwRDtBQUNBLElBQU0sWUFBWSxJQUFJLEdBQUosRUFBWjtBQUNOLFVBQVUsR0FBVixDQUFjLGFBQWEsS0FBYixDQUFtQixJQUFuQixDQUFkLENBQXVDLEdBQXZDLENBQTJDLGFBQWEsS0FBYixDQUFtQixHQUFuQixDQUEzQzs7QUFFQSxJQUFNLGlCQUFpQixlQUFLLElBQUwsQ0FBVSxHQUFWLEVBQWUsS0FBZixFQUFzQixPQUF0QixFQUErQixNQUEvQixDQUFqQjtBQUNOLElBQU0scUJBQXFCLGVBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxLQUFmLEVBQXNCLFNBQXRCLEVBQWlDLGNBQWpDLEVBQWlELGFBQWpELENBQXJCO0FBQ04sSUFBTSxjQUFjLGVBQUssSUFBTCxDQUFVLGNBQVYsRUFBMEIsUUFBMUIsQ0FBZDtBQUNOLElBQU0sZ0JBQWdCLGVBQUssSUFBTCxDQUFVLGNBQVYsRUFBMEIsVUFBMUIsQ0FBaEI7O0FBRU4sSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFDLEdBQUQ7UUFBTSxrRUFBWTtXQUFPLGVBQUssSUFBTCxDQUFVLGNBQVYsV0FBaUMsR0FBakMsRUFBd0MsU0FBeEM7Q0FBekI7QUFDbkIsSUFBTSxnQkFBZ0IsU0FBaEIsYUFBZ0I7V0FBTyxlQUFLLElBQUwsQ0FBVSxrQkFBVixpQkFBMkMsWUFBM0M7Q0FBUDs7QUFFdEIsU0FBUyxRQUFULENBQWtCLFdBQWxCLEVBQStCLEtBQS9CLEVBQXNDO0FBQ2xDLFFBQUksQ0FBQyxZQUFZLEdBQVosQ0FBZ0IsS0FBaEIsQ0FBRCxFQUF5QjtBQUN6QixjQUFNLElBQUksS0FBSixxQkFBNEIsS0FBNUIsQ0FBTixDQUR5QjtLQUE3QjtDQURKOztJQU1xQjs7O0FBQ2pCLGFBRGlCLElBQ2pCLENBQVksR0FBWixFQUFvQztZQUFuQixxRUFBZSxrQkFBSTs7OEJBRG5CLE1BQ21COzsyRUFEbkIsa0JBQ21COztBQUVoQyxjQUFLLEdBQUwsR0FBVyxHQUFYLENBRmdDO0FBR2hDLGNBQUssV0FBTCxHQUFtQixZQUFuQixDQUhnQztBQUloQyxjQUFLLEtBQUwsR0FBYSxDQUFiLENBSmdDOztLQUFwQzs7aUJBRGlCOzsrQkFRVjs7O0FBQ0gsbUJBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUNwQyw2QkFBRyxNQUFILENBQVUsV0FBVyxPQUFLLEdBQUwsQ0FBckIsRUFBZ0MsYUFBRyxJQUFILEVBQVMsZUFBTztBQUM1Qyx3QkFBSSxDQUFDLEdBQUQsRUFBTTtBQUNOLGtDQURNO3FCQUFWLE1BRU8sSUFBSSxJQUFJLEtBQUosS0FBYyxDQUFDLENBQUQsRUFBSTtBQUN6QixxQ0FBRyxTQUFILENBQWEsV0FBYixFQUEwQixPQUFLLEdBQUwsRUFBVTttQ0FBTyxNQUFNLE9BQU8sR0FBUCxDQUFOLEdBQW9CLFNBQXBCO3lCQUFQLENBQXBDLENBRHlCO3FCQUF0QixNQUVBO0FBQ0gsK0JBQU8sR0FBUCxFQURHO3FCQUZBO2lCQUg4QixDQUF6QyxDQURvQzthQUFyQixDQUFuQixDQURHOzs7O2lDQWNFOzs7QUFDTCxtQkFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3BDLDZCQUFHLFNBQUgsQ0FBYSxhQUFiLEVBQTRCLE9BQUssR0FBTCxFQUFVOzJCQUFPLE1BQU0sT0FBTyxHQUFQLENBQU4sR0FBb0IsU0FBcEI7aUJBQVAsQ0FBdEMsQ0FEb0M7YUFBckIsQ0FBbkIsQ0FESzs7OztrQ0FNeUM7OztnQkFBMUMsa0VBQVksYUFBYSxTQUFiLENBQXVCLEtBQXZCLGdCQUE4Qjs7QUFDOUMscUJBQVMsWUFBVCxFQUF1QixTQUF2QixFQUQ4Qzs7QUFHOUMsaUJBQUssSUFBTCxDQUFVLEtBQUssR0FBTCxDQUFWLENBQ0ssSUFETCxDQUNVO3VCQUFNLGFBQUcsU0FBSCxDQUFhLFdBQVcsT0FBSyxHQUFMLEVBQVUsV0FBckIsQ0FBYixFQUFnRCxTQUFoRDthQUFOLENBRFYsQ0FFSyxLQUZMLENBRVc7dUJBQU8sUUFBUSxJQUFSLENBQWEsR0FBYjthQUFQLENBRlgsQ0FIOEM7Ozs7dUNBUVA7OztnQkFBOUIsNERBQU0sYUFBYSxLQUFiLENBQW1CLEdBQW5CLGdCQUF3Qjs7QUFDdkMscUJBQVMsU0FBVCxFQUFvQixHQUFwQixFQUR1Qzs7QUFHdkMsbUJBQU8sSUFBSSxPQUFKLENBQVksVUFBQyxPQUFELEVBQVUsTUFBVixFQUFxQjtBQUNwQyw2QkFBRyxTQUFILENBQWEsV0FBVyxPQUFLLEdBQUwsRUFBVSxPQUFyQixDQUFiLEVBQTRDLEdBQTVDLEVBQWlEOzJCQUFPLE1BQU0sT0FBTyxHQUFQLENBQU4sR0FBb0IsU0FBcEI7aUJBQVAsQ0FBakQsQ0FEb0M7YUFBckIsQ0FBbkIsQ0FIdUM7Ozs7c0NBUTdCOzs7QUFDVixtQkFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3BDLDZCQUFHLFFBQUgsQ0FBWSxXQUFXLE9BQUssR0FBTCxFQUFVLE9BQXJCLENBQVosRUFBMkMsTUFBM0MsRUFBbUQsVUFBQyxHQUFELEVBQU0sSUFBTjsyQkFBZSxNQUFNLE9BQU8sR0FBUCxDQUFOLEdBQW9CLFFBQVEsSUFBUixDQUFwQjtpQkFBZixDQUFuRCxDQURvQzthQUFyQixDQUFuQixDQURVOzs7O3FDQU1EOzs7QUFDVCxtQkFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3BDLDZCQUFHLFFBQUgsQ0FBWSxjQUFjLE9BQUssR0FBTCxDQUExQixFQUFxQyxNQUFyQyxFQUE2QyxVQUFDLEdBQUQsRUFBTSxJQUFOOzJCQUFlLE1BQU0sT0FBTyxHQUFQLENBQU4sR0FBb0IsUUFBUSxJQUFSLENBQXBCO2lCQUFmLENBQTdDLENBRG9DO2FBQXJCLENBQW5CLENBRFM7Ozs7NkJBTW9DO2dCQUE5Qyw4REFBUSxhQUFhLEtBQWIsQ0FBbUIsTUFBbkIsZ0JBQXNDO2dCQUFYLDJEQUFLLG9CQUFNOztBQUM3QyxhQUFDLEtBQUssZUFBTCxFQUFELElBQTJCLEtBQUsscUJBQUwsRUFBM0IsQ0FENkM7QUFFN0MsaUJBQUssV0FBTCxDQUFpQixLQUFqQixFQUF3QixFQUF4QixFQUY2Qzs7Ozs4QkFLQztnQkFBOUMsOERBQVEsYUFBYSxLQUFiLENBQW1CLE1BQW5CLGdCQUFzQztnQkFBWCwyREFBSyxvQkFBTTs7QUFDOUMsaUJBQUssY0FBTCxDQUFvQixLQUFwQixFQUEyQixFQUEzQixFQUQ4QztBQUU5QyxhQUFDLEtBQUssZUFBTCxFQUFELElBQTJCLEtBQUssb0JBQUwsRUFBM0IsQ0FGOEM7Ozs7MENBS2hDO0FBQ2QsbUJBQU8sS0FBSyxhQUFMLENBQW1CLGFBQWEsS0FBYixDQUFtQixNQUFuQixDQUFuQixHQUNILEtBQUssYUFBTCxDQUFtQixhQUFhLEtBQWIsQ0FBbUIsTUFBbkIsQ0FEaEIsR0FFSCxLQUFLLGFBQUwsQ0FBbUIsYUFBYSxLQUFiLENBQW1CLE9BQW5CLENBRmhCLENBRE87Ozs7Z0RBTU07OztBQUNwQixpQkFBSyxVQUFMLEdBQWtCLFlBQVksWUFBTTtBQUNoQyx1QkFBSyxXQUFMLEdBQW1CLElBQW5CLENBQXdCLFVBQUMsR0FBRCxFQUFTO0FBQzdCLHdCQUFJLFdBQVcsQ0FBQyxHQUFELENBRGM7QUFFN0Isd0JBQUksT0FBSyxLQUFMLEtBQWUsUUFBZixFQUF5QjtBQUN6QiwrQkFBSyxJQUFMLENBQVUsYUFBYSxLQUFiLENBQW1CLE1BQW5CLEVBQTJCLFFBQXJDLEVBRHlCO0FBRXpCLHFDQUFhLGFBQWEsS0FBYixDQUFtQixJQUFuQixHQUNULE9BQUssSUFBTCxDQUFVLGFBQWEsS0FBYixDQUFtQixNQUFuQixFQUEyQixRQUFyQyxDQURKLEdBRUksT0FBSyxJQUFMLENBQVUsYUFBYSxLQUFiLENBQW1CLE9BQW5CLEVBQTRCLFFBQXRDLENBRkosQ0FGeUI7QUFLekIsK0JBQUssS0FBTCxHQUFhLFFBQWIsQ0FMeUI7cUJBQTdCO2lCQUZvQixDQUF4QixDQURnQzthQUFOLEVBVzNCLEtBQUssV0FBTCxDQVhILENBRG9COzs7OytDQWVEO0FBQ25CLDBCQUFjLEtBQUssVUFBTCxDQUFkLENBRG1COzs7O1dBdkZOOzs7Ozs7QUE0RnJCLE9BQU8sTUFBUCxDQUFjLElBQWQsRUFBb0IsWUFBcEIiLCJmaWxlIjoiYXJ0aWstZ3Bpby5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbiBDb3B5cmlnaHQgKGMpIDIwMTYgQmFydGxvbWllaiBLb3BlciA8YmtvcGVyQGdtYWlsLmNvbT5cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcImV2ZW50c1wiO1xuaW1wb3J0IGFydGlrSU8gZnJvbSBcIi4vYXJ0aWstaW9cIjtcblxuY29uc3Qgc3RhdGljVmFsdWVzID0ge1xuICAgIHZhbHVlOiB7XG4gICAgICAgIEhJR0g6IDEsXG4gICAgICAgIExPVzogMFxuICAgIH0sXG4gICAgZGlyZWN0aW9uOiB7XG4gICAgICAgIElOUFVUOiBcImluXCIsXG4gICAgICAgIE9VVFBVVDogXCJvdXRcIlxuICAgIH0sXG4gICAgZXZlbnQ6IHtcbiAgICAgICAgQ0hBTkdFOiBcImNoYW5nZVwiLFxuICAgICAgICBSSVNJTkc6IFwicmlzaW5nXCIsXG4gICAgICAgIEZBTExJTkc6IFwiZmFsbGluZ1wiXG4gICAgfVxufTtcbmNvbnN0IGRpcmVjdGlvblNldCA9IG5ldyBTZXQoKTtcbmRpcmVjdGlvblNldC5hZGQoc3RhdGljVmFsdWVzLmRpcmVjdGlvbi5PVVRQVVQpLmFkZChzdGF0aWNWYWx1ZXMuZGlyZWN0aW9uLklOUFVUKTtcbmNvbnN0IHZhbHVlc1NldCA9IG5ldyBTZXQoKTtcbnZhbHVlc1NldC5hZGQoc3RhdGljVmFsdWVzLnZhbHVlLkhJR0gpLmFkZChzdGF0aWNWYWx1ZXMudmFsdWUuTE9XKTtcblxuY29uc3QgR1BJT19CQVNFX1BBVEggPSBwYXRoLmpvaW4oXCIvXCIsIFwic3lzXCIsIFwiY2xhc3NcIiwgXCJncGlvXCIpO1xuY29uc3QgR1BJT19CQVNFX1JBV19QQVRIID0gcGF0aC5qb2luKFwiL1wiLCBcInN5c1wiLCBcImRldmljZXNcIiwgXCIxMmQxMDAwMC5hZGNcIiwgXCJpaW86ZGV2aWNlMFwiKTtcbmNvbnN0IEdQSU9fRVhQT1JUID0gcGF0aC5qb2luKEdQSU9fQkFTRV9QQVRILCBcImV4cG9ydFwiKTtcbmNvbnN0IEdQSU9fVU5FWFBPUlQgPSBwYXRoLmpvaW4oR1BJT19CQVNFX1BBVEgsIFwidW5leHBvcnRcIik7XG5cbmNvbnN0IGdldFBpblBhdGggPSAocGluLCBzdWJmb2xkZXIgPSBcIlwiKSA9PiBwYXRoLmpvaW4oR1BJT19CQVNFX1BBVEgsIGBncGlvJHtwaW59YCwgc3ViZm9sZGVyKTtcbmNvbnN0IGdldFJhd1BpblBhdGggPSBwaW4gPT4gcGF0aC5qb2luKEdQSU9fQkFTRV9SQVdfUEFUSCwgYGluX3ZvbHRhZ2Uke3Bpbn1fcmF3YCk7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHNldFZhcmlhYmxlLCB2YWx1ZSkge1xuICAgIGlmICghc2V0VmFyaWFibGUuaGFzKHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWU6ICR7dmFsdWV9YCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcGlvIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcihwaW4sIGRlYm91bmNlVGltZSA9IDEwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGluID0gcGluO1xuICAgICAgICB0aGlzLmRlYm91Y2VUaW1lID0gZGVib3VuY2VUaW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gMDtcbiAgICB9XG5cbiAgICBsb2FkKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMuYWNjZXNzKGdldFBpblBhdGgodGhpcy5waW4pLCBmcy5GX09LLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyci5lcnJubyA9PT0gLTIpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlKEdQSU9fRVhQT1JULCB0aGlzLnBpbiwgZXJyID0+IGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5sb2FkKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlKEdQSU9fVU5FWFBPUlQsIHRoaXMucGluLCBlcnIgPT4gZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwaW5Nb2RlKGRpcmVjdGlvbiA9IHN0YXRpY1ZhbHVlcy5kaXJlY3Rpb24uSU5QVVQpIHtcbiAgICAgICAgdmFsaWRhdGUoZGlyZWN0aW9uU2V0LCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMubG9hZCh0aGlzLnBpbilcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGZzLndyaXRlRmlsZShnZXRQaW5QYXRoKHRoaXMucGluLCBcImRpcmVjdGlvblwiKSwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS53YXJuKGVycikpO1xuICAgIH1cblxuICAgIGRpZ2l0YWxXcml0ZSh2YWwgPSBzdGF0aWNWYWx1ZXMudmFsdWUuTE9XKSB7XG4gICAgICAgIHZhbGlkYXRlKHZhbHVlc1NldCwgdmFsKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlKGdldFBpblBhdGgodGhpcy5waW4sIFwidmFsdWVcIiksIHZhbCwgZXJyID0+IGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlnaXRhbFJlYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy5yZWFkRmlsZShnZXRQaW5QYXRoKHRoaXMucGluLCBcInZhbHVlXCIpLCBcInV0ZjhcIiwgKGVyciwgZGF0YSkgPT4gZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKGRhdGEpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYW5hbG9nUmVhZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZzLnJlYWRGaWxlKGdldFJhd1BpblBhdGgodGhpcy5waW4pLCBcInV0ZjhcIiwgKGVyciwgZGF0YSkgPT4gZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKGRhdGEpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb24oZXZlbnQgPSBzdGF0aWNWYWx1ZXMuZXZlbnQuQ0hBTkdFLCBjYiA9IG51bGwpIHtcbiAgICAgICAgIXRoaXMuX2dldExpc3RlbmVyc05iKCkgJiYgdGhpcy5fc3RhcnRFdmVudFBpblB1bGxpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihldmVudCwgY2IpO1xuICAgIH1cblxuICAgIG9mZihldmVudCA9IHN0YXRpY1ZhbHVlcy5ldmVudC5DSEFOR0UsIGNiID0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBjYik7XG4gICAgICAgICF0aGlzLl9nZXRMaXN0ZW5lcnNOYigpICYmIHRoaXMuX3N0b3BFdmVudFBpblB1bGxpbmcoKTtcbiAgICB9XG5cbiAgICBfZ2V0TGlzdGVuZXJzTmIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyQ291bnQoc3RhdGljVmFsdWVzLmV2ZW50LkNIQU5HRSkgK1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lckNvdW50KHN0YXRpY1ZhbHVlcy5ldmVudC5SSVNJTkcpICtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJDb3VudChzdGF0aWNWYWx1ZXMuZXZlbnQuRkFMTElORyk7XG4gICAgfVxuXG4gICAgX3N0YXJ0RXZlbnRQaW5QdWxsaW5nKCkge1xuICAgICAgICB0aGlzLmludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRpZ2l0YWxSZWFkKCkudGhlbigodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gK3ZhbDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KHN0YXRpY1ZhbHVlcy5ldmVudC5DSEFOR0UsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPT09IHN0YXRpY1ZhbHVlcy52YWx1ZS5ISUdIID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChzdGF0aWNWYWx1ZXMuZXZlbnQuUklTSU5HLCBuZXdWYWx1ZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KHN0YXRpY1ZhbHVlcy5ldmVudC5GQUxMSU5HLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LCB0aGlzLmRlYm91Y2VUaW1lKTtcbiAgICB9XG5cbiAgICBfc3RvcEV2ZW50UGluUHVsbGluZygpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsSWQpO1xuICAgIH1cbn1cblxuT2JqZWN0LmFzc2lnbihHcGlvLCBzdGF0aWNWYWx1ZXMsIGFydGlrSU8pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
