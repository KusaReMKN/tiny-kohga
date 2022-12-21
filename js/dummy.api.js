'use strict';

export function createUser() {
	const result = Math.random() < .1 ? {
		succeeded: false,
	} : {
		succeeded: true,
		userId: 'dummy' + String(Math.random()).substring(2),
	};
	return new Promise(r =>
		setTimeout(() => r(result), Math.random() * 1000)
	);
}

export function routeName() {
	const result = Math.random() < .1 ? {
		succeeded: false,
	} : {
		succeeded: true,
		passableNames: [
			{
				routeName: 'ゆめ咲線直通桜島行き',
				available: true,
			},
			{
				routeName: '完全版 Kohga 完成√',
				available: false,
			},
		],
	};
	return new Promise(r =>
		setTimeout(() => r(result), Math.random() * 1000)
	);
}
