// Nederlandse teksten van de site. Elke sleutel hoort bij een element met data-i18n (of
// data-i18n-alt, -aria-label, -title, -placeholder, -content, -src, -srcset) in index.html, of bij een
// tekst die JavaScript zelf maakt (zie en.js). Ontbreekt hier een sleutel, dan blijft het Engels staan.
const TAAL_NL = {
    // Paginagegevens
    "meta.description": "Portfolio van Wesley Bogaerts uit Balen, student Full Stack &amp; AI Automation Developer aan SyntraPXL.",

    // Navigatie
    "nav.skip": "Ga naar de inhoud",
    "nav.label": "Hoofdnavigatie",
    "nav.about": "Over mij",
    "nav.education": "Opleiding",
    "nav.skills": "Vaardigheden",
    "nav.cv": "CV",
    "nav.projects": "Projecten",
    "nav.taal": "Taal",
    "thema.label": "Licht thema",
    "menu.open": "Menu openen",
    "menu.sluit": "Menu sluiten",
    "thema.naarDonker": "Wissel naar het donkere thema",
    "thema.naarLicht": "Wissel naar het lichte thema",
    "thema.sneltoets": " (sneltoets T)",

    // Intro
    "hero.avatarAlt": "Avatar van Wesley Bogaerts met zonnebril",
    "groet.ochtend": "Goeiemorgen, ik ben",
    "groet.middag": "Goeiemiddag, ik ben",
    "groet.avond": "Goeienavond, ik ben",
    "groet.nacht": "Nog wakker? Ik ben",
    "hero.intro": "<code class=\"hero-code\">console.log(\"carrièreswitch\")</code> → Boekhouder.exe reageert niet meer. Developer.exe wordt gestart… Na jaren debet en credit is het nu debuggen en committen. Scroll naar beneden voor mijn projecten, van een pagina die eindelijk een div centreert tot een calculator die offertes als pdf afdrukt. Een bug gevonden? Dat is een feature. Een idee? Stuur me een bericht.",
    "hero.projecten": "Bekijk mijn projecten",
    "hero.contact": "Neem contact op",
    "hero.opleiding": "Opleiding",
    "hero.opleidingWaarde": "SyntraPXL, voltijds",
    "hero.leren": "Nu aan het leren",
    "hero.locatie": "Locatie",
    "algemeen.locatie": "Balen, België",

    // Bewegende tekstbalk
    "marquee.opleiding": "Full Stack Developer in opleiding",
    "marquee.webdesign": "Webdesign",
    "marquee.webapps": "Webapplicaties",
    "marquee.software": "Software op maat",
    "marquee.ai": "AI-automatisering",

    // Over mij
    "about.titel": "Over mij",
    "about.label": "Mijn achtergrond",
    "about.kop": "Van balansen naar stylesheets",
    "about.ondertitel": "Full Stack Developer in opleiding",
    "about.lead": "Jarenlang werkte ik in de boekhouding en administratie, waar elke cent moest kloppen. Daarna koos ik bewust voor IT. Wat ik meenam: nauwkeurigheid, structuur, respect voor deadlines en een gezond wantrouwen tegenover cijfers die te mooi lijken om waar te zijn.",
    "about.p1": "Mijn nieuwsgierigheid naar IT groeide elk jaar. Websites en apps gewoon gebruiken was niet meer genoeg; ik wilde weten wat er achter de knop gebeurt. Uiteindelijk won die nieuwsgierigheid en schoolde ik me om tot developer. Geen spijt, wel veel meer browsertabbladen.",
    "about.p2": "Wat ik het leukst vind, is oplossingen zoeken. Code werkt zelden de eerste keer, en eerlijk: dat is net het leuke. Ik zoek uit waar het misloopt, test een paar ideeën en blijf bijsturen tot de bug opgeeft. Mijn jaren in de boekhouding helpen daarbij: logisch denken en oog voor detail werken in code net zo goed.",
    "about.p3": "Ik weet dat leren programmeren tijd en doorzettingsvermogen vraagt. Daarom oefen ik veel, neem ik feedback ter harte en leer ik uit mijn fouten. Elke fout leert me iets, en Git onthoudt ze toch allemaal.",
    "about.p4": "Mijn doel: mijn werkervaring combineren met mijn nieuwe technische kennis om applicaties te bouwen die niet alleen werken, maar ook praktisch en prettig zijn in gebruik. Code die werkt is goed. Code die mensen graag gebruiken is beter.",
    "leesMeer": "Lees meer",
    "leesMinder": "Lees minder",

    // Mijn opleiding
    "education.titel": "Mijn opleiding",
    "education.label": "Momenteel student",
    "education.lead": "Ik volg de voltijdse dagopleiding Full Stack &amp; AI Automation Developer aan SyntraPXL. Stap voor stap leer ik zelf websites en applicaties bouwen, commit per commit.",
    "education.p1": "We begonnen met HTML en CSS, de basis van elke pagina. Daarna volgden Flexbox en responsive design, zodat een site er goed uitziet op een gsm, een tablet en die ene ultrabrede monitor. Vervolgens Bootstrap en Tailwind: met Bootstrap Grid bouw ik pagina's uit rijen en kolommen, met Tailwind style ik rechtstreeks vanuit mijn classes.",
    "education.p2": "Ook de look van een site kreeg veel aandacht: Google Fonts voor lettertypes, Font Awesome voor icoontjes en Coolors.co voor kleurenpaletten die echt bij elkaar passen. Met die gereedschapskist bouwde ik sindsdien al verschillende projecten, waaronder het portfolio waar je nu door scrollt.",
    "education.p3": "Daarna: relationele databanken. In MySQL oefende ik tabellen opbouwen, data normaliseren en SQL-queries schrijven, tot JOIN niet meer als een dreigement klonk. Nu werken we met JavaScript en API's, zodat mijn code met de buitenwereld begint te praten.",
    "education.p4": "De opleiding liet me ook kennismaken met Agile en Scrum: sprintplanning, planning poker en een Kanbanbord in Trello. Zo zag ik hoe developers samen plannen en bouwen als team, en dat inschatten vaak moeilijker is dan programmeren.",
    "education.p5": "Mijn doel is om zelfstandig volledige webapplicaties te bouwen, van front-end tot back-end. Ik wil dieper duiken in JavaScript en TypeScript, werken met API's en ontdekken hoe AI processen kan automatiseren. Full stack, zonder shortcuts.",
    "education.p6": "Minstens even belangrijk: ik wil de code die ik schrijf ook begrijpen. Ik wil geen AI-agents die code genereren die ik niet kan uitleggen. Ik wil weten hoe het werkt, waarom ik bepaalde keuzes maakte en hoe ik een bug opspoor. AI is een handig hulpmiddel om sneller te leren en te werken, geen vervanging voor mijn eigen hersenen.",

    // Mijn cv
    "cv.titel": "Mijn cv",
    "cv.label": "Curriculum vitae",
    "cv.kop": "Werkervaring en opleidingen",
    "cv.ondertitel": "Van administratie en finance naar IT",
    "cv.lead": "Leergierige en analytisch ingestelde student Full Stack &amp; AI Automation Developer "
        + "met een sterke professionele achtergrond in administratie en finance.",
    "cv.werk": "Werkervaring",
    "cv.werk1.datum": "<time datetime=\"2025-02\">Februari 2025</time> - <time datetime=\"2026-09\">september 2026</time>",
    "cv.werk1.functie": "Assistent accountant",
    "cv.werk1.taak1": "Valideren en verwerken van aankoopfacturen in SAP",
    "cv.werk1.taak2": "Opvolgen van leveranciersbalansen en crediteurenbeheer",
    "cv.werk1.taak3": "Verwerken en boeken van bankverrichtingen",
    "cv.werk1.taak4": "Ondersteunen en fungeren als back-up van collega’s",
    "cv.werk1.taak5": "Voorbereiden en ondersteunen bij audits",
    "cv.werk2.datum": "<time datetime=\"2022-08\">Augustus 2022</time> - <time datetime=\"2025-01\">januari 2025</time>",
    "cv.werk2.functie": "Finance assistent",
    "cv.werk2.taak1": "Debiteuren- en crediteurenbeheer",
    "cv.werk2.taak2": "Voorbereiden en indienen van de maandelijkse btw-, ICO- en Intrastat-aangiftes",
    "cv.werk2.taak3": "Verwerken van verkoop- en aankoopfacturen in SAP",
    "cv.werk2.taak4": "Verwerken en boeken van bankverrichtingen en klaarzetten van betalingen",
    "cv.werk2.taak5": "Ondersteunen bij maandafsluitingen en aanleveren van data voor externe audits",
    "cv.werk2.taak6": "Opvolgen van achterstallige betalingen en versturen van wekelijkse aanmaningen",
    "cv.werk2.taak7": "Uitvoeren van diverse financiële en administratieve taken",
    "cv.werk3.datum": "<time datetime=\"2021-10\">Oktober 2021</time> - <time datetime=\"2022-06\">juni 2022</time>",
    "cv.werk3.functie": "Medewerker boekhouding <span class=\"cv-note\">(tijdelijk project)</span>",
    "cv.werk3.taak1": "Verwerken van facturen en bankverrichtingen in WIC en BouwOffice",
    "cv.werk3.taak2": "Verantwoordelijke crediteurenbeheer",
    "cv.werk3.taak3": "Klaarzetten van betalingen in SEPA-betaallijsten",
    "cv.werk4.datum": "<time datetime=\"2021-08\">Augustus 2021</time> - <time datetime=\"2021-10\">oktober 2021</time>",
    "cv.werk4.functie": "Junior dossierbeheerder",
    "cv.werk4.taak1": "Verwerken van facturen en bankverrichtingen",
    "cv.werk4.taak2": "Verwerken van CODA-bestanden",
    "cv.werk4.taak3": "Verwerken van kas- en dagontvangsten",
    "cv.werk5.datum": "<time datetime=\"2021-02\">Februari 2021</time> - <time datetime=\"2021-05\">mei 2021</time>",
    "cv.werk5.functie": "Admin &amp; customer service",
    "cv.werk5.taak1": "Eindverantwoordelijke data-input Waste Management Online",
    "cv.werk5.taak2": "Customer service",
    "cv.werk5.taak3": "Sorteerinstructies op maat van de klant opstellen in PowerPoint",
    "cv.werk6.datum": "<time datetime=\"2010-01\">Januari 2010</time> - <time datetime=\"2020-03\">maart 2020</time>",
    "cv.werk6.functie": "Administratief bediende",
    "cv.werk6.taak1": "Eindverantwoordelijke voor het verwerken en verifiëren van orders",
    "cv.werk6.taak2": "Customer service en klachtenbehandeling",
    "cv.werk6.taak3": "Verantwoordelijke voor social media en folders",
    "cv.opleidingen": "Opleidingen",
    "cv.opl1.datum": "<time datetime=\"2026\">2026</time> - heden",
    "cv.opl2.titel": "Graduaat Accounting &amp; Administration",
    "cv.opl3.titel": "Boekhoudkundig bediende",
    "cv.opl4.titel": "Opleiding kleuteronderwijs",
    "cv.opl5.titel": "Bedrijfsbeheer",
    "cv.opl6.titel": "Administratief commercieel medewerker",
    "cv.profiel": "Profiel",
    "cv.itVaardigheden": "IT-vaardigheden",
    "skills.concepten": "Concepten &amp; methodologieën",
    "skills.label": "Tech stack",
    "skills.kop": "Tools waarmee ik bouw",
    "skills.ondertitel": "Van frontend tot AI-automatisering",
    "skills.lead": "De talen, frameworks en tools waarmee ik bouw in mijn opleiding en in mijn eigen projecten. En de manier waarop ik dat werk georganiseerd houd, zodat de chaos beperkt blijft tot mijn browsertabbladen.",
    "cv.talen": "Talenkennis",
    "cv.nederlands": "Nederlands",
    "cv.moedertaal": "Moedertaal",
    "cv.engels": "Engels",
    "cv.goedeKennis": "Goede kennis",
    "cv.kenmerken": "Persoonlijke kenmerken",
    "cv.leergierig": "Leergierig",
    "cv.analytisch": "Analytisch",
    "cv.probleemoplossend": "Probleemoplossend",
    "cv.nauwkeurig": "Nauwkeurig",
    "cv.zelfstandig": "Zelfstandig",
    "cv.nieuwsgierig": "Nieuwsgierig",
    "cv.pdf": "Download als pdf",
    "pdf.bestand": "Cv",
    "pdf.fout": "De pdf kon niet gemaakt worden. Controleer je internetverbinding en probeer opnieuw.",

    // Mijn vaardigheden
    "skills.titel": "Mijn vaardigheden",
    "skills.monday": "<strong>Monday</strong> — hier plan ik mijn taken, volg ik op hoever een project staat en stem ik het werk af als we in team bouwen. Minder post-its, meer overzicht.",
    "skills.scrum": "<strong>Scrum</strong> — in de lessen werken we in sprints: we schatten in met planning poker, volgen taken op een Kanbanbord in Trello en blikken terug na elke sprint. Spoiler: de inschatting is altijd een tikje optimistisch.",
    "skills.rest": "<strong>REST API</strong> — met JavaScript haal ik gegevens op via HTTP-verzoeken en toon ik het antwoord op mijn pagina. 200 OK is mijn favoriete getal.",
    "skills.mcp": "<strong>MCP</strong> — hiermee koppel ik AI-assistenten aan mijn eigen tools, zoals GitHub en Google Drive, zodat ze rechtstreeks met mijn bestanden en data kunnen werken. Alsof ik mijn assistent een sleutel geef, maar alleen voor de juiste kamers.",

    // Mijn projecten
    "projects.titel": "Mijn projecten",
    "projects.sorteren": "Sorteren",
    "projects.nieuwste": "Nieuwste eerst",
    "projects.oudste": "Oudste eerst",
    "projects.alfabetisch": "Alfabetisch (A-Z)",
    "projects.details": "Bekijk details",
    "projects.paginering": "Paginering projecten",
    "projects.vorigeLabel": "Vorige projectpagina",
    "projects.vorige": "Vorige",
    "projects.volgendeLabel": "Volgende projectpagina",
    "projects.volgende": "Volgende",
    "project.screenshot": "Screenshot van ",
    "modal.sluiten": "Sluiten",
    "modal.feedback": "Feedback van mijn docent",
    "modal.technologieen": "Gebruikte technologieën",
    "modal.demo": "Bekijk project",
    "modal.code": "Bekijk code",

    // Privacybeleid
    "privacy.titel": "Privacybeleid",
    "privacy.bijgewerkt": "Laatst bijgewerkt op 31 oktober 2026",
    "privacy.intro": "Dit is mijn persoonlijke portfolio. Ik vind privacy belangrijk en hou het daarom "
        + "eenvoudig: deze site verzamelt zelf geen persoonsgegevens.",
    "privacy.wieKop": "Wie is verantwoordelijk?",
    "privacy.wie": "Wesley Bogaerts, Balen (België). Vragen over privacy stel je via het "
        + "<a href=\"#contact\" class=\"privacy-close\">contactformulier</a> onderaan de pagina.",
    "privacy.nietKop": "Wat deze site niet doet",
    "privacy.niet1": "Geen eigen cookies. Alleen de ingesloten kaart van Google Maps kan cookies plaatsen "
        + "(zie <a href=\"#privacy-derden\" class=\"privacy-jump\">diensten van derden</a>).",
    "privacy.niet2": "Geen statistieken, analytics of tracking.",
    "privacy.niet3": "Geen advertenties en geen formulieren die gegevens opslaan.",
    "privacy.keuzeKop": "Je thema- en taalkeuze",
    "privacy.keuze": "Kies je het lichte of donkere thema, of Engels of Nederlands, dan onthoudt je "
        + "browser die keuze (onder de namen <strong>thema</strong> en <strong>taal</strong>) in de lokale "
        + "opslag van je toestel. Dat is geen cookie en het wordt nooit naar mij of naar iemand anders "
        + "gestuurd. Je wist het door de sitegegevens in je browser te verwijderen.",
    "privacy.derdenKop": "Diensten van derden",
    "privacy.derden": "Om de site te tonen, laadt je browser bestanden van deze diensten. Daarbij "
        + "ontvangen zij technische gegevens zoals je IP-adres en browsertype:",
    "privacy.github": "<strong>GitHub Pages</strong> host de site",
    "privacy.verklaring": "privacyverklaring",
    "privacy.beleid": "privacybeleid",
    "privacy.fonts": "<strong>Google Fonts</strong> levert de lettertypes",
    "privacy.maps": "<strong>Google Maps</strong> toont de kaart van Balen in de footer. Google kan "
        + "daarbij cookies plaatsen",
    "privacy.jsdelivr": "<strong>jsDelivr</strong> levert Bootstrap",
    "privacy.cdnjs": "<strong>cdnjs (Cloudflare)</strong> levert de iconen van Font Awesome en de "
        + "bibliotheek jsPDF voor de cv-pdf",
    "privacy.contactKop": "Als je contact opneemt",
    "privacy.contact": "Stuur je me een bericht via het contactformulier, een e-mail, bel je me of stuur "
        + "je een bericht via WhatsApp of Messenger, dan gebruik ik je naam, contactgegevens, bericht en "
        + "eventueel je bedrijfsnaam alleen om je te antwoorden. Ik deel ze met niemand en verwijder ze "
        + "zodra ze niet meer nodig zijn. Het contactformulier wordt verstuurd via "
        + "<a href=\"https://web3forms.com/privacy\" target=\"_blank\" rel=\"noopener noreferrer\">Web3Forms</a>, "
        + "dat je bericht doorstuurt naar mijn mailbox. WhatsApp en Messenger zijn diensten van Meta, met "
        + "een eigen <a href=\"https://www.facebook.com/privacy/policy/\" target=\"_blank\" "
        + "rel=\"noopener noreferrer\">privacybeleid</a>.",
    "privacy.linksKop": "Links naar andere sites",
    "privacy.links": "Links naar GitHub, LinkedIn, WhatsApp, Messenger en mijn projecten openen een "
        + "andere site. Daar geldt het privacybeleid van die site.",
    "privacy.rechtenKop": "Jouw rechten",
    "privacy.rechten": "Volgens de AVG (GDPR) mag je vragen welke gegevens ik van je heb, ze laten "
        + "verbeteren of laten verwijderen. Stuur me daarvoor een e-mail. Ben je niet tevreden over mijn "
        + "antwoord, dan kun je een klacht indienen bij de "
        + "<a href=\"https://www.gegevensbeschermingsautoriteit.be\" target=\"_blank\" "
        + "rel=\"noopener noreferrer\">Gegevensbeschermingsautoriteit</a>.",

    // Contact en footer
    "contact.titel": "Neem contact op",
    "contact.intro": "Een vraag over een project, een idee voor een website of benieuwd naar mijn code op GitHub? Stuur me een bericht of bel me even. Ik hoor graag van je, en ik beloof: mijn inbox heeft minder bugs dan mijn eerste projecten.",
    "form.naam": "Naam",
    "form.bedrijf": "Bedrijfsnaam",
    "form.email": "E-mailadres",
    "form.telefoon": "Telefoonnummer",
    "form.bericht": "Bericht",
    "form.berichtPlaceholder": "Laat hier je boodschap achter",
    "form.bezig": "Bezig met versturen…",
    "form.verstuur": "Verstuur bericht",
    "form.gelukt": "Bericht afgeleverd! Bedankt om contact op te nemen, ik antwoord zo snel mogelijk.",
    "form.mislukt": "Oeps, je bericht is ergens tussen hier en mijn inbox verdwaald. Probeer het opnieuw of bel me even.",
    "form.verplicht": "Vul dit veld in.",
    "form.ongeldigEmail": "Vul een geldig e-mailadres in.",
    "footer.kaartTitel": "Balen op Google Maps",
    "footer.kaartSrc": "https://maps.google.com/maps?q=Balen,+Belgi%C3%AB&z=12&hl=nl&output=embed",
    "footer.rechten": "Alle rechten voorbehouden",
    "footer.bijgewerkt": "Laatst bijgewerkt op",
    "footer.naarBoven": "Terug naar boven",
    "datum.locale": "nl-BE"
};
