import generateIcon from './icon.js';

import * as Manki from './manki.js';
import * as Second from './second.js';

const global = {
	userId: undefined,
	status: undefined,
	doalog: undefined,
	map: undefined,
}

const routePoints = [];

export function initialize(userId, status, dialog, map) {
	global.userId = userId;
	global.status = status;
	global.dialog = dialog;
	global.map = map;
	global.map.on('click', appendPoint);
	routePoints.forEach(r => r.forEach(p => p.marker.addTo(global.map)));
	beforeCheck.style.display = 'flex';
	btnGenerateRoute.addEventListener('click', searchRoute);
}

export function quit() {
	global.map.off('click', appendPoint);
	routePoints.forEach(r => r.forEach(p => p.marker.remove()));
	beforeCheck.style.display = 'none';
	btnGenerateRoute.removeEventListener('click', searchRoute);
}

async function appendPoint(e) {
	const type = document.forms.beforeCheck.radMode.value;
	if (type !== 'stop' && type !== 'thru')
		return;
	if (type === 'thru' && routePoints.length === 0) {
		global.dialog.open(true, `
			<div>
			<p>最初の地点は停留所である必要があります</p>
			<button onclick="this.parentNode.parentNode.close();">
			了解
			</button>
			</div>
		`);
		await new Promise(r => {
			const timer = setInterval(() => {
				if (!global.dialog.opened) {
					clearInterval(timer);
					r();
				}
			});
		});
		global.dialog.close();
		return;
	}
	const icon = generateIcon(...iconArgs(type));
	const marker = L.marker(e.latlng, { icon })
	marker.on('click', removePoint);
	marker.addTo(global.map);
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
}

function iconArgs(type) {
	return [
		type === 'stop' ? 'blue' : 'red',
		type === 'stop' ? (routePoints.length+1)+''
			: routePoints.length+'-'+(routePoints.at(-1).length),
	];
}

async function removePoint(e) {
	const dialogContent = document.createElement('div');
	const p = document.createElement('p');
	p.textContent = '選択した地点を削除しますか？';
	dialogContent.appendChild(p);
	const buttons = document.createElement('div');
	const btnYes = document.createElement('button');
	btnYes.textContent = 'Yes';
	btnYes.onclick = () => {
		global.dialog.status = true;
		global.dialog.close();
	};
	buttons.appendChild(btnYes);
	buttons.appendChild(document.createTextNode(' '));
	const btnCancel = document.createElement('button');
	btnCancel.textContent = 'No';
	btnCancel.onclick = () => {
		global.dialog.status = false;
		global.dialog.close();
	};
	buttons.appendChild(btnCancel);
	dialogContent.appendChild(buttons);
	global.dialog.open(true, dialogContent);
	await new Promise(r => {
		const timer = setInterval(() => {
			if (!global.dialog.opened) {
				clearInterval(timer);
				r();
			}
		});
	});
	global.dialog.close();
	if (global.dialog.status === false)
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
	first.marker.setIcon(generateIcon(...iconArgs(first.type)));
	routePoints.push([ first ]);
	for (const p of cat) {
		p.marker.setIcon(generateIcon(...iconArgs(p.type)));
		if (p.type === 'stop'
				&& routePoints.at(-1).length !== 1
				&& routePoints.at(-1).at(-1).type === 'stop')
			routePoints.push([]);
		routePoints.at(-1).push(p);
	}
}

async function searchRoute() {
	const rpData = routePoints.map(r => r.map(e => ({ ...e })));
	if (rpData.length === 0) {
		global.dialog.open(true, `
			<div>
			<p>一つ以上の停留所を設定する必要があります</p>
			<button onclick="this.parentNode.parentNode.close();">
			了解
			</button>
			</div>
		`);
		await new Promise(r => {
			const timer = setInterval(() => {
				if (!global.dialog.opened) {
					clearInterval(timer);
					r();
				}
			});
		});
		global.dialog.close();
		return;
	}
	if (!chkPatrol.checked && rpData.at(-1).at(-1).type !== "stop") {
		global.dialog.open(true, `
			<div>
			<p>非巡回経路の終点は停留所である必要があります</p>
			<button onclick="this.parentNode.parentNode.close();">
			了解
			</button>
			</div>
		`);
		await new Promise(r => {
			const timer = setInterval(() => {
				if (!global.dialog.opened) {
					clearInterval(timer);
					r();
				}
			});
		});
		global.dialog.close();
		return;
	}
	if (rpData.length === 1 || chkPatrol.checked)
		rpData.at(-1).push(rpData[0][0]);
	else
		void rpData.pop();
	for (const route of rpData)
		for (const point of route)
			[ 'type', 'marker' ].forEach(k => delete point[k]);
	global.status.write('経路を探索中 ... ');
	global.dialog.open(true, '<p>Loading ...</p>');
	const route = await Manki.astar(sessionStorage.userId, rpData);
	global.dialog.close();
	if (!route) {
		global.status.append('失敗。');
		global.dialog.open(true, `
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
				if (!global.dialog.opened) {
					clearInterval(timer);
					r();
				}
			});
		});
		global.dialog.close();
		return;
	}
	global.status.append('成功。総距離: ', route.reduce((c, r) =>
		c + r.reduce((c, p, i, r) =>
			c + (i ? global.map.distance(r[i-1], p) : 0), 0), 0));
	quit();
	Second.initialize(
		global.userId, global.status, global.dialog, global.map, route
	);
}
