/**
 * Globalny wybór tła obszaru zdjęcia produktu (białe vs ciemne) w katalogu i na karcie produktu.
 */
export function useProductGalleryBackground() {
    const isDarkGallery = useState<boolean>(
        'shop-product-gallery-dark-bg',
        () => false,
    );

    function setIsDarkGallery(value: boolean): void {
        isDarkGallery.value = value;
    }

    function galleryImageContainerClasses(options?: {
        withGroupHover?: boolean;
    }): string {
        const withGroupHover = options?.withGroupHover !== false;

        if (isDarkGallery.value) {
            if (!withGroupHover) {
                return 'bg-secondary-900 dark:bg-secondary-900';
            }

            return 'bg-secondary-900 group-hover:bg-secondary-800 dark:bg-secondary-900 dark:group-hover:bg-secondary-800';
        }

        if (!withGroupHover) {
            return 'bg-white dark:bg-white';
        }

        return 'bg-white group-hover:bg-secondary-50 dark:bg-white dark:group-hover:bg-secondary-50';
    }

    return {
        isDarkGallery,
        setIsDarkGallery,
        galleryImageContainerClasses,
    };
}
