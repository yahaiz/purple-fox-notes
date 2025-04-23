import { App, PluginSettingTab, Setting } from 'obsidian';
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
            .setName("Show page break icon")
            .setDesc("Display an icon in the ribbon to quickly insert page breaks.")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.showRibbonIcon)
                    .onChange(async (value) => {
                        this.plugin.settings.showRibbonIcon = value;
                        await this.plugin.saveSettings();
                    })
            );

        new Setting(containerEl)
            .setName("Show line break icon")
            .setDesc("Display an icon in the ribbon to quickly insert line breaks.")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.showLineBreakIcon)
                    .onChange(async (value) => {
                        this.plugin.settings.showLineBreakIcon = value;
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
                    container.empty();
                    container.addClass('setting-item-control');

                    // Create reset button first
                    const resetButton = container.createEl('div', {
                        cls: 'clickable-icon extra-setting-button',
                        attr: {
                            'aria-label': 'Restore default'
                        }
                    });
                    resetButton.style.visibility = this.plugin.settings.radiusMultiplier === 1.0 ? 'hidden' : 'visible';
                    resetButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>';

                    // Create and append slider
                    container.appendChild(slider.sliderEl);

                    // Create tooltip (outside of setting-item-control)
                    const tooltip = document.body.createEl('div', {
                        cls: 'tooltip mod-top',
                        text: this.plugin.settings.radiusMultiplier.toFixed(1)
                    });

                    // Initial positioning
                    const updateTooltipPosition = () => {
                        const sliderRect = slider.sliderEl.getBoundingClientRect();
                        const percent = (this.plugin.settings.radiusMultiplier / 1.5) * 100;
                        const tooltipRect = tooltip.getBoundingClientRect();
                        
                        const left = sliderRect.left + (sliderRect.width * (percent / 100));
                        tooltip.style.left = `${left}px`;
                        tooltip.style.top = `${sliderRect.top - tooltipRect.height - 8}px`;
                    };

                    // Update tooltip visibility
                    const showTooltip = () => {
                        tooltip.style.display = 'block';
                        updateTooltipPosition();
                    };

                    const hideTooltip = () => {
                        tooltip.style.display = 'none';
                    };

                    // Handle reset button click
                    resetButton.addEventListener('click', async () => {
                        const defaultValue = 1.0;
                        slider.setValue(defaultValue);
                        tooltip.textContent = defaultValue.toFixed(1);
                        this.plugin.settings.radiusMultiplier = defaultValue;
                        await this.plugin.saveSettings();
                        this.plugin.updateRadiusStyles();
                        resetButton.style.visibility = 'hidden';
                        updateTooltipPosition();
                    });

                    slider
                        .setLimits(0, 1.5, 0.1)
                        .setValue(this.plugin.settings.radiusMultiplier)
                        .onChange(async (value) => {
                            tooltip.textContent = value.toFixed(1);
                            resetButton.style.visibility = value === 1.0 ? 'hidden' : 'visible';
                            this.plugin.settings.radiusMultiplier = value;
                            await this.plugin.saveSettings();
                            this.plugin.updateRadiusStyles();
                            updateTooltipPosition();
                        });

                    // Add event listeners for tooltip
                    slider.sliderEl.addEventListener('mouseenter', showTooltip);
                    slider.sliderEl.addEventListener('mouseleave', hideTooltip);
                    slider.sliderEl.addEventListener('mousemove', updateTooltipPosition);
                    
                    // Handle window scroll and resize
                    window.addEventListener('scroll', updateTooltipPosition);
                    window.addEventListener('resize', updateTooltipPosition);

                    // Initial setup
                    hideTooltip();
                }

                return slider;
            });

        // Font Settings
        containerEl.createEl('h3', { text: 'Font Settings' });

        new Setting(containerEl)
            .setName("Use Vazirmatn font")
            .setDesc("Enable Vazirmatn font for better Persian text display")
            .addToggle(toggle =>
                toggle
                    .setValue(this.plugin.settings.useCustomFont)
                    .onChange(async (value) => {
                        this.plugin.settings.useCustomFont = value;
                        await this.plugin.saveSettings();
                        this.plugin.updateFontStyle();
                    })
            );
    }
}