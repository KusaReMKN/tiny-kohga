'use strict';

export default class Status {
	#elemStatus;
	constructor(id) {
		const parentNode =
			id && document.getElementById(id) || document.body;
		const output = document.createElement('output');
		output.style.display = 'block';
		output.style.overflow = 'hidden';
		this.#elemStatus = parentNode.appendChild(output);
	}
	append(...mesg) {
		for (const str of mesg)
			this.#elemStatus.textContent += str;
	}
	clear() {
		this.#elemStatus.textContent = '';
	}
	write(...mesg) {
		this.clear();
		this.append(...mesg);
	}
};
