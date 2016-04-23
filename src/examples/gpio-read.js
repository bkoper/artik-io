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

import Gpio from "./artik-gpio";

let gpio = new Gpio(Gpio.pins.ARTIK_10[3]);
let gpioAnalog = new Gpio(Gpio.pins.ARTIK_10["analog0"]);
let min = 1000;
let max = 0;
const interval = 10;

gpio.pinMode(Gpio.direction.INPUT);

setInterval(() => gpioAnalog.analogRead().then((val) => {
    let oldMin = min;
    let oldMax = max;
    min = val < min ? val : min;
    max = val > max ? val : max;

    (min != oldMin || max !== oldMax) && console.log(`min: ${min}, max: ${max}`);
}), interval);
