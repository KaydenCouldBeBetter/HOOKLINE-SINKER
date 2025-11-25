export type LocationDetails = {
	name: string;
	subtitle?: string;
	address?: string;
	species?: string[];
	details?: Array<{ label: string; value: string }>;
	conditions?: Array<{ label: string; value: string }>;
	galleryImage?: string;
	galleryLabel?: string;
	depth?: string;
	catches?: number;
	forecast?: string;
};
