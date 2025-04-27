import { MarkdownView } from 'obsidian';
import { PurpleFoxSettings } from './settings';

export class TOCProcessor {
    constructor(private settings: PurpleFoxSettings) {}

    generateTOC(markdownContent: string): string {
        const lines = markdownContent.split('\n');
        const headings: { level: number; text: string; }[] = [];

        // Extract headings
        for (const line of lines) {
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                if (level >= this.settings.tocMinLevel && level <= this.settings.tocMaxLevel) {
                    headings.push({
                        level,
                        text: match[2].trim()
                    });
                }
            }
        }

        if (headings.length === 0) {
            return '';
        }

        // Generate TOC content
        let toc = `## Table of Contents\n\n<div dir="auto" class="purple-fox-toc">\n<ul>\n`;
        
        let lastLevel = 1;
        let openLists = 1; // Count of currently open <ul> tags

        headings.forEach((heading, index) => {
            const bullet = this.settings.tocListStyle === 'bullet' ? '•' : `${index + 1}`;
            
            if (heading.level > lastLevel) {
                // Add a new sublist
                toc += '<ul>\n';
                openLists++;
            } else if (heading.level < lastLevel) {
                // Close appropriate number of sublists
                const levels = lastLevel - heading.level;
                for (let i = 0; i < levels && openLists > 1; i++) {
                    toc += '</ul>\n';
                    openLists--;
                }
            }

            // Add the heading entry
            toc += `<li data-bullet="${bullet}">${heading.text}</li>\n`;
            lastLevel = heading.level;
        });

        // Close any remaining open lists
        while (openLists > 0) {
            toc += '</ul>\n';
            openLists--;
        }

        toc += '</div>\n\n<div class="page-break"></div>\n\n';
        return toc;
    }
}