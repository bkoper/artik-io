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

 Rain/Snow detector
 Model: YL-83
 */

import Gpio from "./artik-gpio";
import Device from "./device";

const maxAnalogVal = 930;
const minAnalogVal = 830;
const range = maxAnalogVal - minAnalogVal;
const debaunceTime = 1000;


export default class RainDetector extends Device {
	constructor(digitalPinNb, analogPinNb) {
		super(digitalPinNb);

		this.digitalPin = this.gpio;
		this.digitalPin.pinMode(Gpio.direction.INPUT);
		this.analogPin = new Gpio(analogPinNb);
		this.pullingId = setInterval(this._updateCurrentIntense.bind(this), 200);
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
			let value = 100 - Math.round(((+val - minAnalogVal) / range) * 100);
			this.currentIntense = value > 100 ? 100 : (value < 0 ? 0 : value);
		});
	}
}

RainDetector.events = {
	STATUS_CHANGE: Gpio.event.CHANGE,
	START_RAINING: Gpio.event.FALLING,
	STOP_RAINING: Gpio.event.RISING
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyYWluRGV0ZWN0b3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuIENvcHlyaWdodCAoYykgMjAxNiBCYXJ0bG9taWVqIEtvcGVyIDxia29wZXJAZ21haWwuY29tPlxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cblxuIFJhaW4vU25vdyBkZXRlY3RvclxuIE1vZGVsOiBZTC04M1xuICovXG5cbmltcG9ydCBHcGlvIGZyb20gXCIuL2FydGlrLWdwaW9cIjtcbmltcG9ydCBEZXZpY2UgZnJvbSBcIi4vZGV2aWNlXCI7XG5cbmNvbnN0IG1heEFuYWxvZ1ZhbCA9IDkzMDtcbmNvbnN0IG1pbkFuYWxvZ1ZhbCA9IDgzMDtcbmNvbnN0IHJhbmdlID0gbWF4QW5hbG9nVmFsIC0gbWluQW5hbG9nVmFsO1xuY29uc3QgZGViYXVuY2VUaW1lID0gMTAwMDtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSYWluRGV0ZWN0b3IgZXh0ZW5kcyBEZXZpY2Uge1xuXHRjb25zdHJ1Y3RvcihkaWdpdGFsUGluTmIsIGFuYWxvZ1Bpbk5iKSB7XG5cdFx0c3VwZXIoZGlnaXRhbFBpbk5iKTtcblxuXHRcdHRoaXMuZGlnaXRhbFBpbiA9IHRoaXMuZ3Bpbztcblx0XHR0aGlzLmRpZ2l0YWxQaW4ucGluTW9kZShHcGlvLmRpcmVjdGlvbi5JTlBVVCk7XG5cdFx0dGhpcy5hbmFsb2dQaW4gPSBuZXcgR3BpbyhhbmFsb2dQaW5OYik7XG5cdFx0dGhpcy5wdWxsaW5nSWQgPSBzZXRJbnRlcnZhbCh0aGlzLl91cGRhdGVDdXJyZW50SW50ZW5zZS5iaW5kKHRoaXMpLCAyMDApO1xuXHRcdHRoaXMuY3VycmVudEludGVuc2UgPSAwO1xuXHR9XG5cblx0Z2V0SW50ZW5zZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5jdXJyZW50SW50ZW5zZTtcblx0fVxuXG5cdG9uKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vbihldmVudCwgY2FsbGJhY2spO1xuXHR9XG5cblx0b2ZmKGV2ZW50LCBjYWxsYmFjaykge1xuXHRcdHRoaXMuZGlnaXRhbFBpbi5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcblx0fVxuXG5cdHR1cm5PZmYoKSB7XG5cdFx0dGhpcy5kaWdpdGFsUGluLnJlbW92ZUxpc3RlbmVyKEdwaW8uZXZlbnQuQ0hBTkdFLCB0aGlzLl91cGRhdGVDdXJyZW50SW50ZW5zZSk7XG5cdFx0c3VwZXIudHVybk9mZigpO1xuXG5cdH1cblxuXHRfdXBkYXRlQ3VycmVudEludGVuc2UoKSB7XG5cdFx0dGhpcy5hbmFsb2dQaW4uYW5hbG9nUmVhZCgpLnRoZW4odmFsID0+IHtcblx0XHRcdC8vIG9ubHkgcm91Z2ggcGVyY2VudCBlc3RpbWF0aW9uLCBiZXR3ZWVuIDAgdG8gMTAwXG5cdFx0XHRsZXQgdmFsdWUgPSAxMDAgLSBNYXRoLnJvdW5kKCgoK3ZhbCAtIG1pbkFuYWxvZ1ZhbCkgLyByYW5nZSkgKiAxMDApO1xuXHRcdFx0dGhpcy5jdXJyZW50SW50ZW5zZSA9IHZhbHVlID4gMTAwID8gMTAwIDogKHZhbHVlIDwgMCA/IDAgOiB2YWx1ZSk7XG5cdFx0fSk7XG5cdH1cbn1cblxuUmFpbkRldGVjdG9yLmV2ZW50cyA9IHtcblx0U1RBVFVTX0NIQU5HRTogR3Bpby5ldmVudC5DSEFOR0UsXG5cdFNUQVJUX1JBSU5JTkc6IEdwaW8uZXZlbnQuRkFMTElORyxcblx0U1RPUF9SQUlOSU5HOiBHcGlvLmV2ZW50LlJJU0lOR1xufTsiXSwiZmlsZSI6InJhaW5EZXRlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
