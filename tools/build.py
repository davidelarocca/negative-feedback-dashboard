#!/usr/bin/env python3
"""
Assemble broken-loop.html — one self-contained, fully offline file.

    python3 tools/build.py

Concatenates the parts in src/, then inlines the two binary brand assets as
data URIs so the result has no external references of any kind:

  * Poppins  — the Costa brand typeface, subset to Latin + Latin-Ext and
               converted to WOFF2 (weights 300/400/600/700).
  * The mark — the Costa "C", cropped to its content box and resized for a
               high-DPI presentation screen.

Regenerating the font subsets from the full TTFs needs fonttools + brotli;
tools/subset-fonts.py does that and is only needed if the weights change.
"""

import base64
import io
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "broken-loop.html"

# The white + yellow mark reads correctly on the deep-blue console ground.
# Matched by glob so a re-upload under a slightly different name still builds;
# to use a different variant, put its stem first.
LOGO_GLOBS = ["c_full_white_yellow*.png", "c_full_white*.png", "c_full_yellow*.png"]
LOGO_HEIGHT = 144          # 3x the 48px rendered height, for retina/projector

FONTS = [
    ("Poppins", 300, "Poppins-300.subset.woff2"),
    ("Poppins", 400, "Poppins-400.subset.woff2"),
    ("Poppins", 600, "Poppins-600.subset.woff2"),
    ("Poppins", 700, "Poppins-700.subset.woff2"),
]

PARTS = [
    "01-head.html",
    "02-css.html",
    "03-body.html",
]


def font_css() -> str:
    """@font-face blocks with the WOFF2 payloads inlined as data URIs."""
    out = []
    for family, weight, filename in FONTS:
        path = ROOT / "assets" / "fonts" / filename
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

    print(f"logo: {src.name}")
    im = Image.open(src).convert("RGBA")
    box = im.getchannel("A").getbbox()
    if box:
        im = im.crop(box)

    w = round(im.width * LOGO_HEIGHT / im.height)
    im = im.resize((w, LOGO_HEIGHT), Image.LANCZOS)

    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{b64}"


def main() -> None:
    html = "".join((SRC / p).read_text(encoding="utf-8") for p in PARTS)

    js = "\n".join(
        (SRC / p).read_text(encoding="utf-8") for p in ("04-content.js", "05-app.js")
    )
    html += "\n<script>\n" + js + "\n</script>\n</body>\n</html>\n"

    for token, value in (("/*__FONTS__*/", font_css()), ("/*__LOGO__*/", logo_data_uri())):
        if token not in html:
            sys.exit(f"token {token} not found in src/")
        html = html.replace(token, value)

    # Nothing may reach outside the file.
    leaks = re.findall(r'(?:src|href)\s*=\s*["\'](?!data:|#)([^"\']+)', html)
    leaks += re.findall(r'url\(\s*(?!["\']?data:)([^)]+)\)', html)
    if leaks:
        sys.exit("external reference(s) left in the build: " + ", ".join(sorted(set(leaks))))

    OUT.write_text(html, encoding="utf-8")
    print(f"built {OUT.relative_to(ROOT)}  ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
