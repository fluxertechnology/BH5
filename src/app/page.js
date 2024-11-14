'use client';

import { useTranslations } from 'next-intl';
import IndexSwiper from './../components/index/IndexSwiper';
import ComicSlider from './../components/index/ComicSlider';
import AnimeSlider from './../components/index/AnimeSlider';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <div>
      <h1>{t('title')}</h1> {/* Call the hook with the dictionary key */}
      <IndexSwiper />
      <div style={styles.indexMainCont}>
        <div>
          <h2>COMIC SECTION</h2>
          <ComicSlider />
          <div style={styles.popularMainCont}>
            <h1 style={styles.popularCont}>popular comic</h1>
            <h1 style={styles.rankCont}>ranking comic</h1>
          </div>
          <ComicSlider />
        </div>
        
        <div>
          <h2>ANIME SECTION</h2>
          <AnimeSlider />
          <h2>&nbsp;</h2>
          <AnimeSlider />
        </div>
      </div>
    </div>
  );
}

const styles = {
  indexMainCont: {
    width: '100%',
    padding: '0 10%',
    boxSizing: 'border-box'
  },
  popularMainCont: {
    display: 'flex',
  },
  popularCont: {
    width:'60%',
    backgroundColor: '#999',
    minHeight: '750px',
    margin: 0
  },
  rankCont: {
    display: 'flex',
    backgroundColor: '#eee',
    width:'40%',
    minHeight: '750px',
    margin: 0
  }
};