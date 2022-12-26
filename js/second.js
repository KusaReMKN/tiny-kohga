/**
 * @module First
 * @requires Leaflet, First
 */

import generateIcon from './icon.js';

import * as First from './first.js';

const global = {
	userId: undefined,
	status: undefined,
	dialog: undefined,
	map: undefined,
	routeLine: undefined,
	markers: [],
};

const routeData = [];

export function initialize(userId, status, dialog, map, route) {
	global.userId = userId;
	global.status = status;
	global.dialog = dialog;
	global.map = map;
	routeData.length = 0;
	route.forEach(r => routeData.push(r));
	routeData.forEach((r, i) => {
		const icon = generateIcon('blue', i+1);
		global.markers.push(
			L.marker(r[0], { icon }).addTo(global.map)
		);
	});
	if (!L.latLng(routeData[0][0]).equals(routeData.at(-1).at(-1))) {
		const icon = generateIcon('blue', routeData.length+1);
		global.markers.push(
			L.marker(routeData.at(-1).at(-1), { icon })
				.addTo(global.map)
		);
	}
	global.routeLine = L.polyline(
		routeData,
		{ weight: 10, color: 'lime' }
	).addTo(global.map);
	afterCheck.style.display = 'flex';
	btnEditRoute.addEventListener('click', editRoute);
}

export function quit() {
	global.routeLine?.remove();
	global.markers.forEach(e => e.remove());
	afterCheck.style.display = 'none';
	btnEditRoute.removeEventListener('click', editRoute);
}

function editRoute() {
	quit();
	First.initialize(
		global.userId, global.status, global.dialog, global.map
	);
}
