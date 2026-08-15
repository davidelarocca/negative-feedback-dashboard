#!/usr/bin/env python3
"""
Build the two files of the session, each self-contained and fully offline.

    python3 tools/build.py              # both
    python3 tools/build.py console      # just the console
    python3 tools/build.py deck         # just the deck

  broken-loop.html        the feedback decision console (dark)
  broken-loop-deck.html   the 22-slide presentation that wraps around it (light)

Both inline every asset as a data URI, so neither can be separated from what
it needs by being emailed, zipped or copied to a ship's laptop. Each build
fails if any external reference survives into the output.

  Poppins        Costa brand face, subset to Latin + Latin-Ext (both files)
  IBM Plex Mono  eyebrows, sources and figures (deck only)
  The Costa mark cropped to its content box and resized (console only)

Regenerating the font subsets needs fonttools + brotli; tools/subset-fonts.py
does that and is only needed if the set of weights changes.
"""

import base64
import io
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
FONTS = ROOT / "assets" / "fonts"

# The white + yellow mark reads correctly on the deep-blue console ground.
# Matched by glob so a re-upload under a slightly different name still builds;
# to use a different variant, put its stem first.
LOGO_GLOBS = ["c_full_white_yellow*.png", "c_full_white*.png", "c_full_yellow*.png"]
LOGO_HEIGHT = 144          # 3x the 48px rendered height, for retina/projector

POPPINS = [("Poppins", w, f"Poppins-{w}.subset.woff2") for w in (300, 400, 600, 700)]
PLEX = [("IBM Plex Mono", w, f"IBMPlexMono-{w}.subset.woff2") for w in (400, 600)]

TARGETS = {
    "console": {
        "out": "broken-loop.html",
        "parts": ["01-head.html", "02-css.html", "03-body.html"],
        "scripts": ["04-content.js", "05-app.js"],
        "fonts": POPPINS,
        "logo": True,
    },
    "deck": {
        "out": "broken-loop-deck.html",
        "parts": ["01-head.html", "02-css.html", "04-body.html"],
        "scripts": ["03-slides.js", "05-app.js"],
        "fonts": POPPINS + PLEX,
        "logo": False,
    },
}


def font_css(fonts) -> str:
    """@font-face blocks with the WOFF2 payloads inlined as data URIs."""
    out = []
    for family, weight, filename in fonts:
        path = FONTS / filename
        if not path.exists():
            sys.exit(f"missing font: {path}\nrun tools/subset-fonts.py first")
        b64 = base64.b64encode(path.read_bytes()).decode("ascii")
        out.append(
            f"@font-face{{\n"
            f"  font-family:'{family}';\n"
            f"  font-style:normal;\n"
            f"  font-weight:{weight};\n"
            f"  font-display:block;\n"
            f"  src:url(data:font/woff2;base64,{b64}) format('woff2');\n"
            f"}}"
        )
    return "\n".join(out)


def find_logo() -> pathlib.Path:
    for pattern in LOGO_GLOBS:
        matches = sorted(ROOT.glob(pattern))
        if matches:
            return matches[0]
    sys.exit("no logo found; expected one of: " + ", ".join(LOGO_GLOBS))


def logo_data_uri() -> str:
    """Crop the mark to its content box, resize, and return it as a data URI."""
    src = find_logo()
    try:
        from PIL import Image
    except ImportError:
        sys.exit("Pillow is required to embed the logo:  pip install pillow")

    im = Image.open(src).convert("RGBA")
    box = im.getchannel("A").getbbox()
    if box:
        im = im.crop(box)

    w = round(im.width * LOGO_HEIGHT / im.height)
    im = im.resize((w, LOGO_HEIGHT), Image.LANCZOS)

    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def check_offline(html: str, name: str) -> None:
    """Nothing may reach outside the file. The console is the one allowed
    reference, because the deck loads it from the same folder on purpose."""
    leaks = re.findall(r'(?:src|href)\s*=\s*["\'](?!data:|#)([^"\']+)', html)
    leaks += re.findall(r'url\(\s*(?!["\']?data:)([^)]+)\)', html)
    leaks = [x for x in leaks if x != TARGETS["console"]["out"]]
    if leaks:
        sys.exit(f"{name}: external reference(s) left in the build: " + ", ".join(sorted(set(leaks))))


def build(name: str) -> None:
    cfg = TARGETS[name]
    src = SRC / name

    html = "".join((src / p).read_text(encoding="utf-8") for p in cfg["parts"])
    js = "\n".join((src / s).read_text(encoding="utf-8") for s in cfg["scripts"])
    html += "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n"

    subs = {"/*__FONTS__*/": font_css(cfg["fonts"])}
    if cfg["logo"]:
        subs["/*__LOGO__*/"] = logo_data_uri()

    for token, value in subs.items():
        if token not in html:
            sys.exit(f"{name}: token {token} not found in src/{name}/")
        html = html.replace(token, value)

    check_offline(html, name)

    out = ROOT / cfg["out"]
    out.write_text(html, encoding="utf-8")
    print(f"built {out.name:<24} {out.stat().st_size / 1024:>6.0f} KB")


def main() -> None:
    wanted = sys.argv[1:] or list(TARGETS)
    for name in wanted:
        if name not in TARGETS:
            sys.exit(f"unknown target {name!r}; expected one of: {', '.join(TARGETS)}")
        build(name)


if __name__ == "__main__":
    main()
