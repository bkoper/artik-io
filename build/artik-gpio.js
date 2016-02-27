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
 */

import fs from "fs";
import path from "path";
import EventEmitter from "events";
import artikIO from "./artik-io";

const staticValues = {
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
const directionSet = new Set();
directionSet.add(staticValues.direction.OUTPUT).add(staticValues.direction.INPUT);
const valuesSet = new Set();
valuesSet.add(staticValues.value.HIGH).add(staticValues.value.LOW);

const GPIO_BASE_PATH = path.join("/", "sys", "class", "gpio");
const GPIO_BASE_RAW_PATH = path.join("/", "sys", "devices", "12d10000.adc", "iio:device0");
const GPIO_EXPORT = path.join(GPIO_BASE_PATH, "export");
const GPIO_UNEXPORT = path.join(GPIO_BASE_PATH, "unexport");

const getPinPath = (pin, subfolder = "") => path.join(GPIO_BASE_PATH, `gpio${pin}`, subfolder);
const getRawPinPath = pin => path.join(GPIO_BASE_RAW_PATH, `in_voltage${pin}_raw`);

function validate(setVariable, value) {
    if (!setVariable.has(value)) {
        throw new Error(`Invalid value: ${value}`);
    }
}

export default class Gpio extends EventEmitter {
    constructor(pin, debounceTime = 10) {
        super();
        this.pin = pin;
        this.debouceTime = debounceTime;
        this.value = 0;
    }

    load() {
        return new Promise((resolve, reject) => {
            fs.access(getPinPath(this.pin), fs.F_OK, err => {
                if (!err) {
                    resolve();
                } else if (err.errno === -2) {
                    fs.writeFile(GPIO_EXPORT, this.pin, err => err ? reject(err) : resolve());
                } else {
                    reject(err);
                }
            });
        });
    }

    unload() {
        return new Promise((resolve, reject) => {
            fs.writeFile(GPIO_UNEXPORT, this.pin, err => err ? reject(err) : resolve());
        });
    }

    pinMode(direction = staticValues.direction.INPUT) {
        validate(directionSet, direction);

        this.load(this.pin)
            .then(() => fs.writeFile(getPinPath(this.pin, "direction"), direction))
            .catch(err => console.warn(err));
    }

    digitalWrite(val = staticValues.value.LOW) {
        validate(valuesSet, val);

        return new Promise((resolve, reject) => {
            fs.writeFile(getPinPath(this.pin, "value"), val, err => err ? reject(err) : resolve());
        });
    }

    digitalRead() {
        return new Promise((resolve, reject) => {
            fs.readFile(getPinPath(this.pin, "value"), "utf8", (err, data) => err ? reject(err) : resolve(data));
        });
    }

    analogRead() {
        return new Promise((resolve, reject) => {
            fs.readFile(getRawPinPath(this.pin), "utf8", (err, data) => err ? reject(err) : resolve(data));
        });
    }

    on(event = staticValues.event.CHANGE, cb = null) {
        !this._getListenersNb() && this._startEventPinPulling();
        this.addListener(event, cb);
    }

    off(event = staticValues.event.CHANGE, cb = null) {
        this.removeListener(event, cb);
        !this._getListenersNb() && this._stopEventPinPulling();
    }

    _getListenersNb() {
        return this.listenerCount(staticValues.event.CHANGE) +
            this.listenerCount(staticValues.event.RISING) +
            this.listenerCount(staticValues.event.FALLING);
    }

    _startEventPinPulling() {
        this.intervalId = setInterval(() => {
            this.digitalRead().then((val) => {
                let newValue = +val;
                if (this.value !== newValue) {
                    this.emit(staticValues.event.CHANGE, newValue);
                    newValue === staticValues.value.HIGH ?
                        this.emit(staticValues.event.RISING, newValue) :
                        this.emit(staticValues.event.FALLING, newValue);
                    this.value = newValue;
                }
            })
        }, this.debouceTime);
    }

    _stopEventPinPulling() {
        clearInterval(this.intervalId);
    }
}

Object.assign(Gpio, staticValues, artikIO);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcnRpay1ncGlvLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbiBDb3B5cmlnaHQgKGMpIDIwMTYgQmFydGxvbWllaiBLb3BlciA8YmtvcGVyQGdtYWlsLmNvbT5cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcImV2ZW50c1wiO1xuaW1wb3J0IGFydGlrSU8gZnJvbSBcIi4vYXJ0aWstaW9cIjtcblxuY29uc3Qgc3RhdGljVmFsdWVzID0ge1xuICAgIHZhbHVlOiB7XG4gICAgICAgIEhJR0g6IDEsXG4gICAgICAgIExPVzogMFxuICAgIH0sXG4gICAgZGlyZWN0aW9uOiB7XG4gICAgICAgIElOUFVUOiBcImluXCIsXG4gICAgICAgIE9VVFBVVDogXCJvdXRcIlxuICAgIH0sXG4gICAgZXZlbnQ6IHtcbiAgICAgICAgQ0hBTkdFOiBcImNoYW5nZVwiLFxuICAgICAgICBSSVNJTkc6IFwicmlzaW5nXCIsXG4gICAgICAgIEZBTExJTkc6IFwiZmFsbGluZ1wiXG4gICAgfVxufTtcbmNvbnN0IGRpcmVjdGlvblNldCA9IG5ldyBTZXQoKTtcbmRpcmVjdGlvblNldC5hZGQoc3RhdGljVmFsdWVzLmRpcmVjdGlvbi5PVVRQVVQpLmFkZChzdGF0aWNWYWx1ZXMuZGlyZWN0aW9uLklOUFVUKTtcbmNvbnN0IHZhbHVlc1NldCA9IG5ldyBTZXQoKTtcbnZhbHVlc1NldC5hZGQoc3RhdGljVmFsdWVzLnZhbHVlLkhJR0gpLmFkZChzdGF0aWNWYWx1ZXMudmFsdWUuTE9XKTtcblxuY29uc3QgR1BJT19CQVNFX1BBVEggPSBwYXRoLmpvaW4oXCIvXCIsIFwic3lzXCIsIFwiY2xhc3NcIiwgXCJncGlvXCIpO1xuY29uc3QgR1BJT19CQVNFX1JBV19QQVRIID0gcGF0aC5qb2luKFwiL1wiLCBcInN5c1wiLCBcImRldmljZXNcIiwgXCIxMmQxMDAwMC5hZGNcIiwgXCJpaW86ZGV2aWNlMFwiKTtcbmNvbnN0IEdQSU9fRVhQT1JUID0gcGF0aC5qb2luKEdQSU9fQkFTRV9QQVRILCBcImV4cG9ydFwiKTtcbmNvbnN0IEdQSU9fVU5FWFBPUlQgPSBwYXRoLmpvaW4oR1BJT19CQVNFX1BBVEgsIFwidW5leHBvcnRcIik7XG5cbmNvbnN0IGdldFBpblBhdGggPSAocGluLCBzdWJmb2xkZXIgPSBcIlwiKSA9PiBwYXRoLmpvaW4oR1BJT19CQVNFX1BBVEgsIGBncGlvJHtwaW59YCwgc3ViZm9sZGVyKTtcbmNvbnN0IGdldFJhd1BpblBhdGggPSBwaW4gPT4gcGF0aC5qb2luKEdQSU9fQkFTRV9SQVdfUEFUSCwgYGluX3ZvbHRhZ2Uke3Bpbn1fcmF3YCk7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlKHNldFZhcmlhYmxlLCB2YWx1ZSkge1xuICAgIGlmICghc2V0VmFyaWFibGUuaGFzKHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWU6ICR7dmFsdWV9YCk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcGlvIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBjb25zdHJ1Y3RvcihwaW4sIGRlYm91bmNlVGltZSA9IDEwKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucGluID0gcGluO1xuICAgICAgICB0aGlzLmRlYm91Y2VUaW1lID0gZGVib3VuY2VUaW1lO1xuICAgICAgICB0aGlzLnZhbHVlID0gMDtcbiAgICB9XG5cbiAgICBsb2FkKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMuYWNjZXNzKGdldFBpblBhdGgodGhpcy5waW4pLCBmcy5GX09LLCBlcnIgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyci5lcnJubyA9PT0gLTIpIHtcbiAgICAgICAgICAgICAgICAgICAgZnMud3JpdGVGaWxlKEdQSU9fRVhQT1JULCB0aGlzLnBpbiwgZXJyID0+IGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5sb2FkKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlKEdQSU9fVU5FWFBPUlQsIHRoaXMucGluLCBlcnIgPT4gZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwaW5Nb2RlKGRpcmVjdGlvbiA9IHN0YXRpY1ZhbHVlcy5kaXJlY3Rpb24uSU5QVVQpIHtcbiAgICAgICAgdmFsaWRhdGUoZGlyZWN0aW9uU2V0LCBkaXJlY3Rpb24pO1xuXG4gICAgICAgIHRoaXMubG9hZCh0aGlzLnBpbilcbiAgICAgICAgICAgIC50aGVuKCgpID0+IGZzLndyaXRlRmlsZShnZXRQaW5QYXRoKHRoaXMucGluLCBcImRpcmVjdGlvblwiKSwgZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS53YXJuKGVycikpO1xuICAgIH1cblxuICAgIGRpZ2l0YWxXcml0ZSh2YWwgPSBzdGF0aWNWYWx1ZXMudmFsdWUuTE9XKSB7XG4gICAgICAgIHZhbGlkYXRlKHZhbHVlc1NldCwgdmFsKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlKGdldFBpblBhdGgodGhpcy5waW4sIFwidmFsdWVcIiksIHZhbCwgZXJyID0+IGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGlnaXRhbFJlYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBmcy5yZWFkRmlsZShnZXRQaW5QYXRoKHRoaXMucGluLCBcInZhbHVlXCIpLCBcInV0ZjhcIiwgKGVyciwgZGF0YSkgPT4gZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKGRhdGEpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYW5hbG9nUmVhZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGZzLnJlYWRGaWxlKGdldFJhd1BpblBhdGgodGhpcy5waW4pLCBcInV0ZjhcIiwgKGVyciwgZGF0YSkgPT4gZXJyID8gcmVqZWN0KGVycikgOiByZXNvbHZlKGRhdGEpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb24oZXZlbnQgPSBzdGF0aWNWYWx1ZXMuZXZlbnQuQ0hBTkdFLCBjYiA9IG51bGwpIHtcbiAgICAgICAgIXRoaXMuX2dldExpc3RlbmVyc05iKCkgJiYgdGhpcy5fc3RhcnRFdmVudFBpblB1bGxpbmcoKTtcbiAgICAgICAgdGhpcy5hZGRMaXN0ZW5lcihldmVudCwgY2IpO1xuICAgIH1cblxuICAgIG9mZihldmVudCA9IHN0YXRpY1ZhbHVlcy5ldmVudC5DSEFOR0UsIGNiID0gbnVsbCkge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGV2ZW50LCBjYik7XG4gICAgICAgICF0aGlzLl9nZXRMaXN0ZW5lcnNOYigpICYmIHRoaXMuX3N0b3BFdmVudFBpblB1bGxpbmcoKTtcbiAgICB9XG5cbiAgICBfZ2V0TGlzdGVuZXJzTmIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyQ291bnQoc3RhdGljVmFsdWVzLmV2ZW50LkNIQU5HRSkgK1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lckNvdW50KHN0YXRpY1ZhbHVlcy5ldmVudC5SSVNJTkcpICtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJDb3VudChzdGF0aWNWYWx1ZXMuZXZlbnQuRkFMTElORyk7XG4gICAgfVxuXG4gICAgX3N0YXJ0RXZlbnRQaW5QdWxsaW5nKCkge1xuICAgICAgICB0aGlzLmludGVydmFsSWQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRpZ2l0YWxSZWFkKCkudGhlbigodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gK3ZhbDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KHN0YXRpY1ZhbHVlcy5ldmVudC5DSEFOR0UsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPT09IHN0YXRpY1ZhbHVlcy52YWx1ZS5ISUdIID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdChzdGF0aWNWYWx1ZXMuZXZlbnQuUklTSU5HLCBuZXdWYWx1ZSkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KHN0YXRpY1ZhbHVlcy5ldmVudC5GQUxMSU5HLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LCB0aGlzLmRlYm91Y2VUaW1lKTtcbiAgICB9XG5cbiAgICBfc3RvcEV2ZW50UGluUHVsbGluZygpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsSWQpO1xuICAgIH1cbn1cblxuT2JqZWN0LmFzc2lnbihHcGlvLCBzdGF0aWNWYWx1ZXMsIGFydGlrSU8pOyJdLCJmaWxlIjoiYXJ0aWstZ3Bpby5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
