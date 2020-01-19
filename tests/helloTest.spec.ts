import { TestClass } from '../src/ts/TestClass';
import { expect } from 'chai';
import 'mocha';

describe('First test', () => {
    it('should return true', () => {
        let testClass = new TestClass();
        const result = testClass.helloTest();
        expect(result).to.equal(true);
    });
});