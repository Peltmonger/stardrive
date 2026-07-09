---
publishDate: 2026-06-04
draft: false
featured: false
title: 'Conecta fuentes de datos externas a tu sitio Astro'
excerpt: 'Si quieres que tu contenido se edite fuera del código, puedes configurar Astro para que obtenga los datos de esas fuentes externas. Aprende cómo hacerlo.'
image:
  file: '@images/content/articles/connecting.jpg'
  alt: 'Astronautas conectando dos cables de datos en el espacio'
tags: ['astro', 'directus', 'supabase', 'strapi', 'contentful', 'github']
categories: ['web-development', 'infrastructure']
---

¿Quieres editar tu contenido en otro sitio que no sea el código? Totalmente justo. 🤩

A lo mejor tienes un equipo de marketing que no quiere tocar Markdown. A lo mejor estás migrando desde otro CMS. O a lo mejor simplemente te gusta la comodidad de un editor visual.

Buenas noticias: Astro se lleva bien con fuentes de datos externas. Veamos cómo conectar una - usando [Directus](https://directus.io) como ejemplo, porque es gratuito, open source y API-first.

> Ten en cuenta que Astro genera sitios estáticos.
> Cuando el contenido cambia, hay que reconstruir todo el sitio.
> Esto puede ser un poco más dinámico con SSR (renderizado en el servidor), pero introduce desafíos relacionados con la caché.

## 💔 El problema con "simplemente usa un CMS"

La mayoría de las integraciones de CMS son o demasiado rígidas o demasiado mágicas. O te encierran en una solución hosted que es dueña de tus datos, o te dan un montón de SDKs que pelean con tu build.

Lo que de verdad quieres es simple: traer contenido desde una API en tiempo de build, renderizarlo con tus componentes existentes y reconstruir cuando algo cambia. Sin lock-in. Sin magia.

## 🩹 El enfoque

Astro trata los datos externos como cualquier otra fuente de datos asíncrona. Los traes, los tipas, los renderizas. Eso es todo.

Y no tienes que inventar el patrón desde cero - Stardrive ya trae un ejemplo funcional. El sistema de eventos puede traer datos en vivo desde la API de Add to Calendar PRO en vez de leer archivos Markdown locales. Mira `src/utils/event-bridge.ts`: expone la misma interfaz `getEvents` / `getEventEntry` tanto si los eventos vienen de la colección de contenido como de la API, así que cada punto de uso (listas, páginas de detalle, RSS) sigue funcionando sin cambios. Ese es exactamente el esquema que copiarías para un blog respaldado por Directus.

## 🛠️ Paso a paso con Directus

### 1. Configurar Directus

Levanta un proyecto de Directus (self-hosted o cloud). Crea una colección - digamos, `articles` - con campos que reflejen lo que necesitas: `title`, `slug`, `excerpt`, `content`, `publish_date`, `image`, y demás.

Asegúrate de que la colección tiene permisos de lectura adecuados para el rol público (o un token de API dedicado).

### 2. Crear algunos artículos

Añade unas cuantas entradas de prueba. Te lo agradecerás luego cuando estés depurando el bucle de render. 😅

### 3. Conectarlo en Astro

Crea un pequeño loader que traiga desde la API REST (o GraphQL) de Directus. Algo así:

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

Luego úsalo en tu página o en un content loader. Mapea los campos de Directus a la misma forma que tus componentes ya esperan - así no tienes que reescribir tu lista de blog, el post individual o el feed RSS.

> Consejo: mantén tus variables de entorno en `.env` y nunca las commitees. Astro es un framework frontend - no metas secretos en código del lado del cliente.

> Consejo de seguridad: trata el contenido externo de un CMS como no confiable. Sanitiza cualquier HTML que no venga de commits confiables del repositorio antes de renderizarlo con `set:html` o con un renderizador Markdown. Stardrive expone `sanitizeTrustedHtmlFragment` desde `src/utils/security.ts` para fragmentos HTML enriquecidos y usa el mismo patrón para las descripciones dinámicas de eventos de Add to Calendar PRO.

### 4. Reconstruir ante cambios

Esta es la parte que la gente olvida. Como Astro es estático por defecto, un cambio de contenido en Directus no aparece en tu sitio hasta que reconstruyes.

Dos opciones:

- **Webhook + rebuild.** Configura Directus para que llame al webhook de despliegue de tu hosting cada vez que cambie un registro. Cloudflare Pages, Netlify y Vercel lo soportan todos.
- **SSR + purga de caché.** Si ejecutas Astro en modo SSR (usamos Cloudflare Workers), puedes traer bajo demanda y purgar la caché cuando cambie el contenido. Más dinámico, pero cambias simplicidad por complejidad de caché.

Elige la que mejor encaje con tu tráfico y tus necesidades de frescura.

### 5. No te olvides del sitemap (trampa del SSR)

Aquí hay una trampa en la que la gente cae: si vas por la ruta SSR y traes los artículos bajo demanda, tu sitemap estático no sabrá de ellos. Se genera en tiempo de build, pero tus artículos viven en Directus y cambian de forma independiente. Así que los artículos nuevos no aparecen en el sitemap hasta el siguiente build completo - lo cual kinda derrota el sentido del SSR.

La solución es un endpoint de sitemap dinámico separado - una ruta SSR que consulta Directus en tiempo de petición y devuelve XML fresco. Stardrive ya hace exactamente esto para eventos: mira `src/pages/dynamic-events-sitemap.xml.ts`. Llama a la API de Add to Calendar PRO, construye la lista de URLs y sirve el sitemap al vuelo. Copia ese patrón para tus artículos de Directus y quedas cubierto.

## 🎯 La conclusión

Conectar un CMS externo a Stardrive no es un hack - es un camino soportado y directo. Traer en build, renderizar con tus componentes existentes, reconstruir ante cambios.

Y como el boilerplate ya trae blog, RSS, sitemaps y datos estructurados conectados, te llevas todo eso gratis. Solo cambias la fuente de datos. 🚀
