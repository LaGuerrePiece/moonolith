import flatten from 'flatten';
import isarray from 'is-array';
import isnumber from 'is-number';
import isstring from 'is-string';
import parse from 'parse-color';

function convert(data) {
    data = isarray(data[0]) && data[0].length !== 3 ? flatten(data, 1) : data;

    if (isnumber(data[0])) {
        data = data.map(function (d) {
            return [d, d, d];
        });
    }

    if (isstring(data[0])) {
        data = data.map(function (d) {
            return parse(d).rgb.map(function (c) {
                return c / 255;
            });
        });
    }

    return data;
}

export default convert;
