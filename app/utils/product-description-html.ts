/**
 * Zwraca `null`, gdy HTML z edytora nie zawiera realnej treści (pusty dokument / same tagi).
 */
export function normalizeStoredProductDescription(html: string): string | null {
    const trimmed = html.trim();

    if (!trimmed) {
        return null;
    }

    const plain = trimmed
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!plain) {
        return null;
    }

    return trimmed;
}
