import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext, useGlobalDispatch } from '@/store';
import {
	addHistoryTabAcion,
	updateSearchResultAction,
} from '@/store/actions/pages/homeSearchResultAction';
import Grid from '@mui/material/Grid';
import CoverCubeItem from '@/components/common/CoverCubeItem';
import Image from 'next/image';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useTranslations } from 'next-intl';
import {
	itemScrollBottomCallEvent,
	scrollCold,
} from '@/lib/services/scrollEvent';
import {
	clearHistoryAction,
	getSearchTabAction,
} from '@/store/actions/pages/homeSearchMainAction';
import LinkComponent from '@/components/common/LinkComponent';
import {
	adsKeys,
	colors,
	pageUrlConstants,
	side_padding,
} from '@/lib/constants';
import Cookies from 'js-cookie';
import Tab from '@mui/material/Tab';
import { Swiper, SwiperSlide } from 'swiper/react';

const { home } = pageUrlConstants;

const SearchResult = ({ show = true }) => {
	const { state } = useGlobalContext();
	const { isMobile } = useMediaQuery();
	const t = useTranslations();

	const categoryList = {
		SAC: {
			name: t('Navbar.top_navigator_comic'),
		},
		SAV: {
			name: t('Navbar.top_navigator_animate'),
		},
		SV: {
			name: t('Navbar.top_navigator_video'),
		},
		SX: {
			name: t('Navbar.top_navigator_novel'),
		},
		ST: {
			name: t('Navbar.top_navigator_meitu'),
		},
	};

	const categoryColors = [
		['#ff487f', '#fa719a'], // Ani-Manga
		['#33b7c3', '#7fc28f'], // Video
		['#4aeba8', '#fcb423'], // Image
		['#f80f6e', '#595292'], // Novel
		['#1289e7', '#24e5c0'], // K-Comics
		['#2065bc', '#923bde'], // Dojin
		['#5eaeef', '#f3305f'], // 3D
		['#ea2c38', '#ea9d3c'], // RANKS
		['#0f74c7', '#7acfec'], // Free Watch
		['#ffb321', '#ff8921'], // Customer Support
		['#ff4b80', '#ff4b60'], // Download APP
		['#ff4b80'], // PINK
	];

	const [isShow, setIsShow] = useState(show);
	const [searchCategory, setSearchCategory] = useState('SAC');
	const [searchInput, setSearchInput] = useState('');
	const updateSearchResult = (pathneme, scrollColdEnd = () => {}) => {
		let path = pathneme.split('/');
		const category = window.localStorage.getItem('searchCategory');
		const input = window.localStorage.getItem('searchInput');
		if (input && category) {
			useGlobalDispatch(
				updateSearchResultAction(path[0], path[1], scrollColdEnd),
			);
			useGlobalDispatch(addHistoryTabAcion(path[0]));
		}
	};
	const onSearchInputChange = (e) => {
		setSearchInput(e.target.value);
	};
	const onSearchInputKeydown = (e) => {
		if (e.key === 'Enter') {
			window.localStorage.setItem('searchInput', searchInputRef.current.value);
			scrollCold(false);
			updateSearchResult(`${searchInput}/${searchCategory}`);
		}
	};

	const tabSearch = (tabName) => () => {
		setSearchInput(tabName);
		scrollCold(false);
		window.localStorage.setItem('searchInput', tabName);
		updateSearchResult(`${tabName}/${searchCategory}`);
	};

	const categorySearch = (category) => {
		setSearchCategory(category);
		window.localStorage.setItem('searchInput', searchInputRef.current.value);
		window.localStorage.setItem('searchCategory', category);
		scrollCold(false);
		updateSearchResult(`${searchInputRef.current.value}/${category}`);
	};

	const searchInputRef = useRef(null);
	const searchCategoryRef = useRef(searchCategory);

	const localState = useMemo(() => {
		return {
			isEnd: state.homeSearchResultData[searchInput]
				? state.homeSearchResultData[searchInput][searchCategory].isEnd
				: false,
			list: state.homeSearchResultData[searchInput]
				? [...state.homeSearchResultData[searchInput][searchCategory].list]
				: [],
		};
	}, [
		state.homeSearchResultData,
		searchCategory,
		searchInput,
	]);

	function scrollEvent() {
		itemScrollBottomCallEvent(
			document.querySelector('.search_result_wrapper'),
			(scrollColdEnd) => {
				useGlobalDispatch(
					updateSearchResultAction(
						window.localStorage.getItem('searchInput'),
						window.localStorage.getItem('searchCategory'),
						scrollColdEnd,
					),
				);
			},
		);
	}

	const closeSearch = () => {
		useGlobalDispatch({
			type: 'UPDATE_NAVBAR',
			key: 'isShowSearch',
			data: false,
		});
	};

	useEffect(() => {
		window.localStorage.setItem('searchInput', searchInput);
		window.localStorage.setItem('searchCategory', searchCategory);
		if (
			!state.homeSearchResultData[searchInput] ||
			state.homeSearchResultData[searchInput][searchCategory]?.page === 0
		) {
			updateSearchResult(`${searchInput}/${searchCategory}`);
		}

		const searchResultWrapper = document.querySelector(
			'.search_result_wrapper',
		);
		searchResultWrapper.removeEventListener('scroll', scrollEvent);
		searchResultWrapper.addEventListener('scroll', scrollEvent);
	}, []);

	useEffect(() => {
		if (
			state.navbar.isShowSearch && state.homeSearchTabList.hotTab.length === 0
		) {
			getSearchTabData();
		}
	}, [state.navbar.isShowSearch]);

	const getSearchTabData = () => {
		useGlobalDispatch(getSearchTabAction());
	};

	const clearHistory = () => {
		useGlobalDispatch(clearHistoryAction());
	};

	return (
		<SearchResultElement
			main_height={state.navbar.mainHeight}
			bottom_nav_height={state.navbar.bottomNavHeight}
			isMobile={isMobile}
			searchbar_height={(isMobile ? 200 : 210) +
				(!!searchInput ? (isMobile ? 30 : 60) : 0)}
		>
			<div className={state.navbar.isShowSearch ? '' : 'hide'}>
				<div className='search_bar'>
					<div className='search_bar_content'>
						<input
							ref={searchInputRef}
							type='text'
							className='search_content_input'
							placeholder='搜寻你想要的...'
							enterKeyHint='search'
							value={searchInput}
							onChange={onSearchInputChange}
							onKeyDown={onSearchInputKeydown}
						/>
						<div onClick={closeSearch} className='close_btn'>
							<Image
								src='/images/shared/close_black.png'
								width={20}
								height={20}
								alt='Close'
							/>
						</div>
					</div>

					<div className='tab_container'>
						<div className='tab_container_header'>
							<p className='tab_container_header_title'>
								{t('Search.hot_search')}
							</p>
						</div>
						<div className='tab_container_body'>
							<Swiper
								className='media_slider_container'
								slidesPerView={20}
							>
								{state.homeSearchTabList.hotTab.map((tabName, index) => {
									return (
										<SwiperSlide
											className='tab_container_body_tab'
											onClick={tabSearch(tabName)}
											key={`${tabName}-${index}`}
										>
											{tabName}
										</SwiperSlide>
									);
								})}
							</Swiper>
						</div>
					</div>

					<div className='tab_container'>
						<div className='tab_container_header'>
							<p className='tab_container_header_title'>
								{t('Search.search_history')}
							</p>
							<span
								className='tab_container_header_clear'
								onClick={clearHistory}
							>
								{t('Global.clean')}
							</span>
						</div>
						<div className='history_tab_wrapper'>
							<div className='tab_container_body'>
								<Swiper
									className='media_slider_container'
									slidesPerView={20}
								>
									{state.homeSearchTabList.historyTab.map((tabName, index) => {
										return (
											<SwiperSlide
												className='tab_container_body_tab'
												onClick={tabSearch(tabName)}
												key={`${tabName}-${index}`}
											>
												{tabName}
											</SwiperSlide>
										);
									})}
								</Swiper>
							</div>
						</div>
					</div>

					{!!searchInput &&
						Object.keys(categoryList).map((category, index) => {
							const bgColors = categoryColors[index % categoryColors.length] ||
								['#333333'];
							return (
								<AntTab
									key={category}
									label={categoryList[category].name}
									bgColors={bgColors}
									onClick={() => categorySearch(category)}
									className={category === searchCategory ? 'Mui-selected' : ''}
								/>
							);
						})}
				</div>
				<div className='search_result_wrapper'>
					<div
						className={localState.list.length
							? 'search_result_container with_content'
							: 'search_result_container'}
					>
						<Grid
							container
							direction='row'
							alignItems='center'
							spacing={isMobile ? 1 : 4}
						>
							{localState.list.map((data, index) => {
								return (
									<Grid item md={2} xs={4} key={index}>
										<CoverCubeItem data={data} total_view_show />
									</Grid>
								);
							})}
						</Grid>
						{localState.isEnd && localState.list.length === 0
							? (
								<div className='empty'>
									<Image
										className='empty_img'
										src='/images/imgPlaceholder/girl404.png'
										width={0}
										height={0}
										alt='404 girl
          '
									/>
									<p className='empty_text'>{t('Global.tip.nothing')}</p>
								</div>
							)
							: (
								''
							)}
					</div>
				</div>
			</div>
		</SearchResultElement>
	);
};

const SearchResultElement = styled.div.withConfig({
	shouldForwardProp: (prop) =>
		![
			'main_height',
			'bottom_nav_height',
			'isMobile',
			'searchbar_height',
		]
			.includes(prop),
})`
  ${(
	{
		main_height,
		bottom_nav_height,
		isMobile,
		searchbar_height,
	},
) => `
    .hide {
        display: none;
    }
    .search_bar {
      height: ${isMobile ? `${searchbar_height}px` : `${searchbar_height}px`};
        padding: ${isMobile ? '15px 30px' : '10px 11.927vw'};
        position: fixed;
        top: ${main_height}px;
        left: 0;
        background-color: #fff;
        width: 100%;
        z-index: 11;
    }
    .search_bar_content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .search_content_input {
        width: 100%;
        height: 35px;
        padding: 0 10px;
        background-color: #00000036;
        border-radius: 10px;
    }

    .search_result_wrapper {
        position: fixed;
        z-index: 11;
        top: calc(${main_height}px + ${
	isMobile ? `${searchbar_height}px` : `${searchbar_height}px`
});
        width: 100%;
        height: calc(100vh - ${
	main_height + (isMobile ? bottom_nav_height : 0) + searchbar_height
}px);
        background-color: rgba(0, 0, 0, 0.7);
        overflow-y: auto;
    }
    .search_result_container {
        display: flex;
        flex-wrap: wrap;
    }
    .search_result_container.with_content {
        padding: ${isMobile ? '0px 30px' : '15px 11.927vw'};
    }
    .search_result_container > div {
        background-color: #fff;
    }
    .close_btn {
      cursor: pointer;
    }

    .empty {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 11.927vw;
    }

    .tab_container {
      background-color: #fff;
      margin: ${isMobile ? '2px' : '10px'} 0;

      &_header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &_title {
          padding-left:5px;
          font-size: 18px;
          font-weight: 900;
          text-shadow: 0px 0px black;

          @media (max-width: 750px) {
            font-size: max(14px, 2.4vw);
            margin-top: 2px;
          }
        }

        &_clear {
          cursor: pointer;
          color: #fa719a;

          @media (max-width: 750px) {
            font-size: max(12px, 2.133vw);
          }
        }
      }

      &_body {
        margin-top: 10px;

        @media (max-width: 750px) {
          margin-top: 0px;
        }

        &_tab {
          font-size: max(12px, 0.833vw);
          margin-right: max(10px, 0.625vw) !important;
          min-width: fit-content;
          cursor: pointer;
          padding: 4px 12px;
          padding:auto
          height:25px;
          line-height:25px;
          text-decoration: none;
          color: gray;
          font-weight:600;
          background-color: ${colors.back_grey};
          border-radius:3px;
          
          @media (max-width: 750px) {
            padding: 4px 6px;
            margin: 3px 10px 10px 0;
            font-size: max(12px, 2.133vw);
          }
        }
      }
    }

    .history_tab_wrapper {
      min-height: 40px;
    }

    .search_result_container .MuiGrid-root {
      margin-left: 0px;
    }
    .search_result_container .MuiGrid-item {
      padding: 0px;
    }
  `}
`;

export default SearchResult;

const lang = Cookies.get('NEXT_LOCALE');

const AntTab = styled((props) => (
	<Tab
		disableRipple
		{...Object.fromEntries(
			Object.entries(props).filter(([key]) => key !== 'bgColors'),
		)}
	/>
))(
	({ theme, bgColors }) => {
		const { isMobile } = useMediaQuery();
		const backgroundColor = Array.isArray(bgColors) && bgColors.length === 2
			? `linear-gradient(135deg, ${bgColors[0]}, ${bgColors[1]})`
			: bgColors[0] || '#333333';

		return {
			textTransform: 'none',
			minWidth: isMobile ? '0 !important' : 0,
			padding: '0px !important',
			fontSize: lang == 'en'
				? 'max(10px,0.739vw) !important'
				: 'max(12px,0.83vw) !important',
			fontFamily: 'Microsoft YaHei !important',
			fontWeight: '700  !important',
			alignSelf: 'center !important',
			width: 'max(50px,4vw) !important',
			height: 'max(30px,1.6vw) !important',
			minHeight: '20px !important',
			borderRadius: '0.677vw !important',
			background: backgroundColor, // Use `background` for gradient support
			color: '#fff !important',
			transition: '0.3s !important',
			marginRight: isMobile ? '1.333vw !important' : '0.521vw !important',
			[theme.breakpoints?.down('sm')]: {
				width: 'auto',
				fontSize: '14px',
			},
			'&:hover': {
				color: colors.text_grey,
				opacity: 1,
			},
			'&.Mui-selected': {
				color: '#fff !important',
				// fontWeight: theme.typography?.fontWeightMedium,
			},
		};
	},
);
