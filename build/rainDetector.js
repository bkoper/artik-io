"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Rain/Snow detector
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Model: YL-83
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var maxAnalogVal = 930;
var minAnalogVal = 830;
var range = maxAnalogVal - minAnalogVal;
var debaunceTime = 1000;

var RainDetector = function (_Device) {
	_inherits(RainDetector, _Device);

	function RainDetector(digitalPinNb, analogPinNb) {
		_classCallCheck(this, RainDetector);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RainDetector).call(this, digitalPinNb));

		_this.digitalPin = _this.gpio;
		_this.digitalPin.pinMode(_artikGpio2.default.direction.INPUT);
		_this.analogPin = new _artikGpio2.default(analogPinNb);
		_this.pullingId = setInterval(_this._updateCurrentIntense.bind(_this), 200);
		_this.currentIntense = 0;
		return _this;
	}

	_createClass(RainDetector, [{
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
			_get(Object.getPrototypeOf(RainDetector.prototype), "turnOff", this).call(this);
		}
	}, {
		key: "_updateCurrentIntense",
		value: function _updateCurrentIntense() {
			var _this2 = this;

			this.analogPin.analogRead().then(function (val) {
				// only rough percent estimation, between 0 to 100
				var value = 100 - Math.round((+val - minAnalogVal) / range * 100);
				_this2.currentIntense = value > 100 ? 100 : value < 0 ? 0 : value;
			});
		}
	}]);

	return RainDetector;
}(_device2.default);

exports.default = RainDetector;


RainDetector.events = {
	STATUS_CHANGE: _artikGpio2.default.event.CHANGE,
	START_RAINING: _artikGpio2.default.event.FALLING,
	STOP_RAINING: _artikGpio2.default.event.RISING
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJhaW5EZXRlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QkEsSUFBTSxlQUFlLEdBQWY7QUFDTixJQUFNLGVBQWUsR0FBZjtBQUNOLElBQU0sUUFBUSxlQUFlLFlBQWY7QUFDZCxJQUFNLGVBQWUsSUFBZjs7SUFHZTs7O0FBQ3BCLFVBRG9CLFlBQ3BCLENBQVksWUFBWixFQUEwQixXQUExQixFQUF1Qzt3QkFEbkIsY0FDbUI7O3FFQURuQix5QkFFYixlQURnQzs7QUFHdEMsUUFBSyxVQUFMLEdBQWtCLE1BQUssSUFBTCxDQUhvQjtBQUl0QyxRQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBd0Isb0JBQUssU0FBTCxDQUFlLEtBQWYsQ0FBeEIsQ0FKc0M7QUFLdEMsUUFBSyxTQUFMLEdBQWlCLHdCQUFTLFdBQVQsQ0FBakIsQ0FMc0M7QUFNdEMsUUFBSyxTQUFMLEdBQWlCLFlBQVksTUFBSyxxQkFBTCxDQUEyQixJQUEzQixPQUFaLEVBQW1ELEdBQW5ELENBQWpCLENBTnNDO0FBT3RDLFFBQUssY0FBTCxHQUFzQixDQUF0QixDQVBzQzs7RUFBdkM7O2NBRG9COzsrQkFXUDtBQUNaLFVBQU8sS0FBSyxjQUFMLENBREs7Ozs7cUJBSVYsT0FBTyxVQUFVO0FBQ25CLFFBQUssVUFBTCxDQUFnQixFQUFoQixDQUFtQixLQUFuQixFQUEwQixRQUExQixFQURtQjs7OztzQkFJaEIsT0FBTyxVQUFVO0FBQ3BCLFFBQUssVUFBTCxDQUFnQixHQUFoQixDQUFvQixLQUFwQixFQUEyQixRQUEzQixFQURvQjs7Ozs0QkFJWDtBQUNULFFBQUssVUFBTCxDQUFnQixjQUFoQixDQUErQixvQkFBSyxLQUFMLENBQVcsTUFBWCxFQUFtQixLQUFLLHFCQUFMLENBQWxELENBRFM7QUFFVCw4QkF6Qm1CLG9EQXlCbkIsQ0FGUzs7OzswQ0FNYzs7O0FBQ3ZCLFFBQUssU0FBTCxDQUFlLFVBQWYsR0FBNEIsSUFBNUIsQ0FBaUMsZUFBTzs7QUFFdkMsUUFBSSxRQUFRLE1BQU0sS0FBSyxLQUFMLENBQVcsQ0FBRSxDQUFDLEdBQUQsR0FBTyxZQUFQLENBQUQsR0FBd0IsS0FBeEIsR0FBaUMsR0FBbEMsQ0FBakIsQ0FGMkI7QUFHdkMsV0FBSyxjQUFMLEdBQXNCLFFBQVEsR0FBUixHQUFjLEdBQWQsR0FBcUIsUUFBUSxDQUFSLEdBQVksQ0FBWixHQUFnQixLQUFoQixDQUhKO0lBQVAsQ0FBakMsQ0FEdUI7Ozs7UUE3Qko7Ozs7OztBQXNDckIsYUFBYSxNQUFiLEdBQXNCO0FBQ3JCLGdCQUFlLG9CQUFLLEtBQUwsQ0FBVyxNQUFYO0FBQ2YsZ0JBQWUsb0JBQUssS0FBTCxDQUFXLE9BQVg7QUFDZixlQUFjLG9CQUFLLEtBQUwsQ0FBVyxNQUFYO0NBSGYiLCJmaWxlIjoicmFpbkRldGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuIENvcHlyaWdodCAoYykgMjAxNiBCYXJ0bG9taWVqIEtvcGVyIDxia29wZXJAZ21haWwuY29tPlxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cblxuIFJhaW4vU25vdyBkZXRlY3RvclxuIE1vZGVsOiBZTC04M1xuICovXG5cbmltcG9ydCBHcGlvIGZyb20gXCIuL2FydGlrLWdwaW9cIjtcbmltcG9ydCBEZXZpY2UgZnJvbSBcIi4vZGV2aWNlXCI7XG5cbmNvbnN0IG1heEFuYWxvZ1ZhbCA9IDkzMDtcbmNvbnN0IG1pbkFuYWxvZ1ZhbCA9IDgzMDtcbmNvbnN0IHJhbmdlID0gbWF4QW5hbG9nVmFsIC0gbWluQW5hbG9nVmFsO1xuY29uc3QgZGViYXVuY2VUaW1lID0gMTAwMDtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWluRGV0ZWN0b3IgZXh0ZW5kcyBEZXZpY2Uge1xuXHRjb25zdHJ1Y3RvcihkaWdpdGFsUGluTmIsIGFuYWxvZ1Bpbk5iKSB7XG5cdFx0c3VwZXIoZGlnaXRhbFBpbk5iKTtcblxuXHRcdHRoaXMuZGlnaXRhbFBpbiA9IHRoaXMuZ3Bpbztcblx0XHR0aGlzLmRpZ2l0YWxQaW4ucGluTW9kZShHcGlvLmRpcmVjdGlvbi5JTlBVVCk7XG5cdFx0dGhpcy5hbmFsb2dQaW4gPSBuZXcgR3BpbyhhbmFsb2dQaW5OYik7XG5cdFx0dGhpcy5wdWxsaW5nSWQgPSBzZXRJbnRlcnZhbCh0aGlzLl91cGRhdGVDdXJyZW50SW50ZW5zZS5iaW5kKHRoaXMpLCAyMDApO1xuXHRcdHRoaXMuY3VycmVudEludGVuc2UgPSAwO1xuXHR9XG5cblx0Z2V0SW50ZW5zZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50SW50ZW5zZTtcblx0fVxuXG5cdG9uKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vbihldmVudCwgY2FsbGJhY2spO1xuXHR9XG5cblx0b2ZmKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcblx0fVxuXG5cdHR1cm5PZmYoKSB7XG5cdFx0dGhpcy5kaWdpdGFsUGluLnJlbW92ZUxpc3RlbmVyKEdwaW8uZXZlbnQuQ0hBTkdFLCB0aGlzLl91cGRhdGVDdXJyZW50SW50ZW5zZSk7XG5cdFx0c3VwZXIudHVybk9mZigpO1xuXG5cdH1cblxuXHRfdXBkYXRlQ3VycmVudEludGVuc2UoKSB7XG5cdFx0dGhpcy5hbmFsb2dQaW4uYW5hbG9nUmVhZCgpLnRoZW4odmFsID0+IHtcblx0XHRcdC8vIG9ubHkgcm91Z2ggcGVyY2VudCBlc3RpbWF0aW9uLCBiZXR3ZWVuIDAgdG8gMTAwXG5cdFx0XHRsZXQgdmFsdWUgPSAxMDAgLSBNYXRoLnJvdW5kKCgoK3ZhbCAtIG1pbkFuYWxvZ1ZhbCkgLyByYW5nZSkgKiAxMDApO1xuXHRcdFx0dGhpcy5jdXJyZW50SW50ZW5zZSA9IHZhbHVlID4gMTAwID8gMTAwIDogKHZhbHVlIDwgMCA/IDAgOiB2YWx1ZSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuUmFpbkRldGVjdG9yLmV2ZW50cyA9IHtcblx0U1RBVFVTX0NIQU5HRTogR3Bpby5ldmVudC5DSEFOR0UsXG5cdFNUQVJUX1JBSU5JTkc6IEdwaW8uZXZlbnQuRkFMTElORyxcblx0U1RPUF9SQUlOSU5HOiBHcGlvLmV2ZW50LlJJU0lOR1xufTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
