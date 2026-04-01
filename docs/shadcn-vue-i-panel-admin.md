# shadcn-vue, MCP i tabela produktów w panelu admina

Ten dokument opisuje integrację [shadcn-vue](https://shadcn-vue.com/) z projektem Nuxt, konfigurację MCP w Cursorze oraz implementację tabeli listy produktów w `/admin/products`.

## Co zostało dodane

| Obszar | Opis |
|--------|------|
| **Moduł Nuxt** | `shadcn-nuxt` — rejestruje komponenty z katalogu shadcn z prefiksem `Ui` (np. `UiButton`). |
| **Komponenty UI** | Katalog [`app/components/shadcn/`](../app/components/shadcn/) — wygenerowane przez CLI m.in.: `table`, `checkbox`, `badge`, `button`, `dropdown-menu`, `select`. |
| **Utils** | [`app/lib/utils.ts`](../app/lib/utils.ts) — `cn()`, `valueUpdater()` (dla TanStack Table). |
| **Style** | Rozszerzenie [`app/assets/css/tailwind.css`](../app/assets/css/tailwind.css) o zmienne motywu shadcn (`:root`, `.dark`, `@theme inline`) oraz `@plugin 'tailwindcss-animate'` i import `tw-animate-css`. |
| **Plugin** | [`app/plugins/ssr-width.ts`](../app/plugins/ssr-width.ts) — `provideSSRWidth` z VueUse, zmniejsza ryzyko błędów hydratacji dla komponentów zależnych od szerokości viewport. |
| **Zależności** | m.in. `reka-ui`, `lucide-vue-next`, `class-variance-authority`, `tailwind-merge`, `tailwindcss-animate`, `tw-animate-css`, `@tanstack/vue-table`, `@vueuse/core`. |
| **MCP** | [`.cursor/mcp.json`](../.cursor/mcp.json) — serwer MCP `shadcn-vue` dla Cursora. |
| **Panel admin** | [`app/components/app/AdminProductsDataTable.vue`](../app/components/app/AdminProductsDataTable.vue) oraz pomocnicze komponenty wiersza; strona [`app/pages/admin/products/index.vue`](../app/pages/admin/products/index.vue). |

## Dlaczego osobny katalog `shadcn` i prefiks `Ui`

W projekcie już istnieją komponenty w [`app/components/ui/`](../app/components/ui/) (np. `Badge.vue`, `Card.vue`). Domyślna instalacja shadcn kierowałaby nowe pliki do `components/ui` i powodowałaby **kolizję nazw** przy auto-importcie Nuxt.

Konfiguracja w [`nuxt.config.ts`](../nuxt.config.ts):

- `shadcn.componentDir: '@/components/shadcn'` — źródłowe pliki shadcn trafiają do `app/components/shadcn/`.
- `shadcn.prefix: 'Ui'` — w szablonach można używać globalego auto-importu postaci `UiButton`, `UiTable`, **bez** nadpisywania istniejącego `Badge` ze starego UI.

Szablony, które nadal mają używać „starego” designu sklepu, importują lub auto-importują komponenty z `~/components/ui` jak dotychczas.

Alias w [`components.json`](../components.json) pole `aliases.ui` wskazuje na `@/components/shadcn`, żeby polecenie `shadcn-vue add …` dodawało pliki we właściwe miejsce.

## Konfiguracja CLI (`components.json`)

Plik w katalogu głównym projektu definiuje m.in.:

- styl (`new-york`), bazę kolorów, użycie zmiennych CSS,
- ścieżkę do arkusza Tailwinda,
- aliasy `@/components`, `@/lib/utils`, **`@/components/shadcn`** dla komponentów rejestru.

Po zmianie aliasów warto ponownie uruchomić `npx nuxt prepare`.

## Dodawanie kolejnych komponentów shadcn

```bash
npx shadcn-vue@latest add nazwa-komponentu -y
```

Lista: [dokumentacja komponentów shadcn-vue](https://shadcn-vue.com/docs/components).

Nowe pliki pojawią się w `app/components/shadcn/<nazwa>/` i będą dostępne jako `Ui<NazwaExportu>` (zgodnie z eksportami w `index.ts` każdego podfolderu).

## MCP shadcn-vue w Cursorze

W repozytorium jest [`.cursor/mcp.json`](../.cursor/mcp.json) z serwerem:

- polecenie: `npx`
- argumenty: `shadcn-vue@latest`, `mcp`

**W Cursorze:** włącz ten serwer MCP w ustawieniach (powinien pojawić się jako „shadcn” z narzędziami do przeglądania rejestru i instalacji komponentów). Szczegóły: [MCP Server – shadcn/vue](https://shadcn-vue.com/docs/mcp).

## Tabela produktów (`/admin/products`)

### Przepływ danych

1. Strona [`index.vue`](../app/pages/admin/products/index.vue) woła `useAdminProducts().listProducts()` z parametrami: `page`, `pageSize`, `search`, `status`.
2. Wynik (`items`, `total`) jest przekazywany do `AdminProductsDataTable`.
3. **Paginacja i rozmiar strony** są serwerowe — zmiana strony lub „wierszy na stronę” emituje zdarzenia `@update:page` / `@update:page-size` i ponownie ładuje listę z API.

### TanStack Table

[`AdminProductsDataTable.vue`](../app/components/app/AdminProductsDataTable.vue) używa `@tanstack/vue-table` do:

- definicji kolumn i renderowania komórek (`FlexRender`, funkcje `h()` tam, gdzie treść jest złożona),
- **zaznaczania wierszy** na bieżącej stronie (`rowSelection`; przy zmianie strony zaznaczenie jest czyszczone).

Paginacja **nie** jest obsługiwana przez wbudowany model stronicowania TanStacka — tabela jest w trybie `manualPagination` z `pageCount` zsynchronizowanym z API.

### Powiązane komponenty aplikacji

| Plik | Rola |
|------|------|
| `AdminProductsDataTable.vue` | Tabela, stopka z podsumowaniem zaznaczenia, selektor rozmiaru strony, nawigacja stron. |
| `AdminProductsTableRowActions.vue` | Menu akcji wiersza (m.in. link „Edytuj”). |
| `AdminProductsTableReviewerMenu.vue` | Placeholder menu „Przypisz” — pod przyszłe powiązanie z backendem. |

### Dostępność

Przyciski paginacji i kontrolki mają etykiety `aria-label`; zaznaczanie wierszy używa `ariaLabel` na komponentach Checkbox z shadcn.

## Oficjalne materiały

- [Instalacja Nuxt – shadcn-vue](https://shadcn-vue.com/docs/installation/nuxt)
- [Data Table – shadcn-vue](https://shadcn-vue.com/docs/components/data-table) (wzorzec TanStack Table)
- [Theming / dark mode](https://shadcn-vue.com/docs/theming)

## Typowe problemy

| Problem | Sugestia |
|---------|----------|
| Konflikt nazwy komponentu z `~/components/ui` | Zachować `prefix: 'Ui'` i `componentDir` na `shadcn`; nie mieszać starych i nowych komponentów o tej samej nazwie bez prefiksu. |
| Błędy hydratacji przy `Select` / overlay | Sprawdzić, czy działa plugin `ssr-width.ts`; w razie potrzeby zaktualizować `reka-ui` / shadcn-vue. |
| MCP nie odpowiada | Restart Cursora, włączenie serwera w ustawieniach; [troubleshooting](https://shadcn-vue.com/docs/mcp#troubleshooting). |
