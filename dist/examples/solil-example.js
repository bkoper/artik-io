"use strict";

var _soilHumid = require("./soilHumid");

var _soilHumid2 = _interopRequireDefault(_soilHumid);

var _artikGpio = require("./artik-gpio");

var _artikGpio2 = _interopRequireDefault(_artikGpio);

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

var soilSensor = new _soilHumid2.default(_artikGpio2.default.pins.ARTIK_10[3], _artikGpio2.default.pins.ARTIK_10["analog0"]);

var okCallback = function okCallback() {
  return console.log("humid ok");
};
var notOkCallback = function notOkCallback() {
  return console.log("soil not humid");
};

soilSensor.on(_soilHumid2.default.events.SOIL_HUMID, okCallback);
soilSensor.on(_soilHumid2.default.events.SOIL_NOT_HUMID, notOkCallback);

setInterval(function () {
  console.log(soilSensor.getIntense());
}, 100);