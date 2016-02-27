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
import WaterFlowSensor from "./waterFlowSensor";
import Led from "./led";

let toggle = true;
let sensor = new WaterFlowSensor(Gpio.pins.ARTIK_10[2]);
let ledGreen = new Led(Gpio.pins.ARTIK_10[13]);
let ledRed = new Led(Gpio.pins.ARTIK_10[12]);

let changeListner = () => {
    console.log(sensor.getFlowRate() + " mL/Sec, total: " + sensor.getTotalMillilitres() + " ml");
    console.log("speed: ", sensor.percentSpeed, "%");
    console.log("--------------------");

    if(sensor.getTotalMillilitres() > 500){
        ledRed.turnOn();
        ledGreen.turnOff();
    } else {
        ledRed.turnOff();
        ledGreen.turnOn();
    }
};

sensor.on(changeListner);
sensor.turnOn();

setTimeout(() => {
    sensor.turnOff();
    sensor.unload();

    ledGreen.turnOff();
    ledGreen.unload();
    ledRed.turnOff();
    ledRed.unload();

    console.log("total: ", sensor.totalMillilitres, "ml");
}, 50000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ3YXRlckZsb3dTZW5zb3JUZXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbiBDb3B5cmlnaHQgKGMpIDIwMTYgQmFydGxvbWllaiBLb3BlciA8YmtvcGVyQGdtYWlsLmNvbT5cblxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG8gZGVhbFxuIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0IEdwaW8gZnJvbSBcIi4vYXJ0aWstZ3Bpb1wiO1xuaW1wb3J0IFdhdGVyRmxvd1NlbnNvciBmcm9tIFwiLi93YXRlckZsb3dTZW5zb3JcIjtcbmltcG9ydCBMZWQgZnJvbSBcIi4vbGVkXCI7XG5cbmxldCB0b2dnbGUgPSB0cnVlO1xubGV0IHNlbnNvciA9IG5ldyBXYXRlckZsb3dTZW5zb3IoR3Bpby5waW5zLkFSVElLXzEwWzJdKTtcbmxldCBsZWRHcmVlbiA9IG5ldyBMZWQoR3Bpby5waW5zLkFSVElLXzEwWzEzXSk7XG5sZXQgbGVkUmVkID0gbmV3IExlZChHcGlvLnBpbnMuQVJUSUtfMTBbMTJdKTtcblxubGV0IGNoYW5nZUxpc3RuZXIgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coc2Vuc29yLmdldEZsb3dSYXRlKCkgKyBcIiBtTC9TZWMsIHRvdGFsOiBcIiArIHNlbnNvci5nZXRUb3RhbE1pbGxpbGl0cmVzKCkgKyBcIiBtbFwiKTtcbiAgICBjb25zb2xlLmxvZyhcInNwZWVkOiBcIiwgc2Vuc29yLnBlcmNlbnRTcGVlZCwgXCIlXCIpO1xuICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG5cbiAgICBpZihzZW5zb3IuZ2V0VG90YWxNaWxsaWxpdHJlcygpID4gNTAwKXtcbiAgICAgICAgbGVkUmVkLnR1cm5PbigpO1xuICAgICAgICBsZWRHcmVlbi50dXJuT2ZmKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGVkUmVkLnR1cm5PZmYoKTtcbiAgICAgICAgbGVkR3JlZW4udHVybk9uKCk7XG4gICAgfVxufTtcblxuc2Vuc29yLm9uKGNoYW5nZUxpc3RuZXIpO1xuc2Vuc29yLnR1cm5PbigpO1xuXG5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICBzZW5zb3IudHVybk9mZigpO1xuICAgIHNlbnNvci51bmxvYWQoKTtcblxuICAgIGxlZEdyZWVuLnR1cm5PZmYoKTtcbiAgICBsZWRHcmVlbi51bmxvYWQoKTtcbiAgICBsZWRSZWQudHVybk9mZigpO1xuICAgIGxlZFJlZC51bmxvYWQoKTtcblxuICAgIGNvbnNvbGUubG9nKFwidG90YWw6IFwiLCBzZW5zb3IudG90YWxNaWxsaWxpdHJlcywgXCJtbFwiKTtcbn0sIDUwMDAwKTsiXSwiZmlsZSI6IndhdGVyRmxvd1NlbnNvclRlc3QuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
