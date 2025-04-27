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

        // Break Settings
        containerEl.createEl('h3', { text: 'Break Settings' });

        new Setting(containerEl)
            .setName("Show all break icons")
            .setDesc("Enable or disable both page break and line break icons.")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.showAllBreakIcons)
                    .onChange(async (value) => {
                        this.plugin.settings.showAllBreakIcons = value;
                        await this.plugin.saveSettings();
                    })
            );

        // Border Radius Settings
        containerEl.createEl('h3', { text: 'Border Radius Settings' });

        new Setting(containerEl)
            .setName("Border radius size")
            .setDesc("Adjust the size of all border radiuses in the plugin (0 = no radius, 1 = default, 1.5 = maximum)")
            .addSlider(slider => {
                const container = slider.sliderEl.parentElement;
                if (container) {
                    while (container.firstChild) {
                        container.removeChild(container.firstChild);
                    }

                    const resetButton = container.createEl('div', {
                        cls: 'extra-setting-button',
                        attr: { 
                            'data-role': 'reset',
                            'data-visible': 'false'
                        }
                    });

                    setIcon(resetButton, 'rotate-ccw');
                    container.appendChild(slider.sliderEl);
                    
                    slider.sliderEl.dataset.role = 'radius-multiplier';
                    slider.setLimits(0, 1.5, 0.1);
                    slider.setValue(this.plugin.settings.radiusMultiplier);
                    
                    const updateVisuals = (value: number) => {
                        const roundedValue = Math.round(value * 10) / 10;
                        slider.sliderEl.value = roundedValue.toString();
                        slider.sliderEl.dataset.value = roundedValue.toFixed(1);
                        resetButton.dataset.visible = Math.abs(roundedValue - 1.0) >= 0.01 ? 'true' : 'false';
                    };

                    updateVisuals(this.plugin.settings.radiusMultiplier);

                    resetButton.addEventListener('click', async () => {
                        const defaultValue = 1.0;
                        this.plugin.settings.radiusMultiplier = defaultValue;
                        slider.setValue(defaultValue);
                        updateVisuals(defaultValue);
                        await this.plugin.saveSettings();
                    });

                    slider.onChange(async (value) => {
                        const roundedValue = Math.round(value * 10) / 10;
                        this.plugin.settings.radiusMultiplier = roundedValue;
                        updateVisuals(roundedValue);
                        await this.plugin.saveSettings();
                    });
                }
                return slider;
            });

        // Watermark Settings
        containerEl.createEl('h3', { text: 'PDF Export Watermark' });

        new Setting(containerEl)
            .setName("Show watermark")
            .setDesc("Enable or disable watermark in PDF exports")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.showWatermark)
                    .onChange(async (value) => {
                        this.plugin.settings.showWatermark = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Watermark text")
            .setDesc("Text to display as watermark in PDF exports")
            .addText(text => text
                .setPlaceholder("CONFIDENTIAL")
                .setValue(this.plugin.settings.watermarkText)
                .onChange(async (value) => {
                    this.plugin.settings.watermarkText = value;
                    await this.plugin.saveSettings();
                })
            );

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