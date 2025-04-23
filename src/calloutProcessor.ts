import { App } from 'obsidian';

export class CalloutProcessor {
    private observer: MutationObserver;
    private app: App;

    constructor(app: App) {
        this.app = app;
        this.observer = new MutationObserver(this.handleMutations.bind(this));
    }

    public startObserving(): void {
        const workspaceEl = this.app.workspace.containerEl;
        if (workspaceEl) {
            this.observer.observe(workspaceEl, {
                childList: true,
                subtree: true,
            });
        }
    }

    public stopObserving(): void {
        this.observer.disconnect();
    }

    public processAllCallouts(): void {
        const workspaceEl = this.app.workspace.containerEl;
        if (!workspaceEl) return;

        workspaceEl
            .querySelectorAll<HTMLElement>('.callout[data-callout]')
            .forEach(el => this.processCallout(el));
    }

    private handleMutations(mutations: MutationRecord[]): void {
        for (const m of mutations) {
            for (const node of Array.from(m.addedNodes)) {
                if (!(node instanceof HTMLElement)) continue;

                if (node.matches('.callout[data-callout]')) {
                    this.processCallout(node);
                }
                node.querySelectorAll<HTMLElement>('.callout[data-callout]').forEach(el => {
                    this.processCallout(el);
                });
            }
        }
    }

    private processCallout(calloutEl: HTMLElement): void {
        const raw = calloutEl.getAttribute('data-callout');
        if (!raw || !raw.includes('-')) return;

        const [type, extraClass] = raw.split('-', 2);
        calloutEl.setAttribute('data-callout', type);
        calloutEl.classList.add(extraClass);
    }
}