"""Maakt van elke projectscreenshot scherpe, verkleinde versies voor het detailvenster.

Het venster toont een screenshot op desktop 960px breed, op gsm en tablet zo breed als
het scherm min de marges. Laat je de browser zelf een screenshot van 1280px verkleinen,
dan worden kleine tekst en dunne lijnen wazig. Daarom staan er naast elke screenshot drie
vooraf verkleinde versies (520, 780 en 960px breed); script.js laat de browser via srcset
de passende kiezen, met de originele 1280px als grootste.

Gebruik (vanuit de map van de repo, met Pillow geïnstalleerd):

    python3 scripts/screenshots-verkleinen.py

Het script zoekt alle screenshots die in script.js bij een project staan (afbeelding en
afbeeldingLicht) en maakt voor elk naam-520.webp, naam-780.webp en naam-960.webp ernaast.
Een bestaande versie wordt alleen opnieuw gemaakt als de screenshot nieuwer is.
"""
import pathlib
import re

from PIL import Image, ImageFilter

REPO = pathlib.Path(__file__).resolve().parent.parent
BREEDTES = (520, 780, 960)


def screenshots():
    script = (REPO / "script.js").read_text(encoding="utf-8")
    regels = re.findall(r'afbeelding(?:Licht)?: (.+)', script)
    paden = set()

    for regel in regels:
        for pad in re.findall(r'"(images/[^"?]+\.webp)', regel):
            paden.add(pad)

    return sorted(paden)


def verklein(pad):
    bron = REPO / pad
    beeld = Image.open(bron).convert("RGB")

    for breedte in BREEDTES:
        doel = bron.with_name(f"{bron.stem}-{breedte}.webp")

        if doel.exists() and doel.stat().st_mtime >= bron.stat().st_mtime:
            continue

        hoogte = round(beeld.height * breedte / beeld.width)
        klein = beeld.resize((breedte, hoogte), Image.LANCZOS)

        # Bij sterk verkleinen een lichte verscherping, zodat kleine tekst niet zacht wordt
        if breedte <= 780:
            klein = klein.filter(ImageFilter.UnsharpMask(radius=0.6, percent=60, threshold=2))

        klein.save(doel, "WEBP", quality=90, method=6)
        print(f"{doel.relative_to(REPO)}  {breedte}x{hoogte}")


if __name__ == "__main__":
    for pad in screenshots():
        verklein(pad)
