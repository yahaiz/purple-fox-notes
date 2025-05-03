import { App, PluginSettingTab, Setting, setIcon } from 'obsidian';
import PurpleFoxPlugin from '../main';

export class FoxSettingTab extends PluginSettingTab {
    plugin: PurpleFoxPlugin;

    constructor(app: App, plugin: PurpleFoxPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        // Table of Contents Settings
        containerEl.createEl('h3', { text: 'Table of Contents Settings' });

        new Setting(containerEl)
            .setName("Maximum heading level")
            .setDesc("The highest heading level to include in TOC (1-6)")
            .addSlider(slider => {
                slider.setLimits(1, 6, 1);
                slider.setValue(this.plugin.settings.tocMaxLevel);
                slider.setDynamicTooltip();
                slider.onChange(async (value) => {
                    this.plugin.settings.tocMaxLevel = value;
                    await this.plugin.saveSettings();
                });
                return slider;
            });

        new Setting(containerEl)
            .setName("Minimum heading level")
            .setDesc("The lowest heading level to include in TOC (1-6)")
            .addSlider(slider => {
                slider.setLimits(1, 6, 1);
                slider.setValue(this.plugin.settings.tocMinLevel);
                slider.setDynamicTooltip();
                slider.onChange(async (value) => {
                    this.plugin.settings.tocMinLevel = value;
                    await this.plugin.saveSettings();
                });
                return slider;
            });

        new Setting(containerEl)
            .setName("List style")
            .setDesc("The style of TOC items (bullet points or numbers)")
            .addDropdown(dropdown => 
                dropdown
                    .addOption('bullet', 'Bullet Points')
                    .addOption('number', 'Numbers')
                    .setValue(this.plugin.settings.tocListStyle)
                    .onChange(async (value: 'bullet' | 'number') => {
                        this.plugin.settings.tocListStyle = value;
                        await this.plugin.saveSettings();
                    })
            );
    }
}