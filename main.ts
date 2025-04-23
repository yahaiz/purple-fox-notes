import { Editor, MarkdownView, normalizePath, Plugin, WorkspaceLeaf, EditorRange, View } from 'obsidian';
import { PurpleFoxSettings, DEFAULT_SETTINGS } from './src/settings';
import { CalloutProcessor } from './src/calloutProcessor';
import { FoxSettingTab } from './src/settingsTab';

export default class PurpleFoxPlugin extends Plugin {
    settings: PurpleFoxSettings;
    private ribbonIconEl: HTMLElement | null = null;
    private calloutProcessor: CalloutProcessor;
    private fontElement: HTMLStyleElement;

    async onload() {
        await this.loadSettings();
        
        this.registerEditorExtension();
        this.registerCommands();
        
        // Defer UI setup to onLayoutReady
        this.app.workspace.onLayoutReady(() => {
            this.setupUI();
            this.setupCalloutProcessor();
        });
    }

    public registerEditorExtension() {
        // Register any editor extensions if needed in the future
        // This placeholder is added for future extensibility
    }

    private registerCommands() {
        this.addCommand({
            id: 'insert-page-break',
            name: 'Insert Page Break',
            editorCallback: async (editor: Editor) => {
                const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                const view = await maybeView?.leaf?.view;
                if (view instanceof MarkdownView) {
                    view.editor.replaceSelection('\n<div class="page-break"></div>\n\n');
                }
            }
        });

        this.addCommand({
            id: 'insert-line-break',
            name: 'Insert Line Break',
            editorCallback: async (editor: Editor) => {
                const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                const view = await maybeView?.leaf?.view;
                if (view instanceof MarkdownView) {
                    view.editor.replaceSelection('\n<div class="line-break"></div>\n\n');
                }
            }
        });
    }

    private setupUI() {
        // Set up font
        this.fontElement = document.createElement('style');
        document.head.appendChild(this.fontElement);
        this.updateFontStyle();
        this.updateRadiusStyles();
        
        // Set up settings tab
        this.addSettingTab(new FoxSettingTab(this.app, this));
        
        // Set up ribbon icons
        this.updateRibbonIcon();
    }

    public updateFontStyle() {
        if (this.settings.useCustomFont) {
            this.fontElement.textContent = `
                @font-face {
                    font-family: "PFoxCustomFont";
                    src: url("https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/fonts/webfonts/Vazirmatn-Regular.woff2") format("woff2");
                }
                body {
                    font-family: "PFoxCustomFont", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `;
        } else {
            this.fontElement.textContent = '';
        }
    }

    public updateRadiusStyles() {
        const multiplier = this.settings.radiusMultiplier;
        document.body.style.setProperty('--radius-s', `${4 * multiplier}px`);
        document.body.style.setProperty('--radius-m', `${8 * multiplier}px`);
        document.body.style.setProperty('--radius-l', `${12 * multiplier}px`);
        document.body.style.setProperty('--radius-xl', `${16 * multiplier}px`);
        document.body.style.setProperty('--radius-xxl', `${24 * multiplier}px`);
        document.body.style.setProperty('--radius-xxxl', `${32 * multiplier}px`);
    }

    private setupCalloutProcessor() {
        this.calloutProcessor = new CalloutProcessor(this.app);
        this.calloutProcessor.processAllCallouts();
        this.calloutProcessor.startObserving();
    }

    async onunload() {
        if (this.ribbonIconEl) {
            this.ribbonIconEl.remove();
        }
        if (this.fontElement) {
            this.fontElement.remove();
        }
        this.calloutProcessor?.stopObserving();
    }

    private updateRibbonIcon(): void {
        if (this.ribbonIconEl) {
            this.ribbonIconEl.remove();
            this.ribbonIconEl = null;
        }

        if (this.settings.showRibbonIcon) {
            // Add page break icon
            this.ribbonIconEl = this.addRibbonIcon('lucide-file-plus', 'Insert Page Break', async () => {
                const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                const view = await maybeView?.leaf?.view;
                if (view instanceof MarkdownView) {
                    view.editor.replaceSelection('<div class="page-break"></div>\n');
                }
            });
        }

        // Add line break icon separately
        if (this.settings.showLineBreakIcon) {
            this.addRibbonIcon('lucide-minus', 'Insert Line Break', async () => {
                const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                const view = await maybeView?.leaf?.view;
                if (view instanceof MarkdownView) {
                    view.editor.replaceSelection('<div class="line-break"></div>\n');
                }
            });
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.updateRibbonIcon();
        this.updateRadiusStyles();
    }
}
