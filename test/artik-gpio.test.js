import Gpio from "../src/artik-gpio";
import sinon from "sinon";
import fs from "fs";
import {expect} from 'chai';

const noop = () => {
};

describe("Artik GPIO class", function () {
    let gpio;
    let fsAccesss;

    before(() => {
        fsAccesss = sinon.stub(fs, "access");
    });

    beforeEach(() => {
        fsAccesss.yields();
        gpio = new Gpio(Gpio.pins.ARTIK_10[3]);
    });

    after(() => {
        fs.access.restore();
    });

    describe("load method", function () {
        before(function () {
            sinon.stub(fs, "writeFile");
        });

        after(function () {
            fs.writeFile.restore();
        });

        it("should return promise", function () {
            expect(gpio.load()).to.be.a("promise");
        });

        it("should return resolved promise when file is accessible", function (done) {
            fsAccesss.yields();

            gpio.load().then(() => done());
        });

        it("should call writeFile if gpio export path does not exists", function (done) {
            fsAccesss.yields({errno: -2});
            fs.writeFile.yields();

            gpio.load()
                .then(() => {
                    expect(fs.writeFile.called).to.be.true;
                    done();
                });
        });

        it("should return rejected promise when export file is not accessible", function (done) {
            fsAccesss.yields({errno: -3});

            gpio.load().catch(() => done());
        });
    });

    describe("unload method", function () {
        before(function () {
            sinon.stub(fs, "writeFile");
        });

        after(function () {
            fs.writeFile.restore();
        });

        it("should return promise", function () {
            expect(gpio.unload()).to.be.a("promise");
        });

        it("should call fs.writeFile", function (done) {
            fs.writeFile.yields();

            gpio.load()
                .then(() => {
                    expect(fs.writeFile.called).to.be.true;
                    done();
                });
        });

        it("should return resolved promise if unloading is successful", function (done) {
            fs.writeFile.yields();

            gpio.unload().then(() => done());
        });

        it("should return rejected promise if unloading fails", function (done) {
            fs.writeFile.yields({});

            gpio.unload().catch(() => done());
        });
    });

    describe("analogRead method", function () {
        let fsReadFile;

        before(function () {
            fsReadFile = sinon.stub(fs, "readFile");
        });

        after(function () {
            fsReadFile.restore();
        });

        it("should call fs.readFile", function () {
            gpio.analogRead();

            expect(fsReadFile.called).to.be.true;
        });

        it("should return promise", function () {
            expect(gpio.analogRead()).to.be.a("promise");
        });

        it("should return resolved promise with analog data", function (done) {
            const value = 12.4;
            fsReadFile.yields(null, value);

            gpio.analogRead()
                .then(data => {
                    expect(data).to.equals(value);
                    done();
                });
        });


        it("should return failed promise when error occurs", function (done) {
            fsReadFile.yields({});

            gpio.analogRead().catch(() => done());
        });
    });

    describe("digitalRead method", function () {
        let fsReadFile;

        before(function () {
            fsReadFile = sinon.stub(fs, "readFile");
        });

        after(function () {
            fsReadFile.restore();
        });

        it("should call fs.readFile", function () {
            gpio.digitalRead();

            expect(fsReadFile.called).to.be.true;
        });

        it("should return promise", function () {
            expect(gpio.digitalRead()).to.be.a("promise");
        });

        it("should return resolved promise with digital data", function (done) {
            const value = 23;
            fsReadFile.yields(null, value);

            gpio.digitalRead()
                .then(data => {
                    expect(data).to.equals(value);
                    done();
                });
        });

        it("should return failed promise when error occure", function (done) {
            fsReadFile.yields({});

            gpio.digitalRead().catch(() => done());
        });
    });

    describe("digitalWrite method", function () {
        let fsWriteFile;

        before(function () {
            fsWriteFile = sinon.stub(fs, "writeFile");
        });

        beforeEach(function () {
            fsWriteFile.reset();
        });

        after(function () {
            fsWriteFile.restore();
        });

        it("should call fs.writeFile", function () {
            gpio.digitalWrite();

            expect(fsWriteFile.called).to.be.true;
        });

        it("should return promise", function () {
            expect(gpio.digitalWrite()).to.be.a("promise");
        });

        it("should return resolved promise if writeFile was successful", function (done) {
            fsWriteFile.yields(null, {});

            gpio.digitalWrite().then(() => done());
        });

        it("should return rejected promise if writeFile fails", function (done) {
            fsWriteFile.yields({});

            gpio.digitalWrite().catch(() => done());
        });

        it("should pass LOW value as default", function () {
            gpio.digitalWrite();
;
            expect(fsWriteFile.args[0][1]).to.equal(Gpio.value.LOW);
        });

        it("should pass HIGH value", function () {
            gpio.digitalWrite(Gpio.value.HIGH);

            expect(fs.writeFile.args[0][1]).to.equal(Gpio.value.HIGH);
        });

        it("should pass LOW value", function () {
            gpio.digitalWrite(Gpio.value.LOW);

            expect(fs.writeFile.args[0][1]).to.equal(Gpio.value.LOW);
        });
    });

    describe("pinMode method", function () {
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

        it("should console warn error if pin is not accessible", function (done) {
            const errorMsg = "error message";
            sinon.stub(gpio, "load").returns(Promise.reject(errorMsg));

            gpio.pinMode(Gpio.direction.INPUT).catch(err => {
                expect(err.message).to.be.equal(errorMsg);
                done()
            });
        });

        it("shoud throw an error when passing wrong argument", function () {
            expect(gpio.pinMode.bind(null, "test")).to.throw(Error);
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
                gpio.value = 0;
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
