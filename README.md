Diplomarbeit 2022 Web Frontend Developer
========================================

## Abstract / Management Summary

[//]: # (todo: add summary at end of project)

## Setup Guide

### Grundinstallation

```shell
npm install
```

### Nodeskripte

| Befehl          | Auswirkung                                                           |
|-----------------|----------------------------------------------------------------------|
| `start`         | Startet den Webpackdevserver mit Beobachtung der Dateien             |
| `build`         | Build der Seiten und Assets gemäss _webpack.prod.js_                 |
| `build:dev`     | Build der Seiten und Assets gemäss _webpack.dev.js_                  |
| `deploy`        | Build der Seiten und anschliessend des Skripts _gh-pages_            |
| `ghpages`       | Erstellt den Branch ghpages und pusht diesen auf Github              |
| `ghpages:doc`   | Erzeugt die Dokumentationsseiten für die Javaskriptcodedokumentation |
| `debug`         | Startet ndb via nodemon                                              |
| `lint:js`       | Linting der Javascriptdateien                                        |
| `lint:js:fix`   | Linting der Javascriptdateien mit Korrektur                          |
| `lint:scss`     | Linting der Stylesheets                                              |
| `lint:scss:fix` | Linting der Stylesheets mit Korrektur                                |
| `lint`          | Linting der Javascript und Stylesheets mit Korrektur                 |

### Seitenstruktur

Neue Seiten können unter _src/pages/_ angelegt werden. Es wird auch eine Baumstruktur der Seiten als Objekt mitgegeben.\
Um die Seiten in eine bestimmte "Reihenfolge" zu bringen, kann ein Präfix im Dateinamen hinzugefügt werden. Die Seite
kann mit vorangestelltem Underline `_` als versteckt markiert werden. Zusätzliche Daten werden mit einer _JSON_-Datei
eingebunden. Die Präfixe werden für die URLs entfernt.

__Aufbau gemäss Ansicht:__

```
├── 010_aktuelles.twig
├── 020_kontakt.twig
├── 030_objekt.twig
├── _index.json
├── _index.twig
├── _newsdetail.twig
├── moresub
│       └── another.twig
└── sub
    ├── sub.twig
    └── subsub
        └── subsub.twig
```

#### Zusätzliche Daten für die Seiten

Um einer Seite zusätzliche Daten mitzugeben, kann eine _JSON_-Datei hinterlegt werden, welche denselben Namen hat wie
die Seite. Es können auch Attribute überschrieben werden, wie z.B. das `title`-Tag.

__Beispiel an einem Newseintrag:__

```json
{
    "title": "Grossprojekt Home & House",
    "image": "/src/assets/images/aktuelles/aktuelles_01.jpeg",
    "date": "2021-08-01",
    "teaserTitle": "Home & House News",
    "teaser": "Grossprojekt Home & House nimmt Gestalt an. Es entstehen ..."
}
```

#### Skripte nur für spezifische Seiten

Um Skripte nur für eine einzelne Seite anzugeben, wird eine Javascriptdatei im Skriptordner _src/js/pages_ unter dem
gleichen Namen wie die Seite angelegt. Die Javascriptdatei wird dann als zusätzlicher _Chunk_ beim Build eingepflegt.\
Um beispielsweise für die Seite *src/pages/010_aktuelles/_001_grossprojekt-home-house.twig* ein eigenes Skript zu ladenb
wird die Datei *src/js/pages/010_aktuelles/_001_grossprojekt-home-house.js* angelegt.

[//]: # (todo: does the order of files being read depend on the host?)

[//]: # (todo: write setup as soon there is one and update comment)

## URL der lauffähigen Version

[dipl22mac.netlify.app][preview]

## Zeitplan / Meilensteine

### Vorbereitungen Planung

Zuerst habe ich die Vorlage gesichtet. Dabei bin ich im Kopf die einzelnen Elemente, Seiten sowie Inhalte
durchgegangen und habe mir überlegt, wie der Aufbau – auch serverseitig – vonstattengehen soll, damit ich vorgängig
definierte Ziele und Aufwandseinschätzungen festlegen konnte.\
Da die Daten der Immobilien über _GraphQL_ geladen werden und diese Daten bereits extern verfügbar sind, habe ich die
Erstellung eines Backends aussen vor gelassen.

### Zeitplanung

__Erläuterung__: Die Zeiten sind immer aufgerundet mit einer Stunde (1h) als kleinste Zeiteinheit. Zeiten mit Dauer
über __3h__ sind heruntergebrochen auf Unteraufgaben mit einer Dauer unter 3h.

- [x] Grundsetup Webpack
    - [x] Einrichtung gemäss bisheriger Struktur des Kurses _1h_
    - [x] ~~Integration Templates gemäss Beispielen von Pascal _1h_~~\
      Integration Twig
    - [x] ~~Einbau Rekursion in Templates _3h_~~\
      Integration Seitenstruktur Twig
    - [x] Logik Skripte
        - [x] Standardskripte für alle Seiten. Z.B. Grundfunktionalität wie Navi _1h_
        - [x] Seitenspezifische Skripte. Z.B. Ansichten, Home, Kontakt _1h_
    - Nachkonfiguration / Reserve Webpack _4h_
- [x] Dateistrukturierung
    - [x] Grundsetup
        - [x] SCSS Grundaufbau. Z.B. Reset, Variablendatei _1h_
        - [x] Javascript Grundaufbau. Z.B. Tools _1h_
        - [x] HTML
            - [x] Header _2h_
            - [x] Footer _1h_
            - [x] Inhaltsbereich _1h_
        - [x] Zusammenstellung der Assets
            - [ ] ~~Icons/SVGs _2h_~~
            - [x] Bildwelten _2h_
    - Reserve _2h_
- [x] Aufbau HTML-Templates
    - [x] Home _3h_
    - [x] Aktuelles _1h_
    - [x] Newsdetail _1h_
    - [x] Objektdetail _1h_
    - [x] Formular _1h_
    - [x] Kontakt _1h_
    - Reserve _2h_
- [ ] Javaskriptfunktionalität
    - [x] Hauptnavigation _3h_
        - [ ] 2nd Level
    - [x] Scroll (Smooth) _1h_
    - [ ] Filterung / Listenansicht
        - [x] Wechsel zwischen den Ansichten _2h_
        - [x] Filterung Objekte
            - [x] Grundfilter _3h_
            - [x] Filter: Was, Wo, Sortierung, Art (kaufen, mieten) _3h_
        - [ ] Paginierung _3h_
        - [x] Sortierung _2h_
    - [ ] Modal
        - [x] Grundmodal _2h_
        - [ ] Implementierung Kontakt, Formmodal _2h_ mit Objektauswahl
    - [ ] Formularversand _2h_
    - [ ] Google Maps
        - [ ] Vordesign von [Snazzymaps][roadmap :: snazzymaps] _1h_
        - [x] Implementierung und Designanpassung mit neuem Pin _2h_
    - [x] Slider _2h_
    - Reserve _4h_
- [ ] Frontendstyling
    - [x] Header _1h_
    - [x] Hauptnavigation _1h_
    - [x] Footer _1h_
    - [x] Strukturstyling (Headlines, Buttons, Formularfelder) _3h_
    - [x] Home
        - [x] Headerbild mit Teaser _1h_
        - [x] Filterformular _3h_
        - [x] Kachelansicht _1h_
        - [x] Bildkachel _1h_
        - [x] Listenansicht _2h_
    - [x] Aktuelles
        - [x] Bildteaser _2h_
        - [ ] Bildteaserlayout _1h_
    - [ ] Objektdetail
        - [x] Slider _1h_
        - [x] Detaillayout _2h_
        - [x] Hintergrundblock _1h_
    - [x] Newsdetail _2h_
    - [x] Formular _3h_
        - [ ] Modal
    - [x] Kontakt _1h_
    - Reserve _4h_
- [ ] Schlusstests
    - [ ] Chrome _1h_
    - [ ] Firefox _1h_
    - [ ] Safari _1h_
- [ ] Fixing 1st _8h_
- [ ] Benutzertest (nur Funktionalität, kein UX)
    - [ ] Benutzer _2h_
- [ ] Fixing 2nd _2h_
- [ ] Dokuupdate _4h_

### Meilensteine

| Meilenstein                       | Geschätzt | Termin     | Abgeschlossen am | Aufwand |
|-----------------------------------|-----------|------------|------------------|---------|
| Grundsetup Webpack                | 13h       | 26.09.2022 | 27.09.2022       | ca. 16h |
| Dateistrukturierung mit Demodaten | 13h       | 03.10.2022 | 02.10.2022       | ca. 12h |
| Aufbau HTML-Templates             | 10h       | 08.10.2022 | 09.10.2022       | ca. 16h |
| Javascriptfunktionalität          | 15h       | 17.10.2022 | 22.10.2022       | ca. 24h |
| Frontendstyling                   | 31h       | 07.11.2022 | 14.11.2022       | ca. 40h |
| Testing / Fixing (Crossbrowser)   | 11h       | 14.11.2022 |                  |         |
| Testing "User" / Fixing           | 4h        | 21.11.2022 |                  |         |
| Letzte Anpassungen an der Doku    | 4h        | 21.11.2022 |                  |         |
| Abgabe Diplomarbeit               | 1h        | 27.11.2022 |                  |         |

## Technologiekonzept inkl. Evaluation der eingesetzten Technologien, Begründung

### [Node][technology :: node :: homepage] und [npm][technology :: npm :: homepage]

Node habe ich verwendet, um verschiedene Skripte/Module (z.B. _ghpages_, _twig_, _eslint_ etc.) im Projekt einsetzen zu
können. _NPM_ ermöglicht es, die eingesetzen Technologien einfach mit dem Projekt "mitzuführen" und bei Bedarf zu
installieren.

### [Deepl][technology :: translation :: deepl]

Deepl habe ich verwendet, um [falsche Freunde][technology :: translation :: friends] zu vermeiden.

### [Webpack][technology :: webpack]

_Webpack_ habe ich aufgrund der Anforderungen des Kurses verwendet. Weitere Vorteile von Webpack sind:

- ermöglicht _Cachebusting_ ohne manuelles Eingreifen
- ermöglicht eine Optimierung der Dateien (hauptsächlich Bilddateien) beim Durchgang
- besitzt eine ausführliche\* Doku
- die weite Verbreitung des Tools ermöglicht eine einfach(ere) Hilfestellung (z.B. Recherche bei Problemen)

*Die Doku ist zwar recht ausführlich aber – teilweise – sehr schwer verständlich.

### [NDB][technology :: ndb]

Da das Debugging der Nodeskripte recht mühsam war, begab ich mich auf die Suche nach einem Debugger, bei dem ich
Haltepunkte setzen konnte, analog _Xdebug_. Hauptgrund für den Einsatz von NDB war meine Familiarität mit den
Entwicklertools von Chrome.

### [twig-html-loader][technology :: twig html loader]

Ursprüngliche Idee war, die Templates über die im Kurs angesprochene Methode (Suchen/Ersetzen) zu erstellen. Da ich aber
voraussichtlich auf einen Rattenschwanz von Problemen gestossen wäre – Rekursion mit Abbruchbedingungen, Übergabe der
Daten an die Templates – habe ich mich auf eine vorhandene Lösung besonnen. Als Alternative wäre noch _Nunjucks_ in
Frage
gekommen.\
_Nachtrag_: Zwischenzeitlich würde ich wohl eher Nunjucks einsetzen, da näher an Node.

### [normalise.css][technology :: normalise.css]

Dieses Tool habe ich eingesetzt, um die Stile in den verschiedenen Browsern zu normalisieren. Alternativ wäre auch ein
Reset in Frage gekommen. Der Vorteil eines Resets ist auch, dass fehlende Stile schneller ersichtlich sind. Persönlich
ist mir eine Normalisierung lieber, da so die Titel noch als solche angezeigt werden und ersichtlich sind. In dieser
Hinsicht gebe ich der visuellen Semantik den Vorzug.

### Versionierungsnachrichten

Die Commits sind in Englisch und nach folgendem Schema angelegt:

```
<type>: <description>
```

`<type>`

| Typ    | Bedeutung                                            |
|--------|------------------------------------------------------|
| feat   | Hinzufügen neuer Funktionen                          |
| fix    | Reparatur von Bugs im Code                           |
| hotfix | __Nicht nachhaltig__ behobener Bug, zukünftiges Todo |
| clean  | Aufräumarbeiten im Code, Refaktorierung, Einrückung  |
| doc    | Reine Dokumentationsarbeiten                         |

`<description>`

Der Beschrieb erfolgt immer mit Verb im Imperativ und dem erledigten Task.

```
fix inequality in society
remove world hunger
apply anarchism in the UK
```

[//]: # (todo: add section about usage)

## Technische Dokumentation bei Eigenleistungen

### Javascriptdokumentation

#### Zum Gesamtaufbau

Primär war es mir ein Anliegen die Skripte so zu schreiben, dass der Einsatz auch andernorts möglichst einfach
vonstattengeht und bei späteren Anpassungen unkompliziert Funktionen erweitert, angepasst oder neu hinzugefügt
werden können.

Die drei wichtigsten Module sind nachfolgend grob umschrieben. In einem realen Projekt würde ich diese allerdings so
nicht verwenden, sondern auf Bibliotheken oder Frameworks zurückgreifen. Eine detailliertere Dokumentation ist als _
JSDoc_ zu
finden unter:

[Javascript im Frontend][preview :: doc :: frontend] \
[Javascript Node][preview :: doc :: backend]

##### PageCollection.js

__Info: Dieses Modul hat den Nachteil, dass nach dem Neuanlegen einer Seite, Webpack nochmals gestartet werden muss. Da
dies
nach Rückfrage eigentlich ein Bastel ist, würde ich dies in einem Projekt so nicht einsetzen.__

Die Logik für die Benamsung der Dateien habe ich mir von CMS wie [grav][tech doc :: grav] und _Static Site Generatoren_
wie [11ty][tech doc :: 11ty] abgeschaut.

Ich habe in der Annahme angefangen, dass ich früher oder später so oder so in die Situation kommen werde, Templates
nachträglich anpassen zu müssen. Dies hätte auch bedeutet, einige Verlinkungen auf den Seiten in der Hauptnavigation
oder – und dies war der Primärgedanke – Verlinkungen auf Unterseiten korrigieren zu müssen. Um die Fehleranfälligkeit
etwas zu
reduzieren, habe ich die Klasse `PageCollection` aufgebaut. Diese sammelt die Files im Ordner _src/pages_, erstellt
daraus eine "Seitenstruktur" und eine "Hauptnavigation" als Objekt und generiert und auch die nötigen Informationen, um
dem _html-loader_ die entsprechende Quell- und Zieldatei mitzugeben.

Aus diesen Informationen wird die Hauptnavigation und die Auflistung der Nachrichteneinträge generiert.

Dieser Aufbau ermöglicht es mir auch in Kombination mit einer Templatesprache (in diesem Fall Twig), über eine _JSON_
-Datei dem Template weitere Information mitzugeben, wie z.B. Übersichtsbild, Teasertexte, Datum oder _Title_tags.

##### Template.js

Auch hier ist es ein Versuch, die Funktion zum Generieren der Einzelelemente (z.B. Immobilienelement) vom hart
hinterlegten Markup zu trennen, bzw. das Markup ausserhalb des generierenden Objekts zu haben. Tabellen und
Kachelansichten können so im einem `template`-Tag hinterlegt werden. Bei der Initialisierung wird ein Element erzeugt,
bei dem die anpassbaren Teile – das Attribut _data-template_ – in einem Array zwischengespeichert werden. Beim Erzeugen
eines neuen Elements muss ein Objekt mit den entsprechenden Schlüsselwertpaaren übergeben werden. Korrelierende Werte
zwischen Objektschlüssel und dem Wert des Attributs werden dann vor dem Generieren des neuen Elements ersetzt.

Beispiel Basismarkup:

```html

<ul>
    <template>
        <li data-template="title"></li>
    </template>
</ul>
```

Beispielinitialisierung:

```javascript
const el = document.querySelector('template');
const template = new Template(el);
const listItem = template.create({
    'title': 'I am a list item',
});
document.querySelector('ul').appendChild(listItem);
```

Erzeugter Ast:

```html

<ul>
    <li>I am a list Item</li>
</ul>
```

##### CustomSelect

Auch hier handelt es sich wieder um eine Klasse, welche ich so nicht in einem Projekt einsetzen würde, bzw. bei der ich
auf ein vorhandenes Modul setzen würde. Aber gerade die scheinbar einfache Anforderung eines Selektmenüs mit eigenem
Styling
stellt eine überraschend interessante Herausforderung dar.\

Um die Werte nach einem Optionsupdate im Frontend synchron zu halten, besitzt die Klasse eine Renderfunktion. Diese wird
auch nach der Initialisierung aufgerufen, nachdem aus dem Markup des ursprünglichen Selektelements ein
Konfigurationsobjekt generiert wurde. Ausserdem wird ein _Changeevent_ auf dem Original ausgelöst, um allfällige andere
Plugins zu
alarmieren, welche einen Listener auf dem Element haben.

Um das Styling zu erweitern bzw. zurückzusetzen, kann das Optionsobjekt mit der Property _namespace_ übergeben werden.
Diese Property wird als Basisklasse genutzt für die CSS-Klassen.

Beispiel Basismarkup:

```html

<select name="ref_type_id" id="ref_type_id" tabindex="1">
    <option value="">Alle</option>
    <option value="1">Haus</option>
    <option value="2">Wohnung</option>
</select>
```

Beispielinitialisierung:

```javascript
const el = document.querySelector('#ref_type_id');
new CustomSelect(el);
```

Erzeugter Ast:

```html
<select name="ref_type_id"
        id="ref_type_id"
        data-filter-type="filter"
        class="custom-select-original"
        aria-hidden="true"
        tabindex="-1">
    <option value="">Alle</option>
    <option value="1">Haus</option>
    <option value="2">Wohnung</option>
</select>
<dl class="custom-select" tabindex="0">
    <dt class="custom-select__label">
        <span class="custom-select__label-inner">Alle</span><span class="custom-select__label-icon"></span></dt>
    <dd class="custom-select__options">
        <ul role="listbox" tabindex="0" class="custom-select__options-inner">
            <li data-value="" class="custom-select__option" role="option" aria-selected="true">Alle</li>
            <li data-value="1" class="custom-select__option" role="option" aria-selected="false">Haus</li>
            <li data-value="2" class="custom-select__option" role="option" aria-selected="false">Wohnung</li>
        </ul>
    </dd>
</dl>
```

[//]: # (todo: write whatever i did myself and maybe update comment)

## Zusammenfassung und Ausblick, persönliche Anmerkungen

Ziel dieses Kurses war für mich in erster Linie Grundlagen nachzuholen und mich – hauptsächlich in Hinblick auf
Javascript – nicht auf Bibliotheken und Frameworks verlassen zu müssen. Da ich allerdings bereits als Frontendentwickler
arbeite, habe ich mir erlaubt, das Linting der Media Motion AG (bei der ich arbeite) zu übernehmen.
Für den grössten Teil der Implementation dieses Lintings (primär Stylelinting) bin ich selber verantwortlich.

Gleiches gilt für die Funktion aus _tools.js_:

- _mapOptions_

### Abweichungen von der Vorlage

- __`line-height` Schriften:__ Bei übergrossen Zeilenabständen habe ich mir erlaubt von der Vorlage abzuweichen. Sofern
  ein ähnlicher Font – gleiche Schriftgrösse, gleiche Familie – mit akzeptablem Zeilenabstand _(Titel 1.1 bis 1.3,
  Laufschrift 1.3 bis 1.8)_ vorhanden war, habe ich diesen übernommen.\
  Angaben ohne Einheiten wegen der [Vererbung][comment :: css :: line-height inheritance].
- __Abstände zwischen den *label*- und *input*-Feldern:__ Da ich die Felder mit den Bezeichnungen optisch nur sehr ungut
  zuteilen konnte, habe ich die Abstände etwas angepasst, um die Trennung der Blöcke besser ersichtlich zu machen.
- __Ausrichtung Hauptnavigation:__
    - Die Abstände links und rechts sind angeglichen statt verschieden.
    - Die Elemente (Button, Logo) sind vertikal aneinander ausgemittet.
- __Ausrichtung Footer:__ Die Flucht des Footers ist auf den Rest des Inhalts angepasst.

## Literaturverzeichnis, Quellenangaben bei Nutzung von externem Code

[//]: # (todo: update source information regularly)

### Erweiterung

#### Node

[Ersten Buchstaben in Grossschreibung konvertieren][sources :: node :: uppercase first letter of string]\
Genutzt in der _PageCollection_ um aus dem Dateinamen eine Art Seitentitel zu generieren.

### Fix

#### Node

[Fehler: `__dirname is not defined in ES module scope`][sources :: node :: dirname not in es scope]\
Beim Build bei Nutzung von `__dirname` nach dem Umstellen und Umbau auf `"type": "module"`.

[Fehler: `Parsing error: Unexpected token import`][sources :: eslint :: parsing error: unexpected token import]\
Beim Linting von _webpack.common.js_ und _webpack.dev.js_ Umstellung des im _eslintrc.json_ auf `"ecmaVersion": 11`
nötig. Für dieses Projekt war diese Anpassung nicht weiter von Belang aber ansonsten würde ich wohl das File auf die
Ignoreliste setzen.\
Falls das Linting aber nötig ist __und__ die Parseoptionen aus irgendeinem Grund auf einer älteren Version
basieren müssen, wäre der Import über eine externe Datei – welche auf der Ignoreliste steht –
gemäss [dieser Antwort][sources :: eslint :: parsing error: unexpected token import :: answer] noch überlegenswert.

[Fehler: `[HMR] Update failed: ChunkLoadError: Loading hot update chunk app failed.`][sources :: webpack :: chunk load error]\
Fehler in der Browserconsole. Anpassung gemäss Frage
auf [Stack Overflow][sources :: webpack :: chunk load error :: answer]

#### HTML

[Regulärer Ausdruck Telefonnummber][sources :: html :: regex phone number]

#### Javascript

[Konvertierung Camelcase zu Kebabcase][sources :: javascript :: camel to kebab] innerhalb der _tools.js_

## Eidesstattliche Erklärung

Hiermit erkläre ich, dass ich die Diplomarbeit selbständig verfasst / programmiert und keine anderen als die angegebenen
Quellen und Hilfsmittel benutzt und die aus fremden Quellen direkt oder indirekt übernommenen Gedanken als solche
kenntlich gemacht habe. Die Arbeit habe ich bisher keinem anderen Prüfungsgremium in gleicher oder vergleichbarer Form
vorgelegt. Sie wurde bisher auch nicht veröffentlicht.

[preview]: https://dipl22mac.netlify.app

[preview :: doc :: frontend]: https://dipl22mac-jsdoc-frontend.netlify.app/

[preview :: doc :: backend]: https://dipl22mac-jsdoc-backend.netlify.app/

[roadmap :: snazzymaps]: https://snazzymaps.com/

[technology :: node :: homepage]: https://nodejs.org/en/

[technology :: npm :: homepage]: https://www.npmjs.com/

[technology :: translation :: deepl]: https://www.deepl.com/translator

[technology :: translation :: friends]: https://de.wikipedia.org/wiki/Falscher_Freund

[technology :: webpack]: https://webpack.js.org/

[technology :: ndb]: https://github.com/GoogleChromeLabs/ndb#readme

[technology :: twig html loader]: https://github.com/radiocity/twig-html-loader#readme

[technology :: normalise.css]: https://github.com/necolas/normalize.css

[tech doc :: grav]: https://getgrav.org/

[tech doc :: 11ty]: https://www.11ty.dev/

[sources :: node :: dirname not in es scope]:
https://bobbyhadz.com/blog/javascript-dirname-is-not-defined-in-es-module-scope#:~:text=The%20__dirname%20or%20__,directory%20name%20of%20the%20path.

[sources :: node :: uppercase first letter of string]:
https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript

[sources :: eslint :: parsing error: unexpected token import]: https://stackoverflow.com/a/65541635

[sources :: eslint :: parsing error: unexpected token import :: answer]: https://stackoverflow.com/a/58646219

[sources :: webpack :: chunk load error]: https://stackoverflow.com/a/65541635

[sources :: webpack :: chunk load error :: answer]: https://stackoverflow.com/a/66197410

[sources :: html :: regex phone number]: https://ihateregex.io/expr/phone/

[sources :: javascript :: camel to kebab]: https://javascript.plainenglish.io/from-camel-case-to-dash-syntax-in-javascript-c685206ee682

[comment :: css :: line-height inheritance]:
https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#prefer_unitless_numbers_for_line-height_values
