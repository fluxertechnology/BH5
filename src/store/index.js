'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
//import rootReducer from '@/store/reducers';
import { useRouter } from 'next/navigation';
import { decryptiedData } from '@/lib/services/aes';
import rootReducer from '@/store/rootReducer';

const GlobalContext = createContext();

let context = null;

export function GlobalProvider({ children, cookies }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const quertObj = Object.fromEntries(searchParams.entries());
	const url = `${pathname}?${searchParams}`;

	const defaultState = {
		adsList: {},
		noticeList: [],
		noticeListRead: [],
		user: { id: 'guest' },
		config: {},
		breadcrumbs: [],
		areaCode: [],
		routesGuard: {},
		outOfQuotaData: {
			show: false,
			buy_id: 0,
			buy_type: 0, // 0 小說 1 插圖吧? 2 漫畫 3 動畫 4 影片
			gold: 0,
			episode: 0,
			checkOnPage: false,
			showBuy: false,
			closeType: 'back', //關閉方式 back hidden
			unit: 'gold',
			avatarType: 'init',
			callback: () => {},
		},
		homeData: {},
		homeAnimeData: {},
		homeCategory: [],
		homeAnimesViewData: {},
		homeAnimesContentData: {},
		homeComicViewData: {},
		homeComicContentData: {},
		homeLeaderBoard: {
			comic: [],
			anime: [],
		},
		homeTagData: {},
		homeCategoryData: {},
		homeCategoryTabList: [],
		homeSearchTabList: {
			hotTab: [],
			historyTab: [],
		},
		homeSearchResultData: {},
		homeVideo: { nowTab: 0 },
		homeVideoList: [
			{
				cateid: 0,
				title: '推荐',
				videolist: [],
				page: 0,
				isNew: true,
				isDone: false,
				sort: 0,
			},
		],
		homeVideoContent: {},
		homeNovel: { nowTab: 4 },
		homeNovelsList: [],
		homeNovelsListData: {},
		homeNovelsContentData: {},
		homePhoto: { nowTab: 9 },
		homePhotosList: [],
		homePhotosListData: {},
		homePhotosContentData: {},
		homeStreamList: [],
		postData: {},
		postSameTagList: { list: [], page: 0, isDone: false },
		postProfile: {
			profile: {},
			postList: [],
			page: 0,
			isDone: false,
		},
		postTags: { postTags: [], selectTags: [] },
		postListData: {
			postList: [],
			page: 0,
			isNew: true,
			isDone: false,
		},
		postTrackData: {
			postTrack: [],
			page: 0,
			isNew: true,
			isDone: false,
		},
		postRecommend: [],
		postRecommendFriendList: {
			...({
				list: [],
				page: 0,
				isDone: false,
			}),
		},
		postNotice: [],
		postRecommendList: {
			list: [],
			page: 0,
			isDone: false,
		},
		socialListData: {},
		socialProfileData: {},
		vendorCategory: [],
		vendorListData: { list: [], adverse: [] },
		vendorGameListData: {
			vendorList: [],
			page: 0,
			isNew: true,
			isDone: false,
		},
		vendorData: {},
		vipInfoData: {},
		myorderData: { list: [], page: 0, isDone: false },
		myorderDataDetail: {},
		profileDirectBuy: {
			pay_channel_list: [],
			item_list: [{ outside_display_name: '', pay_price: 0 }],
		},
		myWatchHistory: [],
		getTransferMoney: [],
		profileMission: {
			checkin: [
				{
					id: 1,
					name: '連續簽到',
					category: 1,
					description: '0-0-0-0-0-0',
					reward_type: 1,
					reward_quantity: 1,
					completion_count: 1,
					time_limit: 0,
					create_time: '2023-07-28 18:23:30',
					is_completion: 0,
					has_completion_count: 0,
					signin: [
						{
							day: 1,
							sign: '0',
							completion: 0,
							is_show: 0,
						},
						{
							day: 2,
							sign: '0',
							completion: 0,
							is_show: 0,
						},
						{
							day: 3,
							sign: '0',
							completion: 0,
							is_show: 0,
						},
						{
							day: 4,
							sign: '0',
							completion: 0,
							is_show: 0,
						},
						{
							day: 5,
							sign: '0',
							completion: 0,
							is_show: 0,
						},
						{
							day: 6,
							sign: '0',
							completion: 0,
							is_show: 0,
						},
					],
				},
			],
			weekly: [],
			newbie: [],
		},
		myCollectList: {
			CAC: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			CAV: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			CV: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			CX: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			CT: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
		},
		myBuyList: {
			BAC: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			BAV: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			BV: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			BX: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			BT: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
			BO: {
				list: [],
				page: 0,
				isNew: true,
				isDone: false,
			},
		},
		showCoverCenter: {
			mentionAppCover: false,
			homeFloatAds: false, // 因要求從內存先把狀態改成 false
			announcementCover: false,
		},
		gameListData: {
			list: [],
			vendorList: [],
			page: 0,
			isNew: true,
			isDone: false,
		},
		scrollToTopStatus: false,
		router: {
			action: '', // TODO(ZY): get router action
			location: {
				hash: url.split('#')[1] || '',
				key: '',
				pathname,
				query: { ...quertObj },
				search: searchParams.toString(),
				state: null,
			},
			useRouter: useRouter(),
		},
		navbar: {
			isPlaceholder: false,
			clickSearch: (e) => e.stopPropagation(),
			clickAvatar: () => {},
			clickNew: () => {},
			newNotice: 0,
			clickHome: () => {},
			toPaymentPage: () => {},
			mainHeight: 72,
			subHeight: 66.7,
			subFontSize: 20,
			fixed: true,
			show: true,
			isShowFooter: true,
			isShowSearch: false,
			isShowMore: false,
			bottomNavHeight: 62,
			customComponent: () => false,
			prependComponent: () => <></>,
			appendComponent: () => <></>,
		},
		serviceWorker: {
			isReady: false,
		},
	};

	let isInit = false;
	let toInitData = {};

	if (!isInit && typeof window !== 'undefined') {
		let nowTime = Date.now();
		let lastTime = parseInt(localStorage.lastInitTime || 0);

		// 相關儲存資料請在 index.js 設定
		let userDate = localStorage.userData
			? JSON.parse(decryptiedData(localStorage.userData))
			: {};
		let systemData = localStorage.systemData
			? JSON.parse(decryptiedData(localStorage.systemData))
			: {};
		let catchData = localStorage.catchData
			? JSON.parse(decryptiedData(localStorage.catchData))
			: {};
		let contentData = localStorage.contentData
			? JSON.parse(decryptiedData(localStorage.contentData))
			: {};
		// console.log(cookies.userData,decryptiedData(cookies.userData),'userDate', userDate)

		toInitData = {
			...userDate,
		};

		if (nowTime < lastTime + 1000 * 60 * 10) {
			if (process.env.NODE_ENV !== 'development') {
				toInitData = {
					...toInitData,
					...systemData,
					...catchData,
					...contentData,
				};
			} else {
				toInitData = {
					...toInitData,
					...systemData,
					...catchData,
					...contentData,
				};
			}
		}
		isInit = true;
	}

	const [state, dispatch] = useReducer(rootReducer, {
		...defaultState,
		...toInitData,
	});

	// FORTEST: on state change
	if (process.env.NODE_ENV === 'development') {
		useEffect(() => {
			console.log('state changed', state);
		}, [state]);
	}

	return (
		<GlobalContext.Provider value={{ state, dispatch }}>
			{children}
		</GlobalContext.Provider>
	);
}

export function useGlobalContext() {
	context = useContext(GlobalContext);
	return context;
}

export function useGlobalDispatch(callback) {
	if (!context) useContext(GlobalContext);
	if (typeof callback !== 'function' && !!callback.type) {
		return context.dispatch(callback);
	}
	return callback((subCallback) => {
		if (typeof subCallback !== 'function' && !!subCallback.type) {
			return context.dispatch(subCallback);
		}
		return subCallback(context.dispatch);
	});
}

const Store = {
	getState: () => {
		if (!context) useContext(GlobalContext);
		return context.state;
	},
};

export default Store;
