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
var interval = 10;

gpio.pinMode(_artikGpio2.default.direction.INPUT);

var min = 1000,
    max = 0;

//setInterval(() => gpio.digitalRead().then((val) => {
//	console.log('digital', val)
//}), interval);

setInterval(function () {
  return gpioAnalog.analogRead().then(function (val) {
    var oldMin = min,
        oldMax = max;
    min = val < min ? val : min;
    max = val > max ? val : max;

    (min != oldMin || max !== oldMax) && console.log("min: " + min + ", max: " + max);
  });
}, interval);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdwaW8tcmVhZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQTBCQSxJQUFJLE9BQU8sd0JBQVMsb0JBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsQ0FBbkIsQ0FBVCxDQUFQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDSixJQUFJLGFBQWEsd0JBQVMsb0JBQUssSUFBTCxDQUFVLFFBQVYsQ0FBbUIsU0FBbkIsQ0FBVCxDQUFiO0FBQ0osSUFBTSxXQUFXLEVBQVg7O0FBRU4sS0FBSyxPQUFMLENBQWEsb0JBQUssU0FBTCxDQUFlLEtBQWYsQ0FBYjs7QUFHQSxJQUFJLE1BQU0sSUFBTjtJQUFZLE1BQU0sQ0FBTjs7Ozs7O0FBT2hCLFlBQVk7U0FBTSxXQUFXLFVBQVgsR0FBd0IsSUFBeEIsQ0FBOEIsVUFBQyxHQUFELEVBQVM7QUFDeEQsUUFBSSxTQUFTLEdBQVQ7UUFBYyxTQUFTLEdBQVQsQ0FEc0M7QUFFeEQsVUFBTSxNQUFNLEdBQU4sR0FBWSxHQUFaLEdBQWtCLEdBQWxCLENBRmtEO0FBR3hELFVBQU0sTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixHQUFsQixDQUhrRDs7QUFLeEQsS0FBQyxPQUFPLE1BQVAsSUFBaUIsUUFBUSxNQUFSLENBQWxCLElBQXFDLFFBQVEsR0FBUixXQUFvQixrQkFBYSxHQUFqQyxDQUFyQyxDQUx3RDtHQUFUO0NBQXBDLEVBTVIsUUFOSiIsImZpbGUiOiJncGlvLXJlYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4gQ29weXJpZ2h0IChjKSAyMDE2IEJhcnRsb21pZWogS29wZXIgPGJrb3BlckBnbWFpbC5jb20+XG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCBHcGlvIGZyb20gXCIuL2FydGlrLWdwaW9cIjtcblxubGV0IGdwaW8gPSBuZXcgR3BpbyhHcGlvLnBpbnMuQVJUSUtfMTBbM10pO1xubGV0IGdwaW9BbmFsb2cgPSBuZXcgR3BpbyhHcGlvLnBpbnMuQVJUSUtfMTBbXCJhbmFsb2cwXCJdKTtcbmNvbnN0IGludGVydmFsID0gMTA7XG5cbmdwaW8ucGluTW9kZShHcGlvLmRpcmVjdGlvbi5JTlBVVCk7XG5cblxubGV0IG1pbiA9IDEwMDAsIG1heCA9IDA7XG5cbi8vc2V0SW50ZXJ2YWwoKCkgPT4gZ3Bpby5kaWdpdGFsUmVhZCgpLnRoZW4oKHZhbCkgPT4ge1xuLy9cdGNvbnNvbGUubG9nKCdkaWdpdGFsJywgdmFsKVxuLy99KSwgaW50ZXJ2YWwpO1xuXG5cbnNldEludGVydmFsKCgpID0+IGdwaW9BbmFsb2cuYW5hbG9nUmVhZCgpLnRoZW4oICh2YWwpID0+IHtcblx0bGV0IG9sZE1pbiA9IG1pbiwgb2xkTWF4ID0gbWF4O1xuXHRtaW4gPSB2YWwgPCBtaW4gPyB2YWwgOiBtaW47XG5cdG1heCA9IHZhbCA+IG1heCA/IHZhbCA6IG1heDtcblxuXHQobWluICE9IG9sZE1pbiB8fCBtYXggIT09IG9sZE1heCkgJiYgY29uc29sZS5sb2coYG1pbjogJHttaW59LCBtYXg6ICR7bWF4fWApO1xufSksIGludGVydmFsKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
