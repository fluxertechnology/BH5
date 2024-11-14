"use client";

// import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie'; // Make sure to import Cookies

const AnimeSilder = ({ locale }) => {
    // const t = useTranslations('Home');
    // const router = useRouter();
    // const changeLanguage = (newLocale) => {
    //     Cookies.set('NEXT_LOCALE', newLocale, { path: '/' }); // Set the new locale
    //     console.log(newLocale, 'Locale changed'); // Log the new locale
    //     router.push(`/${newLocale}`); // Navigate to the new locale route
    // };

    return (
        <div style={styles.aSliderCont}>
          <h1>Directional Anime Slider</h1>
        </div>
    );
};

const styles = {
    aSliderCont: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#555',
        color: '#fff',
        minHeight: '350px',
    }
};

export default AnimeSilder;