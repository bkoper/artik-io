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

    it("should  ");

    describe("pooling ", function () {
       it("should call _startEventPinPulling() method when listeners no increase from 0");
       it("should call _stopEventPinPulling() method when listeners no decrease to 0");
       it("should trigger CHANGE event when value change");
       it("should trigger RISING event when value change from low to high");
       it("should trigger FALLING event when value change from high to low");
    });
});