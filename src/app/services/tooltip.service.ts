import { Injectable, signal, ElementRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TooltipService {
    private label = signal<string | null>(null);
    private popoverRef = signal<ElementRef<HTMLElement> | null>(null);
    private currentAnchor = signal<HTMLElement | null>(null);

    getTooltipLabel() {
        return this.label;
    }

    setPopoverRef(ref: ElementRef<HTMLElement> | null) {
        this.popoverRef.set(ref);
    }

    show(event: MouseEvent | HTMLElement, text: string) {
        if (!text || text.trim() === '') {
            this.hide();
            return;
        }
        
        const target = event instanceof MouseEvent ? (event.currentTarget as HTMLElement) : event;
        this.label.set(text);
        this.currentAnchor.set(target);
        
        // Synchronous show now that the DOM element is persistent
        const ref = this.popoverRef();
        if (ref && ref.nativeElement) {
            const popover = ref.nativeElement as HTMLElement & { showPopover?: () => void };
            if (popover.showPopover) {
                try {
                    popover.showPopover();
                } catch {
                    // ignore
                }

                // Precision positioning with smart-flipping
                const rect = target.getBoundingClientRect();
                const popoverRect = popover.getBoundingClientRect();
                const margin = 10;
                
                // Determine best vertical placement: 
                // If it's in the top part of the screen (e.g. main header), show BELOW
                // Otherwise, show ABOVE (preferred for marbles)
                const isNearTop = rect.top < 100;
                let top = isNearTop ? (rect.bottom + margin) : (rect.top - popoverRect.height - margin);
                
                // Viewport boundary guard (if flipping still hits bottom, or top hits top)
                if (top < margin) {
                    top = rect.bottom + margin;
                } else if (top + popoverRect.height > window.innerHeight - margin) {
                    top = rect.top - popoverRect.height - margin;
                }

                // Horizontal centering with edge-pushing
                let left = rect.left + (rect.width / 2) - (popoverRect.width / 2);
                
                // Edge push: Ensure it doesn't bleed off the left/right edges
                const leftLimit = margin;
                const rightLimit = window.innerWidth - popoverRect.width - margin;
                left = Math.max(leftLimit, Math.min(left, rightLimit));
                
                popover.style.left = `${left}px`;
                popover.style.top = `${top}px`;
                popover.style.margin = '0';
                popover.style.position = 'fixed';

                // Precision arrow positioning for "typical" tooltip look
                const arrow = popover.querySelector('.tooltip-arrow') as HTMLElement;
                if (arrow) {
                    const isAbove = top < rect.top;
                    
                    // Vertical: 
                    // Above: arrow at bottom (offset slightly to merge with popover border)
                    // Below: arrow at top
                    arrow.style.top = isAbove ? 'calc(100% - 9px)' : '-9px';
                    
                    // Horizontal: Center on the anchor, constrained within popover bounds
                    const arrowCenter = rect.left + (rect.width / 2) - left;
                    const arrowClipped = Math.max(12, Math.min(arrowCenter, popoverRect.width - 12));
                    arrow.style.left = `${arrowClipped}px`;
                    arrow.style.marginLeft = '-9px'; // Half of 18px

                    // Sync borders for a seamless triangle look
                    arrow.style.borderRight = isAbove ? '1px solid rgba(255,255,255,0.1)' : 'none';
                    arrow.style.borderBottom = isAbove ? '1px solid rgba(255,255,255,0.1)' : 'none';
                    arrow.style.borderTop = isAbove ? 'none' : '1px solid rgba(255,255,255,0.1)';
                    arrow.style.borderLeft = isAbove ? 'none' : '1px solid rgba(255,255,255,0.1)';
                }
            }
        }
    }

    hide() {
        this.currentAnchor.set(null);
        const ref = this.popoverRef();
        if (ref && ref.nativeElement) {
            const popover = ref.nativeElement as HTMLElement & { hidePopover?: () => void };
            if (popover.hidePopover) {
                try {
                    popover.hidePopover();
                } catch {
                    // ignore
                }
            }
        }
    }
}
