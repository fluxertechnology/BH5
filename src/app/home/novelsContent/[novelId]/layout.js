import { requestUrlConstants, apiUrl } from "@/lib/constants";
import { getLocale, getTranslations } from "next-intl/server";

const { getItemDetail } = requestUrlConstants;

export async function generateMetadata({ params }) {
    const locale = await getLocale();
    const t = await getTranslations();

    const { novelId } = await params;

    const queryParams = new URLSearchParams({
        type: 'novel',
        id: novelId,
    });

    const response = await fetch(`${apiUrl}/${getItemDetail}?${queryParams.toString()}`, {
        method: "GET",
    });

    if (!response.ok) {
        console.error('Failed to fetch novel data:', response.status, response.statusText);

        const errorDetails = await response.text();
        console.error('Error details:', errorDetails);

        return {
            title: `${t('Home.name')}`,
            description: '',
        };
    }

    const posts = await response.json();

    const title = posts.data?.title
        ? `${posts.data.title} | ${t('Home.name')}`
        : `${t('Home.name')}`;

    return {
        title,
    };
}

export default function Page({ children }) {
    return (<>{children}</>);
}
