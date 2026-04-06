/**
 * Chart-variant hex values for each Tailwind asset color class.
 * These are intentionally slightly desaturated/darkened vs the main CSS token palette
 * to improve readability in Chart.js data visualizations (DESIGN_SYSTEM.md §2 "Chart Variants").
 * DO NOT use these for UI components — use the CSS tokens (--color-*) instead.
 */
export const TAILWIND_COLOR_MAP: Record<string, string> = {
    'bg-assetGreen':  '#52CB6C', 
    'bg-assetPurple': '#67A2F9', 
    'bg-assetBlue':   '#C380F5', 
    'bg-assetCyan':   '#707AFF', 
    'bg-assetOrange': '#F89160', 
    'bg-assetSand':   '#8B7A58',
    'bg-assetRose':   '#B66A6A',
    'bg-assetTeal':   '#548E8D',
    'bg-assetStone':  '#6B7280',
    'bg-flowOrange':  '#FF7E7E',
    'bg-flowBlue':    '#4AB1FF',
    'bg-labelYellow': '#FBDE72',
};

export function getColorProps(color: string, type: 'full' | 'shadow' = 'full'): { cls: string; stl: string } {
    const isHex = color.startsWith('#');
    
    // If it's a Tailwind-style class (e.g. bg-assetGreen, bg-flowOrange)
    if (!isHex && color.startsWith('bg-')) {
        // Map camelCase class to kebab-case variable name
        const camelToKebab = (str: string) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        const baseName = camelToKebab(color.replace('bg-', ''));
        
        // Asset classes map to 'block-' variants, flow classes use directly
        const varName = baseName.startsWith('asset') ? `block-${baseName}` : baseName;
        
        if (type === 'full') {
            return {
                cls: '',
                stl: `background-color: var(--color-${varName});`
            };
        }
        if (type === 'shadow') {
            return {
                cls: '',
                stl: 'background-color: #EDF2F7;'
            };
        }
    }

    // Fallback for direct HEX or other strings
    if (type === 'full') {
        return {
            cls: isHex ? '' : color,
            stl: isHex ? `background-color: ${color};` : ''
        };
    }
    if (type === 'shadow') {
        return {
            cls: '',
            stl: 'background-color: #EDF2F7;'
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
