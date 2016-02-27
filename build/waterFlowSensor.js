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

 Water Flow Sensor
 Model: YF-S201
 */

import Gpio from "./artik-gpio";
import Device from "./device";

const calibrationFactor = 7.5;
const maxSpeed = 10;
const watchdogThreshold = 1250;
const getTimestamp = () => (new Date).getTime();

export default class WaterFlowSensor extends Device {
    constructor(pin) {
        super(pin);
        this.reset();
        this.watchdogId = null;
    }

    initialize() {
        this.gpio = new Gpio(this.pin, 10);
        this.gpio.pinMode(Gpio.direction.INPUT);
    }

    turnOn() {
        this.gpio.on(Gpio.event.FALLING, () => this.pulseCount++);
        this.iv = setInterval(() => {
            if (this.pulseCount > 0) {
                this.lastTimestamp = getTimestamp();
                !this.watchdogId && this._watchdogStart();

                let flowRateRaw = this.pulseCount / calibrationFactor;
                this.flowRate = Math.round(flowRateRaw);
                this.percentSpeed = Math.round((flowRateRaw / maxSpeed) * 100);
                this.pulseCount = 0;

                let flowMilliLitres = roundNb((this.flowRate / 60) * 1000);
                this.totalMillilitres += flowMilliLitres;

                this.emit(WaterFlowSensor.event.CHANGE);
            }
        }, 1000);
    }

    turnOff() {
        this.gpio.removeAllListeners(Gpio.event.FALLING);
        this.removeAllListener(WaterFlowSensor.event.CHANGE);
        clearInterval(this.watchdogId);
    }

    getFlowRate() {
        return this.flowRate;
    }

    getTotalMillilitres() {
        return roundNb(this.totalMillilitres);
    }

	getPercentSpeed() {
		return this.percentSpeed;
	}

    getData() {
        return {
            speed: this.flowRate,
            percentSpeed: this.percentSpeed,
            avg: 0,
            percentAvg: 0,
            max: 0,
            maxPercent: 0,
            total: this.totalMillilitres
        }
    }

    on(listener) {
        this.addListener(WaterFlowSensor.event.CHANGE, listener);
    }

    reset() {
        this.pulseCount = 0;
        this.flowRate = 0;
        this.totalMillilitres = 0;
        this.percentSpeed = 0;
        this.lastTimestamp = 0;
    }

    _watchdogStop() {
        clearInterval(this.watchdogId);
        this.watchdogId = null;
        this.percentSpeed = 0;
        this.flowRate = 0;
        this.emit(WaterFlowSensor.event.CHANGE);
    }

    _watchdogStart() {
        this.watchdogId = setInterval(() => {
            getTimestamp() - this.lastTimestamp > watchdogThreshold && this._watchdogStop();
        }, watchdogThreshold);
    }
}

WaterFlowSensor.event = {
    CHANGE: "WaterFlowSensor:change"
};

function roundNb(num) {
    return Math.round(num * 100) / 100;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ3YXRlckZsb3dTZW5zb3IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuIENvcHlyaWdodCAoYykgMjAxNiBCYXJ0bG9taWVqIEtvcGVyIDxia29wZXJAZ21haWwuY29tPlxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cblxuIFdhdGVyIEZsb3cgU2Vuc29yXG4gTW9kZWw6IFlGLVMyMDFcbiAqL1xuXG5pbXBvcnQgR3BpbyBmcm9tIFwiLi9hcnRpay1ncGlvXCI7XG5pbXBvcnQgRGV2aWNlIGZyb20gXCIuL2RldmljZVwiO1xuXG5jb25zdCBjYWxpYnJhdGlvbkZhY3RvciA9IDcuNTtcbmNvbnN0IG1heFNwZWVkID0gMTA7XG5jb25zdCB3YXRjaGRvZ1RocmVzaG9sZCA9IDEyNTA7XG5jb25zdCBnZXRUaW1lc3RhbXAgPSAoKSA9PiAobmV3IERhdGUpLmdldFRpbWUoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2F0ZXJGbG93U2Vuc29yIGV4dGVuZHMgRGV2aWNlIHtcbiAgICBjb25zdHJ1Y3RvcihwaW4pIHtcbiAgICAgICAgc3VwZXIocGluKTtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB0aGlzLndhdGNoZG9nSWQgPSBudWxsO1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHRoaXMuZ3BpbyA9IG5ldyBHcGlvKHRoaXMucGluLCAxMCk7XG4gICAgICAgIHRoaXMuZ3Bpby5waW5Nb2RlKEdwaW8uZGlyZWN0aW9uLklOUFVUKTtcbiAgICB9XG5cbiAgICB0dXJuT24oKSB7XG4gICAgICAgIHRoaXMuZ3Bpby5vbihHcGlvLmV2ZW50LkZBTExJTkcsICgpID0+IHRoaXMucHVsc2VDb3VudCsrKTtcbiAgICAgICAgdGhpcy5pdiA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnB1bHNlQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VGltZXN0YW1wID0gZ2V0VGltZXN0YW1wKCk7XG4gICAgICAgICAgICAgICAgIXRoaXMud2F0Y2hkb2dJZCAmJiB0aGlzLl93YXRjaGRvZ1N0YXJ0KCk7XG5cbiAgICAgICAgICAgICAgICBsZXQgZmxvd1JhdGVSYXcgPSB0aGlzLnB1bHNlQ291bnQgLyBjYWxpYnJhdGlvbkZhY3RvcjtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dSYXRlID0gTWF0aC5yb3VuZChmbG93UmF0ZVJhdyk7XG4gICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50U3BlZWQgPSBNYXRoLnJvdW5kKChmbG93UmF0ZVJhdyAvIG1heFNwZWVkKSAqIDEwMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5wdWxzZUNvdW50ID0gMDtcblxuICAgICAgICAgICAgICAgIGxldCBmbG93TWlsbGlMaXRyZXMgPSByb3VuZE5iKCh0aGlzLmZsb3dSYXRlIC8gNjApICogMTAwMCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbE1pbGxpbGl0cmVzICs9IGZsb3dNaWxsaUxpdHJlcztcblxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChXYXRlckZsb3dTZW5zb3IuZXZlbnQuQ0hBTkdFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxuXG4gICAgdHVybk9mZigpIHtcbiAgICAgICAgdGhpcy5ncGlvLnJlbW92ZUFsbExpc3RlbmVycyhHcGlvLmV2ZW50LkZBTExJTkcpO1xuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVyKFdhdGVyRmxvd1NlbnNvci5ldmVudC5DSEFOR0UpO1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMud2F0Y2hkb2dJZCk7XG4gICAgfVxuXG4gICAgZ2V0Rmxvd1JhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZsb3dSYXRlO1xuICAgIH1cblxuICAgIGdldFRvdGFsTWlsbGlsaXRyZXMoKSB7XG4gICAgICAgIHJldHVybiByb3VuZE5iKHRoaXMudG90YWxNaWxsaWxpdHJlcyk7XG4gICAgfVxuXG5cdGdldFBlcmNlbnRTcGVlZCgpIHtcblx0XHRyZXR1cm4gdGhpcy5wZXJjZW50U3BlZWQ7XG5cdH1cblxuICAgIGdldERhdGEoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzcGVlZDogdGhpcy5mbG93UmF0ZSxcbiAgICAgICAgICAgIHBlcmNlbnRTcGVlZDogdGhpcy5wZXJjZW50U3BlZWQsXG4gICAgICAgICAgICBhdmc6IDAsXG4gICAgICAgICAgICBwZXJjZW50QXZnOiAwLFxuICAgICAgICAgICAgbWF4OiAwLFxuICAgICAgICAgICAgbWF4UGVyY2VudDogMCxcbiAgICAgICAgICAgIHRvdGFsOiB0aGlzLnRvdGFsTWlsbGlsaXRyZXNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uKGxpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIoV2F0ZXJGbG93U2Vuc29yLmV2ZW50LkNIQU5HRSwgbGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnB1bHNlQ291bnQgPSAwO1xuICAgICAgICB0aGlzLmZsb3dSYXRlID0gMDtcbiAgICAgICAgdGhpcy50b3RhbE1pbGxpbGl0cmVzID0gMDtcbiAgICAgICAgdGhpcy5wZXJjZW50U3BlZWQgPSAwO1xuICAgICAgICB0aGlzLmxhc3RUaW1lc3RhbXAgPSAwO1xuICAgIH1cblxuICAgIF93YXRjaGRvZ1N0b3AoKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy53YXRjaGRvZ0lkKTtcbiAgICAgICAgdGhpcy53YXRjaGRvZ0lkID0gbnVsbDtcbiAgICAgICAgdGhpcy5wZXJjZW50U3BlZWQgPSAwO1xuICAgICAgICB0aGlzLmZsb3dSYXRlID0gMDtcbiAgICAgICAgdGhpcy5lbWl0KFdhdGVyRmxvd1NlbnNvci5ldmVudC5DSEFOR0UpO1xuICAgIH1cblxuICAgIF93YXRjaGRvZ1N0YXJ0KCkge1xuICAgICAgICB0aGlzLndhdGNoZG9nSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBnZXRUaW1lc3RhbXAoKSAtIHRoaXMubGFzdFRpbWVzdGFtcCA+IHdhdGNoZG9nVGhyZXNob2xkICYmIHRoaXMuX3dhdGNoZG9nU3RvcCgpO1xuICAgICAgICB9LCB3YXRjaGRvZ1RocmVzaG9sZCk7XG4gICAgfVxufVxuXG5XYXRlckZsb3dTZW5zb3IuZXZlbnQgPSB7XG4gICAgQ0hBTkdFOiBcIldhdGVyRmxvd1NlbnNvcjpjaGFuZ2VcIlxufTtcblxuZnVuY3Rpb24gcm91bmROYihudW0pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChudW0gKiAxMDApIC8gMTAwO1xufSJdLCJmaWxlIjoid2F0ZXJGbG93U2Vuc29yLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
