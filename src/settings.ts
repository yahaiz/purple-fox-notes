export interface PurpleFoxSettings {
    isEnabled: boolean;
    showRibbonIcon: boolean;
    showLineBreakIcon: boolean;
    useCustomFont: boolean;
    pageBreakColor: string;
    pageBreakHeight: number;
    lineBreakColor: string;
    lineBreakHeight: number;
    radiusMultiplier: number;
}

export const DEFAULT_SETTINGS: PurpleFoxSettings = {
    isEnabled: true,
    showRibbonIcon: true,
    showLineBreakIcon: true,
    useCustomFont: true,
    pageBreakColor: '#ddd',
    pageBreakHeight: 35,
    lineBreakColor: '#ddd',
    lineBreakHeight: 25,
    radiusMultiplier: 1.0
}