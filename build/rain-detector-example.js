"use strict";

var _rainDetector = require("./rainDetector");

var _rainDetector2 = _interopRequireDefault(_rainDetector);

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

var rainDetector = new _rainDetector2.default(_artikGpio2.default.pins.ARTIK_10[3], _artikGpio2.default.pins.ARTIK_10["analog0"]);

var startsRainingCallback = function startsRainingCallback() {
  return console.log("starts raining");
};
var stopsRainingCallback = function stopsRainingCallback() {
  return console.log("stops raining");
};
var rainIntense = function rainIntense(val) {
  return console.log("It's raining with power of " + val + "%");
};

rainDetector.on(_rainDetector2.default.events.START_RAINING, startsRainingCallback);
rainDetector.on(_rainDetector2.default.events.STOP_RAINING, stopsRainingCallback);

setInterval(function () {
  console.log(rainDetector.getIntense(rainIntense));
}, 1000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJhaW4tZGV0ZWN0b3ItZXhhbXBsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsSUFBSSxlQUFlLDJCQUFpQixvQkFBSyxJQUFMLENBQVUsUUFBVixDQUFtQixDQUFuQixDQUFqQixFQUF3QyxvQkFBSyxJQUFMLENBQVUsUUFBVixDQUFtQixTQUFuQixDQUF4QyxDQUFmOztBQUVKLElBQU0sd0JBQXdCLFNBQXhCLHFCQUF3QjtTQUFNLFFBQVEsR0FBUixDQUFZLGdCQUFaO0NBQU47QUFDOUIsSUFBTSx1QkFBdUIsU0FBdkIsb0JBQXVCO1NBQU0sUUFBUSxHQUFSLENBQVksZUFBWjtDQUFOO0FBQzdCLElBQU0sY0FBYyxTQUFkLFdBQWM7U0FBTyxRQUFRLEdBQVIsaUNBQTBDLFNBQTFDO0NBQVA7O0FBRXBCLGFBQWEsRUFBYixDQUFnQix1QkFBYSxNQUFiLENBQW9CLGFBQXBCLEVBQW1DLHFCQUFuRDtBQUNBLGFBQWEsRUFBYixDQUFnQix1QkFBYSxNQUFiLENBQW9CLFlBQXBCLEVBQWtDLG9CQUFsRDs7QUFFQSxZQUFZLFlBQU07QUFDakIsVUFBUSxHQUFSLENBQVksYUFBYSxVQUFiLENBQXdCLFdBQXhCLENBQVosRUFEaUI7Q0FBTixFQUVULElBRkgiLCJmaWxlIjoicmFpbi1kZXRlY3Rvci1leGFtcGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuIENvcHlyaWdodCAoYykgMjAxNiBCYXJ0bG9taWVqIEtvcGVyIDxia29wZXJAZ21haWwuY29tPlxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgUmFpbkRldGVjdG9yIGZyb20gJy4vcmFpbkRldGVjdG9yJztcbmltcG9ydCBHcGlvIGZyb20gXCIuL2FydGlrLWdwaW9cIjtcblxubGV0IHJhaW5EZXRlY3RvciA9IG5ldyBSYWluRGV0ZWN0b3IoR3Bpby5waW5zLkFSVElLXzEwWzNdLCBHcGlvLnBpbnMuQVJUSUtfMTBbXCJhbmFsb2cwXCJdKTtcblxuY29uc3Qgc3RhcnRzUmFpbmluZ0NhbGxiYWNrID0gKCkgPT4gY29uc29sZS5sb2coXCJzdGFydHMgcmFpbmluZ1wiKTtcbmNvbnN0IHN0b3BzUmFpbmluZ0NhbGxiYWNrID0gKCkgPT4gY29uc29sZS5sb2coXCJzdG9wcyByYWluaW5nXCIpO1xuY29uc3QgcmFpbkludGVuc2UgPSB2YWwgPT4gY29uc29sZS5sb2coYEl0J3MgcmFpbmluZyB3aXRoIHBvd2VyIG9mICR7dmFsfSVgKTtcblxucmFpbkRldGVjdG9yLm9uKFJhaW5EZXRlY3Rvci5ldmVudHMuU1RBUlRfUkFJTklORywgc3RhcnRzUmFpbmluZ0NhbGxiYWNrKTtcbnJhaW5EZXRlY3Rvci5vbihSYWluRGV0ZWN0b3IuZXZlbnRzLlNUT1BfUkFJTklORywgc3RvcHNSYWluaW5nQ2FsbGJhY2spO1xuXG5zZXRJbnRlcnZhbCgoKSA9PiB7XG5cdGNvbnNvbGUubG9nKHJhaW5EZXRlY3Rvci5nZXRJbnRlbnNlKHJhaW5JbnRlbnNlKSlcbn0sIDEwMDApOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
