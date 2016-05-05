import GpioIO from '../../src/lib/artik-io';
import Led from '../../src/devices/led';
import {expect} from 'chai';

describe("Artik IO", function () {
    it("should be an object", function () {
        expect(GpioIO).to.be.instanceOf(Object);
    });

    it("contains object with pins property", function () {
        expect(Object.keys(GpioIO)).to.contains("pins");
    })
});
