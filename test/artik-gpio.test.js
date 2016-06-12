import Gpio from "../src/artik-gpio";
import sinon from "sinon";
import fs from "fs";
import {expect} from 'chai';

const noop = () => {};

describe("Artik GPIO class", function () {
    let gpio;

    before(() => {
        sinon.stub(fs, "access").yields();
    });

    beforeEach(() => {
        gpio = new Gpio(Gpio.pins.ARTIK_10[3]);
    });

    after(() => {
        fs.access.restore();
    });

    describe("pinMode", function () {
        before(() => {
            sinon.spy(fs, "writeFile");
        });
        beforeEach(() => {
            fs.writeFile.reset();
        });

        after(() => {
            fs.writeFile.restore();
        });

        it("should set INPUT direction when no arguments were passed", function (done) {
            gpio.pinMode().then(() => {
                expect(fs.writeFile.called).to.be.true;
                expect(fs.writeFile.args[0][1]).to.be.equal(Gpio.direction.INPUT);
                done();
            });
        });

        it("should set INPUT direction", function (done) {
            gpio.pinMode(Gpio.direction.INPUT).then(() => {
                expect(fs.writeFile.called).to.be.true;
                expect(fs.writeFile.args[0][1]).to.equal(Gpio.direction.INPUT);
                done();
            });
        });

        it("shoud set OUTPUT direction", function (done) {
            gpio.pinMode(Gpio.direction.OUTPUT).then(() => {
                expect(fs.writeFile.called).to.be.true;
                expect(fs.writeFile.args[0][1]).to.equal(Gpio.direction.OUTPUT);
                done();
            });
        });
    });

    describe("pooling", function () {
        it("should call _startEventPinPulling() method when listeners nb increases from 0", function () {
            sinon.spy(gpio, "_startEventPinPulling");

            gpio.on(Gpio.event.CHANGE, noop);

            expect(gpio._startEventPinPulling.called).to.be.true;

            gpio._startEventPinPulling.restore();
        });

        it("should call _stopEventPinPulling() method when listeners nb decreases to 0", function () {
            sinon.spy(gpio, "_stopEventPinPulling");

            gpio.on(Gpio.event.CHANGE, noop);
            gpio.off(Gpio.event.CHANGE, noop);

            expect(gpio._stopEventPinPulling.called).to.be.true;

            gpio._stopEventPinPulling.restore();

        });

        describe(" / callbacks", function () {
            afterEach(function () {
               gpio.digitalRead.restore();
            });

            it("should trigger CHANGE event when value change", function (done) {
                sinon.stub(gpio, "digitalRead").returns(Promise.resolve(1));

                gpio.on(Gpio.event.CHANGE, () => {
                    done();
                });
            });

            it("should trigger RISING event when value change from low to high", function (done) {
                sinon.stub(gpio, "digitalRead").returns(Promise.resolve(1));

                gpio.on(Gpio.event.RISING, () => {
                    done();
                });
            });

            it("should trigger FALLING event when value change from high to low", function () {
                    gpio.value = 1;
                    sinon.stub(gpio, "digitalRead").returns(Promise.resolve(0));

                    gpio.on(Gpio.event.FALLING, () => {
                        done();
                    });
            });
        });
    });
});
