import Device from "../../src/devices/device";
import EventEmitter from "events";
import {expect} from "chai";

describe("device class", function () {
    it("should be defined", function () {
        expect(Device).to.exist;
    });

    it("should extend EventEmitter", function () {
        expect(Device.prototype).to.be.an.instanceOf(EventEmitter);
    });
});