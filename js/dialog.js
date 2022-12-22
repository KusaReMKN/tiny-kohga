'use strict';

export default class Dialog {
	#elemDialog;
	constructor(id) {
		const parentNode =
			id && document.getElementById(id) || document.body;
		const dialog = document.createElement('dialog');
		this.#elemDialog = parentNode.appendChild(dialog);
	}
	close() {
		this.#elemDialog.close();
	}
	set content(cnt) {
		this.reset();
		const parser = new DOMParser();
		const child = cnt instanceof Node ? cnt
			: parser.parseFromString(cnt, 'text/html')
				.body.firstElementChild;
		this.#elemDialog.appendChild(child);
	}
	open(modal, cnt) {
		if (cnt)
			this.content = cnt;
		this.#elemDialog[modal ? 'showModal' : 'show']();
	}
	get opened() {
		return this.#elemDialog.open;
	}
	reset() {
		const clone = this.#elemDialog.cloneNode(false);
		const parent = this.#elemDialog.parentNode;
		parent.replaceChild(clone, this.#elemDialog);
		this.#elemDialog = clone;
	}
	show() {
		this.#elemDialog.show();
	}
	showModal() {
		this.#elemDialog.showModal();
	}
};
