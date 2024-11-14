"use client";

// import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie'; // Make sure to import Cookies

const IndexSwiper = ({ locale }) => {
    // const t = useTranslations('Home');
    // const router = useRouter();
    // const changeLanguage = (newLocale) => {
    //     Cookies.set('NEXT_LOCALE', newLocale, { path: '/' }); // Set the new locale
    //     console.log(newLocale, 'Locale changed'); // Log the new locale
    //     router.push(`/${newLocale}`); // Navigate to the new locale route
    // };

    return (
        <div style={styles.swiperCont}>
          <h1>Swiper</h1>
        </div>
    );
};

const styles = {
    swiperCont: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
        backgroundColor: '#666',
        color: '#fff',
        minHeight: '300px',
        width: '100%'
    }
};

export default IndexSwiper;