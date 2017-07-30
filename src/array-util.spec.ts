import { ArrayUtil } from './array-util';

describe('ArrayUtil', () => {

    it('should compare undefined undefined', () => {
        const left: any = undefined;
        const right: any = undefined;

        expect(ArrayUtil.areEqual(left, right)).toBeTruthy();
    });
    
    it('should compare null null', () => {
        const left: any = null;
        const right: any = null;

        expect(ArrayUtil.areEqual(left, right)).toBeTruthy();
    });

    it('should compare undefined null', () => {
        const left: any = undefined;
        const right: any = null;

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

    it('should compare null undefined', () => {
        const left: any = null;
        const right: any = undefined;

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

    it('should compare undefined array(0)', () => {
        const left: any = undefined;
        const right: any[] = [];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });
    
    it('should compare null array(0)', () => {
        const left: any = null;
        const right: any[] = [];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

    it('should compare array(0) undefined', () => {
        const left: any = [];
        const right: any[] = undefined;

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });
    
    it('should compare array(0) null', () => {
        const left: any = [];
        const right: any[] = null;

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

        it('should compare undefined array(>0)', () => {
        const left: any = undefined;
        const right: any[] = [10, 1];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });
    
    it('should compare null array(>0)', () => {
        const left: any = null;
        const right: any[] = [2, 1];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

    it('should compare array(>0) undefined', () => {
        const left: any = [1, 2, 3, 4];
        const right: any[] = undefined;

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });
    
    it('should compare array(>0) null', () => {
        const left: any = ['a', 'b'];
        const right: any[] = null;

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

    it('should compare unequal length string arrays', () => {
        const left: any = ['a', 'b'];
        const right: any = ['a', 'b', 'c'];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });
    
    it('should compare equal string arrays', () => {
        const left: any = ['a', 'b'];
        const right: any = ['a', 'b'];

        expect(ArrayUtil.areEqual(left, right)).toBeTruthy();
    });

    it('should compare equal string arrays out of order', () => {
        const left: any = ['a', 'b'];
        const right: any = ['b', 'a'];

        expect(ArrayUtil.areEqual(left, right)).toBeTruthy();
    });

    it('should compare unequal string arrays', () => {
        const left: any = ['a', 'b'];
        const right: any = ['b', 'c'];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

    it('should compare unequal length numeric arrays', () => {
        const left: any = [1, 2];
        const right: any = [1, 2, 3];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });
    
    it('should compare equal numeric arrays', () => {
        const left: any = [1, 2];
        const right: any = [1, 2];

        expect(ArrayUtil.areEqual(left, right)).toBeTruthy();
    });

    it('should compare equal numeric arrays out of order', () => {
        const left: any = [1, 2];
        const right: any = [2, 1];

        expect(ArrayUtil.areEqual(left, right)).toBeTruthy();
    });

    it('should compare unequal numeric arrays', () => {
        const left: any = [1, 2];
        const right: any = [2, 3];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

    it('should compare arrays with different types', () => {
        const left: any = ['a', 'b'];
        const right: any = [1, 2];

        expect(ArrayUtil.areEqual(left, right)).toBeFalsy();
    });

});
