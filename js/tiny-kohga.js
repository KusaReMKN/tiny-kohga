'use strict';

import * as Api from './api.js';
import * as Status from './status.js';

const getUserId = async () => {
	Status.write('ユーザ識別子を発行中 ... ');
	const res = await Api.createUser();
	if (!res.succeeded) {
		Status.append('失敗。継続できません。');
		return null;
	}
	Status.append('完了。', res.userId);
	return res.userId;
};

const getRouteNames = async () => {
	Status.write('保存済み経路名情報を取得中 ... ');
	const res = await Api.routeName(sessionStorage.userId);
	if (!res.succeeded) {
		Status.append('失敗。保存済み経路を利用できません。');
		return null;
	}
	Status.append('完了。', res.passableNames.length);
	return res.passableNames;
};

const initialize

window.addEventListener('load', async () => {
	const userId = await getUserId()
	if (userId)
		sessionStorage.setItem('userId', userId);
	await new Promise(r => setTimeout(() => r(), 1000));

});
