// Meteen laten weten dat JavaScript werkt, nog voor de pagina getekend wordt. style.css klapt
// dan de lange teksten al in en toont de knoppen, zodat er bij het laden niets verspringt.
document.documentElement.classList.add("js");

// Licht of donker thema, meteen toegepast zodra dit script in de head geladen wordt,
// zodat de pagina nooit eerst in het verkeerde thema verschijnt.
// Een eerder gekozen thema wint, anders start de site altijd in het donkere thema.
const themaKleur = document.querySelector('meta[name="theme-color"]');

// De kleur van de browserbalk komt uit style.css, zodat de kleuren maar op één plek staan.
// Het script staat na de stylesheet in de head, dus die is op dit moment al geladen.
function pasThemaToe(thema) {
    document.documentElement.dataset.theme = thema;
    themaKleur.setAttribute("content",
        getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim());
}

let opgeslagenThema = null;

try {
    opgeslagenThema = localStorage.getItem("thema");
} catch (fout) {
    // Opslag geblokkeerd (bv. privévenster): dan gewoon het donkere thema
}

pasThemaToe(opgeslagenThema === "light" ? "light" : "dark");

// Taal: Engels of Nederlands, los van het thema. De Engelse tekst staat gewoon in index.html;
// lang/nl.js bevat per sleutel (data-i18n in de HTML) de Nederlandse versie. Teksten die
// JavaScript zelf maakt, staan in lang/en.js en lang/nl.js.
// Een taal in de link (?lang=nl of ?lang=en) wint, dan een eerder gekozen taal, anders altijd
// Engels (de taal van de browser telt niet mee).
const vertalingen = { en: TAAL_EN, nl: TAAL_NL };
const SITE_ADRES = "https://wesley-dev-tech.github.io/";
const taalInLink = new URLSearchParams(window.location.search).get("lang");
let huidigeTaal = "en";

try {
    if (taalInLink === "nl" || taalInLink === "en") {
        huidigeTaal = taalInLink;
        localStorage.setItem("taal", huidigeTaal);
    } else if (localStorage.getItem("taal") === "nl") {
        huidigeTaal = "nl";
    }
} catch (fout) {
    // Opslag geblokkeerd: dan geldt alleen de taal in de link
    if (taalInLink === "nl") {
        huidigeTaal = "nl";
    }
}

// Elke taal heeft een eigen adres: Engels op SITE_ADRES, Nederlands op SITE_ADRES?lang=nl.
// Zo kun je een link in de juiste taal delen, en indexeert Google beide versies
// (de hreflang-links in index.html verwijzen naar die twee adressen).
// De canonical-link volgt de taal; hij staat bewust niet in index.html, anders zou
// Google de Nederlandse versie als kopie van de Engelse zien.
function werkTaalAdresBij() {
    const parameters = new URLSearchParams(window.location.search);

    if (huidigeTaal === "nl") {
        parameters.set("lang", "nl");
    } else {
        parameters.delete("lang");
    }

    const zoek = parameters.toString();
    const adres = window.location.pathname + (zoek ? "?" + zoek : "") + window.location.hash;

    if (adres !== window.location.pathname + window.location.search + window.location.hash) {
        history.replaceState(history.state, "", adres);
    }

    let canonical = document.querySelector('link[rel="canonical"]');

    if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
    }

    canonical.href = SITE_ADRES + (huidigeTaal === "nl" ? "?lang=nl" : "");
}

document.documentElement.lang = huidigeTaal;
werkTaalAdresBij();

// Nederlands gekozen: style.css verbergt de pagina tot ze vertaald is, zodat je nooit eerst Engels ziet
if (huidigeTaal === "nl") {
    document.documentElement.classList.add("taal-laden");
}

// Tekst die JavaScript zelf maakt, in de actieve taal; ontbreekt ze, dan de Engelse
function t(sleutel) {
    const tekst = vertalingen[huidigeTaal][sleutel];
    return tekst !== undefined ? tekst : vertalingen.en[sleutel];
}

// Projecten bewaren hun teksten als { en: "...", nl: "..." }; gewone tekst blijft gewoon tekst
function inTaal(waarde) {
    if (typeof waarde === "object" && waarde !== null) {
        return waarde[huidigeTaal] || waarde.en;
    }

    return waarde;
}

// Attributen die een eigen vertaling kunnen hebben, bv. data-i18n-alt="hero.avatarAlt"
// Bij "src" hoort ook "srcset", anders kiest de browser toch de afbeelding uit srcset
const vertaalbareAttributen = ["alt", "aria-label", "title", "placeholder", "content", "src", "srcset"];

// De Engelse tekst uit index.html per element, de eerste keer bewaard zodat je ook terug kan naar Engels
const engelseTeksten = new Map();

function vertaalPagina() {
    function vertaling(sleutel, engels) {
        const nederlands = TAAL_NL[sleutel];
        return huidigeTaal === "nl" && nederlands !== undefined ? nederlands : engels;
    }

    function origineelVan(element) {
        if (!engelseTeksten.has(element)) {
            engelseTeksten.set(element, {});
        }

        return engelseTeksten.get(element);
    }

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const origineel = origineelVan(element);

        if (origineel.tekst === undefined) {
            origineel.tekst = element.innerHTML;
        }

        element.innerHTML = vertaling(element.dataset.i18n, origineel.tekst);
    });

    vertaalbareAttributen.forEach(function (attribuut) {
        document.querySelectorAll("[data-i18n-" + attribuut + "]").forEach(function (element) {
            const origineel = origineelVan(element);

            if (origineel[attribuut] === undefined) {
                origineel[attribuut] = element.getAttribute(attribuut);
            }

            const nieuw = vertaling(element.getAttribute("data-i18n-" + attribuut), origineel[attribuut]);

            // Alleen aanpassen als het echt verandert, anders laadt bv. de kaart opnieuw
            if (element.getAttribute(attribuut) === nieuw) {
                return;
            }

            // Een iframe (de kaart) krijgt een nieuw element met het nieuwe adres. Het adres van een
            // bestaand iframe veranderen, voegt een stap toe aan de geschiedenis van de browser;
            // Safari opende daardoor bij "terug" (bv. bij het sluiten van een projectvenster)
            // de kaart als volledige pagina.
            if (element.tagName === "IFRAME" && attribuut === "src") {
                const kopie = element.cloneNode(false);

                kopie.setAttribute("src", nieuw);
                engelseTeksten.set(kopie, origineel);
                element.replaceWith(kopie);
                return;
            }

            element.setAttribute(attribuut, nieuw);
        });
    });
}

// Wat er naast de vaste teksten nog mee moet bij een taalwissel (projecten, knoppen, datum...).
// De onderdelen in DOMContentLoaded zetten hun eigen functie in deze lijst.
const bijTaalwissel = [];

function wisselTaal(taal) {
    huidigeTaal = taal === "nl" ? "nl" : "en";
    document.documentElement.lang = huidigeTaal;
    werkTaalAdresBij();

    // De keuze onthouden voor een volgend bezoek; lukt dat niet, dan geldt ze alleen nu
    try {
        localStorage.setItem("taal", huidigeTaal);
    } catch (fout) {
        // Opslag geblokkeerd, bv. in een privévenster
    }

    vertaalPagina();
    bijTaalwissel.forEach(function (werkBij) {
        werkBij();
    });
}

// De Google Maps-kaart in de footer staat op loading="lazy", zodat ze het openen van de site niet
// afremt. Zodra de rest van de pagina geladen is, mag ze toch al laden: dan staat ze klaar als je
// onderaan komt, in plaats van pas dan te beginnen. (Het iframe opvragen op dat moment, want
// vertaalPagina kan het door een nieuw element vervangen hebben.)
window.addEventListener("load", function () {
    const kaart = document.querySelector(".footer-map iframe");

    if (kaart) {
        kaart.loading = "eager";
    }
});

// De rest werkt met de elementen op de pagina en wacht dus tot de HTML geladen is
document.addEventListener("DOMContentLoaded", function () {
    // Bezoekers die minder beweging willen: geen scroll-animaties en direct springen
    const voorkeurMinderBeweging = window.matchMedia("(prefers-reduced-motion: reduce)");

    function scrollGedrag() {
        return voorkeurMinderBeweging.matches ? "auto" : "smooth";
    }

    // Hamburgermenu
    const menuKnop = document.querySelector(".menu-button");
    const menuIcoon = menuKnop.querySelector("i");
    const navigatie = document.querySelector(".site-nav");
    const menuLinks = document.querySelectorAll(".nav-links a");

    // Menu openen of sluiten en de knop mee laten veranderen
    function zetMenu(open) {
        navigatie.classList.toggle("menu-is-open", open);
        menuKnop.setAttribute("aria-expanded", open);
        menuKnop.setAttribute("aria-label", open ? t("menu.sluit") : t("menu.open"));
        menuIcoon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }

    menuKnop.addEventListener("click", function () {
        const open = !navigatie.classList.contains("menu-is-open");

        zetMenu(open);

        // De links staan in de HTML vóór de knop; zo kan je met Tab meteen verder in het menu
        if (open) {
            menuLinks[0].focus();
        }
    });

    // Menu sluiten na het kiezen van een link
    menuLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            zetMenu(false);
        });
    });

    // Menu sluiten bij een klik naast het menupaneel
    document.addEventListener("click", function (event) {
        if (navigatie.classList.contains("menu-is-open")
            && !event.target.closest(".nav-links, .menu-button")) {
            zetMenu(false);
        }
    });

    bijTaalwissel.push(function () {
        zetMenu(navigatie.classList.contains("menu-is-open"));
    });

    // Menu sluiten met de Escape-toets
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && navigatie.classList.contains("menu-is-open")) {
            zetMenu(false);
            menuKnop.focus();
        }
    });

    // Themaschakelaar. Het thema zelf staat al (zie bovenaan); hier komt alleen de knop bij om te wisselen.
    // style.css schuift het bolletje mee; hier alleen de stand voor schermlezers en de tooltip.
    const themaKnop = document.querySelector(".theme-toggle");

    function zetThema(thema) {
        const licht = thema === "light";

        pasThemaToe(thema);
        themaKnop.setAttribute("aria-checked", licht);
        themaKnop.title = (licht ? t("thema.naarDonker") : t("thema.naarLicht")) + t("thema.sneltoets");
    }

    themaKnop.addEventListener("click", function () {
        const nieuwThema = document.documentElement.dataset.theme === "light" ? "dark" : "light";

        zetThema(nieuwThema);

        // De keuze onthouden voor een volgend bezoek; lukt dat niet, dan geldt ze alleen nu
        try {
            localStorage.setItem("thema", nieuwThema);
        } catch (fout) {
            // Opslag geblokkeerd, bv. in een privévenster
        }
    });

    zetThema(document.documentElement.dataset.theme);

    // Een taalwissel verandert alleen de tooltip, nooit het thema zelf
    bijTaalwissel.push(function () {
        zetThema(document.documentElement.dataset.theme);
    });

    // Taalkeuze in de header. aria-pressed toont de actieve taal ook aan schermlezers;
    // style.css maakt die vet en onderstreept, dus niet alleen met kleur.
    const taalKnoppen = document.querySelectorAll(".lang-option");

    function zetTaalknoppen() {
        taalKnoppen.forEach(function (knop) {
            knop.setAttribute("aria-pressed", knop.dataset.lang === huidigeTaal);
        });
    }

    taalKnoppen.forEach(function (knop) {
        knop.addEventListener("click", function () {
            if (knop.dataset.lang !== huidigeTaal) {
                wisselTaal(knop.dataset.lang);
            }
        });
    });

    zetTaalknoppen();
    bijTaalwissel.push(zetTaalknoppen);

    // Sneltoets T wisselt het thema, behalve tijdens het typen in een veld
    // of samen met Ctrl, Alt of Cmd (zodat bv. Ctrl+T gewoon een nieuw tabblad opent)
    document.addEventListener("keydown", function (event) {
        const typtInVeld = event.target.closest("input, textarea, select, [contenteditable]");
        const metToets = event.ctrlKey || event.altKey || event.metaKey;

        if (event.key.toLowerCase() === "t" && !typtInVeld && !metToets && !event.repeat) {
            themaKnop.click();
        }
    });

    // Begroeting in de intro volgens het uur van de bezoeker; zonder JavaScript blijft "Hi, I'm"
    const begroeting = document.querySelector(".hero-greeting");

    function zetBegroeting() {
        const uur = new Date().getHours();

        if (uur >= 5 && uur < 12) {
            begroeting.textContent = t("groet.ochtend");
        } else if (uur >= 12 && uur < 18) {
            begroeting.textContent = t("groet.middag");
        } else if (uur >= 18 && uur < 23) {
            begroeting.textContent = t("groet.avond");
        } else {
            begroeting.textContent = t("groet.nacht");
        }
    }

    zetBegroeting();
    bijTaalwissel.push(zetBegroeting);

    // Actieve link in de navigatie
    const secties = document.querySelectorAll("main section[id], footer[id]");

    // Actief is de laatste sectie die al tot het bovenste derde van het scherm gescrold is
    function werkActieveLinkBij() {
        let actieveSectie = secties[0];

        secties.forEach(function (sectie) {
            if (sectie.getBoundingClientRect().top <= window.innerHeight / 3) {
                actieveSectie = sectie;
            }
        });

        // Helemaal onderaan geraakt de contactsectie dat punt soms niet,
        // dus dan is die sowieso actief.
        const onderaanPagina = window.innerHeight + window.scrollY
            >= document.documentElement.scrollHeight - 2;

        if (onderaanPagina) {
            actieveSectie = secties[secties.length - 1];
        }

        menuLinks.forEach(function (link) {
            if (link.getAttribute("href") === "#" + actieveSectie.id) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    // Lees meer: style.css toont de tekst al ingeklapt zolang de klasse is-open ontbreekt.
    // Zonder JavaScript blijft alle tekst gewoon zichtbaar.
    document.querySelectorAll(".read-more-toggle").forEach(function (knop) {
        const tekst = document.getElementById(knop.getAttribute("aria-controls"));
        const label = knop.querySelector("span");

        // Alleen na een klik op "Lees minder" de knop terug in beeld brengen
        let ingeklaptDoorBezoeker = false;

        // Na het inklappen staat de knop soms onder de header of erboven; dan terug in beeld brengen
        function brengKnopInBeeld() {
            ingeklaptDoorBezoeker = false;
            if (knop.getBoundingClientRect().top < navigatie.offsetHeight) {
                knop.scrollIntoView({ block: "center" });
            }
        }

        // Het label volgt de stand van de tekst, in de actieve taal
        function zetLabel() {
            label.textContent = tekst.classList.contains("is-open") ? t("leesMinder") : t("leesMeer");
        }

        knop.addEventListener("click", function () {
            const open = tekst.classList.toggle("is-open");

            ingeklaptDoorBezoeker = !open;
            knop.setAttribute("aria-expanded", open);
            zetLabel();

            // De opleiding op desktop klapt zonder overgang in (style.css); dan meteen controleren
            if (ingeklaptDoorBezoeker && tekst.getAnimations().length === 0) {
                brengKnopInBeeld();
            }
        });

        zetLabel();
        bijTaalwissel.push(zetLabel);

        tekst.addEventListener("transitionend", function (event) {
            if (event.propertyName === "grid-template-rows" && ingeklaptDoorBezoeker) {
                brengKnopInBeeld();
            }
        });
    });

    // Paginering van de projecten per vier kaarten.
    // Onder deze breedte wordt de lijst een veegbare carrousel zonder paginering.
    const mobieleWeergave = window.matchMedia("(max-width: 991.98px)");
    const kaartenPerPagina = 4;

    function toonPagina(lijst, kaarten, pagina, vorigeKnop, volgendeKnop) {
        const aantalPaginas = Math.ceil(kaarten.length / kaartenPerPagina);
        const eersteKaart = (pagina - 1) * kaartenPerPagina;

        // Op mobiel staan alle kaarten naast elkaar in de carrousel
        lijst.classList.toggle("is-swipeable", mobieleWeergave.matches);
        kaarten.forEach(function (kaart, index) {
            kaart.hidden = !mobieleWeergave.matches
                && (index < eersteKaart || index >= eersteKaart + kaartenPerPagina);
        });

        vorigeKnop.disabled = pagina <= 1;
        volgendeKnop.disabled = pagina >= aantalPaginas;

        return aantalPaginas;
    }

    // Projecten, van oud naar nieuw. Een nieuw project zet je gewoon onderaan de lijst,
    // met een korte teaser voor de kaart en een screenshot in images/ voor het detailvenster.
    // Heeft een project ook een lichte versie, zet die dan in afbeeldingLicht (en demoLicht).
    // slug: vaste korte naam voor de eigen link van het project (#project-slug), in beide talen gelijk.
    // Teksten in twee talen schrijf je als { en: "...", nl: "..." }, ook een screenshot per taal
    // (afbeelding en afbeeldingLicht); een naam die in beide
    // talen gelijk is (zoals "Polestar 6"), mag gewoon tekst blijven.
    const projecten = [
        {
            titel: "Polestar 6",
            slug: "polestar-6",
            teaser: {
                en: "A fictional pre-order for a roadster convertible with a drone. You can't buy it, but you can dream.",
                nl: "Een fictieve preorder voor een roadster cabrio met drone. Kopen kan niet, dromen wel."
            },
            icoon: "fa-car-side",
            beschrijving: {
                en: "A fictional pre-order page for the Polestar 6, and my very first course project. "
                    + "This is where Flexbox and I got to know each other. A mobile version? "
                    + "That's still in the backlog.",
                nl: "Een fictieve preorderpagina voor de Polestar 6, en meteen mijn allereerste "
                    + "opleidingsproject. Hier leerden Flexbox en ik elkaar kennen. Een mobiele versie? "
                    + "Die staat nog in de backlog."
            },
            tags: ["HTML", "CSS", "Flexbox"],
            demo: "https://wesley-dev-tech.github.io/Polestar/",
            afbeelding: "images/polestar.webp",
            code: "https://github.com/Wesley-dev-tech/Polestar"
        },
        {
            titel: { en: "Halloween sign-up page", nl: "Halloween inschrijvingspagina" },
            slug: "halloween",
            teaser: {
                en: "A fictional Halloween walk on 31 October. Pick your time slot and don't forget your costume.",
                nl: "Een fictieve Halloweentocht op 31 oktober. Kies je tijdslot en vergeet je kostuum niet."
            },
            icoon: "fa-ghost",
            beschrijving: {
                en: "A sign-up page for a fictional Halloween walk, with time slots until midnight. "
                    + "The Creepster typeface brings the chills. Bootstrap Grid keeps the ghosts in "
                    + "their place, even on your smartphone.",
                nl: "Een inschrijvingspagina voor een fictieve Halloweentocht, met tijdsloten tot "
                    + "middernacht. Het lettertype Creepster zorgt voor de rillingen. Bootstrap Grid houdt "
                    + "de spoken op hun plek, ook op je smartphone."
            },
            tags: ["HTML", "CSS", "Bootstrap Grid"],
            demo: "https://wesley-dev-tech.github.io/Halloween/",
            afbeelding: "images/halloween.webp",
            code: "https://github.com/Wesley-dev-tech/Halloween"
        },
        {
            titel: { en: "Crossword puzzle", nl: "Kruiswoordraadsel" },
            slug: "kruiswoordraadsel",
            teaser: {
                en: "A fictional crossword you'll never get stuck on. That's because you can't fill it in.",
                nl: "Een fictief kruiswoordraadsel waarop je nooit vastloopt. Invullen kan namelijk niet."
            },
            icoon: "fa-table-cells",
            beschrijving: {
                en: "A fictional crossword of 15 rows, in which every square is a Bootstrap Grid column. "
                    + "It looks like a puzzle but works like a screenshot. Read-only, so to speak.",
                nl: "Een fictief kruiswoordraadsel van 15 rijen, waarin elk vakje een kolom van "
                    + "Bootstrap Grid is. Het ziet eruit als een puzzel, maar werkt als een screenshot. "
                    + "Read-only, zeg maar."
            },
            tags: ["HTML", "CSS", "Bootstrap Grid"],
            demo: "https://wesley-dev-tech.github.io/Crossword_puzzle/",
            afbeelding: "images/kruiswoordraadsel.webp",
            code: "https://github.com/Wesley-dev-tech/Crossword_puzzle"
        },
        {
            titel: { en: "Product page with Tailwind", nl: "Productpagina met Tailwind" },
            slug: "tailwind-productpagina",
            teaser: {
                en: "A fictional product card for the AirPods Pro 3. So honest it even lists the downsides.",
                nl: "Een fictieve productkaart voor AirPods Pro 3. Zo eerlijk dat ze zelfs de nadelen opsomt."
            },
            icoon: "fa-headphones",
            beschrijving: {
                en: "A fictional product card for the AirPods Pro 3, honest right down to the downsides. "
                    + "The Buy now button has no event listener, so your wallet is safe. The styling is "
                    + "a hefty stack of Tailwind utility classes.",
                nl: "Een fictieve productkaart voor de AirPods Pro 3, eerlijk tot en met de nadelen. "
                    + "De knop Koop nu heeft geen event listener, dus je portemonnee is veilig. De opmaak is "
                    + "een flinke stapel utility-classes van Tailwind."
            },
            tags: ["HTML", "Tailwind", "Flexbox"],
            demo: "https://wesley-dev-tech.github.io/Tailwind_product_page/",
            afbeelding: "images/tailwind-productpagina.webp",
            code: "https://github.com/Wesley-dev-tech/Tailwind_product_page"
        },
        {
            titel: { en: "Animated browser mockup", nl: "Geanimeerde browsermock-up" },
            slug: "browser-mockup",
            teaser: {
                en: "A fictional browser with a cursor that has a mind of its own. And not a single line of JavaScript.",
                nl: "Een fictieve browser met een cursor die zijn eigen gang gaat. En dat zonder één regel JavaScript."
            },
            icoon: "fa-window-maximize",
            beschrijving: {
                en: "A fictional browser window with a cursor that floats around and a page that "
                    + "scrolls by itself. Zero lines of JavaScript, just HTML and CSS doing their best. "
                    + "Untick Play animation and the cursor goes to sleep. Tick Switch theme and the "
                    + "whole window follows along.",
                nl: "Een fictief browservenster met een cursor die rondzweeft en een pagina die "
                    + "vanzelf scrolt. Nul regels JavaScript, alleen HTML en CSS die hun best doen. Vink "
                    + "Animatie afspelen uit en de cursor gaat in slaapstand. Vink Thema wisselen aan en "
                    + "het hele venster gaat mee."
            },
            tags: ["HTML", "CSS"],
            demo: "https://wesley-dev-tech.github.io/Animated_browser_mockup/?v=3",
            demoLicht: "https://wesley-dev-tech.github.io/Animated_browser_mockup/?v=3#licht",
            afbeelding: "images/browsermockup-dark.webp",
            afbeeldingLicht: "images/browsermockup-light.webp",
            code: "https://github.com/Wesley-dev-tech/Animated_browser_mockup"
        },
        {
            titel: "Portfolio",
            slug: "portfolio",
            teaser: {
                en: "The only project here that isn't fictional, because you're right in the middle of it. "
                    + "Click View details for a look behind the scenes.",
                nl: "Het enige project hier dat niet fictief is, want je zit er middenin. Klik op Bekijk "
                    + "details en kijk achter de schermen."
            },
            icoon: "fa-laptop-code",
            beschrijving: {
                en: "No fiction this time: this is my own portfolio, built with HTML, CSS, Bootstrap and "
                    + "JavaScript, in English and Dutch. You're right in the middle of it, so this window "
                    + "is actually a project too. It works on my smartphone and desktop, and hopefully on yours too.",
                nl: "Geen fictie deze keer, dit is mijn eigen portfolio, gebouwd met HTML, CSS, Bootstrap "
                    + "en JavaScript, in het Engels en het Nederlands. Je zit er middenin, dus dit venster "
                    + "is eigenlijk ook een project. Werkt op mijn smartphone en desktop, en hopelijk ook op de jouwe."
            },
            tags: ["HTML", "CSS", "JavaScript", "Flexbox", "Bootstrap"],
            afbeelding: { en: "images/portfolio-dark-en.webp", nl: "images/portfolio-dark-nl.webp" },
            afbeeldingLicht: { en: "images/portfolio-light-en.webp", nl: "images/portfolio-light-nl.webp" },
            code: "https://github.com/Wesley-dev-tech/wesley-dev-tech.github.io"
        },
        {
            titel: { en: "Vloermeesters tile price calculator", nl: "Vloermeesters tegelprijs calculator" },
            slug: "vloermeesters",
            teaser: {
                en: "A fictional tiling company. Your quote rolls out as a PDF, but no tiler will ever ring your doorbell.",
                nl: "Een fictief tegelbedrijf. Je offerte rolt er als PDF uit, alleen belt er nooit een tegelzetter aan."
            },
            icoon: "fa-calculator",
            beschrijving: {
                en: "A calculator for Vloermeesters, a fictional tiling company. Enter the dimensions of "
                    + "your room, choose a tile and a grout, and the estimated price rolls out as a PDF "
                    + "quote. Only the tiler was never deployed.",
                nl: "Een rekentool voor Vloermeesters, een fictief tegelbedrijf. Geef de afmetingen "
                    + "van je ruimte in, kies een tegel en een voeg, en de richtprijs rolt eruit als PDF-offerte. "
                    + "Alleen de tegelzetter is nooit gedeployd."
            },
            tags: ["HTML", "CSS", "JavaScript", "Bootstrap"],
            demo: "https://wesley-dev-tech.github.io/Flooring_price_calculator/",
            afbeelding: "images/vloermeesters.webp",
            code: "https://github.com/Wesley-dev-tech/Flooring_price_calculator"
        },
        {
            titel: { en: "Exam: Griezelnacht", nl: "Examen Griezelnacht" },
            slug: "examen-griezelnacht",
            teaser: {
                en: "A fictional spooky night at Kasteel Ravenhoek, and my exam. The ghosts went easy on me: 96 out of 100.",
                nl: "Een fictieve griezelnacht in Kasteel Ravenhoek, en mijn examen. De spoken waren mild: 96 op 100."
            },
            icoon: "fa-graduation-cap",
            beschrijving: {
                en: "My exam for the Fundamentals & tooling module: a fictional Griezelnacht (spooky night) "
                    + "at Kasteel Ravenhoek, built from a design with Bootstrap, Flexbox, CSS variables and "
                    + "Google Fonts. The moon, the little ghost, the pumpkin and the bats are separate images, "
                    + "each with its own spot. At the bottom, a subtle mist hangs above the ground.",
                nl: "Mijn examen voor de module Fundamentals & tooling: een fictieve Griezelnacht in "
                    + "Kasteel Ravenhoek, nagebouwd vanaf een ontwerp met Bootstrap, Flexbox, CSS-variabelen en "
                    + "Google Fonts. De maan, het spookje, de pompoen en de vleermuizen zijn losse afbeeldingen "
                    + "die elk hun eigen plekje kregen. Onderaan hangt een subtiel mistje boven de grond."
            },
            tags: ["HTML", "CSS", "Bootstrap", "Flexbox"],
            demo: "https://wesley-dev-tech.github.io/Examen_Griezelnacht/",
            afbeelding: "images/examen-ravenhoek.webp?v=2",
            code: "https://github.com/Wesley-dev-tech/Examen_Griezelnacht",
            // Alleen bij een examen: de score en de feedback van mijn docent (in het Engels vertaald)
            punten: "96 / 100",
            feedback: {
                en: "Wow Wesley, what a great exam! Your website looks amazing with those layered "
                    + "illustrations of the castle, the bats and that subtle mist effect at the bottom of "
                    + "the hero! Now all that's left is to master the JavaScript click and you're good to go! "
                    + "CONGRATULATIONS",
                nl: "Wauw Wesley, echt een topexamen afgeleverd! Je website ziet er geweldig uit met die "
                    + "gelaagde illustraties van het kasteel, de vleermuizen en dat subtiele mist-effectje "
                    + "onderaan de hero! Nu nog de javascript klik vinden en dan ben je vertrokken! PROFICIAT"
            }
        },
        {
            titel: { en: "North Pole on Christmas Eve", nl: "Noordpool op kerstavond" },
            slug: "noordpool-kerstavond",
            teaser: {
                en: "Three.js? Around here it's called Tree.js. A whole Christmas village in your browser, without a single 3D model.",
                nl: "Three.js? Hier heet het Tree.js. Een heel kerstdorp in je browser, zonder één 3D-model."
            },
            icoon: "fa-sleigh",
            beschrijving: {
                en: "What started as 'just a pole at 90° N' got slightly out of hand. The North Pole on "
                    + "Christmas Eve, built entirely in Three.js without a single 3D model or image: "
                    + "everything is shapes, procedural textures and custom shaders. Next to Santa's "
                    + "workshop lies an elf village with six houses, and those elves work harder than I "
                    + "do near a deadline: they have a snowball fight, chop wood, hang up lights and haul "
                    + "a sleigh full of presents along the path. Thanks to obstacle avoidance nobody walks "
                    + "through Santa anymore. That wasn't always the case. Click almost anything: the "
                    + "workshop door sends an elf with a present to the tree, the sleigh does a loop and "
                    + "your wish flies from the mailbox into the chimney. The northern lights, the snow "
                    + "and the sleigh bells are all generated live. No bugs found, just features wearing "
                    + "a Santa hat.",
                nl: "Wat begon als 'gewoon een paal op 90° N' liep een klein beetje uit de hand. De "
                    + "Noordpool op kerstavond, volledig in Three.js, zonder één 3D-model of afbeelding: "
                    + "alles is vormen, procedurele texturen en eigen shaders. Naast de werkplaats van de "
                    + "Kerstman ligt een elfendorp met zes huisjes, en die elfjes werken harder dan ik "
                    + "vlak voor een deadline: ze houden een sneeuwballengevecht, hakken hout, hangen "
                    + "lichtjes op en sleuren een slee vol cadeaus over het pad. Dankzij obstakelontwijking "
                    + "loopt niemand nog door de Kerstman heen. Dat was niet altijd zo. Klik op bijna "
                    + "alles: de werkplaatsdeur stuurt een elfje met een cadeau naar de kerstboom, de slee "
                    + "maakt een looping en je wens vliegt via de brievenbus de schoorsteen in. Het "
                    + "noorderlicht, de sneeuw en de sleebelletjes worden live berekend. Geen bugs "
                    + "gevonden, alleen features met een kerstmuts op."
            },
            tags: ["HTML", "CSS", "JavaScript", "Three.js"],
            demo: "https://wesley-dev-tech.github.io/noordpool-kerstavond/",
            afbeelding: "images/noordpool-kerstavond.webp",
            code: "https://github.com/Wesley-dev-tech/noordpool-kerstavond"
        },
    ];

    const projectLijst = document.querySelector("#project-list");
    const projectSjabloon = document.querySelector("#project-template");
    const projectSortering = document.querySelector("#project-sort");
    const projectPaginering = document.querySelector("#project-pagination");
    const vorigeProjectpaginaKnop = document.querySelector("#project-prev");
    const volgendeProjectpaginaKnop = document.querySelector("#project-next");

    // Technologieën als labels; gedeeld door de projectkaart en het detailvenster
    function vulTags(element, project) {
        const tags = element.querySelector(".project-tags");

        tags.replaceChildren();
        project.tags.forEach(function (tag) {
            const label = document.createElement("li");
            label.textContent = tag;
            tags.appendChild(label);
        });
    }

    // Titel en teaser van een kaart in de actieve taal; ook opnieuw bij een taalwissel
    function vulProjectteksten(kaart) {
        const project = projecten[Number(kaart.dataset.order)];

        kaart.querySelector(".project-open").textContent = inTaal(project.titel);
        kaart.querySelector("p").textContent = inTaal(project.teaser);
    }

    // Een kopie van het sjabloon invullen met de teaser van één project
    function maakProjectkaart(project, index) {
        const kaart = projectSjabloon.content.firstElementChild.cloneNode(true);

        // Hoe hoger het nummer, hoe nieuwer het project
        kaart.dataset.order = index;
        kaart.querySelector(".project-icon i").classList.add(project.icoon);
        vulProjectteksten(kaart);
        vulTags(kaart, project);

        return kaart;
    }

    const projectKaarten = projecten.map(maakProjectkaart);
    let huidigeProjectpagina = 1;

    function werkProjectenBij() {
        const sortering = projectSortering.value;

        projectKaarten.sort(function (eerste, tweede) {
            if (sortering === "alphabetical") {
                return eerste.querySelector("h3").textContent.localeCompare(
                    tweede.querySelector("h3").textContent,
                    huidigeTaal
                );
            }

            const verschil = Number(eerste.dataset.order) - Number(tweede.dataset.order);
            return sortering === "oldest" ? verschil : -verschil;
        });

        projectKaarten.forEach(function (kaart) {
            projectLijst.appendChild(kaart);
        });

        // Na een nieuwe sortering terug naar de eerste pagina (of het eerste project)
        projectLijst.scrollLeft = 0;
        toonProjectpagina(1);
    }

    function toonProjectpagina(pagina) {
        huidigeProjectpagina = pagina;
        const aantalPaginas = toonPagina(projectLijst, projectKaarten, pagina,
            vorigeProjectpaginaKnop, volgendeProjectpaginaKnop);

        projectPaginering.hidden = mobieleWeergave.matches || aantalPaginas <= 1;
    }

    projectSortering.addEventListener("change", werkProjectenBij);
    werkProjectenBij();

    // Bij een taalwissel de teksten vervangen. Alfabetisch kan de volgorde veranderen
    // (bv. Crossword puzzle tegenover Kruiswoordraadsel); dan opnieuw sorteren.
    bijTaalwissel.push(function () {
        projectKaarten.forEach(vulProjectteksten);

        if (projectSortering.value === "alphabetical") {
            werkProjectenBij();
        }
    });

    vorigeProjectpaginaKnop.addEventListener("click", function () {
        toonProjectpagina(huidigeProjectpagina - 1);
    });

    volgendeProjectpaginaKnop.addEventListener("click", function () {
        toonProjectpagina(huidigeProjectpagina + 1);
    });

    // Bij de wissel tussen carrousel en paginering de projecten opnieuw tonen
    mobieleWeergave.addEventListener("change", function () {
        toonProjectpagina(huidigeProjectpagina);
    });

    // Elke kaart even hoog als de hoogste in dezelfde lijst, ook op een andere pagina.
    // Verborgen kaarten worden heel even getoond om ze te kunnen meten.
    function maakKaartenEvenHoog(kaarten) {
        const verborgenKaarten = kaarten.filter(function (kaart) {
            return kaart.hidden;
        });

        kaarten.forEach(function (kaart) {
            kaart.style.removeProperty("--kaart-hoogte");
            kaart.hidden = false;
        });

        const hoogste = Math.max(...kaarten.map(function (kaart) {
            return kaart.offsetHeight;
        }));

        verborgenKaarten.forEach(function (kaart) {
            kaart.hidden = true;
        });
        // Alleen de gemeten waarde; style.css gebruikt ze als min-height
        kaarten.forEach(function (kaart) {
            kaart.style.setProperty("--kaart-hoogte", hoogste + "px");
        });
    }

    function maakAlleKaartenEvenHoog() {
        maakKaartenEvenHoog(projectKaarten);
    }

    // Opnieuw meten zodra het lettertype geladen is, bij een andere schermbreedte
    // en bij een taalwissel (de teksten worden dan langer of korter)
    document.fonts.ready.then(maakAlleKaartenEvenHoog);
    window.addEventListener("resize", maakAlleKaartenEvenHoog);
    maakAlleKaartenEvenHoog();
    bijTaalwissel.push(maakAlleKaartenEvenHoog);

    // Vensters (projectdetail en privacybeleid): openen, sluiten en de focus terugzetten
    let vensterOpener = null;

    // showModal zet de focus op de sluitknop, met een koperen focusring rond het kruisje als gevolg.
    // Daarom krijgt het venster zelf de focus (tabindex="-1" in de HTML); Tab gaat dan naar het kruisje.
    // Na het sluiten gaat de focus terug naar de opener.
    function openVenster(venster, opener) {
        vensterOpener = opener;
        document.documentElement.classList.add("modal-is-open");
        venster.showModal();
        venster.focus();
    }

    document.querySelectorAll(".dialog").forEach(function (venster) {
        const sluitKnop = venster.querySelector(".dialog-close");

        sluitKnop.addEventListener("click", function () {
            venster.close();
        });

        // Lege touch-listener: zonder zet Safari op iPhone :active niet, en dat geeft het hover-effect op gsm
        sluitKnop.addEventListener("touchstart", function () {}, { passive: true });

        // Een klik op de donkere achtergrond valt op het dialog-element zelf
        venster.addEventListener("click", function (event) {
            if (event.target === venster) {
                venster.close();
            }
        });

        // Escape sluit het venster al vanzelf; ook dan opruimen
        venster.addEventListener("close", function () {
            document.documentElement.classList.remove("modal-is-open");

            if (vensterOpener) {
                vensterOpener.focus({ preventScroll: true });
            }
        });
    });

    // Privacybeleid in de footer
    const privacyKnop = document.querySelector(".privacy-open");

    privacyKnop.addEventListener("click", function () {
        openVenster(document.querySelector("#privacy-modal"), privacyKnop);
    });

    // Links in het privacybeleid. Eén listener op het venster zelf, want bij een taalwissel
    // vervangt vertaalPagina de tekst (en dus de links) door nieuwe.
    document.querySelector("#privacy-modal").addEventListener("click", function (gebeurtenis) {
        const link = gebeurtenis.target.closest(".privacy-close, .privacy-jump");

        if (!link) {
            return;
        }

        // Link naar het contactformulier: eerst het venster sluiten, daarna springt de link naar de footer
        if (link.classList.contains("privacy-close")) {
            link.closest("dialog").close();
            return;
        }

        // Links binnen het privacybeleid scrollen in het venster zelf naar het juiste stukje,
        // zonder het adres in de adresbalk te veranderen
        const doel = document.querySelector(link.getAttribute("href"));

        if (doel) {
            gebeurtenis.preventDefault();
            doel.scrollIntoView({
                behavior: scrollGedrag(),
                block: "start"
            });
        }
    });

    // Detailvenster van een project
    const projectModal = document.querySelector("#project-modal");
    const projectModalAfbeelding = projectModal.querySelector(".project-modal-image");

    const vorigProjectKnop = projectModal.querySelector(".project-modal-prev");
    const volgendProjectKnop = projectModal.querySelector(".project-modal-next");
    let huidigeProjectkaart = null;

    // De screenshot vloeit zacht in zodra hij geladen is, in plaats van plots te verschijnen
    // (style.css; zonder animatie bij "minder beweging")
    function toonScreenshot() {
        projectModalAfbeelding.classList.add("is-geladen");
    }

    projectModalAfbeelding.addEventListener("load", toonScreenshot);
    projectModalAfbeelding.addEventListener("error", toonScreenshot);

    // Scherpe, vooraf verkleinde versies van een screenshot (scripts/screenshots-verkleinen.py):
    // de browser kiest via srcset de versie die past bij de breedte en de schaal van het scherm,
    // in plaats van zelf een screenshot van 1280px te verkleinen (dat maakt kleine tekst wazig)
    function screenshotSrcset(pad) {
        const delen = pad.match(/^(.+)\.webp(\?.*)?$/);

        if (!delen) {
            return "";
        }

        return [520, 780, 960].map(function (breedte) {
            return delen[1] + "-" + breedte + ".webp " + breedte + "w";
        }).concat(pad + " 1280w").join(", ");
    }

    // Vult het detailvenster met één project; gebruikt bij openen en bij vorige/volgende
    function vulProjectModal(kaart) {
        const project = projecten[Number(kaart.dataset.order)];
        huidigeProjectkaart = kaart;

        projectModal.querySelector(".project-icon i").className = "fa-solid " + project.icoon;
        projectModal.querySelector("#project-modal-title").textContent = inTaal(project.titel);
        projectModal.querySelector(".project-modal-description").textContent = inTaal(project.beschrijving);
        // Screenshot en demo in het thema dat nu actief is, als het project er een lichte versie van heeft
        const lichtThema = document.documentElement.dataset.theme === "light";

        function inThema(donker, licht) {
            return lichtThema && licht ? licht : donker;
        }

        const screenshotPad = inThema(inTaal(project.afbeelding), inTaal(project.afbeeldingLicht));
        const nieuweScreenshot = new URL(screenshotPad, document.baseURI).href;

        if (projectModalAfbeelding.src !== nieuweScreenshot) {
            projectModalAfbeelding.classList.remove("is-geladen");
            projectModalAfbeelding.srcset = screenshotSrcset(screenshotPad);
            projectModalAfbeelding.src = nieuweScreenshot;

            // Al in de cache: dan meteen tonen (load komt dan soms niet meer)
            if (projectModalAfbeelding.complete && projectModalAfbeelding.naturalWidth > 0) {
                requestAnimationFrame(toonScreenshot);
            }
        }
        projectModalAfbeelding.alt = t("project.screenshot") + inTaal(project.titel);
        vulTags(projectModal, project);

        // Zonder live demo geen knop die nergens naartoe gaat
        const demoLink = projectModal.querySelector(".project-demo");
        demoLink.hidden = !project.demo;
        if (project.demo) {
            demoLink.href = inThema(project.demo, project.demoLicht);
        }

        // Zonder repository op GitHub ook geen codeknop
        const codeLink = projectModal.querySelector(".project-code");
        codeLink.hidden = !project.code;
        if (project.code) {
            codeLink.href = project.code;
        }

        // Score en feedback alleen tonen bij een project met punten
        const beoordeling = projectModal.querySelector(".project-modal-grade");
        beoordeling.hidden = !project.punten;
        if (project.punten) {
            beoordeling.querySelector(".project-modal-score").textContent = project.punten;
            beoordeling.querySelector("blockquote").textContent = inTaal(project.feedback);
        }

        // Pijltjes: in de volgorde van de kaarten (dus ook na sorteren), niet rond aan de uiteinden
        const plaats = projectKaarten.indexOf(kaart);
        vorigProjectKnop.disabled = plaats <= 0;
        volgendProjectKnop.disabled = plaats >= projectKaarten.length - 1;
    }

    // Eigen link per project: #project-slug in het adres zolang het venster open is.
    // Zo kun je een link naar één project delen; wie hem opent, krijgt meteen dat venster.
    // Openen met een klik voegt een stap toe aan de geschiedenis, zodat de terugknop
    // (ook op gsm) het venster sluit in plaats van de site te verlaten.
    const PROJECT_ANKER = "#project-";
    let projectInGeschiedenis = false;

    function ankerVan(kaart) {
        return PROJECT_ANKER + projecten[Number(kaart.dataset.order)].slug;
    }

    function adresMet(anker) {
        return window.location.pathname + window.location.search + anker;
    }

    function kaartVanAnker(anker) {
        if (!anker.startsWith(PROJECT_ANKER)) {
            return null;
        }

        const slug = decodeURIComponent(anker.slice(PROJECT_ANKER.length));

        return projectKaarten.find(function (kaart) {
            return projecten[Number(kaart.dataset.order)].slug === slug;
        }) || null;
    }

    // De kaart van een project zichtbaar maken achter het venster, zodat de focus er na het
    // sluiten op kan landen: op desktop de juiste pagina, op mobiel de carrousel verschuiven
    function maakKaartZichtbaar(kaart) {
        if (mobieleWeergave.matches) {
            kaart.scrollIntoView({ block: "nearest", inline: "center" });
        } else {
            toonProjectpagina(Math.floor(projectKaarten.indexOf(kaart) / kaartenPerPagina) + 1);
        }
    }

    // viaAdres: het venster opent omdat het adres al naar dit project wijst (gedeelde link,
    // terug- of vooruitknop); dan niets aan de geschiedenis toevoegen
    function openProjectModal(kaart, viaAdres) {
        vulProjectModal(kaart);

        if (viaAdres) {
            projectInGeschiedenis = false;
        } else {
            history.pushState({ projectVenster: true }, "", adresMet(ankerVan(kaart)));
            projectInGeschiedenis = true;
        }

        openVenster(projectModal, kaart.querySelector(".project-open"));
    }

    // Venster dicht: het project uit het adres halen. Was het met een klik geopend, dan een stap
    // terug in de geschiedenis (de stap die het openen toevoegde), anders gewoon het anker weg.
    projectModal.addEventListener("close", function () {
        if (!kaartVanAnker(window.location.hash)) {
            return;
        }

        if (projectInGeschiedenis) {
            projectInGeschiedenis = false;
            history.back();
        } else {
            history.replaceState(history.state, "", adresMet(""));
        }
    });

    // Terug- of vooruitknop: venster openen, wisselen of sluiten volgens het adres
    window.addEventListener("popstate", function () {
        const kaart = kaartVanAnker(window.location.hash);

        if (kaart && projectModal.open) {
            vulProjectModal(kaart);
            maakKaartZichtbaar(kaart);
        } else if (kaart) {
            maakKaartZichtbaar(kaart);
            openProjectModal(kaart, true);
        } else if (projectModal.open) {
            projectInGeschiedenis = false;
            projectModal.close();
        }
    });

    // Naar het vorige (-1) of volgende (+1) project zonder het venster te sluiten
    function toonAnderProject(stap) {
        const kaart = projectKaarten[projectKaarten.indexOf(huidigeProjectkaart) + stap];

        if (!kaart || !projectModal.open) {
            return;
        }

        vulProjectModal(kaart);
        projectModal.scrollTop = 0;

        // Het adres volgt mee, zonder extra stap in de geschiedenis
        history.replaceState(history.state, "", adresMet(ankerVan(kaart)));

        // Na het sluiten komt de focus op de kaart van het laatst bekeken project
        vensterOpener = kaart.querySelector(".project-open");
        maakKaartZichtbaar(kaart);

        // Werd de knop die de focus had uitgeschakeld (eerste of laatste project), focus dan het venster
        if (document.activeElement && document.activeElement.disabled) {
            projectModal.focus();
        }
    }

    vorigProjectKnop.addEventListener("click", function () {
        toonAnderProject(-1);
    });

    volgendProjectKnop.addEventListener("click", function () {
        toonAnderProject(1);
    });

    // Pijltjestoetsen, behalve met een sneltoets erbij (bv. Alt + pijl is "terug" in de browser)
    projectModal.addEventListener("keydown", function (gebeurtenis) {
        if (gebeurtenis.altKey || gebeurtenis.ctrlKey || gebeurtenis.metaKey || gebeurtenis.shiftKey) {
            return;
        }

        if (gebeurtenis.key === "ArrowLeft" || gebeurtenis.key === "ArrowRight") {
            gebeurtenis.preventDefault();
            toonAnderProject(gebeurtenis.key === "ArrowLeft" ? -1 : 1);
        }
    });

    // Vegen op touchscreens: duidelijk horizontaal en minstens 60px, zodat gewoon scrollen
    // in het venster nooit per ongeluk van project wisselt
    let vegenStart = null;

    projectModal.addEventListener("touchstart", function (gebeurtenis) {
        const aanraking = gebeurtenis.changedTouches[0];
        vegenStart = { x: aanraking.clientX, y: aanraking.clientY };
    }, { passive: true });

    projectModal.addEventListener("touchend", function (gebeurtenis) {
        if (!vegenStart) {
            return;
        }

        const aanraking = gebeurtenis.changedTouches[0];
        const dx = aanraking.clientX - vegenStart.x;
        const dy = aanraking.clientY - vegenStart.y;
        vegenStart = null;

        if (Math.abs(dx) >= 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            toonAnderProject(dx > 0 ? -1 : 1);
        }
    }, { passive: true });

    // De hele kaart is klikbaar; de titelknop zorgt voor de toetsenbordbediening
    projectLijst.addEventListener("click", function (event) {
        const kaart = event.target.closest("#project-list > *");

        if (kaart) {
            openProjectModal(kaart);
        }
    });

    // Geopend met een link naar een project (bv. .../#project-examen-griezelnacht): naar de
    // projecten scrollen en meteen dat venster openen
    const projectUitLink = kaartVanAnker(window.location.hash);

    if (projectUitLink) {
        document.querySelector("#projects").scrollIntoView({ behavior: "instant" });
        maakKaartZichtbaar(projectUitLink);
        openProjectModal(projectUitLink, true);
    }

    // Secties en kaarten animeren wanneer ze in beeld komen.
    // De kolom met de Google Maps-kaart doet niet mee: Safari en de ingebouwde browser van
    // Facebook tonen een iframe in een element met transform of opacity soms helemaal leeg.
    // Dit staat onderaan, zodat de projectkaarten al bestaan.
    if ("IntersectionObserver" in window && !voorkeurMinderBeweging.matches) {
        const scrollObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll(
            "#about .about-card, #education .education-card, #cv .cv-card, " +
            "#skills .skills-card, #projects .section-head-row, " +
            "#project-list > *, .footer-grid > :not(.footer-details)"
        ).forEach(function (element) {
            element.classList.add("scroll-reveal");
            scrollObserver.observe(element);
        });
    }

    // Terug-naar-boven-knop
    const terugNaarBovenKnop = document.querySelector("#back-to-top");

    function werkTerugNaarBovenKnopBij() {
        terugNaarBovenKnop.hidden = window.scrollY < 400;
    }

    terugNaarBovenKnop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: scrollGedrag() });
    });

    // Voortgangsbalk onder de header
    const voortgangsbalk = document.querySelector("#scroll-progress");

    function werkVoortgangsbalkBij() {
        const scrollbareHoogte = document.documentElement.scrollHeight - window.innerHeight;
        let voortgang = scrollbareHoogte > 0 ? window.scrollY / scrollbareHoogte : 0;

        // Op iPhones kan je even voorbij de rand scrollen, dus tussen 0 en 1 houden
        voortgang = Math.min(Math.max(voortgang, 0), 1);
        // Alleen de waarde; style.css zet ze om in de breedte van de balk
        voortgangsbalk.style.setProperty("--voortgang", voortgang);
    }

    // Mobiele weergave: header weg bij naar beneden scrollen, terug bij een stukje omhoog.
    // Bovenaan de pagina, met het menu open of met toetsenbordfocus in de header blijft hij staan.
    const header = document.querySelector(".site-header");
    const headerKanVerbergen = window.matchMedia("(max-width: 1199.98px)");
    const HEADER_START = 150;      // eerst zo ver naar beneden voor de header verdwijnt
    const HEADER_OMHOOG = 8;       // zoveel px omhoog voor hij terugkomt (geen gespring bij een schokje)
    let vorigeScrollY = window.scrollY;
    let omhoogGescrold = 0;

    function zetHeaderVerborgen(verborgen) {
        header.classList.toggle("is-verborgen", verborgen);
    }

    function werkHeaderBij() {
        const y = window.scrollY;
        const verschil = y - vorigeScrollY;
        vorigeScrollY = y;

        // Na een tik blijft de focus op bv. de menuknop staan; alleen toetsenbordfocus telt
        const toetsenbordFocus = header.contains(document.activeElement)
            && document.activeElement.matches(":focus-visible");

        if (!headerKanVerbergen.matches || y < HEADER_START || navigatie.classList.contains("menu-is-open")
            || toetsenbordFocus) {
            omhoogGescrold = 0;
            zetHeaderVerborgen(false);
        } else if (verschil > 0) {
            omhoogGescrold = 0;
            zetHeaderVerborgen(true);
        } else if (verschil < 0) {
            omhoogGescrold -= verschil;

            if (omhoogGescrold >= HEADER_OMHOOG) {
                zetHeaderVerborgen(false);
            }
        }
    }

    // Met Tab naar de header: meteen tonen
    header.addEventListener("focusin", function () {
        if (document.activeElement.matches(":focus-visible")) {
            zetHeaderVerborgen(false);
        }
    });

    // Alles wat meebeweegt met de scrollpositie, in één listener
    function werkScrollpositieBij() {
        werkActieveLinkBij();
        werkTerugNaarBovenKnopBij();
        werkVoortgangsbalkBij();
        werkHeaderBij();
    }

    window.addEventListener("scroll", werkScrollpositieBij, { passive: true });
    window.addEventListener("resize", werkScrollpositieBij);
    werkScrollpositieBij();

    // Jaartal in de footer altijd actueel houden
    document.querySelector("#copyright-year").textContent = new Date().getFullYear();

    // Laatst bijgewerkt: GitHub Pages geeft de datum van de laatste publicatie mee,
    // dus die hoeft niemand met de hand aan te passen
    const bijgewerkt = document.querySelector("#last-updated");
    const publicatieDatum = new Date(document.lastModified);

    // In de datumnotatie van de actieve taal (31 October 2026 of 31 oktober 2026)
    function zetPublicatieDatum() {
        if (isNaN(publicatieDatum)) {
            return;
        }

        bijgewerkt.textContent = publicatieDatum.toLocaleDateString(t("datum.locale"), {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
        bijgewerkt.setAttribute("datetime", publicatieDatum.toISOString().slice(0, 10));
    }

    zetPublicatieDatum();
    bijTaalwissel.push(zetPublicatieDatum);

    // Afdrukken met Ctrl+P: style.css toont op papier alleen het cv (zoals de pdf's in cv/).
    // De titel wordt de voorgestelde bestandsnaam bij "Opslaan als pdf".
    const paginaTitel = document.title;

    window.addEventListener("beforeprint", function () {
        document.title = t("pdf.bestand") + " Wesley Bogaerts";
    });

    window.addEventListener("afterprint", function () {
        document.title = paginaTitel;
    });

    // Contactformulier: versturen zonder de pagina te verlaten.
    // Zonder JavaScript post het formulier gewoon naar Web3Forms en komt de bezoeker terug.
    const contactFormulier = document.querySelector("#contact-form");
    const contactStatus = document.querySelector("#contact-status");

    // Berichtveld op touchscreens laten meegroeien, voor browsers die field-sizing (style.css) niet kennen
    const berichtVeld = document.querySelector("#contact-bericht");
    const groeitZelf = !CSS.supports("field-sizing", "content")
        && window.matchMedia("(pointer: coarse)").matches;

    function pasBerichtHoogteAan() {
        if (!groeitZelf) {
            return;
        }

        // Eerst terug naar de minimumhoogte, zodat het veld ook weer kan krimpen.
        // Alleen de gemeten waarde; style.css gebruikt ze als hoogte.
        berichtVeld.style.removeProperty("--bericht-hoogte");
        const rand = berichtVeld.offsetHeight - berichtVeld.clientHeight;
        berichtVeld.style.setProperty("--bericht-hoogte", berichtVeld.scrollHeight + rand + "px");
    }

    berichtVeld.addEventListener("input", pasBerichtHoogteAan);

    // De melding onthoudt haar sleutel, zodat ze bij een taalwissel mee vertaald wordt
    let contactStatusSleutel = "";
    let bezigMetVersturen = false;

    function toonContactStatus(sleutel, gelukt) {
        contactStatusSleutel = sleutel;
        contactStatus.textContent = sleutel ? t(sleutel) : "";
        contactStatus.classList.toggle("is-ok", gelukt);
        contactStatus.classList.toggle("is-fout", !gelukt);
    }

    const verstuurKnopTekst = contactFormulier.querySelector('button[type="submit"] span');

    bijTaalwissel.push(function () {
        verstuurKnopTekst.textContent = bezigMetVersturen ? t("form.bezig") : t("form.verstuur");
        contactStatus.textContent = contactStatusSleutel ? t(contactStatusSleutel) : "";
    });

    // Eigen foutmeldingen onder het veld, in de taal van de pagina. JavaScript neemt de controle
    // over (noValidate); zonder JavaScript blijven de gewone meldingen van de browser werken.
    contactFormulier.noValidate = true;
    const verplichteVelden = Array.from(contactFormulier.querySelectorAll("[required]"));

    // Sleutel van de melding voor een veld, of "" als het in orde is.
    // Alleen spaties telt ook als leeg.
    function foutVoor(veld) {
        if (veld.value.trim() === "") {
            return "form.verplicht";
        }

        if (veld.validity.typeMismatch) {
            return "form.ongeldigEmail";
        }

        return veld.validity.valid ? "" : "form.verplicht";
    }

    function toonVeldfout(veld, sleutel) {
        const melding = document.getElementById(veld.id + "-fout");

        melding.dataset.sleutel = sleutel;
        melding.textContent = sleutel ? t(sleutel) : "";
        melding.hidden = !sleutel;

        if (sleutel) {
            veld.setAttribute("aria-invalid", "true");
        } else {
            veld.removeAttribute("aria-invalid");
        }
    }

    verplichteVelden.forEach(function (veld) {
        // Pas controleren als de bezoeker het veld verlaat, en alleen als er al iets in stond:
        // wie met Tab door een leeg formulier gaat, krijgt nog geen rij meldingen
        veld.addEventListener("input", function () {
            veld.dataset.aangeraakt = "ja";

            // Staat er al een melding, dan verdwijnt ze zodra het veld in orde is
            if (veld.hasAttribute("aria-invalid")) {
                toonVeldfout(veld, foutVoor(veld));
            }
        });

        veld.addEventListener("blur", function () {
            if (veld.dataset.aangeraakt) {
                toonVeldfout(veld, foutVoor(veld));
            }
        });
    });

    // Tekenteller bij het bericht, altijd zichtbaar en in koper; vet vlak voor de limiet
    const tellerGetal = contactFormulier.querySelector(".contact-counter-getal");
    const teller = tellerGetal.parentElement;

    function werkTellerBij() {
        tellerGetal.textContent = berichtVeld.value.length;
        teller.classList.toggle("is-bijna", berichtVeld.value.length >= berichtVeld.maxLength * .9);
    }

    berichtVeld.addEventListener("input", werkTellerBij);
    werkTellerBij();

    bijTaalwissel.push(function () {
        verplichteVelden.forEach(function (veld) {
            const melding = document.getElementById(veld.id + "-fout");

            if (melding.dataset.sleutel) {
                melding.textContent = t(melding.dataset.sleutel);
            }
        });
    });

    contactFormulier.addEventListener("submit", async function (gebeurtenis) {
        gebeurtenis.preventDefault();

        // Eerst alle velden controleren; bij een fout de meldingen tonen en naar het eerste veld gaan
        const foutVelden = verplichteVelden.filter(function (veld) {
            const sleutel = foutVoor(veld);
            toonVeldfout(veld, sleutel);
            return sleutel !== "";
        });

        if (foutVelden.length > 0) {
            foutVelden[0].focus();
            return;
        }

        const verstuurKnop = contactFormulier.querySelector('button[type="submit"]');

        verstuurKnop.disabled = true;
        bezigMetVersturen = true;
        verstuurKnopTekst.textContent = t("form.bezig");
        toonContactStatus("", true);

        // Na 20 seconden zonder antwoord breken we af, zodat de knop nooit blijft hangen
        const afbreker = new AbortController();
        const wachtTimer = setTimeout(function () {
            afbreker.abort();
        }, 20000);

        try {
            // Web3Forms staat verzoeken van andere websites toe en antwoordt altijd met JSON
            const antwoord = await fetch(contactFormulier.action, {
                method: "POST",
                headers: { Accept: "application/json" },
                body: new FormData(contactFormulier),
                signal: afbreker.signal
            });
            const resultaat = await antwoord.json().catch(function () { return {}; });

            if (!antwoord.ok || resultaat.success !== true) {
                throw new Error(resultaat.message || "Versturen mislukt");
            }

            contactFormulier.reset();
            pasBerichtHoogteAan();
            werkTellerBij();
            verplichteVelden.forEach(function (veld) {
                delete veld.dataset.aangeraakt;
            });
            toonContactStatus("form.gelukt", true);
        } catch (fout) {
            toonContactStatus("form.mislukt", false);
        } finally {
            clearTimeout(wachtTimer);
            verstuurKnop.disabled = false;
            bezigMetVersturen = false;
            verstuurKnopTekst.textContent = t("form.verstuur");
        }
    });

    // Alle vaste teksten in de gekozen taal zetten (ook die van de projectkaarten, die nu bestaan)
    // en de pagina weer tonen; style.css verborg ze zolang er Nederlands moest komen
    vertaalPagina();
    document.documentElement.classList.remove("taal-laden");

    // Bij Nederlands alles wat JavaScript zelf instelt ook één keer bijwerken (bv. het label van
    // de menuknop) en de kaarten opnieuw meten, want er staat nu andere tekst
    if (huidigeTaal !== "en") {
        bijTaalwissel.forEach(function (werkBij) {
            werkBij();
        });
    }
});
