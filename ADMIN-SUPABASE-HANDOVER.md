# Admin Panel + Supabase - kontekst i plan dalszych prac

## Cel

Zbudowac panel administratora sklepu w Nuxt 3, ktory pozwala:
- dodawac i edytowac produkty,
- zarzadzac wariantami (rozmiar/kolor),
- zarzadzac stanami magazynowymi,
- docelowo zarzadzac zdjeciami wariantow,
- dzialac przez Nuxt Server Routes (`server/api/*`) jako warstwa BFF do Supabase.

---

## Co zostalo zrobione do tej pory

### 1) Fundament backendowy (Nuxt Server Routes + repozytoria)

Dodane endpointy admina:
- `server/api/admin/me.get.ts`
- `server/api/admin/products/index.get.ts`
- `server/api/admin/products/index.post.ts`
- `server/api/admin/products/[id].get.ts`
- `server/api/admin/products/[id].patch.ts`
- `server/api/admin/products/[id]/inventory.patch.ts`
- `server/api/admin/inventory/index.get.ts`

Dodane repozytoria:
- `server/repositories/admin-products.repository.ts`
- `server/repositories/admin-inventory.repository.ts`

Dodane helpery:
- `server/utils/admin-auth.ts` (guard admina)
- `server/utils/validation.ts` (walidacja requestow)

Dodane walidacje:
- `server/validation/admin-products.ts` (Zod)

### 2) Fundament frontendowy

Dodane typy domenowe:
- `app/types/admin-product.ts`

Dodane composables:
- `app/composables/useAdminProducts.ts`
- `app/composables/useAdminInventory.ts`
- `app/composables/useAdminSession.ts`

Dodany middleware:
- `app/middleware/admin.ts`

### 3) UI panelu admina (pierwsza wersja)

Dodane widoki:
- `app/pages/admin/index.vue` (dashboard)
- `app/pages/admin/products/index.vue` (lista produktow)
- `app/pages/admin/products/new.vue` (tworzenie produktu + generowanie wariantow)
- `app/pages/admin/products/[id].vue` (edycja produktu + podglad wariantow)
- `app/pages/admin/inventory.vue` (niskie stany + szybka edycja ilosci)

Dodany shell:
- `app/components/app/AdminPanelShell.vue`

Dodatkowo:
- link do panelu admin z `app/pages/protected.vue`.

### 4) Mock admin account (dev)

Dodany tryb mock:
- `app/composables/useAuthSession.ts` (mock sesji admina)
- `server/utils/admin-auth.ts` (przepuszczenie mock cookie)
- `app/pages/login.vue` (przycisk i dane konta demo)
- `nuxt.config.ts` + `.env.example` (`enableAdminMock`)

Cel: szybki podglad UI panelu bez pelnej konfiguracji Supabase Auth.

---

## Aktualna architektura (docelowa)

`UI -> /api/admin/* (Nuxt server routes) -> Supabase (DB + Storage + ewentualnie RPC)`

Zalozenia:
- brak bezposrednich wywolan Supabase z komponentow admin UI,
- autoryzacja i walidacja po stronie serwera Nuxt,
- RLS po stronie Supabase jako dodatkowa warstwa bezpieczenstwa.

---

## Jakie tabele i pola zaklada obecny kod

Kod repozytoriow juz oczekuje tabel:
- `products`
- `product_variants`
- `inventory_items`
- `variant_images`
- `profiles`
- (opcjonalnie pod audit) `inventory_adjustments`

Kluczowe kolumny (zgodnie z obecnymi zapytaniami):
- `products`: `id`, `name`, `slug`, `sku`, `description`, `price`, `category`, `subcategory`, `material`, `status`, `updated_at`
- `product_variants`: `id`, `product_id`, `size`, `color`, `sku`, `price_override`, `is_active`, `created_at`
- `inventory_items`: `variant_id`, `quantity`, `low_stock_threshold`, `updated_at`
- `variant_images`: `id`, `variant_id`, `path`, `alt`, `is_primary`, `order_index`, `created_at`
- `profiles`: `id` (powiazane z `auth.users.id`), `role`

---

## Co trzeba zrobic po stronie Supabase (blokery produkcyjne)

1. Utworzyc schema tabel + indeksy/constraints.
2. Wlaczyc RLS i polityki (admin-only dla panelu).
3. Skonfigurowac bucket `product-images`.
4. Ustawic realne konto admin (rola w `profiles`).
5. Spiac login z realnym Supabase Auth (zamiast mock flow).
6. Wylaczyc mock admina na srodowiskach poza dev.

---

## Plan dalszych prac (roadmap)

### Etap A - Supabase Production Ready
- [ ] Dodac migracje SQL dla tabel i constraintow.
- [ ] Dodac polityki RLS dla DB i Storage.
- [ ] Dodac seedy testowe (1 admin + przykladowe produkty/varianty).
- [ ] Potwierdzic, ze wszystkie endpointy `server/api/admin/*` dzialaja na realnych danych.

### Etap B - Auth hardening
- [ ] Przejsc z mock/custom flow na Supabase Auth session.
- [ ] Ujednolicic `useAuthSession` pod Supabase.
- [ ] Wylaczyc `enableAdminMock` dla staging/prod.
- [ ] Dodac czytelny fallback 401/403 w UI admina.

### Etap C - Warianty i media (brakujaca czesc)
- [ ] Dodac endpointy i logike dla:
  - [ ] tworzenia/edycji wariantow,
  - [ ] uploadu wielu zdjec do wariantu,
  - [ ] usuwania zdjec wariantu,
  - [ ] ustawiania zdjecia glownego.
- [ ] Dodac UI sekcji "Media" w `app/pages/admin/products/[id].vue`.
- [ ] Dodac walidacje plikow (typ, rozmiar, limity).

### Etap D - Magazyn i audit
- [ ] Dodac endpoint "korekta magazynu" z powodem zmiany.
- [ ] Zapisywac korekty do `inventory_adjustments`.
- [ ] Dodac prosty widok historii korekt.

### Etap E - Jakosc i stabilnosc
- [ ] Dodac testy endpointow `server/api/admin/*`.
- [ ] Dodac testy krytycznych flow UI admina.
- [ ] Dodac pelne i18n klucze admin (`pl` i `en`).
- [ ] Dodac monitoring/logowanie bledow po stronie server routes.

---

## Definition of Done (MVP+)

- [ ] Admin loguje sie przez Supabase Auth i ma role `admin`.
- [ ] Admin tworzy produkt + warianty + zapisuje stany.
- [ ] Admin dodaje wiele zdjec do wariantu i ustawia glowne.
- [ ] Dashboard i listy dzialaja na realnym Supabase.
- [ ] Uzytkownik bez roli admin dostaje 403 i nie ma dostepu.
- [ ] Mock mode wylaczony poza lokalnym dev.

---

## Konfiguracja srodowisk

Wymagane env:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `NUXT_PUBLIC_ENABLE_ADMIN_MOCK` (`true` tylko lokalnie)

Rekomendacja:
- local: mock do szybkiego UI (`true`),
- staging/prod: zawsze `false`.

---

## Notatka dla kolejnych sesji AI

Przy kolejnej pracy z AI zacznij od:
1. przeczytania plikow w `server/api/admin/*`,
2. sprawdzenia `server/repositories/*`,
3. sprawdzenia `app/pages/admin/*`,
4. potwierdzenia stanu migracji SQL i RLS po stronie Supabase.

Najpierw dokonczyc warstwe danych + auth produkcyjny, potem rozbudowe UI.

