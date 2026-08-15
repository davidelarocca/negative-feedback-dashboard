#!/usr/bin/env python3
"""
Build the two files of the session, each self-contained and fully offline.

    python3 tools/build.py              # both
    python3 tools/build.py console      # just the console
    python3 tools/build.py deck         # just the deck

  broken-loop-session.html  BOTH halves in one file — the version to present
  broken-loop.html          the feedback management dashboard on its own (dark)
  broken-loop-deck.html     the deck on its own, loading the dashboard beside it

Both inline every asset as a data URI, so neither can be separated from what
it needs by being emailed, zipped or copied to a ship's laptop. Each build
fails if any external reference survives into the output.

  Poppins        Costa brand face, subset to Latin + Latin-Ext — the only
                 typeface in either file
  The Costa mark cropped to its content box and resized (dashboard only)

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
        "fonts": POPPINS,
        "logo": False,
    },
    # The whole session in one file: the deck with the dashboard carried
    # inside it, handed to a srcdoc frame at the handoff. Same deck source as
    # above — only the token differs.
    "session": {
        "out": "broken-loop-session.html",
        "src": "deck",
        "parts": ["01-head.html", "02-css.html", "04-body.html"],
        "scripts": ["03-slides.js", "05-app.js"],
        "fonts": POPPINS,
        "logo": False,
        "embed_dashboard": True,
        "title": "The Broken Loop",
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


def render(name: str) -> str:
    """Assemble one target and return its HTML."""
    cfg = TARGETS[name]
    src = SRC / cfg.get("src", name)

    html = "".join((src / p).read_text(encoding="utf-8") for p in cfg["parts"])
    js = "\n".join((src / s).read_text(encoding="utf-8") for s in cfg["scripts"])
    html += "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n"

    subs = {"/*__FONTS__*/": font_css(cfg["fonts"])}
    if cfg["logo"]:
        subs["/*__LOGO__*/"] = logo_data_uri()

    for token, value in subs.items():
        if token not in html:
            sys.exit(f"{name}: token {token} not found in {src}")
        html = html.replace(token, value)

    # The deck carries a placeholder for an embedded dashboard. The one-file
    # build fills it; the others empty it so the frame loads the sibling file.
    if "__DASHBOARD_B64__" in html:
        payload = ""
        if cfg.get("embed_dashboard"):
            dashboard = render("console")
            payload = base64.b64encode(dashboard.encode("utf-8")).decode("ascii")
        html = html.replace("__DASHBOARD_B64__", payload)

    if cfg.get("title"):
        html = re.sub(r"<title>.*?</title>", f"<title>{cfg['title']}</title>", html, count=1)

    check_offline(html, name)
    return html


def build(name: str) -> None:
    html = render(name)
    out = ROOT / TARGETS[name]["out"]
    out.write_text(html, encoding="utf-8")
    print(f"built {out.name:<26} {out.stat().st_size / 1024:>6.0f} KB")


def main() -> None:
    wanted = sys.argv[1:] or list(TARGETS)
    for name in wanted:
        if name not in TARGETS:
            sys.exit(f"unknown target {name!r}; expected one of: {', '.join(TARGETS)}")
        build(name)


if __name__ == "__main__":
    main()
