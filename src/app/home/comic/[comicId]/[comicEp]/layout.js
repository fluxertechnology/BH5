import { requestUrlConstants, apiUrl } from "@/lib/constants";
import { getLocale, getTranslations } from "next-intl/server";

const { getItemDetail } = requestUrlConstants;

export async function generateMetadata({ params }) {
    const locale = await getLocale();
    const t = await getTranslations();

    const { comicId,comicEp } = await params;

    const queryParams = new URLSearchParams({
        type: 'anime',
        id: comicId,
    });

    const response = await fetch(`${apiUrl}/${getItemDetail}?${queryParams.toString()}`, {
        method: "GET", 
    });

    if (!response.ok) {
        console.error('Failed to fetch comic anime data:', response.status, response.statusText);

        const errorDetails = await response.text(); 
        console.error('Error details:', errorDetails);

        return {
            title: `${t('Home.name')}`,
            description: '',
        };
    }

    const posts = await response.json();
    
    const title = posts.data?.title ? `${t('Common.episode',{number:comicEp})} - ${posts.data.title} | ${t('Home.name')}` : `${t('Home.name')}`; 
    const description = posts.data?.description || ''; 

    return {
        title,
        description,
    };
}

export default function Page({ children }) { 
    return (<>{children}</>); 
}
