export interface PurpleFoxSettings {
    isEnabled: boolean;
    showAllBreakIcons: boolean;
    radiusMultiplier: number;
    showRibbonIcon: boolean;
    showLineBreakIcon: boolean;
    pageBreakColor: string;
    pageBreakHeight: number;
    lineBreakColor: string;
    lineBreakHeight: number;
    imageAlignment: string;
    imageSize: string;
    imageCustomSize: string;
    imageTextLayout: string;
    defaultImageAlignment: string;
    defaultImageSize: string;
    enableInlineImages: boolean;
    defaultImagePosition: string;
    smallImageWidth: string;
    mediumImageWidth: string;
    largeImageWidth: string;
}

export const DEFAULT_SETTINGS: PurpleFoxSettings = {
    isEnabled: true,
    showAllBreakIcons: true,
    radiusMultiplier: 1.0,
    showRibbonIcon: true,
    showLineBreakIcon: true,
    pageBreakColor: "#ff0000",
    pageBreakHeight: 35,
    lineBreakColor: "#ddd",
    lineBreakHeight: 25,
    imageAlignment: "center",
    imageSize: "original",
    imageCustomSize: "",
    imageTextLayout: "image-left",
    defaultImageAlignment: "center",
    defaultImageSize: "medium",
    enableInlineImages: true,
    defaultImagePosition: "left",
    smallImageWidth: "200px",
    mediumImageWidth: "400px",
    largeImageWidth: "800px"
}