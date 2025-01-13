import { requestUrlConstants, apiUrl } from "@/lib/constants";
import { getLocale, getTranslations } from "next-intl/server";

const { postGetComicAnimeData } = requestUrlConstants;

export async function generateMetadata({ params }) {
    const locale = await getLocale();
    const t = await getTranslations('Common');

    const { comicEp, comicId } = await params;

    let formData = new FormData();
    formData.append("aid", comicId);
    formData.append("recommend", 1);
    formData.append("episode", 1);

    const response = await fetch(`${apiUrl}/${postGetComicAnimeData}`, {  
        method: "POST",
        body: formData, 
    });

    if (!response.ok) {
        console.error('Failed to fetch comic anime data:', response.statusText);
        return {
            title: 'Error fetching data',
        };
    }

    const posts = await response.json();

    const title = `${posts.data.title}` || 'Default Title'; 
    const description = `${posts.data.description}` || ''; 

    return {
        title,
        description,
    };
}

export default function Page({ children }) { 
    return (<>{children}</>); 
}