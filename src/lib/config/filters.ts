// Configuration for filter categories and icons
export interface FilterCategory {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORY_CONFIG: Record<string, { icon: string; name: string }> = {
  lake: {
    icon: '🏞️',
    name: 'Lake'
  },
  river: {
    icon: '🌊', 
    name: 'River'
  },
  parking: {
    icon: '🚗',
    name: 'Parking'
  }
};

// Categories to exclude from filters
export const EXCLUDED_CATEGORIES = ['parking'];

// Auto-generate category options from marker data
export function generateCategoryOptions(markers: any[] = []): FilterCategory[] {
  // Extract unique categories from markers
  const uniqueCategories = [...new Set(markers.map(m => m.category).filter(Boolean))];
  
  // Generate options, excluding specified categories
  return uniqueCategories
    .filter(category => !EXCLUDED_CATEGORIES.includes(category))
    .map(category => {
      const config = CATEGORY_CONFIG[category];
      return {
        id: category,
        name: `${config?.icon || '📍'} ${config?.name || category.charAt(0).toUpperCase() + category.slice(1)}s`,
        icon: config?.icon || '📍'
      };
    });
}
