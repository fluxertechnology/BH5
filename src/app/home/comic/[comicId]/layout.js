import { requestUrlConstants, apiUrl } from "@/lib/constants";
import { getLocale, getTranslations } from "next-intl/server";

const { getItemDetail } = requestUrlConstants;

export async function generateMetadata({ params }) {

    const t = await getTranslations('Home');

    const { comicId } = await params;

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
            title: `${t('name')}`,
            description: '',
        };
    }

    const posts = await response.json();
    
    const title = posts.data?.title? `${posts.data.title} | ${t('name')}` : `${t('name')}`; 
    const description = posts.data?.description || ''; 


    return {
        title,
        description,
    };
}

export default function Page({ children }) { 
    return (<>{children}</>); 
}
