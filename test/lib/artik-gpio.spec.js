import Gpio from '../../src/lib/artik-gpio';
import assert from 'assert';

describe("Artik GPIO class", function () {
    let gpio;

    beforeEach(() => {
        gpio = new Gpio(Gpio.pins.ARTIK_10[3]);
    });

    it("testing testing", function () {
        assert.equal(-1, [1,2,3].indexOf(5));
    });

    describe("pinMode", function () {
        it("should set INPUT direction when no arguments were passed");
        it("should set INPUT direction");
        it("shoud set OUTPUT direction");
    });

    it("should  ")
});