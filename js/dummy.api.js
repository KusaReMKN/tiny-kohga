/** @module DummyApi */

/**
 * 地点を通るルートを探索する（ふりをする）。
 * args は data: Position[] を含んでいること。
 *
 * @param {UserId} userId ユーザ識別子
 * @param {AstarArgs} args その他の引数
 * @return {Promise<AstarResult>}
 */
export function astar(userId, args) {
	const result = !userId || !args.data || Math.random() < .05 ? {
		succeeded: false,
		reason: "something wrong",
	} : {
		succeeded: true,
		route: args.data.reduce((r, e) => {
			if (r.length === 0)
				r.push(e);
			else
				r.push(L.latLng(r.at(-1).lat, e.lng), e);
			return r;
		}, []),
	};
	return new Promise(r =>
		setTimeout(() => r(result), Math.random() * 10000)
	);
}

/**
 * 新しいユーザ識別子を発行する（ふりをする）。
 *
 * @return {Promise<CreateUserResult>}
 */
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

/**
 * 通行可能領域情報を取得する（ふりをする）。
 *
 * @param {UserId} userId ユーザ識別子
 * @return {Promise<ReqPassableResult>}
 */
export function reqPassable(userId) {
	const result = !userId || Math.random() < .1 ? {
		succeeded: false,
	} : {
		succeeded: true,
		passableInfo: [
			{
				"pos": {
					"lat": 35.65867636972139,
					"lng": 139.74541680454988
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.658595126386274,
					"lng": 139.74651753902438
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.65942325923373,
					"lng": 139.744827747345
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.65979809548868,
					"lng": 139.7438192367554
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.65952786487723,
					"lng": 139.74276244640353
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.65970656586788,
					"lng": 139.74167346954349
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66008575932827,
					"lng": 139.74067568778995
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66048238504405,
					"lng": 139.7431004047394
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.661271272095114,
					"lng": 139.74359393119815
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66201656706634,
					"lng": 139.74418401718142
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.662740063132574,
					"lng": 139.744827747345
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.660491102070615,
					"lng": 139.73968863487246
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.660892084264326,
					"lng": 139.73869085311892
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.661271272095114,
					"lng": 139.73768770694736
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.661580722898485,
					"lng": 139.73664700984958
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66188581406579,
					"lng": 139.73561167716983
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.662212696165724,
					"lng": 139.7345817089081
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66261802811116,
					"lng": 139.73360002040866
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66308437522319,
					"lng": 139.73265588283542
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66366839486784,
					"lng": 139.73181903362277
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.662831589276216,
					"lng": 139.73140597343448
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.662081640970094,
					"lng": 139.73814609164913
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.662962340728015,
					"lng": 139.73835289478305
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66383401160151,
					"lng": 139.73857283592227
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.66470567295868,
					"lng": 139.73878741264346
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.65873460199356,
					"lng": 139.74329352378848
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.65790646200456,
					"lng": 139.74373340606692
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.657078313427654,
					"lng": 139.74417328834537
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.65628502621145,
					"lng": 139.7447043657303
				},
				"r": 100
			},
			{
				"pos": {
					"lat": 35.655448143244485,
					"lng": 139.7451174259186
				},
				"r": 100
			}
		],
	};
	return new Promise(r =>
		setTimeout(() => r(result), Math.random() * 1000)
	);
}

/**
 * 保存済みの経路を取得する（ふりをする）。
 * args は routeName: string を含んでいること。
 *
 * @param {UserId} userId ユーザ識別子
 * @param {ReqRouteArgs} args その他の引数
 * @return {Promise<ReqRouteResult>}
 */
export function reqRoute(userId, args) {
	const result = !userId || args.routeName !== 'ゆめ咲線直通桜島行き'
			|| Math.random() < .1 ? {
		succeeded: false,
	} : {
		succeeded: true,
		route: [
			[
				{
					"lat": 35.65529127055111,
					"lng": 139.74510669708255
				},
				{
					"lat": 35.65529127055111,
					"lng": 139.74671602249148
				},
				{
					"lat": 35.658462096656926,
					"lng": 139.74671602249148
				},
				{
					"lat": 35.658462096656926,
					"lng": 139.74296092987063
				},
				{
					"lat": 35.65954223943891,
					"lng": 139.74296092987063
				}
			],
			[
				{
					"lat": 35.65954223943891,
					"lng": 139.74296092987063
				},
				{
					"lat": 35.65954223943891,
					"lng": 139.74489212036136
				},
				{
					"lat": 35.66274773844904,
					"lng": 139.74489212036136
				},
				{
					"lat": 35.66274773844904,
					"lng": 139.73783254623416
				},
				{
					"lat": 35.66118192062334,
					"lng": 139.73783254623416
				}
			],
			[
				{
					"lat": 35.66118192062334,
					"lng": 139.73783254623416
				},
				{
					"lat": 35.66118192062334,
					"lng": 139.73875522613528
				},
				{
					"lat": 35.664840285079194,
					"lng": 139.73875522613528
				},
				{
					"lat": 35.664840285079194,
					"lng": 139.7322750091553
				},
				{
					"lat": 35.66313306919273,
					"lng": 139.7322750091553
				}
			]
		],
		dest: [
			{
				lat: 35.65529127055111,
				lng: 139.74510669708255
			},
			{
				lat: 35.65954223943891,
				lng: 139.74296092987063
			},
			{
				lat: 35.66118192062334,
				lng: 139.73783254623416
			},
			{
				lat: 35.66313306919273,
				lng: 139.7322750091553
			},
		],
		junkai: false,
	};
	return new Promise(r =>
		setTimeout(() => r(result), Math.random() * 1000)
	);
}

/**
 * 全ての保存済みの経路名情報を取得する（ふりをする）。
 *
 * @param {UserId} userId ユーザ識別子
 * @return {Promise<RouteNameResult>}
 */
export function routeName(userId) {
	const result = !userId || Math.random() < .1 ? {
		succeeded: false,
	} : {
		succeeded: true,
		passableNames: [
			{
				routeName: 'ゆめ咲線直通桜島行き',
				available: true,
			},
			{
				routeName: '完全版 Kohga 完成ルート',
				available: false,
			},
		],
	};
	return new Promise(r =>
		setTimeout(() => r(result), Math.random() * 1000)
	);
}
