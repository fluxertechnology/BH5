const fileList = {
	adsList: 'adsList',
	noticeList: 'noticeList',
	noticeListRead: 'noticeListRead',
	user: 'user',
	config: 'config',
	breadcrumbs: 'breadcrumbs',
	areaCode: 'areaCode',
	routesGuard: 'routesGuard',
	outOfQuotaData: 'outOfQuotaData',
	homeData: 'homeMain/homeData',
	homeAnimeData: 'homeAnimes/homeAnimeData',
	homeCategory: 'homeAnimes/homeCategory',
	homeAnimesViewData: 'homeAnimes/homeAnimesViewData',
	homeAnimesContentData: 'homeAnimes/homeAnimesContentData',
	homeComicViewData: 'homeComic/homeComicViewData',
	homeComicContentData: 'homeComic/homeComicContentData',
	homeLeaderBoard: 'homeLeaderBoard/homeLeaderBoard',
	homeTagData: 'homeCategory/homeTagData',
	homeCategoryData: 'homeCategory/homeCategoryData',
	homeCategoryTabList: 'homeCategory/homeCategoryTabList',
	homeSearchTabList: 'homeSearch/homeSearchTabList',
	homeSearchResultData: 'homeSearch/homeSearchResultData',
	homeVideo: 'homeVideo/homeVideo',
	homeVideoList: 'homeVideo/homeVideoList',
	homeVideoContent: 'homeVideo/homeVideoContent',
	homeNovel: 'homeNovels/homeNovels',
	homeNovelsList: 'homeNovelsList',
	homeNovelsListData: 'homeNovels/homeNovelsListData',
	homeNovelsContentData: 'homeNovels/homeNovelsContentData',
	homePhoto: 'homePhotos/homePhoto',
	homePhotosList: 'homePhotosList',
	homePhotosListData: 'homePhotos/homePhotosListData',
	homePhotosContentData: 'homePhotos/homePhotosContentData',
	homeStreamList: 'homeStreamList',
	postData: 'post/postData',
	postSameTagList: 'post/postSameTagList',
	postProfile: 'post/postProfile',
	postTags: 'post/postTags',
	postListData: 'post/postListData',
	postTrackData: 'post/postTrackData',
	postRecommend: 'post/postRecommend',
	postRecommendFriendList: 'post/postRecommendFriendList',
	postNotice: 'post/postNotice',
	postRecommendList: 'post/postRecommendList',
	socialListData: 'social/socialListData',
	socialProfileData: 'social/socialProfileData',
	vendorCategory: 'vender/vendorCategory',
	vendorListData: 'vender/vendorListData',
	vendorGameListData: 'vender/vendorGameListData',
	vendorData: 'vender/vendorData',
	vipInfoData: 'profile/vipInfoData',
	myorderData: 'profile/myorderData',
	myorderDataDetail: 'profile/myorderDataDetail',
	profileDirectBuy: 'profile/profileDirectBuy',
	myWatchHistory: 'profile/myWatchHistory',
	getTransferMoney: 'profile/getTransferMoney',
	profileMission: 'profile/profileMission',
	myCollectList: 'myCollectList',
	myBuyList: 'myBuyList',
	showCoverCenter: 'showCoverCenter',
	gameListData: 'games/gameListData',
	scrollToTopStatus: 'scrollToTopStatus',
	router: 'routerReducer',
	navbar: 'navbarReducer',
	serviceWorker: 'serviceWorkerReducer',
};

const fs = require('fs');
const path = require('path');

const reducersPath = path.join(__dirname, '../src/store/reducers');
const outputFilePath = path.join(__dirname, '../src/store/rootReducer.js');

function extractCases(fileMap) {
	const stateKey = fileMap[0];
	const filePath = fileMap[1];
	const fullPath = path.join(reducersPath, filePath) + '.js';
	const content = fs.readFileSync(fullPath, 'utf-8');
	const match = content.match(
		/switch\s*\(action\.type\)\s*{([\s\S]*?)default:/,
	);

	if (!match) return '';

	return match[1]
		.replace(/state/g, `state.${stateKey}`)
		.replace(/return /g, `state.${stateKey} =`)
		.trim()
		.split(/case\s+/)
		.filter(Boolean)
		.map((caseBlock) => {
			return `case ${caseBlock.trim().replace(/^(.*?):/, '$1: {')
				}\n return {...state}\n }`;
		})
		.join('\n\n');
}

const allCases = Object.entries(fileList).map(extractCases).filter(Boolean)
	.join('\n\n');

const rootReducerContent = `

export default function rootReducer(state = {}, action) {

  switch (action.type) {
    ${allCases}

    default:
      return state;
  }
}
`;

fs.writeFileSync(outputFilePath, rootReducerContent);
console.log('✅ rootReducer.js generated successfully.');
