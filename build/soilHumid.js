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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                Soil humidity sensor
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var maxAnalogVal = 950;
var minAnalogVal = 710;
var range = maxAnalogVal - minAnalogVal;

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
				// only rough percent estimation, between 0 to 100
				//let value = 100 - Math.round(((+val - minAnalogVal) / range) * 100);
				//this.currentIntense = value > 100 ? 100 : (value < 0 ? 0 : value);
				_this2.currentIntense = val;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvaWxIdW1pZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZCQSxJQUFNLGVBQWUsR0FBZjtBQUNOLElBQU0sZUFBZSxHQUFmO0FBQ04sSUFBTSxRQUFRLGVBQWUsWUFBZjs7Ozs7OztJQU9POzs7QUFDcEIsVUFEb0IsWUFDcEIsQ0FBWSxZQUFaLEVBQTBCLFdBQTFCLEVBQXVDO3dCQURuQixjQUNtQjs7cUVBRG5CLHlCQUViLGVBRGdDOztBQUd0QyxRQUFLLFVBQUwsR0FBa0IsTUFBSyxJQUFMLENBSG9CO0FBSXRDLFFBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixvQkFBSyxTQUFMLENBQWUsS0FBZixDQUF4QixDQUpzQztBQUt0QyxRQUFLLFNBQUwsR0FBaUIsd0JBQVMsV0FBVCxDQUFqQixDQUxzQztBQU10QyxRQUFLLFNBQUwsR0FBaUIsWUFBWSxNQUFLLHFCQUFMLENBQTJCLElBQTNCLE9BQVosRUFBbUQsRUFBbkQsQ0FBakIsQ0FOc0M7QUFPdEMsUUFBSyxjQUFMLEdBQXNCLENBQXRCLENBUHNDOztFQUF2Qzs7Y0FEb0I7OytCQVdQO0FBQ1osVUFBTyxLQUFLLGNBQUwsQ0FESzs7OztxQkFJVixPQUFPLFVBQVU7QUFDbkIsUUFBSyxVQUFMLENBQWdCLEVBQWhCLENBQW1CLEtBQW5CLEVBQTBCLFFBQTFCLEVBRG1COzs7O3NCQUloQixPQUFPLFVBQVU7QUFDcEIsUUFBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLEtBQXBCLEVBQTJCLFFBQTNCLEVBRG9COzs7OzRCQUlYO0FBQ1QsUUFBSyxVQUFMLENBQWdCLGNBQWhCLENBQStCLG9CQUFLLEtBQUwsQ0FBVyxNQUFYLEVBQW1CLEtBQUsscUJBQUwsQ0FBbEQsQ0FEUztBQUVULDhCQXpCbUIsb0RBeUJuQixDQUZTOzs7OzBDQU1jOzs7QUFDdkIsUUFBSyxTQUFMLENBQWUsVUFBZixHQUE0QixJQUE1QixDQUFpQyxlQUFPOzs7O0FBSXZDLFdBQUssY0FBTCxHQUFzQixHQUF0QixDQUp1QztJQUFQLENBQWpDLENBRHVCOzs7O1FBN0JKOzs7Ozs7QUF1Q3JCLGFBQWEsTUFBYixHQUFzQjtBQUNyQixnQkFBZSxvQkFBSyxLQUFMLENBQVcsTUFBWDtBQUNmLGFBQVksb0JBQUssS0FBTCxDQUFXLE9BQVg7QUFDWixpQkFBZ0Isb0JBQUssS0FBTCxDQUFXLE1BQVg7Q0FIakIiLCJmaWxlIjoic29pbEh1bWlkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuIENvcHlyaWdodCAoYykgMjAxNiBCYXJ0bG9taWVqIEtvcGVyIDxia29wZXJAZ21haWwuY29tPlxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cblxuIFNvaWwgaHVtaWRpdHkgc2Vuc29yXG4gKi9cblxuaW1wb3J0IEdwaW8gZnJvbSBcIi4vYXJ0aWstZ3Bpb1wiO1xuaW1wb3J0IERldmljZSBmcm9tIFwiLi9kZXZpY2VcIjtcblxuY29uc3QgbWF4QW5hbG9nVmFsID0gOTUwO1xuY29uc3QgbWluQW5hbG9nVmFsID0gNzEwO1xuY29uc3QgcmFuZ2UgPSBtYXhBbmFsb2dWYWwgLSBtaW5BbmFsb2dWYWw7XG5cbi8vIH45NDAgbm90IGh1bWlkXG4vLyB+ODcwIGh1bWlkIG9rXG4vLyB+ODAwIHZlcnkgaHVtaWRcbi8vIH43NTAgdG8gaHVtaWRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29pbEh1bWlkaXR5IGV4dGVuZHMgRGV2aWNlIHtcblx0Y29uc3RydWN0b3IoZGlnaXRhbFBpbk5iLCBhbmFsb2dQaW5OYikge1xuXHRcdHN1cGVyKGRpZ2l0YWxQaW5OYik7XG5cblx0XHR0aGlzLmRpZ2l0YWxQaW4gPSB0aGlzLmdwaW87XG5cdFx0dGhpcy5kaWdpdGFsUGluLnBpbk1vZGUoR3Bpby5kaXJlY3Rpb24uSU5QVVQpO1xuXHRcdHRoaXMuYW5hbG9nUGluID0gbmV3IEdwaW8oYW5hbG9nUGluTmIpO1xuXHRcdHRoaXMucHVsbGluZ0lkID0gc2V0SW50ZXJ2YWwodGhpcy5fdXBkYXRlQ3VycmVudEludGVuc2UuYmluZCh0aGlzKSwgNTApO1xuXHRcdHRoaXMuY3VycmVudEludGVuc2UgPSAwO1xuXHR9XG5cblx0Z2V0SW50ZW5zZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50SW50ZW5zZTtcblx0fVxuXG5cdG9uKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vbihldmVudCwgY2FsbGJhY2spO1xuXHR9XG5cblx0b2ZmKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcblx0fVxuXG5cdHR1cm5PZmYoKSB7XG5cdFx0dGhpcy5kaWdpdGFsUGluLnJlbW92ZUxpc3RlbmVyKEdwaW8uZXZlbnQuQ0hBTkdFLCB0aGlzLl91cGRhdGVDdXJyZW50SW50ZW5zZSk7XG5cdFx0c3VwZXIudHVybk9mZigpO1xuXG5cdH1cblxuXHRfdXBkYXRlQ3VycmVudEludGVuc2UoKSB7XG5cdFx0dGhpcy5hbmFsb2dQaW4uYW5hbG9nUmVhZCgpLnRoZW4odmFsID0+IHtcblx0XHRcdC8vIG9ubHkgcm91Z2ggcGVyY2VudCBlc3RpbWF0aW9uLCBiZXR3ZWVuIDAgdG8gMTAwXG5cdFx0XHQvL2xldCB2YWx1ZSA9IDEwMCAtIE1hdGgucm91bmQoKCgrdmFsIC0gbWluQW5hbG9nVmFsKSAvIHJhbmdlKSAqIDEwMCk7XG5cdFx0XHQvL3RoaXMuY3VycmVudEludGVuc2UgPSB2YWx1ZSA+IDEwMCA/IDEwMCA6ICh2YWx1ZSA8IDAgPyAwIDogdmFsdWUpO1xuXHRcdFx0dGhpcy5jdXJyZW50SW50ZW5zZSA9IHZhbDtcblx0XHR9KTtcblx0fVxufVxuXG5Tb2lsSHVtaWRpdHkuZXZlbnRzID0ge1xuXHRTVEFUVVNfQ0hBTkdFOiBHcGlvLmV2ZW50LkNIQU5HRSxcblx0U09JTF9IVU1JRDogR3Bpby5ldmVudC5GQUxMSU5HLFxuXHRTT0lMX05PVF9IVU1JRDogR3Bpby5ldmVudC5SSVNJTkdcbn07Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
