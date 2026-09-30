# TMB 2027 plan: distribution pack (draft, 2026-09-30)

Goal: get at least 150 visitors to the plan page before 20 Oct. That is the minimum sample for the willingness-to-pay
experiment in `ops.log`. Bookings open 15 Oct 2026, so posts written after about 14 Oct are too late to matter.

The owner posts and sends everything below from their own accounts. Claude does not post.

## 0. Before posting (owner)

- [ ] The checklist page (`checklist.html`) is live on treksup.com, and the CTA link points to the real plan page.
- [ ] You have read each community's own rules just before posting. They could not be checked from the cloud,
      because reddit.com and facebook.com are blocked. Most allow helpful answers and forbid ads. Always disclose.
- [ ] You answer an existing question where you can, rather than starting a promo thread.
- [ ] Only use the UTM link that belongs to the channel (table in section 4), so the results can be measured.

## 1. English: answer to "how do refuge bookings work / when should I book" (Reddit, Facebook groups, forums)

> Bookings for the 2027 season open on 15 October on the Mon Tour du Mont-Blanc platform. What I'd do:
> 1. Make your account on the platform now, not on the morning itself.
> 2. Decide direction and start date, then book the nights with the fewest beds first (the Les Chapieux and Trient
>    area are the usual bottlenecks) and fit the rest around them.
> 3. A few refuges aren't on the platform and book by email or their own form, each with its own opening date.
>    List them now.
> 4. Know the refund rule: more than 30 days before your stay you get 80% of the deposit back, after that nothing.
> 5. From 2027, walking the French section without a reservation is set to end, so keep a fallback per night.
>
> I put this on one free page with the sources: {CHECKLIST_URL}
> Disclosure: I build Treksup, which also sells a paid TMB booking plan.

## 2. Dutch (Belgian/Dutch hiking communities; check whether the group allows links)

> Voor de TMB 2027 openen de refuges hun boekingen op 15 oktober, via het platform van Mon Tour du Mont-Blanc.
> Wat ik zou doen:
> 1. Maak nu al je account op dat platform, niet op de ochtend zelf.
> 2. Kies je richting en startdatum. Boek eerst de nachten met de minste bedden (rond Les Chapieux en Trient) en
>    bouw de rest daaromheen.
> 3. Enkele refuges zitten niet op het platform en boek je per mail of via een eigen formulier, elk met een eigen
>    openingsdatum. Zet ze nu al op een lijstje.
> 4. Annuleer je meer dan 30 dagen vooraf, dan krijg je 80% van je voorschot terug. Daarna niets.
> 5. Vanaf 2027 is doorlopend wandelen op het Franse deel zonder reservatie waarschijnlijk niet meer toegestaan.
>    Hou per nacht een alternatief achter de hand.
>
> Ik zette dit gratis op één pagina, met de bronnen erbij: {CHECKLIST_URL}
> Eerlijkheidshalve: ik maak Treksup, dat ook een betaald TMB-boekingsplan verkoopt.

## 3. French (French-language groups and forums)

> Pour le TMB 2027, les refuges ouvrent les réservations le 15 octobre sur la plateforme Mon Tour du Mont-Blanc.
> Ce que je ferais :
> 1. Créer son compte sur la plateforme dès maintenant, pas le matin même.
> 2. Choisir son sens et sa date de départ, puis réserver d'abord les nuits avec le moins de lits (secteurs des
>    Chapieux et de Trient) et construire le reste autour.
> 3. Quelques refuges ne sont pas sur la plateforme et se réservent par e-mail ou via leur propre formulaire, chacun
>    avec sa propre date d'ouverture. Les lister dès maintenant.
> 4. Une annulation à plus de 30 jours rembourse 80 % de l'acompte. Après, rien.
> 5. À partir de 2027, marcher en continu sur la partie française sans réservation devrait prendre fin. Prévoir une
>    solution de repli pour chaque nuit.
>
> J'ai mis tout ça gratuitement sur une page, avec les sources : {CHECKLIST_URL}
> Transparence : je développe Treksup, qui vend aussi un plan de réservation TMB payant.

Note: the checklist page itself is in English only. If the Dutch or French posts are used, either accept that or add
translated copies of the page first.

## 4. Tracked links

Replace `{CHECKLIST_URL}` with the row that matches the channel. Each tag shows up in `public.events`
(`utm_source` and `utm_campaign`).

| Channel | Link |
|---|---|
| Reddit | `https://treksup.com/tmb-2027/checklist?utm_source=reddit&utm_campaign=tmb2027` |
| Facebook group | `https://treksup.com/tmb-2027/checklist?utm_source=facebook&utm_campaign=tmb2027` |
| Dutch forum/group | `https://treksup.com/tmb-2027/checklist?utm_source=community-nl&utm_campaign=tmb2027` |
| French forum/group | `https://treksup.com/tmb-2027/checklist?utm_source=community-fr&utm_campaign=tmb2027` |
| Operator mail | `https://treksup.com/tmb-2027?utm_source=partner&utm_campaign=<org-slug>` |

Caveat: tracking only works if the page on treksup.com sends the same `events` rows as the prototype
(`lib/track.ts`). Until that is ported, only Stripe sales and GA/Netlify analytics (if any) are measurable.

## 5. Operator outreach: paid ask (decision needed first)

The paid ask in `sales-kit.md` section 4 (a discount code for an operator's independent walkers) is a price promise to
partners. That needs the owner's yes first. It also overlaps with the operator follow-up drafts already in Gmail,
which carry no price.

## 6. What this pack does not do

- No posting and no sending. That is owner-only.
- No fake reviews, buyer counts or "as seen in" lines.
- It does not replace checking the refuge sources on the live pages before publishing (sales-kit section 5).
