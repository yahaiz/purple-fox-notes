import { Editor, MarkdownView, Plugin } from 'obsidian';
import { PurpleFoxSettings, DEFAULT_SETTINGS } from './src/settings';
import { CalloutProcessor } from './src/calloutProcessor';
import { FoxSettingTab } from './src/settingsTab';
import { TOCProcessor } from './src/tocProcessor';

export default class PurpleFoxPlugin extends Plugin {
    settings: PurpleFoxSettings;
    private pageBreakIcon: HTMLElement | null = null;
    private lineBreakIcon: HTMLElement | null = null;
    private tocProcessor: TOCProcessor;
    private calloutProcessor: CalloutProcessor;

    async onload() {
        await this.loadSettings();
        this.tocProcessor = new TOCProcessor(this.settings);
        
        this.registerEditorExtension();
        this.registerCommands();
        this.setupUI();
        this.setupCalloutProcessor();
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

        // Add TOC command
        this.addCommand({
            id: 'insert-toc',
            name: 'Insert Table of Contents',
            editorCallback: async (editor: Editor) => {
                const maybeView = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (maybeView?.editor) {
                    const cursor = editor.getCursor();
                    const content = editor.getValue();
                    const toc = this.tocProcessor.generateTOC(content);
                    editor.replaceRange(toc, cursor);
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
        // Method kept empty for future style updates
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

            // Always add break icons
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

            // Add TOC icon
            this.addRibbonIcon('list', 'Insert Table of Contents', async () => {
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (view?.editor) {
                    const cursor = view.editor.getCursor();
                    const content = view.editor.getValue();
                    const toc = this.tocProcessor.generateTOC(content);
                    view.editor.replaceRange(toc, cursor);
                }
            });
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
    }
}
