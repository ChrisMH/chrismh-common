export namespace ArrayUtil {

    /**
     * Compares two arrays for equality
     * 
     * @param left left array for comparison
     * @param right right array for comparison
     * @param compare item comparison function
     */
    export function areEqual(left: any[], right: any[], compare: (a: any, b: any) => number = ArrayUtil.primitiveComparison): boolean {
        if (
            left === undefined && right === undefined
            || left === null && right === null
        ) {
            return true;
        }

        if (
            left === undefined && right !== undefined
            || left === null && right !== null
            || left !== undefined && right === undefined
            || left !== null && right === null
            || left.length !== right.length
        ) {
            return false;
        }

        const sortedLeft = left.sort(compare);
        const sortedRight = right.sort(compare);

        for(let i = 0 ; i < sortedLeft.length ; i++) {
            if (typeof sortedLeft[i] !== typeof sortedRight[i]) {
                return false;
            }
            if(compare(sortedLeft[i], sortedRight[i]) !== 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Compares two items for equality
     * 
     * @param a left item to compare
     * @param b right item to compare
     * @return a < b : -1, a > b : 1, a === b : 0
     */
    export function primitiveComparison(a: any, b: any): number {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }
}
