// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { calculateCenteringCoordinates } from './utils/geometry.utils';

/**
 * Centering Geometry Verification
 * Verified mathematical kernel for viewport mapping
 */

describe('Geometry: Board Centering Mathematics', () => {
    const DESIGN_SCALE = 0.28;

    it('should calculate pinpoint coordinates for a standard 1080p viewport', () => {
        const viewport = { w: 1920, h: 1080 };
        const board = { w: 864, h: 1200, left: 400, top: 200 };

        const { targetPanX, targetPanY } = calculateCenteringCoordinates(
            viewport.w,
            viewport.h,
            board.w,
            board.h,
            board.left,
            board.top,
            DESIGN_SCALE
        );

        // center = (1920/2) - (400 * 0.28) - (864 * 0.28 / 2)
        // center = 960 - 112 - 120.96 = 727.04
        expect(targetPanX).toBeCloseTo(727.04, 2);

        // center = (1080/2) - (200 * 0.28) - (1200 * 0.28 / 2)
        // center = 540 - 56 - 168 = 316
        expect(targetPanY).toBeCloseTo(316, 2);
    });

    it('should maintain centering precision at the edge of the layout', () => {
        const viewport = { w: 1000, h: 1000 };
        const board = { w: 100, h: 100, left: 0, top: 0 };

        const { targetPanX, targetPanY } = calculateCenteringCoordinates(
            viewport.w,
            viewport.h,
            board.w,
            board.h,
            board.left,
            board.top,
            DESIGN_SCALE
        );

        // center = 500 - 0 - 14 = 486
        expect(targetPanX).toBe(486);
        expect(targetPanY).toBe(486);
    });
});
