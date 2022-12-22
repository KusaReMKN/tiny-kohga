'use strict';

import Status from './status.js';
import Dialog from './dialog.js';

import * as Manki from './manki.js';

const status = new Status('statusArea');
const dialog = new Dialog();
const map = L.map('mapArea').setView([ 35.658, 139.745 ], 16);

const sleep = ms => new Promise(r => setTimeout(r, ms));

const routePoints = [];

const appendPoint = async e => {
	const type = document.forms.beforeCheck.radMode.value;
	if (type !== 'stop' && type !== 'thru')
		return;
	if (type === 'thru' && routePoints.length === 0) {
		dialog.open(true, `
			<div>
			<p>最初の地点は停留所である必要があります</p>
			<button onclick="this.parentNode.parentNode.close();">
			了解
			</button>
			</div>
		`);
		await new Promise(r => {
			const timer = setInterval(() => {
				if (!dialog.opened) {
					clearInterval(timer);
					r();
				}
			});
		});
		dialog.close();
		return;
	}
	switch (type) {
		case 'stop':
			if (routePoints.length !== 0)
				routePoints.at(-1).push(e.latlng);
			routePoints.push([ e.latlng ]);
			break;
		case 'thru':
			routePoints.at(-1).push(e.latlng);
			break;
	}
	const icon = L.divIcon({
		html: `
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
			width="30" height="52" viewBox="0 0 40 70">
		<g fill="${type === 'stop' ? 'blue' : 'red'}" stroke="none">
		<circle cx="20" cy="20" r="20" />
		<polygon points="1.672,28 20,70 38.218,28" />
		</g>
		<g fill="white" stroke="gray" stroke-width="1">
		<text x="20" y="28" style="font: bold 16px sans-serif;"
			text-anchor="middle">
		${type === 'stop' ? ''+routePoints.length
		: ''+routePoints.length+'-'+(routePoints.at(-1).length - 1)}
		</text>
		</g>
		</svg>
		`,
		iconSize: L.point(30, 52),
		iconAnchor: L.point(15, 52),
		className: '_',
	});
	L.marker(e.latlng, {
		icon,
	}).addTo(map);
};

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
	map.on('click', appendPoint);
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
	sessionStorage.setItem('userId', userId);
};

const initRouteName = async () => {
	status.write('保存済み経路名情報を取得中 ... ');
	dialog.open(true, '<p>Loading ...</p>');
	const passableNames = await Manki.routeName(sessionStorage.userId);
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
	const passableInfo = await Manki.reqPassable(sessionStorage.userId);
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
};

window.addEventListener('load', () => initialize());
