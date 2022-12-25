'use strict';

import Status from './status.js';
import Dialog from './dialog.js';

import * as Manki from './manki.js';

const status = new Status('statusArea');
const dialog = new Dialog();
const map = L.map('mapArea').setView([ 35.658, 139.745 ], 16);
const global = {};

const sleep = ms => new Promise(r => setTimeout(r, ms));

const routePoints = [];

const generateIcon = type => L.divIcon({
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
	${type === 'stop' ? ''+(routePoints.length+1)
	: ''+routePoints.length+'-'+(routePoints.at(-1).length)}
	</text>
	</g>
	</svg>
	`,
	iconSize: L.point(30, 52),
	iconAnchor: L.point(15, 52),
	className: '_',
});

const removePoint = async e => {
	const dialogContent = document.createElement('div');
	const p = document.createElement('p');
	p.textContent = '選択した地点を削除しますか？';
	dialogContent.appendChild(p);
	const buttons = document.createElement('div');
	const btnYes = document.createElement('button');
	btnYes.textContent = 'Yes';
	btnYes.onclick = () => { dialog.status = true; dialog.close() };
	buttons.appendChild(btnYes);
	buttons.appendChild(document.createTextNode(' '));
	const btnCancel = document.createElement('button');
	btnCancel.textContent = 'No';
	btnCancel.onclick = () => { dialog.status = false; dialog.close() };
	buttons.appendChild(btnCancel);
	dialogContent.appendChild(buttons);
	dialog.open(true, dialogContent);
	await new Promise(r => {
		const timer = setInterval(() => {
			if (!dialog.opened) {
				clearInterval(timer);
				r();
			}
		});
	});
	dialog.close();
	if (dialog.status === false)
		return;

	const cat = routePoints.reduce((c, r, i) => {
		c.push(...r.reduce((c, p, j, r) => {
			if (p.marker !== e.target) {
				c.push(p);
			} else if (i === 0 && j === 0) {
				for (const p of r)
					if (p.type === 'thru')
						p.marker.remove();
				return r.length = 0, [];
			}
			return c;
		}, []));
		return c;
	}, []);

	e.target.remove();
	routePoints.length = 0;
	if (cat.length === 0)
		return;
	const first = cat.shift();
	first.marker.setIcon(generateIcon(first.type));
	routePoints.push([ first ]);
	for (const p of cat) {
		p.marker.setIcon(generateIcon(p.type));
		if (p.type === 'stop'
				&& routePoints.at(-1).length !== 1
				&& routePoints.at(-1).at(-1).type === 'stop')
			routePoints.push([]);
		routePoints.at(-1).push(p);
	}
};

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
	const icon = generateIcon(type);
	const marker = L.marker(e.latlng, { icon })
	marker.on('click', removePoint);
	marker.addTo(map);
	const routePoint = { ...e.latlng, type, marker };
	switch (type) {
		case 'stop':
			if (routePoints.length !== 0)
				routePoints.at(-1).push(routePoint);
			routePoints.push([ routePoint ]);
			break;
		case 'thru':
			routePoints.at(-1).push(routePoint);
			break;
	}
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

const searchRoute = async () => {
	const rpData = routePoints.map(r => r.map(e => ({ ...e })));
	if (rpData.length === 0) {
		dialog.open(true, `
			<div>
			<p>一つ以上の停留所を設定する必要があります</p>
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
	if (!chkPatrol.checked && rpData.at(-1).at(-1).type !== "stop") {
		dialog.open(true, `
			<div>
			<p>非巡回経路の終点は停留所である必要があります</p>
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
	if (rpData.length === 1 || chkPatrol.checked)
		rpData.at(-1).push(rpData[0][0]);
	else
		void rpData.pop();
	for (const route of rpData)
		for (const point of route)
			[ 'type', 'marker' ].forEach(k => delete point[k]);
	status.write('経路を探索中 ... ');
	dialog.open(true, '<p>Loading ...</p>');
	const route = await Manki.astar(sessionStorage.userId, rpData);
	dialog.close();
	if (!route) {
		status.append('失敗。');
		dialog.open(true, `
			<div>
			<p>経路探索に失敗しました。
			現時点では再挑戦すれば成功すると思います。</p>
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
	status.append('成功。総距離: ',
			route.reduce((c, r) => c + r.reduce((c, p, i, r) =>
				c + (i ? map.distance(r[i-1], p) : 0), 0), 0));
	L.polyline(route, { color: 'lime', weight: 10 }).addTo(map);
};

window.addEventListener('load', () => initialize());
btnGenerateRoute.addEventListener('click', () => searchRoute());
