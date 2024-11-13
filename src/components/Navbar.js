"use client";

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = ({ locale }) => {
    const t = useTranslations('Navbar');
    const router = useRouter();
    const pathname = usePathname(); // Get the current pathname

    const changeLanguage = (newLocale) => {
        // Split the pathname into parts
        const pathParts = pathname.split("/").slice(2); // Remove the first two segments (locale and empty string)
        const newPath = `/${newLocale}/${pathParts.join("/")}`; // Construct the new path
        router.push(newPath); // Navigate to the new path
    };

    return (
        <nav style={styles.navbar}>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link href={`/${locale}/`}>{t('home')}</Link>
                </li>
                <li style={styles.navItem}>
                    <Link href={`/${locale}/about`}>{t('about')}</Link>
                </li>
                <li style={styles.navItem}>
                    <Link href={`/${locale}/contact`}>{t('contact')}</Link>
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