#!/usr/bin/env python3
"""
Regenerate the Poppins WOFF2 subsets in assets/fonts/ from the full TTFs.

    pip install fonttools brotli
    python3 tools/subset-fonts.py path/to/unzipped/Poppins

Only needed when the set of weights changes. The console builds from the
committed .subset.woff2 files, so a normal build does not require this.

Poppins is licensed under the SIL Open Font Licence 1.1, which permits
embedding. The licence text is kept alongside the fonts in assets/fonts/OFL.txt.
"""

import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEST = ROOT / "assets" / "fonts"

# Latin + Latin-Ext, plus the punctuation and symbols the console actually
# sets. Poppins carries no arrow glyphs, which is why the presenter arrows
# are drawn as SVG rather than typed.
UNICODES = ",".join([
    "U+0020-007E", "U+00A0-00FF", "U+0100-017F",
    "U+2013", "U+2014", "U+2018", "U+2019", "U+201C", "U+201D",
    "U+2022", "U+2026", "U+2030", "U+2039", "U+203A", "U+20AC",
    "U+00B7", "U+00B0", "U+00D7", "U+2212",
])

WEIGHTS = [("Light", 300), ("Regular", 400), ("SemiBold", 600), ("Bold", 700)]


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__.strip())
    src = pathlib.Path(sys.argv[1])
    DEST.mkdir(parents=True, exist_ok=True)

    for style, weight in WEIGHTS:
        ttf = src / f"Poppins-{style}.ttf"
        if not ttf.exists():
            sys.exit(f"missing {ttf}")
        out = DEST / f"Poppins-{weight}.subset.woff2"
        subprocess.run([
            "pyftsubset", str(ttf),
            f"--unicodes={UNICODES}",
            "--layout-features=kern,liga,tnum,onum,frac",
            "--flavor=woff2",
            f"--output-file={out}",
        ], check=True)
        print(f"{out.name}  {out.stat().st_size / 1024:.1f} KB")

    ofl = src / "OFL.txt"
    if ofl.exists():
        (DEST / "OFL.txt").write_bytes(ofl.read_bytes())
        print("OFL.txt copied")


if __name__ == "__main__":
    main()
