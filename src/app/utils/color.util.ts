/**
 * Chart-variant hex values for each Tailwind asset color class.
 * These are intentionally slightly desaturated/darkened vs the main CSS token palette
 * to improve readability in Chart.js data visualizations (DESIGN_SYSTEM.md §2 "Chart Variants").
 * DO NOT use these for UI components — use the CSS tokens (--color-*) instead.
 */
/**
 * Chart-variant hex values for legacy or direct lookups.
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
    'bg-flowExpense': '#FF7E7E', // Legacy alias for flow-orange
    'bg-flowBlue':    '#4AB1FF',
    'bg-labelYellow': '#FBDE72',
};

export function getColorProps(color: string, type: 'full' | 'shadow' = 'full'): { cls: string; stl: string; val: string } {
    const isHex = color.startsWith('#');
    
    // If it's a Tailwind-style class (e.g. bg-assetGreen, bg-flowOrange)
    if (!isHex && color.startsWith('bg-')) {
        const camelToKebab = (str: string) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        const baseName = camelToKebab(color.replace('bg-', ''));
        
        // Asset classes map to 'marble-' variants, flow classes use directly
        const varName = baseName.startsWith('asset') ? `marble-${baseName}` : baseName;
        
        if (type === 'full') {
            const val = `var(--color-${varName})`;
            return {
                cls: '',
                stl: `background-color: ${val};`,
                val
            };
        }
        if (type === 'shadow') {
            const val = `color-mix(in srgb, var(--color-${varName}) 8%, var(--color-canvas))`;
            return {
                cls: '',
                // DESIGN_SYSTEM.md §2 "The Marble Rule": Inactive marbles use a faint tint of the marble color for warm minimalism
                stl: `background-color: ${val};`,
                val
            };
        }
    }

    // Fallback for direct HEX or other strings
    if (type === 'full') {
        const val = isHex ? color : '';
        return {
            cls: isHex ? '' : color,
            stl: isHex ? `background-color: ${color};` : '',
            val
        };
    }
    if (type === 'shadow') {
        const baseColor = isHex ? color : 'var(--color-slate)';
        const val = `color-mix(in srgb, ${baseColor} 8%, var(--color-canvas))`;
        return {
            cls: '',
            stl: `background-color: ${val};`,
            val
        };
    }
    return { cls: '', stl: '', val: '' };
}

/** 
 * Returns an inline style for the colour at configurable opacity using color-mix for token compatibility.
 */
export function getPreviewStyle(color: string, opacity = 0.4): string {
    const isHex = color.startsWith('#');
    let baseColor: string;

    if (isHex) {
        baseColor = color;
    } else if (color.startsWith('bg-')) {
        const camelToKebab = (str: string) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        const baseName = camelToKebab(color.replace('bg-', ''));
        const varName = baseName.startsWith('asset') ? `marble-${baseName}` : baseName;
        baseColor = `var(--color-${varName})`;
    } else {
        baseColor = 'var(--color-slate)';
    }

    // DESIGN_SYSTEM.md §2 & §7: Use token-aware color-mix for translucent hover previews
    return `background-color: color-mix(in srgb, ${baseColor} ${Math.round(opacity * 100)}%, transparent);`;
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
