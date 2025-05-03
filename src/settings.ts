export interface PurpleFoxSettings {
    isEnabled: boolean;
    showRibbonIcon: boolean;
    showLineBreakIcon: boolean;
    pageBreakColor: string;
    pageBreakHeight: number;
    lineBreakColor: string;
    lineBreakHeight: number;
    // TOC Settings
    enableAutoTOC: boolean;
    tocTitle: string;
    tocMaxLevel: number;
    tocMinLevel: number;
    tocListStyle: 'bullet' | 'number';
}

export const DEFAULT_SETTINGS: PurpleFoxSettings = {
    isEnabled: true,
    showRibbonIcon: true,
    showLineBreakIcon: true,
    pageBreakColor: "#ff0000",
    pageBreakHeight: 35,
    lineBreakColor: "#ddd",
    lineBreakHeight: 25,
    // TOC Default Settings
    enableAutoTOC: false,
    tocTitle: "Table of Contents",
    tocMaxLevel: 3,
    tocMinLevel: 1,
    tocListStyle: 'bullet'
}