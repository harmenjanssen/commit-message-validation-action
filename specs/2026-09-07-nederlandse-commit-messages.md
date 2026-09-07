# Nederlandse commit messages toestaan

`2026-09-07` · Harmen Janssen · TODO: PR-link

## Waarom

- De validatie leunt volledig op `wordpos`, een Engelse WordNet-database. Nederlandse imperatieven als "Voeg", "Herstel" en "Verwijder" worden categorisch geweigerd.
- Norday-teams schrijven Nederlandse commit messages. In die repo's is de action daardoor onbruikbaar.
- De validatie is nu niet consequent Engels, maar inconsistent: "Update de dependencies" en "Fix de bug" komen er wél doorheen omdat het werkwoord toevallig Engels is.
- Doen we niets, dan blijft de keuze: in het Engels schrijven of de validatie uitzetten.

## Scope

- **Wel:** een allowlist van Nederlandse imperatieven, die naast de bestaande Engelse check geldt.
- **Wel:** een foutmelding die bij een bijna-match het bedoelde werkwoord suggereert.
- **Niet:** de Engelse validatie wijzigen. `wordpos`, `VERB_EXCEPTIONS` en de `-ed`-heuristiek blijven ongemoeid — inclusief de bekende false positives op "Embed" en "Shed", die apart opgepakt worden.
- **Niet:** configuratie per repo. Beide talen zijn altijd geldig; er komt geen `language`-input.
- **Niet:** scheidbare werkwoorden controleren. "Voeg validatie toe" wordt beoordeeld op "Voeg"; of het partikel er staat toetsen we niet.

## Acceptatiecriteria

1. Een subject dat begint met een imperatief uit de Nederlandse lijst wordt geaccepteerd: "Voeg validatie toe", "Herstel de bug", "Verwijder dode code", "Werk de documentatie bij".
2. Elk subject dat vandaag geldig is, blijft geldig. Deze wijziging maakt niets ongeldig dat het nu niet al is.
3. Nederlandse voltooid deelwoorden worden geweigerd: "Toegevoegd", "Hersteld", "Verwijderd", "Bijgewerkt".
4. Een subject dat begint met een Nederlands zelfstandig naamwoord buiten de lijst wordt geweigerd: "Bugfix voor de tokenizer".
5. Ligt een geweigerd eerste woord dicht bij een woord uit een van beide lijsten, dan noemt de foutmelding die suggestie: "Fixed" → "Fix", "Verwijderd" → "Verwijder". Bij geen bijna-match blijft de melding zoals nu.
6. De overige regels blijven onveranderd gelden: maximaal 72 tekens, geen `!fixup`/`!squash`, hoofdletter aan het begin, versiecommits toegestaan.
7. De Nederlandse lijst staat in een eigen bestand, los van de validatielogica.
8. De testsuite dekt criteria 1 tot en met 5.

## Domeinmodel

- **Imperatief** — het eerste woord van het subject, in gebiedende wijs. Engels: elk woord dat WordNet als werkwoord kent, plus de uitzonderingenlijst. Nederlands: de werkwoordstam, uit een vaste lijst.
- Beide talen zijn gelijkwaardig. Een subject is geldig zodra het aan één van beide voldoet; er is geen voorkeurstaal en geen volgorde.

## Open vragen

- Welke werkwoorden komen in de Nederlandse lijst? Richtgetal is ~50. Voorzet, nog niet vastgesteld: Voeg, Herstel, Verwijder, Werk, Wijzig, Vervang, Verplaats, Hernoem, Maak, Zet, Haal, Los, Pas, Splits, Verbeter, Vereenvoudig, Documenteer, Implementeer, Introduceer, Schakel, Toon, Verberg, Voorkom, Gebruik, Draai, Test, Refactor, Herschrijf, Corrigeer, Update.
- Hoe ver mag een bijna-match afliggen voordat we beter kunnen zwijgen dan een verkeerd werkwoord suggereren?
- De false positives op "Embed" en "Shed" staan bewust buiten scope. Aparte spec, of laten we ze staan?
