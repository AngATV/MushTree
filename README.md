MushTree – Landing d’affiliation casino
=======================================

Stack: Next.js (App Router) + Tailwind v4 + TypeScript.

Développement
-------------

```bash
npm run dev
```

Ajout de bannières
------------------

Modifiez `src/data/banners.ts` et ajoutez une entrée au tableau `banners`:

```ts
{
  id: "unique-id",
  title: "Nom Casino",
  href: "https://votre-lien-affiliation",
  image: { src: "/mon-fichier.png", alt: "Nom Casino", width: 200, height: 60 },
  badge: "Optionnel: bonus",
  bg: "from-emerald-500 to-teal-600" // Optionnel: dégradé
}
```

UTM automatiques
----------------

Les UTM par défaut sont définis dans `src/app/page.tsx` (`utm_source=mushtree`, `utm_medium=banner`, `utm_campaign=affiliation`).
Vous pouvez les ajuster côté page ou générer dynamiquement selon vos besoins.

Déploiement
-----------

- Configurez `NEXT_PUBLIC_SITE_URL` dans les variables d’environnement Vercel pour `robots.txt` / `sitemap`.
- Déployez via Vercel en connectant ce repo.
