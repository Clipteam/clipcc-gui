/**
 * Adjust a number to specific precision.
 * @param {function} func Adjustment function.
 * @param {number} value The number.
 * @param {number} precision The count of numbers after point.
 * @returns {number} The adjusted value.
 */
const adjustNumber = (func, value, precision) => {
    if (typeof precision === 'undefined' || +precision === 0) {
        return func(value);
    }
    value = +value;
    precision = +precision;
    if (isNaN(value) || !(typeof precision === 'number' && precision % 1 === 0)) {
        return NaN;
    }
    value = value.toString().split('e');
    value = func(+(`${value[0]}e${value[1] ? (+value[1] + precision) : +precision}`));
    value = value.toString().split('e');
    return +(`${value[0]}e${value[1] ? (+value[1] - precision) : -precision}`);
};

const round10 = (value, precision) => adjustNumber(Math.round, value, precision);
const floor10 = (value, precision) => adjustNumber(Math.floor, value, precision);
const ceil10 = (value, precision) => adjustNumber(Math.ceil, value, precision);

export {
    round10, floor10, ceil10
};
