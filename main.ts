import { Editor, MarkdownView, Plugin } from 'obsidian';
import { PurpleFoxSettings, DEFAULT_SETTINGS } from './src/settings';
import { CalloutProcessor } from './src/calloutProcessor';
import { FoxSettingTab } from './src/settingsTab';

export default class PurpleFoxPlugin extends Plugin {
    settings: PurpleFoxSettings;
    private pageBreakIcon: HTMLElement | null = null;
    private lineBreakIcon: HTMLElement | null = null;
    private calloutProcessor: CalloutProcessor;

    async onload() {
        await this.loadSettings();
        this.registerEditorExtension();
        this.registerCommands();
        
        // Initialize styles immediately after loading settings
        this.updateStyles();
        
        this.app.workspace.onLayoutReady(() => {
            this.setupUI();
            this.setupCalloutProcessor();
        });
    }

    public registerEditorExtension() {
        // Register any editor extensions if needed in the future
    }

    private registerCommands() {
        this.addCommand({
            id: 'insert-page-break',
            name: 'Insert Page Break',
            editorCallback: async (editor: Editor) => {
                const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (maybeView?.editor) {
                    maybeView.editor.replaceSelection('\n<div class="page-break"></div>\n\n');
                }
            }
        });

        this.addCommand({
            id: 'insert-line-break',
            name: 'Insert Line Break',
            editorCallback: async (editor: Editor) => {
                const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (maybeView?.editor) {
                    maybeView.editor.replaceSelection('\n<div class="line-break"></div>\n\n');
                }
            }
        });
    }

    private setupUI() {
        // Set up settings tab
        this.addSettingTab(new FoxSettingTab(this.app, this));
        
        // Set up ribbon icons
        this.updateRibbonIcon();
    }

    private updateStyles() {
        try {
            // Get current value and validate it
            let currentValue = this.settings.radiusMultiplier;
            if (typeof currentValue !== 'number' || isNaN(currentValue)) {
                currentValue = DEFAULT_SETTINGS.radiusMultiplier;
                this.settings.radiusMultiplier = currentValue;
                this.saveSettings();
            }

            // Round to one decimal place and bound between 0 and 1.5
            const boundedValue = Math.min(Math.max(Math.round(currentValue * 10) / 10, 0), 1.5);

            // Dynamically create or update a <style> block for the CSS property
            let styleElement = document.getElementById('pfox-dynamic-styles') as HTMLStyleElement;
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'pfox-dynamic-styles';
                document.head.appendChild(styleElement);
            }
            
            // Update watermark settings
            document.body.dataset.watermark = this.settings.showWatermark ? 'true' : 'false';
            document.documentElement.style.setProperty('--pfox-watermark-text', `"${this.settings.watermarkText}"`);
            
            styleElement.textContent = `:root { --pfox-radius-multiplier: ${boundedValue}; }`;

            // Update settings if the value changed after validation
            if (boundedValue !== this.settings.radiusMultiplier) {
                this.settings.radiusMultiplier = boundedValue;
                this.saveSettings();
            }
        } catch (error) {
            console.error('Error updating styles:', error);
        }
    }

    private setupCalloutProcessor() {
        this.calloutProcessor = new CalloutProcessor(this.app);
        this.calloutProcessor.processAllCallouts();
        this.calloutProcessor.startObserving();
    }

    async onunload() {
        // Clean up UI elements
        if (this.pageBreakIcon) {
            this.pageBreakIcon.remove();
        }
        if (this.lineBreakIcon) {
            this.lineBreakIcon.remove();
        }

        // Stop observing callouts
        this.calloutProcessor?.stopObserving();

        // Clean up by removing the dynamically created <style> block
        const styleElement = document.getElementById('pfox-dynamic-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }

    private updateRibbonIcon(): void {
        try {
            // Clean up existing icons
            if (this.pageBreakIcon) {
                this.pageBreakIcon.remove();
                this.pageBreakIcon = null;
            }
            if (this.lineBreakIcon) {
                this.lineBreakIcon.remove();
                this.lineBreakIcon = null;
            }

            // Add icons if enabled
            if (this.settings.showAllBreakIcons) {
                this.pageBreakIcon = this.addRibbonIcon('lucide-file-plus', 'Insert Page Break', async () => {
                    const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (maybeView?.editor) {
                        maybeView.editor.replaceSelection('\n<div class="page-break"></div>\n\n');
                    }
                });

                this.lineBreakIcon = this.addRibbonIcon('lucide-minus', 'Insert Line Break', async () => {
                    const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                    if (maybeView?.editor) {
                        maybeView.editor.replaceSelection('\n<div class="line-break"></div>\n\n');
                    }
                });
            }
        } catch (error) {
            console.error('Error updating ribbon icons:', error);
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        this.updateRibbonIcon();
        this.updateStyles();
    }
}
