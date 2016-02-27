/*
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

import Gpio from "./artik-gpio";
import Device from "./device";

const maxAnalogVal = 950;
const minAnalogVal = 710;
const range = maxAnalogVal - minAnalogVal;

// ~940 not humid
// ~870 humid ok
// ~800 very humid
// ~750 to humid

export default class SoilHumidity extends Device {
	constructor(digitalPinNb, analogPinNb) {
		super(digitalPinNb);

		this.digitalPin = this.gpio;
		this.digitalPin.pinMode(Gpio.direction.INPUT);
		this.analogPin = new Gpio(analogPinNb);
		this.pullingId = setInterval(this._updateCurrentIntense.bind(this), 50);
		this.currentIntense = 0;
	}

	getIntense() {
		return this.currentIntense;
	}

	on(event, callback) {
		this.digitalPin.on(event, callback);
	}

	off(event, callback) {
		this.digitalPin.off(event, callback);
	}

	turnOff() {
		this.digitalPin.removeListener(Gpio.event.CHANGE, this._updateCurrentIntense);
		super.turnOff();

	}

	_updateCurrentIntense() {
		this.analogPin.analogRead().then(val => {
			// only rough percent estimation, between 0 to 100
			//let value = 100 - Math.round(((+val - minAnalogVal) / range) * 100);
			//this.currentIntense = value > 100 ? 100 : (value < 0 ? 0 : value);
			this.currentIntense = val;
		});
	}
}

SoilHumidity.events = {
	STATUS_CHANGE: Gpio.event.CHANGE,
	SOIL_HUMID: Gpio.event.FALLING,
	SOIL_NOT_HUMID: Gpio.event.RISING
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzb2lsSHVtaWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuIENvcHlyaWdodCAoYykgMjAxNiBCYXJ0bG9taWVqIEtvcGVyIDxia29wZXJAZ21haWwuY29tPlxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cblxuIFNvaWwgaHVtaWRpdHkgc2Vuc29yXG4gKi9cblxuaW1wb3J0IEdwaW8gZnJvbSBcIi4vYXJ0aWstZ3Bpb1wiO1xuaW1wb3J0IERldmljZSBmcm9tIFwiLi9kZXZpY2VcIjtcblxuY29uc3QgbWF4QW5hbG9nVmFsID0gOTUwO1xuY29uc3QgbWluQW5hbG9nVmFsID0gNzEwO1xuY29uc3QgcmFuZ2UgPSBtYXhBbmFsb2dWYWwgLSBtaW5BbmFsb2dWYWw7XG5cbi8vIH45NDAgbm90IGh1bWlkXG4vLyB+ODcwIGh1bWlkIG9rXG4vLyB+ODAwIHZlcnkgaHVtaWRcbi8vIH43NTAgdG8gaHVtaWRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29pbEh1bWlkaXR5IGV4dGVuZHMgRGV2aWNlIHtcblx0Y29uc3RydWN0b3IoZGlnaXRhbFBpbk5iLCBhbmFsb2dQaW5OYikge1xuXHRcdHN1cGVyKGRpZ2l0YWxQaW5OYik7XG5cblx0XHR0aGlzLmRpZ2l0YWxQaW4gPSB0aGlzLmdwaW87XG5cdFx0dGhpcy5kaWdpdGFsUGluLnBpbk1vZGUoR3Bpby5kaXJlY3Rpb24uSU5QVVQpO1xuXHRcdHRoaXMuYW5hbG9nUGluID0gbmV3IEdwaW8oYW5hbG9nUGluTmIpO1xuXHRcdHRoaXMucHVsbGluZ0lkID0gc2V0SW50ZXJ2YWwodGhpcy5fdXBkYXRlQ3VycmVudEludGVuc2UuYmluZCh0aGlzKSwgNTApO1xuXHRcdHRoaXMuY3VycmVudEludGVuc2UgPSAwO1xuXHR9XG5cblx0Z2V0SW50ZW5zZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50SW50ZW5zZTtcblx0fVxuXG5cdG9uKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vbihldmVudCwgY2FsbGJhY2spO1xuXHR9XG5cblx0b2ZmKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcblx0fVxuXG5cdHR1cm5PZmYoKSB7XG5cdFx0dGhpcy5kaWdpdGFsUGluLnJlbW92ZUxpc3RlbmVyKEdwaW8uZXZlbnQuQ0hBTkdFLCB0aGlzLl91cGRhdGVDdXJyZW50SW50ZW5zZSk7XG5cdFx0c3VwZXIudHVybk9mZigpO1xuXG5cdH1cblxuXHRfdXBkYXRlQ3VycmVudEludGVuc2UoKSB7XG5cdFx0dGhpcy5hbmFsb2dQaW4uYW5hbG9nUmVhZCgpLnRoZW4odmFsID0+IHtcblx0XHRcdC8vIG9ubHkgcm91Z2ggcGVyY2VudCBlc3RpbWF0aW9uLCBiZXR3ZWVuIDAgdG8gMTAwXG5cdFx0XHQvL2xldCB2YWx1ZSA9IDEwMCAtIE1hdGgucm91bmQoKCgrdmFsIC0gbWluQW5hbG9nVmFsKSAvIHJhbmdlKSAqIDEwMCk7XG5cdFx0XHQvL3RoaXMuY3VycmVudEludGVuc2UgPSB2YWx1ZSA+IDEwMCA/IDEwMCA6ICh2YWx1ZSA8IDAgPyAwIDogdmFsdWUpO1xuXHRcdFx0dGhpcy5jdXJyZW50SW50ZW5zZSA9IHZhbDtcblx0XHR9KTtcblx0fVxufVxuXG5Tb2lsSHVtaWRpdHkuZXZlbnRzID0ge1xuXHRTVEFUVVNfQ0hBTkdFOiBHcGlvLmV2ZW50LkNIQU5HRSxcblx0U09JTF9IVU1JRDogR3Bpby5ldmVudC5GQUxMSU5HLFxuXHRTT0lMX05PVF9IVU1JRDogR3Bpby5ldmVudC5SSVNJTkdcbn07Il0sImZpbGUiOiJzb2lsSHVtaWQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
