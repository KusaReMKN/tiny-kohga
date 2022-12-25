import * as Api from './api.js';

export async function createUser() {
	const result = await (async () => {
		try {
			return await Api.createUser();
		} catch (err) {
			console.error('createUser', err);
			return null;
		}
	})();
	return result?.userId || null;
}

export async function routeName(userId) {
	const result = await (async () => {
		try {
			return await Api.routeName(userId);
		} catch (err) {
			console.error('routeName', err);
			return null;
		}
	})();
	return result?.passableNames || null;
}

export async function reqPassable(userId) {
	const result = await (async () => {
		try {
			return await Api.reqPassable(userId);
		} catch (err) {
			console.error('reqPassable', err);
			return null;
		}
	})();
	return result?.passableInfo || null;
}

export async function astar(userId, routePoints) {
	const result = await (async () => {
		try {
			const promises = [];
			for (const data of routePoints)
				promises.push(Api.astar(userId, { data }));
			const results = await Promise.all(promises);
			return {
				route: results.reduce((c, e) => {
					if (!e.succeeded || c === null)
						return null;
					c.push(e.route);
					return c;
				}, []),
			};
		} catch (err) {
			console.error('astar', err);
			return null;
		}
	})();
	return result?.route || null;
}
