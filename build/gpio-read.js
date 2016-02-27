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
const interval = 10;

gpio.pinMode(Gpio.direction.INPUT);


let min = 1000, max = 0;

//setInterval(() => gpio.digitalRead().then((val) => {
//	console.log('digital', val)
//}), interval);


setInterval(() => gpioAnalog.analogRead().then( (val) => {
	let oldMin = min, oldMax = max;
	min = val < min ? val : min;
	max = val > max ? val : max;

	(min != oldMin || max !== oldMax) && console.log(`min: ${min}, max: ${max}`);
}), interval);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJncGlvLXJlYWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuIENvcHlyaWdodCAoYykgMjAxNiBCYXJ0bG9taWVqIEtvcGVyIDxia29wZXJAZ21haWwuY29tPlxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0byBkZWFsXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgR3BpbyBmcm9tIFwiLi9hcnRpay1ncGlvXCI7XG5cbmxldCBncGlvID0gbmV3IEdwaW8oR3Bpby5waW5zLkFSVElLXzEwWzNdKTtcbmxldCBncGlvQW5hbG9nID0gbmV3IEdwaW8oR3Bpby5waW5zLkFSVElLXzEwW1wiYW5hbG9nMFwiXSk7XG5jb25zdCBpbnRlcnZhbCA9IDEwO1xuXG5ncGlvLnBpbk1vZGUoR3Bpby5kaXJlY3Rpb24uSU5QVVQpO1xuXG5cbmxldCBtaW4gPSAxMDAwLCBtYXggPSAwO1xuXG4vL3NldEludGVydmFsKCgpID0+IGdwaW8uZGlnaXRhbFJlYWQoKS50aGVuKCh2YWwpID0+IHtcbi8vXHRjb25zb2xlLmxvZygnZGlnaXRhbCcsIHZhbClcbi8vfSksIGludGVydmFsKTtcblxuXG5zZXRJbnRlcnZhbCgoKSA9PiBncGlvQW5hbG9nLmFuYWxvZ1JlYWQoKS50aGVuKCAodmFsKSA9PiB7XG5cdGxldCBvbGRNaW4gPSBtaW4sIG9sZE1heCA9IG1heDtcblx0bWluID0gdmFsIDwgbWluID8gdmFsIDogbWluO1xuXHRtYXggPSB2YWwgPiBtYXggPyB2YWwgOiBtYXg7XG5cblx0KG1pbiAhPSBvbGRNaW4gfHwgbWF4ICE9PSBvbGRNYXgpICYmIGNvbnNvbGUubG9nKGBtaW46ICR7bWlufSwgbWF4OiAke21heH1gKTtcbn0pLCBpbnRlcnZhbCk7Il0sImZpbGUiOiJncGlvLXJlYWQuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
