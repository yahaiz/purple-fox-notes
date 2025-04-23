export type TooltipPlacement = 'bottom' | 'right' | 'left' | 'top';

export interface TooltipOptions {
    classes?: string[];
    delay?: number;
    gap?: number;
    placement?: TooltipPlacement;
}

/**
 * Sets a tooltip on an HTML element with customizable options
 * @param el The element to show the tooltip on
 * @param tooltip The tooltip text to show
 * @param options Optional configuration for the tooltip
 */
export function setTooltip(el: HTMLElement, tooltip: string, options?: TooltipOptions): void {
    if (!tooltip) {
        return;
    }

    const defaultOptions: Required<TooltipOptions> = {
        placement: 'top',
        delay: 0,
        gap: 8,
        classes: []
    };

    const finalOptions: Required<TooltipOptions> = { ...defaultOptions, ...options };

    // Create tooltip element if not exists
    let tooltipEl = el.querySelector('.tooltip') as HTMLElement;
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '1000';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.opacity = '0';
        tooltipEl.style.transition = 'opacity 150ms ease';
        
        if (finalOptions.classes) {
            tooltipEl.classList.add(...finalOptions.classes);
        }

        tooltipEl.classList.add(`mod-${finalOptions.placement}`);
        el.appendChild(tooltipEl);
    }

    tooltipEl.textContent = tooltip;

    // Position calculation function
    const updatePosition = () => {
        const rect = el.getBoundingClientRect();
        const tooltipRect = tooltipEl.getBoundingClientRect();
        
        switch (finalOptions.placement) {
            case 'top':
                tooltipEl.style.left = `${rect.width / 2}px`;
                tooltipEl.style.bottom = `${rect.height + finalOptions.gap}px`;
                tooltipEl.style.transform = 'translateX(-50%)';
                break;
            case 'bottom':
                tooltipEl.style.left = `${rect.width / 2}px`;
                tooltipEl.style.top = `${rect.height + finalOptions.gap}px`;
                tooltipEl.style.transform = 'translateX(-50%)';
                break;
            case 'left':
                tooltipEl.style.top = `${rect.height / 2}px`;
                tooltipEl.style.right = `${rect.width + finalOptions.gap}px`;
                tooltipEl.style.transform = 'translateY(-50%)';
                break;
            case 'right':
                tooltipEl.style.top = `${rect.height / 2}px`;
                tooltipEl.style.left = `${rect.width + finalOptions.gap}px`;
                tooltipEl.style.transform = 'translateY(-50%)';
                break;
        }
    };

    // Show/hide logic
    const show = () => {
        setTimeout(() => {
            tooltipEl.style.opacity = '1';
            updatePosition();
        }, finalOptions.delay);
    };

    const hide = () => {
        tooltipEl.style.opacity = '0';
    };

    // Event listeners
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    
    // Update position on scroll/resize
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
}