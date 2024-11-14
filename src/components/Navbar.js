"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Make sure to import Cookies

const Navbar = ({ locale }) => {
    const t = useTranslations('Navbar');
    const router = useRouter();

    const changeLanguage = (newLocale) => {
        Cookies.set('NEXT_LOCALE', newLocale, { path: '/' }); // Set the new locale
        console.log(newLocale, 'Locale changed'); // Log the new locale
        router.push(`/${newLocale}`); // Navigate to the new locale route
    };

    return (
        <nav style={styles.navbar}>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link href={`/`}>{t('home')}</Link>
                </li>
                <li style={styles.navItem}>
                    <Link href={`/about`}>{t('about')}</Link>
                </li>
                <li style={styles.navItem}>
                    <Link href={`/contact`}>{t('contact')}</Link>
                </li>
            </ul>
            <div style={styles.languageSwitcher}>
                <button onClick={() => changeLanguage("en")} style={styles.languageButton}>
                    {t("english")}
                </button>
                <button onClick={() => changeLanguage("tc")} style={styles.languageButton}>
                    {t("chinese_hant")}
                </button>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#333',
        color: '#fff',
    },
    navList: {
        listStyleType: 'none',
        display: 'flex',
        gap: '1rem',
    },
    navItem: {
        color: '#fff',
        textDecoration: 'none',
    },
    languageSwitcher: {
        display: 'flex',
        gap: '0.5rem',
    },
    languageButton: {
        backgroundColor: 'transparent',
        border: '1px solid #fff',
        color: '#fff',
        padding: '0.5rem',
        cursor: 'pointer',
    },
};

export default Navbar;