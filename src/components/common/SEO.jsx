import React, { useEffect } from 'react';

export const SEO = ({
  title,
  description,
  image,
  canonicalUrl = "https://hypril.com/",
  noIndex = false,
  jsonLd = null
}) => {
  const defaultTitle = "Hypril: Premium Men's Sexual Wellness, Enlargement Oil & Delay Gel in India";
  const defaultDesc = "Shop doctor-formulated Hypril Enlargement Oil & Extended Delay Gel online in India. 100% discreet shipping, cash on delivery & clinical grade formula.";

  useEffect(() => {
    // 1. Page Title
    document.title = title ? `${title} | Hypril Wellness` : defaultTitle;

    // 2. Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || defaultDesc);

    // 3. Robots Meta (index/noindex)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // 4. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 5. OpenGraph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title || defaultTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description || defaultDesc);

    // 6. JSON-LD Dynamic Injection
    let scriptJsonLd = document.getElementById('dynamic-jsonld');
    if (jsonLd) {
      if (!scriptJsonLd) {
        scriptJsonLd = document.createElement('script');
        scriptJsonLd.setAttribute('id', 'dynamic-jsonld');
        scriptJsonLd.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptJsonLd);
      }
      scriptJsonLd.textContent = JSON.stringify(jsonLd);
    } else if (scriptJsonLd) {
      scriptJsonLd.remove();
    }
  }, [title, description, canonicalUrl, noIndex, jsonLd]);

  return null;
};
