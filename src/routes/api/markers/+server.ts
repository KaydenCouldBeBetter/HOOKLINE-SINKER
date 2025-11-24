import { json } from '@sveltejs/kit';
import { getMarkers } from '$lib/server/db';

export async function GET() {
    try {
        const markers = getMarkers();
        return json(markers);
    } catch (error) {
        console.error('Error fetching markers:', error);
        return json(
            { error: 'Failed to fetch markers' },
            { status: 500 }
        );
    }
}
