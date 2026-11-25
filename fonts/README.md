# Fonts

All fonts here are embedded so the site, the live preview and the PDF work offline and without loading anything from other sites.
Each family is licensed under the SIL Open Font License 1.1 (see `<family>/LICENSE`). Files are the Hebrew and Latin `woff2` subsets published by [Fontsource](https://fontsource.org).

Handwriting: Gveret Levin, Playpen Sans Hebrew, Amatic SC, Karantina.
Print: Varela Round, Rubik, Fredoka, Heebo, Assistant, Alef, Secular One, Suez One, Frank Ruhl Libre, David Libre, Bellefair, Miriam Libre.

`vendor/` holds html2canvas 1.4.1 and jsPDF 2.5.1 (both MIT, licenses next to them).

# Icons

`icons/emoji.js` holds the Noto Emoji artwork (Apache-2.0, Google; taken from the `@iconify-json/noto` package, license in `icons/`) for every emoji a card can show, as data-URI SVG images. Card stars, hearts, flowers, the moon, the burst and the garden sprigs are drawn as inline SVG in `app.js`. Cards, the PDF and printing therefore never depend on the device's emoji or symbol fonts; an emoji typed by a parent that is not in the set is left out of the card.
