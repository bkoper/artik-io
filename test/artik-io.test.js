import GpioIO from '../dist/artik-io';
import {expect} from 'chai';

describe("Artik IO", function () {
    it("should be an object", function () {
        expect(GpioIO).to.be.instanceOf(Object);
    });

    it("contains object with pins property", function () {
        expect(Object.keys(GpioIO)).to.contains("pins");
    })
});
