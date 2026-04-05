/**
 * Chart-variant hex values for each Tailwind asset color class.
 * These are intentionally slightly desaturated/darkened vs the main CSS token palette
 * to improve readability in Chart.js data visualizations (DESIGN_SYSTEM.md §2 "Chart Variants").
 * DO NOT use these for UI components — use the CSS tokens (--color-*) instead.
 */
export const TAILWIND_COLOR_MAP: Record<string, string> = {
    'bg-assetGreen':  '#4CAF7D',
    'bg-assetPurple': '#9B8EC4',
    'bg-assetBlue':   '#5B9BD5',
    'bg-assetSand':   '#C8A96E',
    'bg-assetRose':   '#D47F8A',
    'bg-assetTeal':   '#5BB8B4',
    'bg-assetStone':  '#9B9B8E',
    'bg-flowOrange':  '#E8A87C',
    'bg-labelYellow': '#F5C842',
};

export function getColorProps(color: string, type: 'full' | 'shadow' = 'full'): { cls: string; stl: string } {
    const isHex = color.startsWith('#');
    if (type === 'full') {
        return {
            cls: isHex ? '' : color,
            stl: isHex ? `background-color: ${color};` : ''
        };
    }
    if (type === 'shadow') {
        return {
            cls: isHex ? '' : `${color}/15`,
            stl: isHex ? `background-color: ${color}26;` : (!isHex ? 'background-color: rgba(0,0,0,0.03);' : '')
        };
    }
    return { cls: '', stl: '' };
}

/** Returns an inline rgba style for the colour at configurable opacity — works for both hex and Tailwind class colours. */
export function getPreviewStyle(color: string, opacity = 0.4): string {
    if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `background-color: rgba(${r},${g},${b},${opacity});`;
    }
    const hex = TAILWIND_COLOR_MAP[color];
    if (hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `background-color: rgba(${r},${g},${b},${opacity});`;
    }
    return `background-color: rgba(0,0,0,${opacity});`;
}

export function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
