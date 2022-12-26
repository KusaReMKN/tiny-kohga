/**
 * @module First
 * @requires Leaflet, First
 */

import generateIcon from './icon.js';

const global = {
	userId: undefined,
	status: undefined,
	dialog: undefined,
	map: undefined,
	routeLine: undefined,
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
		L.marker(r[0], { icon }).addTo(global.map);
	});
	global.routeLine = L.polyline(
		routeData,
		{ weight: 10, color: 'lime' }
	).addTo(global.map);
	afterCheck.style.display = 'flex';
}

export function quit() {
	global.routeLine?.remove();
	afterCheck.style.display = 'none';
}
