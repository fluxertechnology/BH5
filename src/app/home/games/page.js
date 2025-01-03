'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import AccordionCard from '@/components/games/AccordionCard';
import TopBarContainer, {
	main_height,
} from '@/components/layout/Header/TopBarContainer';
import TopTitleBar from '@/components/common/TopTitleBar';
import scrollBottomCallEvent from '@/lib/services/scrollEvent';
import { colors, pageUrlConstants } from '@/lib/constants';
import FeaturedCard from '@/components/games/FeaturedCard';
import LinkComponent from '@/components/common/LinkComponent';
import background from '@public/images/game/bg.png';
import dropdownIcon from '@public/images/icons/dropdown.svg';

import useMediaQuery from '@/hooks/useMediaQuery';
import { moneyAndGold } from '@/components/vendor/VendorItemCard';
import ImageComponent from '@/components/common/ImageComponent';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGlobalContext, useGlobalDispatch } from '@/store';
import { getGameListAction } from '@/store/actions/pages/gameActions';

const { vendor } = pageUrlConstants;
const Game = () => {
	const { state } = useGlobalContext();
	const t = useTranslations();
	const gameListRef = useRef(null);
	const { isMobile } = useMediaQuery();
	const [gameList, setGameList] = useState([]);
	const [shopList, setShopList] = useState(isMobile ? [[], []] : [[]]);
	const [rankList, setRankList] = useState([]);
	const [typeSelect, setTypeSelect] = useState(0);

	useEffect(() => {
    const list = state.gameListData.list;
		if (list.length) {
			let newData = list.filter((data) => data.type === 'supplier');
			setGameList(newData);
			newData = list.filter((data) => data.type === 'shop_list');
			if (isMobile) {
				let mobileShopList = [[], []];
				newData = newData[0]?.shop_list.map((data, index) => {
					return mobileShopList[index % 2].push(data);
				});
				setShopList(mobileShopList);
			} else {
				setShopList([newData[0]?.shop_list || []]);
			}

			newData = list.filter((data) => data.type === 'rank_list');
			setRankList(newData[0]?.rank_list);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.gameListData.list.length]);

	useEffect(() => {
		window.addEventListener('scroll', scrollEvent);
		return () => {
			window.removeEventListener('scroll', scrollEvent);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [typeSelect]);

	useEffect(() => {
		resetGameListData();
		updateGameListData(typeSelect);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [typeSelect, isMobile]);

	function scrollEvent() {
		scrollBottomCallEvent((scrollColdEnd) => {
			// if (!gameListData.isDone && list.length > 0)
			//   updateGameListData(typeSelect, scrollColdEnd);
		});
	}

	function gameWheelEvent(e) {
		// e.preventDefault();
		// e.stopPropagation();
		gameListRef.current.scrollLeft += e.deltaY;
	}
	function onChangeType(e) {
		if (Number(e.target.value) !== typeSelect) {
			setTypeSelect(Number(e.target.value));
		}
	}

	const updateGameListData = (type, scrollColdEnd = () => {}) => {
		useGlobalDispatch(getGameListAction(type, scrollColdEnd));
	};
	const resetGameListData = () => {
		useGlobalDispatch({ type: 'RESET_GAMELIST' });
	};

	useEffect(() => {
		useGlobalDispatch({
			type: 'INIT_NAVBAR',
			data: {
				show: false,
				isShowFooter: false,
			},
		});
	}, []);

	return (
		<GameElement>
			<TopBarContainer show_shadow={false}>
				<TopTitleBar
					title={t('Game.label.game')}
					showBack={true}
					show_back_color='#ffffff'
				/>
			</TopBarContainer>
			<div className='game_container'>
				<div className='container_accordion'>
					{gameList.map((data, index) => {
						if (data.supplier && index < 3) {
							let { name, img, description, game, url } = data.supplier;
							return (
								<AccordionCard
									key={`${name}-${index}`}
									img={img}
									title={name}
									description={description}
									datas={game}
									url={url}
								/>
							);
						}
					})}
				</div>
				<div className='container_featured mx-2 mt-3'>
					<div className='container_featured_title mx-2 fw-l both_clear'>
						<article className='container_featured_title_left'>
							{gameList.length ? t('Game.label.featured_game') : ''}
						</article>
						<LinkComponent
							routes={{
								name: vendor.pages.vendorCategory.name + '游戏',
								path: vendor.pages.vendorCategory.path + '?title=游戏',
								dynamic: {
									category: 1,
								},
							}}
						>
							<div className='container_featured_title_right cursor mr-2'>
								{gameList.length ? t('Game.label.view_all') : ''}
							</div>
						</LinkComponent>
					</div>
					{gameList.length
						? (
							<div className='container_featured_filter'>
								<select onChange={onChangeType}>
									<option value={0}>{t('Game.label.all_game')}</option>
									<option value={1}>{t('Game.label.pc_game')}</option>
									<option value={2}>{t('Game.label.android_game')}</option>
								</select>
							</div>
						)
						: (
							''
						)}

					{isMobile
						? (
							shopList?.map((item, index) => (
								<div
                  key={index}
									ref={gameListRef}
									className='g-flex py-2 container_featured '
									onWheel={gameWheelEvent}
								>
									<div className='container_featured_game pb-1'>
										{item.map((data, index) => (
											<FeaturedCard
												data={data}
												key={`${data.title}-${index}`}
												type='game'
												style={{
													width: isMobile && window.innerWidth / 4,
												}}
											/>
										))}
									</div>
								</div>
							))
						)
						: (
							<div
								ref={gameListRef}
								className='g-flex py-2 container_featured '
								onWheel={gameWheelEvent}
							>
								<Grid container direction='row' alignItems='start' spacing={2}>
									{shopList?.map((item, index) =>
										item.map((data) => (
											<Grid item md={3} key={`${data.title}-${index}`}>
												<FeaturedCard data={data} />
											</Grid>
										))
									)}
								</Grid>
							</div>
						)}
				</div>

				<div className='container_featured mx-2 mt-3'>
					<div className='container_featured_title mx-2 mb-2 fw-l both_clear'>
						<article className='container_featured_title_left'>
							{gameList.length ? t('Game.label.ranks') : ''}
						</article>
					</div>
					{/* 前三名 */}
					<div className='container_featured_rankings'>
						{rankList?.map((data, index) => {
							if (index <= 2) {
								let newIndex = isMobile
									? index
									: index === 0
									? 1
									: index === 1
									? 0
									: 2;
								return (
									<div
                    key={index}
										className={`container_featured_rankings_item_${newIndex}`}
									>
										<FeaturedCard
											data={rankList[newIndex]}
											goldFrame
											style={{
												width: isMobile && window.innerWidth / 3.5,
											}}
										/>
										<Image
											className='container_featured_rankings_item_badge'
											src={`/images/game/rank${newIndex + 1}.svg`}
											width={0}
											height={0}
											alt={`badge${newIndex}`}
										/>
									</div>
								);
							}
						})}
					</div>
					{/* 四到十名 */}
					{state.gameListData.list.map((list) => {
						if (list?.rank_list) {
							return list.rank_list.map((data, index) => {
								if (index > 2) {
									return (
										<LinkComponent
											className='container_featured_rankings bottom_border'
											key={data.title}
											routes={{
												name: vendor.pages.vendorGoods.name + data.title,
												path: vendor.pages.vendorGoods.path,
												dynamic: {
													goodsId: data.id,
												},
											}}
										>
											<Image
												className='container_featured_rankings_item_badge  other'
												src={`/images/game/rank${index + 1}.svg`}
												width={0}
												height={0}
												alt={`badge${index}`}
											/>
											<div className='container_featured_rankings_pic'>
												<ImageComponent
													src={data.picurl}
													alt={data.title}
													title={data.title}
													border_radius={'10px'}
													background_color='#fff'
													height={100}
													is_cover={true}
												/>
											</div>
											<section
												className='g-flex column gap-2'
												style={{ width: '70%' }}
											>
												<div className='container_featured_rankings_title'>
													{data.title}
												</div>
												<div className='container_featured_rankings_price'>
													{moneyAndGold(data.mone, data.yue, t)}
												</div>
											</section>
										</LinkComponent>
									);
								}
							});
						}
					})}
				</div>

				<div className='container_accordion'>
					{state.gameListData.list.map((data, index) => {
						if (data.supplier && index >= 3) {
							let { name, img, description, game, url } = data.supplier;
							return (
								<div key={`${name}-${index}`}>
									<AccordionCard
										img={img}
										title={name}
										description={description}
										datas={game}
										url={url}
									/>
								</div>
							);
						}
					})}
				</div>
			</div>
		</GameElement>
	);
};

export default Game;

export const GameElement = styled.div`
  /*  */
  background-image: url(${background});
  background-size: contain;
  background-repeat: no-repeat;

  .link_container {
    flex-shrink: 0;
    text-decoration: none;
    color: #000;
  }
  .game_container {
    padding-top: ${main_height}px;
    position: relative;
    @media (min-width: 768px) {
      padding: 0 25%;
    }
  }
  .container {
    &_featured {
      &_title {
        font-size: 20px;
        a {
          text-decoration: none;
        }
        &_left {
          float: left;
        }

        &_right {
          text-align: end;
          color: gray;
        }
      }
      &_filter {
        display: flex;
        justify-content: center;
        padding: 10px;
        select {
          appearance: none;
          background: url(${dropdownIcon}) no-repeat;
          background-size: 20px 20px;
          background-position: right center;
          border-radius: 24px;
          border: solid 1px ${colors.text_light_grey};
          color: ${colors.text_light_grey};
          background-color: #fff;
          font-size: 14px;
          padding: 8px 30px;
          background-position-x: 98%;
          width: 90%;
          text-align: center;
        }
      }

      &_game {
        display: inline-flex;
        overflow: auto;
        gap: 10px;
      }

      &_rankings {
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: 20px;
        padding: 20px;
        @media (max-width: 899px) {
          padding: 0;
          gap: 10px;
        }
        &_item {
          &_badge {
            position: absolute;
            top: 0;
            right: 0;
            left: -10px;
            bottom: 0;
            pointer-events: none;
            @media (max-width: 899px) {
              width: 5.5vh;
            }

            &.other {
              position: relative;
              left: 0px;
              @media (max-width: 899px) {
                min-width: 4.5vh;
              }
            }
          }

          &_0,
          &_1,
          &_2 {
            position: relative;
            align-self: end;
            justify-content: center;
            margin: 0 20px;
            @media (max-width: 899px) {
              margin: 0;
              width: auto !important;
            }
          }

          &_0 {
            width: 35%;
          }
          &_1 {
            width: 30%;
          }
          &_2 {
            width: 30%;
          }
        }

        &_pic {
          width: 80px;
          @media (max-width: 899px) {
            width: 70px;
          }
        }

        &.bottom_border {
          gap: 20px;
          padding: 20px 0px;
          border-bottom: 1px solid;
          justify-content: flex-start;
          text-decoration: none;
          color: black;
          @media (max-width: 899px) {
            gap: 10px;
            padding: 15px 0px;
          }
          &:last-child {
            border-bottom: none;
          }
        }
        &_title {
          font-weight: 800;
        }
        &_price {
          color: #fa719a;
          white-space: nowrap;
          font-size: 14px;
        }
        &_title {
          overflow: hidden;
          max-height: ${2.5 * 18}px;
          font-size: 16px;
          font-weight: 900;
          word-break: break-all;
          @media (max-width: 899px) {
            font-size: 14px;
            height: ${2.5 * 16}px;
          }
        }
      }
    }
  }
`;
