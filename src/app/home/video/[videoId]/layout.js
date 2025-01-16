import { requestUrlConstants, apiUrl } from "@/lib/constants";
import { getLocale, getTranslations } from "next-intl/server";

const { getItemDetail } = requestUrlConstants;

export async function generateMetadata({ params }) {
    const locale = await getLocale();
    const t = await getTranslations('Home');

    const { videoId } = await params;

    // Create query parameters for the GET request
    const queryParams = new URLSearchParams({
        type: 'video',
        id: videoId,
    });

    // Use GET method with query parameters in the URL
    const response = await fetch(`${apiUrl}/${getItemDetail}?${queryParams.toString()}`, {
        method: "GET", // Change to GET method
    });

    if (!response.ok) {
        // Log the error status and status text
        console.error('Failed to fetch comic anime data:', response.status, response.statusText);

        // Try to log the response body in case it contains error details
        const errorDetails = await response.text(); // Read the response body
        console.error('Error details:', errorDetails);

        return {
            title: 'Error fetching data',
            description: 'An error occurred while fetching the comic anime data.',
        };
    }

    const posts = await response.json();
    
    // Assuming comicEp is available or defined elsewhere in the code
    const title = `${posts.data.title} | ${t('name')}`; 
    const description = posts.data.description || ''; 

    return {
        title,
        description,
    };
}

export default function Page({ children }) { 
    return (<>{children}</>); 
}
