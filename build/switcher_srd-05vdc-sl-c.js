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

 Water Switcher
 Model: SRD-05VDC-SL-C
 */

import Gpio from "./artik-gpio";
import Device from "./device";

export default class Switcher extends Device {
    constructor(pin) {
        super(pin);
    }

    turnOn() {
        this.gpio.digitalWrite(Gpio.value.HIGH);
    }

    turnOff() {
        this.gpio.digitalWrite(Gpio.value.LOW);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzd2l0Y2hlcl9zcmQtMDV2ZGMtc2wtYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4gQ29weXJpZ2h0IChjKSAyMDE2IEJhcnRsb21pZWogS29wZXIgPGJrb3BlckBnbWFpbC5jb20+XG5cbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gVEhFIFNPRlRXQVJFLlxuXG4gV2F0ZXIgU3dpdGNoZXJcbiBNb2RlbDogU1JELTA1VkRDLVNMLUNcbiAqL1xuXG5pbXBvcnQgR3BpbyBmcm9tIFwiLi9hcnRpay1ncGlvXCI7XG5pbXBvcnQgRGV2aWNlIGZyb20gXCIuL2RldmljZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTd2l0Y2hlciBleHRlbmRzIERldmljZSB7XG4gICAgY29uc3RydWN0b3IocGluKSB7XG4gICAgICAgIHN1cGVyKHBpbik7XG4gICAgfVxuXG4gICAgdHVybk9uKCkge1xuICAgICAgICB0aGlzLmdwaW8uZGlnaXRhbFdyaXRlKEdwaW8udmFsdWUuSElHSCk7XG4gICAgfVxuXG4gICAgdHVybk9mZigpIHtcbiAgICAgICAgdGhpcy5ncGlvLmRpZ2l0YWxXcml0ZShHcGlvLnZhbHVlLkxPVyk7XG4gICAgfVxufVxuIl0sImZpbGUiOiJzd2l0Y2hlcl9zcmQtMDV2ZGMtc2wtYy5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
