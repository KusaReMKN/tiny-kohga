import Status from './status.js';
import Dialog from './dialog.js';

import * as Manki from './manki.js';
import * as First from './first.js';

const status = new Status('statusArea');
const dialog = new Dialog();
const map = L.map('mapArea').setView([ 35.658, 139.745 ], 16);
const global = {
	userId: undefined,
	state: undefined,
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

const routeData = [];	// state 2

const initForms = () => {
	const forms = document.getElementsByTagName('form');
	for (const elem of forms)
		elem.addEventListener('submit', e => e.preventDefault());
};

const initMap = () => {
	const tileOptions = {
		minZoom: 5,
		maxZoom: 18,
		attribution:
			'<a href="https://maps.gsi.go.jp/development'
			+ '/ichiran.html">地理院タイル</a>',
	};
	L.tileLayer(
		'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
		tileOptions,
	).addTo(map);
};

const initUserId = async () => {
	status.write('ユーザ識別子を発行中 ... ');
	dialog.open(true, '<p>Loading ...</p>');
	const userId = await Manki.createUser();
	dialog.close();
	if (!userId) {
		dialog.open(true, `
		<div style="text-align: center;">
		<p>ユーザ識別子を発行できませんでした。
		ページを再読み込みしてやりなおしてください。</p>
		<button onclick="window.location.reload();">やりなおす</button>
		</div>
		`);
		throw new Error('initUser: Failed');
	}
	status.append('完了。', userId);
	global.userId = userId;
};

const initRouteName = async () => {
	status.write('保存済み経路名情報を取得中 ... ');
	dialog.open(true, '<p>Loading ...</p>');
	const passableNames = await Manki.routeName(global.userId);
	dialog.close();
	if (!passableNames) {
		status.append('失敗。保存済み経路を利用できません。');
		slctRouteName.disabled = btnQueueRoute.disabled = true;
		await sleep(1000);
		return;
	}
	status.append('成功。', passableNames.length, '件');
	for (const elem of passableNames) {
		const opt = document.createElement('option');
		opt.disabled = !elem.available;
		opt.textContent = elem.routeName;
		slctRouteName.appendChild(opt);
	}
};

const initPassable = async () => {
	status.write('通行可能領域情報を取得中 ... ');
	dialog.open(true, '<p>Loading ...</p>');
	const passableInfo = await Manki.reqPassable(global.userId);
	dialog.close();
	if (!passableInfo) {
		status.append('失敗。通行可能領域を表示できません。');
		await sleep(1000);
		return;
	}
	status.append('成功。', passableInfo.length, '件');
	for (const elem of passableInfo)
		L.circle(elem.pos, { radius: elem.r }).addTo(map);
};

const initialize = async () => {
	initForms();
	initMap();
	await initUserId();
	await initRouteName();
	await initPassable();
	changeState(1);
};

const changeState = s => {
	if (global.state === s)
		return;
	switch (global.state) {
		case 1:
			map.off();
			for (const route of routePoints)
				for (const p of route)
					p.remove();
			break;
		case 2:
			break;
		case 3:
			break;
	}
	switch (s) {
		case 1:
			First.initialize(global.userId, status, dialog, map);
			break;
		case 2:
			break;
		case 3:
			break;
	}
	global.state = s;
};

window.addEventListener('load', () => initialize());
