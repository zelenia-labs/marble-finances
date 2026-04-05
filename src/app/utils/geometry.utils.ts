/**
 * Precision calculation for centering a board element within a viewport canvas.
 * Accounts for 0.28 mechanical zoom scale and absolute offset mapping.
 */
export function calculateCenteringCoordinates(
    viewW: number,
    viewH: number,
    boardW: number,
    boardH: number,
    offsetL: number,
    offsetT: number,
    scale: number
) {
    const targetPanX = (viewW / 2) - (offsetL * scale) - (boardW * scale / 2);
    const targetPanY = (viewH / 2) - (offsetT * scale) - (boardH * scale / 2);
    return { targetPanX, targetPanY };
}
