Diplomarbeit 2022 Web Frontend Developer
========================================

## Abstract / Management Summary

[//]: # (todo: add summary at end of project)

## Setup Guide

[//]: # (todo: write setup as soon there is one and update comment)

## URL der lauffähigen Version

[//]: # (todo: add url of first prototype)

## Zeitplan / Meilensteine

### Vorbereitungen Planung

Als erstes erfolgt die Durchsicht der Vorlage. Dabei gehe ich Kopf die einzelnen
Elemente, Seiten sowie Inhalte durch und überlege mir wie der Aufbau – auch
Serverseitig – vonstattengehen soll, damit ich vorgängig vordefinierte Ziele und
Aufwandseinschätzungen festlegen kann.\
Da die Daten der Immobilien über GraphQL geladen werden und diese Daten
bereits extern verfügbar sind, lasse ich die Erstellung eines Backends vorerst
aussen vor.

### Zeitplanung

__Erläuterung__: Zeiten sind immer aufgerundet mit einer Stunde _(1h)_ als
kleinste Zeiteinheit. Zeiten mit Dauer über __3h__ sind runtergebrochen auf
Unteraufgaben mit einer Dauer unter _3h_.

- [ ] Grundsetup Webpack
    - [ ] Einrichtung gemäss bisheriger Struktur vom Kurs _1h_
    - [ ] Integration Templates gemäss Beispielen von Pascal _1h_
    - [ ] Einbau Rekursion in Templates _3h_
    - [ ] Logik Skripte
        - [ ] Standardskripte für alle Seiten. Eg. Grundfunktionalität wie
          Navi _1h_
        - [ ] Seitenspezifische Skripte. Eg. Ansichten, Home, Kontakt _1h_
    - Nachkonfiguration / Reserve Webpack _4h_
- [ ] Dateistrukturierung
    - [ ] Grundsetup
        - [ ] SCSS Grundaufbau. Eg. Reset, Variablendatei _1h_
        - [ ] Javascript Grundaufbau. Eg. Tools _1h_
        - [ ] HTML
            - [ ] Header _2h_
            - [ ] Footer _1h_
            - [ ] Inhaltsbereich _1h_
        - [ ] Zusammenstellung der Assets
            - [ ] Icons/SVGs _2h_
            - [ ] Bildwelten _2h_
    - Reserve _2h_
- [ ] Aufbau HTML-Templates
    - [ ] Home _3h_
    - [ ] Aktueles _1h_
    - [ ] Newsdetail _1h_
    - [ ] Objektdetail _1h_
    - [ ] Formular _1h_
    - [ ] Kontakt _1h_
    - Reserve _2h_
- [ ] Javaskriptfunktionalität
    - [ ] Hauptnavigation _3h_
        - [ ] 2nd Level
    - [ ] Scroll (Smooth?) _1h_
    - [ ] Filterung / Listenansicht
        - [ ] Switch ansichten _2h_
        - [ ] Filterung Objekte
            - [ ] Grundfilter _3h_
            - [ ] Filter Was, Wo, Sortierung, Art (kaufen, mieten) _3h_
        - [ ] Paginierung _3h_
        - [ ] Sortierung _2h_
    - [ ] Modal
        - [ ] Grundmodal _2h_
        - [ ] Implementierung Kontakt, Formmodal _2h_ mit Objektauswahl
    - [ ] Formularversand _2h_
    - [ ] Google map
        - [ ] Vordesign von [Snazzymaps](https://snazzymaps.com/) _1h_
        - [ ] Implementierung und Designanpassung mit neuem Pin _2h_
    - [ ] Slider _2h_
    - Reserve _4h_
- [ ] Frontendstyling
    - [ ] Header _1h_
    - [ ] Hauptnavigation _1h_
    - [ ] Footer _1h_
    - [ ] Strukturstyling (Headlines, Buttons, Formularfelder) _3h_
    - [ ] Home
        - [ ] Headerbild mit Teaser _1h_
        - [ ] Filterformular _3h_
        - [ ] Kachelansicht _1h_
        - [ ] Bildkachel _1h_
        - [ ] Listenansicht _2h_
    - [ ] Aktuelles
        - [ ] Bildteaser _2h_
        - [ ] Bildteaserlayout _1h_
    - [ ] Objektdetail
        - [ ] Slider _1h_
        - [ ] Detaillayout _2h_
        - [ ] Hintergrundblock _1h_
    - [ ] Newsdetail _2h_
    - [ ] Formular _3h_
        - [ ] Modal
    - [ ] Kontakt _1h_
    - Reserve _4h_
- [ ] Schlusstests
    - [ ] Chrome _1h_
    - [ ] Firefox _1h_
    - [ ] Safari _1h_
- [ ] Fixing 1st _8h_
- [ ] Benutzertest _Nur Funktionalität, kein UX_
  - [ ] Benutzer _2h_
- [ ] Fixing 2nd _2h_
- [ ] Dokuupdate _4h_

### Meilensteine

| Meilenstein                       | Geschätzt | Termin     | Abgeschlossen am | Aufwand |
|-----------------------------------|-----------|------------|------------------|---------|
| Grundsetup Webpack                | 13h       | 26.09.2022 |                  |         |
| Dateistrukturierung mit Demodaten | 13h       | 03.10.2022 |                  |         |
| Aufbau HTML-Templates             | 10h       | 08.10.2022 |                  |         |
| Javascriptfunktionalität          | 15h       | 17.10.2022 |                  |         |
| Frontendstyling                   | 31h       | 07.11.2022 |                  |         |
| Testing / Fixing (Crossbrowser)   | 11h       | 14.11.2022 |                  |         |
| Testing "User" / Fixing           | 4h        | 21.11.2022 |                  |         |
| Letzte Anpassungen an der Doku    | 4h        | 21.11.2022 |                  |         |
| Abgabe Diplomarbeit               | 1h        | 27.11.2022 |                  |         |

## Technologiekonzept inkl. Evaluation der eingesetzten Technologien, Begründung

### Versionierungsnachrichten

Die Commits sind in Englisch und nach folgenden Schema angelegt:

```
<type>: <description>
```

`<type>`

| Typ    | Bedeutung                                            |
|--------|------------------------------------------------------|
| feat   | Hinzufügen neuer Funktionen                          |
| fix    | Reparatur von Bugs im Code                           |
| hotfix | __Nicht nachhaltig__ behobener Bug. Zukünftiges Todo |
| clan   | Aufräumarbeiten im Code. Refaktorierung, Einrückung. |

`<description>`

Der Beschrieb erfolgt immer mit Verb im Imperativ und dem erledigten Task.

```
fix inequality in society
remove world hunger
apply anarchism in the UK
```

[//]: # (todo: add section about usage)

## Technische Dokumentation bei Eigenleistungen

[//]: # (todo: write whatever i did myself and maybe update comment)

## Zusammenfassung und Ausblick, persönliche Anmerkungen

Ziel dieses Kurses ist für mich in erster Linie Grundlagen nachzuholen und mich
– hauptsächlich im Hinblick auf Javascript – nicht auf Bibliotheken und
Frameworks zu verlassen. Da ich allerdings in der Media Motion AG als
Frontendentwickler arbeite, erlaube ich mir das Linting zu übernehmen. Zwar bin
ich für den grössten Teil der Implementation des Lintings verantwortlich, da es
allerdings nicht im Zuge der Diplomarbeit zustande gekommen ist, deklariere ich
es hiermit als _halb halb_.

## Literaturverzeichnis, Quellenangaben bei Nutzung von externem Code

[//]: # (todo: update source information regularly)

## Eidesstattliche Erklärung

Hiermit erkläre ich, dass ich die Diplomarbeit selbständig verfasst /
programmiert und keine anderen als die angegebenen Quellen und Hilfsmittel
benutzt und die aus fremden Quellen direkt oder indirekt übernommenen Gedanken
als solche kenntlich gemacht habe. Die Arbeit habe ich bisher keinem anderen
Prüfungsgremium in gleicher oder vergleichbarer Form vorgelegt. Sie wurde bisher
auch nicht veröffentlicht.
