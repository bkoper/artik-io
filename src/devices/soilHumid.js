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

import Gpio from "../lib/artik-gpio";
import Device from "./device";

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
        this.analogPin.analogRead().then(val => this.currentIntense = val);
    }
}

SoilHumidity.events = {
    STATUS_CHANGE: Gpio.event.CHANGE,
    SOIL_HUMID: Gpio.event.FALLING,
    SOIL_NOT_HUMID: Gpio.event.RISING
};
