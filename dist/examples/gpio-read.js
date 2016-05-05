"use strict";

var _artikGpio = require("./artik-gpio");

var _artikGpio2 = _interopRequireDefault(_artikGpio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gpio = new _artikGpio2.default(_artikGpio2.default.pins.ARTIK_10[3]); /*
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

var gpioAnalog = new _artikGpio2.default(_artikGpio2.default.pins.ARTIK_10["analog0"]);
var min = 1000;
var max = 0;
var interval = 10;

gpio.pinMode(_artikGpio2.default.direction.INPUT);

setInterval(function () {
  return gpioAnalog.analogRead().then(function (val) {
    var oldMin = min;
    var oldMax = max;
    min = val < min ? val : min;
    max = val > max ? val : max;

    (min != oldMin || max !== oldMax) && console.log("min: " + min + ", max: " + max);
  });
}, interval);