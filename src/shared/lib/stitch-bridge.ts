import {
	getElementLabel,
	resolveStitchAction,
	type StitchAction,
	type StitchWireContext,
} from './stitch-action-registry';

export interface StitchBridgeHandlers {
	readonly onNavigate: (screenId: string) => void;
	readonly onBack: () => void;
	readonly onToast: (message: string) => void;
}

const INTERACTIVE_SELECTOR = [
	'a[href]',
	'button',
	'[role="button"]',
	'input[type="submit"]',
	'input[type="button"]',
	'[data-nf-target]',
	'[class*="cursor-pointer"]',
].join(',');

function dispatchAction(action: StitchAction, handlers: StitchBridgeHandlers) {
	switch (action.type) {
		case 'navigate':
			handlers.onNavigate(action.screenId);
			break;
		case 'back':
			handlers.onBack();
			break;
		case 'toast':
			handlers.onToast(action.message);
			break;
	}
}

function wireElement(element: Element, ctx: StitchWireContext, handlers: StitchBridgeHandlers) {
	const label = getElementLabel(element);
	const action = resolveStitchAction(label, ctx);

	if (!action) return;

	const htmlEl = element as HTMLElement;
	htmlEl.dataset.nfWired = 'true';
	htmlEl.style.cursor = 'pointer';

	const onActivate = (event: Event) => {
		event.preventDefault();
		event.stopPropagation();
		dispatchAction(action, handlers);
	};

	element.addEventListener('click', onActivate, true);
	element.addEventListener('keydown', event => {
		if (event instanceof KeyboardEvent && (event.key === 'Enter' || event.key === ' ')) {
			onActivate(event);
		}
	});
}

export function wireStitchDocument(doc: Document, ctx: StitchWireContext, handlers: StitchBridgeHandlers) {
	const nodes = doc.querySelectorAll(INTERACTIVE_SELECTOR);
	let wired = 0;

	nodes.forEach(node => {
		if (node instanceof HTMLElement && node.dataset.nfWired === 'true') return;

		const label = getElementLabel(node);
		if (!resolveStitchAction(label, ctx)) return;

		wireElement(node, ctx, handlers);
		wired += 1;
	});

	doc.querySelectorAll('form').forEach(form => {
		form.addEventListener(
			'submit',
			event => {
				event.preventDefault();
				const submitter = (event as SubmitEvent).submitter;
				const label = submitter ? getElementLabel(submitter) : 'enviar';
				const action =
					resolveStitchAction(label, ctx) ??
					resolveStitchAction('enviar', ctx) ??
					resolveStitchAction('continuar', ctx);

				if (action) dispatchAction(action, handlers);
			},
			true,
		);
	});

	return wired;
}
