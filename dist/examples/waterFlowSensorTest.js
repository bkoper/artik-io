"use strict";

var _artikGpio = require("./artik-gpio");

var _artikGpio2 = _interopRequireDefault(_artikGpio);

var _waterFlowSensor = require("./waterFlowSensor");

var _waterFlowSensor2 = _interopRequireDefault(_waterFlowSensor);

var _led = require("./led");

var _led2 = _interopRequireDefault(_led);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sensor = new _waterFlowSensor2.default(_artikGpio2.default.pins.ARTIK_10[2]); /*
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

var ledGreen = new _led2.default(_artikGpio2.default.pins.ARTIK_10[13]);
var ledRed = new _led2.default(_artikGpio2.default.pins.ARTIK_10[12]);

var changeListner = function changeListner() {
    console.log(sensor.getFlowRate() + " mL/Sec, total: " + sensor.getTotalMillilitres() + " ml");
    console.log("speed: ", sensor.percentSpeed, "%");
    console.log("--------------------");

    if (sensor.getTotalMillilitres() > 500) {
        ledRed.turnOn();
        ledGreen.turnOff();
    } else {
        ledRed.turnOff();
        ledGreen.turnOn();
    }
};

sensor.on(changeListner);
sensor.turnOn();

setTimeout(function () {
    sensor.turnOff();
    sensor.unload();

    ledGreen.turnOff();
    ledGreen.unload();
    ledRed.turnOff();
    ledRed.unload();

    console.log("total: ", sensor.totalMillilitres, "ml");
}, 50000);