import Const from '../constants';
import { tool } from '../monolith/tools';
import { renderWidth, renderHeight } from './displayLoop';
import { convertToMonolithPos } from '../utils/conversions';
import { monolithIndexes } from '../monolith/monolith';
import { deviceType, pointer } from '../controls/controls';

export function addPointer(monolithData) {
    if (deviceType === 'mobile') return monolithData
    if (tool === 'smol') {
        whiten(monolithData, pointer.y, pointer.x);
    } else if (tool === 'medium') {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
            }
        }
        whiten(monolithData, pointer.y, pointer.x);
    } else if (tool === 'large') {
        for (let i = -3; i <= 3; i++) {
            for (let j = -1; j <= 1; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
                whiten(monolithData, pointer.y + i, pointer.x + j);
            }
        }
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) whiten(monolithData, pointer.y + i, pointer.x + j);
        }
    } else if (tool === 'giga') {
        for (let i = -20; i <= 20; i++) {
            for (let j = -20; j <= 20; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
            }
        }
        for (let i = -15; i <= 15; i++) {
            for (let j = -15; j <= 15; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
            }
        }
        for (let i = -8; i <= 8; i++) {
            for (let j = -5; j <= 5; j++) {
                whiten(monolithData, pointer.y + j, pointer.x + i);
                whiten(monolithData, pointer.y + i, pointer.x + j);
            }
        }
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) whiten(monolithData, pointer.y + i, pointer.x + j);
        }
        whiten(monolithData, pointer.y, pointer.x);
    }
    return monolithData;
}

function whiten(monolithData, y, x) {
    if (x < 0 || x >= renderWidth || y < 0 || y >= renderHeight) return;
    const monolithPos = convertToMonolithPos({ x: x, y: y });
    if (!monolithPos) return; // If not on the monolith

    const posOnMonolith = (monolithPos.y * Const.MONOLITH_COLUMNS + monolithPos.x) * 4;
    if (monolithIndexes[posOnMonolith] > 0) return; // If not editable return

    monolithData[posOnMonolith] += (255 - monolithData[posOnMonolith]) / 3;
    monolithData[posOnMonolith + 1] += (255 - monolithData[posOnMonolith + 1]) / 3;
    monolithData[posOnMonolith + 2] += (255 - monolithData[posOnMonolith + 2]) / 3;
}
