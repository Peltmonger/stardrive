---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Connectez des sources de données externes à votre site Astro'
excerpt: "Si vous souhaitez modifier vos contenus en dehors du code, vous pouvez configurer Astro pour qu'il récupère les données depuis ces sources externes. Voici comment."
image:
  file: '@images/content/articles/connecting.jpg'
  alt: "Des astronautes connectant deux câbles de données dans l'espace"
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

Tu veux éditer ton contenu ailleurs que dans le code ? Tout à fait légitime. 🤩

Tu as peut-être une équipe marketing qui ne veut pas toucher au Markdown. Tu migres peut-être depuis un autre CMS. Ou tu aimes simplement le confort d'un éditeur visuel.

Bonne nouvelle : Astro s'entend bien avec les sources de données externes. Voyons comment en connecter une - en prenant [Directus](https://directus.io) comme exemple, parce qu'il est gratuit, open source et API-first.

> Gardez à l''esprit qu''Astro génère des sites statiques !
> Lorsque le contenu change, le site entier doit être reconstruit.
> Cela peut être un peu plus dynamique avec le SSR (rendu côté serveur), mais cela introduit alors des défis liés au cache.

## 💔 Le problème avec "prends juste un CMS"

La plupart des intégrations CMS sont soit trop rigides, soit trop magiques. Soit tu te retrouves enfermé dans une solution hosted qui possède tes données, soit avec un tas de SDKs qui se battent avec ton build.

Ce que tu veux vraiment est simple : récupérer le contenu depuis une API au build, le rendre avec tes composants existants et reconstruire quand quelque chose change. Pas de lock-in. Pas de magie.

## 🩹 L'approche

Astro traite les données externes comme n'importe quelle autre source de données asynchrone. Tu les récupères, tu les types, tu les rends. C'est tout.

Et tu n'as pas à inventer le pattern de zéro - Stardrive embarque déjà un exemple fonctionnel. Le système d'événements peut récupérer des données en direct depuis l'API Add to Calendar PRO au lieu de lire des fichiers Markdown locaux. Regarde `src/utils/event-bridge.ts` : il expose la même interface `getEvents` / `getEventEntry` que les événements viennent de la collection de contenu ou de l'API, donc chaque point d'appel (listes, pages de détail, RSS) continue de fonctionner sans changement. C'est exactement le schéma que tu copierais pour un blog reposant sur Directus.

## 🛠️ Étape par étape avec Directus

### 1. Configurer Directus

Lance un projet Directus (self-hosted ou cloud). Crée une collection - disons, `articles` - avec des champs qui reflètent ce dont tu as besoin : `title`, `slug`, `excerpt`, `content`, `publish_date`, `image`, etc.

Assure-toi que la collection a des permissions de lecture correctes pour le rôle public (ou un token d'API dédié).

### 2. Créer quelques articles

Ajoute quelques entrées de test. Tu te remercieras plus tard en debuggant la boucle de rendu. 😅

### 3. Connecter dans Astro

Crée un petit loader qui récupère depuis l'API REST (ou GraphQL) de Directus. Quelque chose comme :

```ts
const DIRECTUS_URL = import.meta.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = import.meta.env.DIRECTUS_TOKEN;

export async function fetchArticles() {
  const res = await fetch(`${DIRECTUS_URL}/items/articles?fields=*`, {
    headers: { Authorization: `Bearer ${DIRECTUS_TOKEN}` },
  });
  const { data } = await res.json();
  return data;
}
```

Utilise-le ensuite dans ta page ou dans un content loader. Mappe les champs Directus sur la même forme que tes composants attendent déjà - ainsi tu n'as pas à réécrire ta liste de blog, ton post unique ou ton flux RSS.

> Astuce : garde tes variables d'environnement dans `.env` et ne les commit jamais. Astro est un framework frontend - ne mets pas de secrets dans le code côté client.

> Astuce sécurité : traite le contenu CMS externe comme non fiable. Sanitize tout HTML qui ne vient pas de commits de dépôt fiables avant de le rendre avec `set:html` ou un renderer Markdown. Stardrive expose `sanitizeTrustedHtmlFragment` depuis `src/utils/security.ts` pour les fragments HTML riches et utilise le même pattern pour les descriptions dynamiques d'événements Add to Calendar PRO.

### 4. Reconstruire au changement

C'est la partie qu'on oublie. Comme Astro est statique par défaut, un changement de contenu dans Directus n'apparaîtra pas sur ton site avant un rebuild.

Deux options :

- **Webhook + rebuild.** Configure Directus pour appeler le webhook de déploiement de ton hébergeur à chaque modification d'enregistrement. Cloudflare Pages, Netlify et Vercel le supportent tous.
- **SSR + purge de cache.** Si tu fais tourner Astro en mode SSR (on utilise Cloudflare Workers), tu peux récupérer à la demande et purger le cache quand le contenu change. Plus dynamique, mais tu échanges de la simplicité contre de la complexité de cache.

Choisis celle qui correspond à ton trafic et à tes besoins de fraîcheur.

### 5. N'oublie pas le sitemap (piège du SSR)

Voici un piège dans lequel on tombe : si tu prends la voie SSR et récupères les articles à la demande, ton sitemap statique ne les connaîtra pas. Il est généré au build, mais tes articles vivent dans Directus et changent indépendamment. Du coup, les nouveaux articles n'apparaîtront dans le sitemap qu'au prochain build complet - ce qui vide un peu le SSR de son sens.

La solution, c'est un endpoint de sitemap dynamique séparé - une route SSR qui interroge Directus au moment de la requête et renvoie du XML frais. Stardrive fait exactement ça pour les événements : voir `src/pages/dynamic-events-sitemap.xml.ts`. Il appelle l'API Add to Calendar PRO, construit la liste d'URLs et sert le sitemap à la volée. Copie ce pattern pour tes articles Directus et tu es couvert.

## 🎯 La conclusion

Connecter un CMS externe à Stardrive n'est pas un hack - c'est un chemin supporté et direct. Récupérer au build, rendre avec tes composants existants, reconstruire au changement.

Et comme le boilerplate a déjà blog, RSS, sitemaps et données structurées câblés, tu as tout ça gratuitement. Tu changes juste la source de données. 🚀
