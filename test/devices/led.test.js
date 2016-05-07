import Led from '../../src/devices/led';
import {expect} from "chai";

describe("Led", function () {
    it("should be defined", function () {
        expect(Led).to.exist;
    });
});