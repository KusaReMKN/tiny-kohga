'use strict';

const outStatus = document.getElementById('outStatus') || { textContent: '' };

export function
append(...args)
{
	for (const str of args)
		outStatus.textContent += str;
}

export function
clear()
{
	outStatus.textContent = '';
}

export function
write(...args)
{
	clear();
	append(...args);
}
