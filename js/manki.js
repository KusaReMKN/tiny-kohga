import * as Api from './api.js';

export async function createUser() {
	const result = await (async () => {
		try {
			return await Api.createUser();
		} catch (err) {
			console.error('createUser', e);
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
			console.error('routeName', e);
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
			console.error('reqPassable', e);
			return null;
		}
	})();
	return result?.passableInfo || null;
}
