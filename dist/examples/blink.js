"use strict";

var _artikGpio = require("./artik-gpio");

var _artikGpio2 = _interopRequireDefault(_artikGpio);

var _led = require("./led");

var _led2 = _interopRequireDefault(_led);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var toggle = true;
var led = new _led2.default(_artikGpio2.default.pins.ARTIK_10.J27[13]);
var interval = 100;
var stopTime = 5000;
var event = _artikGpio2.default.event.RISING;

var iv = setInterval(function () {
    toggle = !toggle;
    toggle ? led.turnOn() : led.turnOff();
}, interval);

led.on(event, callback);

setTimeout(function () {
    led.off(event, callback);
    led.turnOff();
    led.unload();
    clearInterval(iv);
}, stopTime);

function callback(val) {
    console.log(val);
}