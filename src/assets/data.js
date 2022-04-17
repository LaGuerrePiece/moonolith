import {
    sky_4_base64,
    mountains_3_base64,
    hills_2_base64,
    floor_1_base64,
    eProtoBase64,
    dProtoBase64,
    cProtoBase64,
    bProtoBase64,
    aProtoBase64,
    caly0,
    caly1,
    caly2,
    caly3,
    caly4,
    caly5,
    caly6,
} from './base64';

var landscapeBase64woupsi = {
    sky_4: { name: 'sky', height: 614, startY: 15, parallax: 0.12, base64: sky_4_base64 },
    mountains_3: { name: 'mountains', height: 237, startY: 32, parallax: 0.3, base64: mountains_3_base64 },
    hills_2: { name: 'hills', height: 34, startY: 108, parallax: 0.7, base64: hills_2_base64 },
    floor_1: { name: 'floor', height: 22, startY: 0, parallax: 1, base64: floor_1_base64 },
};

var landscapeBase64Guy = {
    eProto: { name: 'eProto', height: 100, startY: 150, parallax: 2, base64: eProtoBase64 },
    dProto: { name: 'dProto', height: 100, startY: 55, parallax: 0.8, base64: dProtoBase64 },
    caProto: { name: 'cProto', height: 100, startY: 35, parallax: 0.4, base64: cProtoBase64 },
    bProto: { name: 'bProto', height: 100, startY: 15, parallax: 0.7, base64: bProtoBase64 },
    aProto: { name: 'aProto', height: 100, startY: 0, parallax: 0.2, base64: aProtoBase64 },
    floor_1: { name: 'floor ', height: 22, startY: 0, parallax: 0, base64: floor_1_base64 },
};

var landscapeBase64 = {
    caly6: { name: 'caly6', height: 306, startY: 160, parallax: 1, base64: caly6 },
    caly5: { name: 'caly5', height: 266, startY: 40, parallax: 0.6, base64: caly5 },
    caly4: { name: 'caly4', height: 168, startY: 50, parallax: 0.5, base64: caly4 },
    caly3: { name: 'caly3', height: 197, startY: 130, parallax: 0.4, base64: caly3 },
    caly2: { name: 'caly2', height: 82, startY: 60, parallax: 0.3, base64: caly2 },
    caly1: { name: 'caly1', height: 119, startY: -30, parallax: 0.2, base64: caly1 },
    caly0: { name: 'caly0 ', height: 271, startY: -221, parallax: 0, base64: caly0 },
};

export default landscapeBase64;
