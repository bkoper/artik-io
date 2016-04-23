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
