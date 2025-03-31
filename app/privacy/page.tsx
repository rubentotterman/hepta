export default function PrivacyPolicy() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Personvernerklæring for Hepta AS</h1>

      <div className="prose prose-invert max-w-none">
        <h2>1. Innledning</h2>
        <p>
          Hepta AS, organisasjonsnummer 934762002 ("vi", "oss", "vår"), er ansvarlig for behandlingen av
          personopplysninger som samles inn gjennom vår nettside. Denne personvernerklæringen beskriver hvordan vi
          samler inn, bruker og beskytter dine personopplysninger i samsvar med personvernforordningen (GDPR) og norsk
          personvernlovgivning.
        </p>

        <h2>2. Hvilke personopplysninger vi samler inn</h2>
        <p>Vi samler inn følgende personopplysninger:</p>
        <ul>
          <li>
            Kontaktskjema: Navn, e-postadresse og innholdet i meldinger som sendes via kontaktskjemaet på nettsiden.
          </li>
          <li>Kundeportal: Informasjon relatert til fakturaer og betalinger for eksisterende kunder.</li>
          <li>
            Tekniske data: Informasjon om hvordan du bruker nettsiden, inkludert IP-adresse, nettlesertype, enhetstype
            og informasjonskapsler (cookies) for sesjonshåndtering.
          </li>
        </ul>

        <h2>3. Formålet med behandlingen av personopplysninger</h2>
        <p>Vi behandler dine personopplysninger for følgende formål:</p>
        <ul>
          <li>Å svare på henvendelser sendt via kontaktskjemaet.</li>
          <li>Å administrere kundeforhold, inkludert fakturering og betalingshåndtering.</li>
          <li>Å gi tilgang til kundeportalen og TikTok analytics dashboard.</li>
          <li>Å forbedre og tilpasse nettsidens funksjonalitet og brukeropplevelse.</li>
          <li>Å overholde lovpålagte forpliktelser, som regnskapslovgivning.</li>
        </ul>

        <h2>4. Rettslig grunnlag for behandling</h2>
        <p>Vi behandler dine personopplysninger basert på følgende rettslige grunnlag:</p>
        <ul>
          <li>
            Avtale: Når behandlingen er nødvendig for å oppfylle våre forpliktelser i henhold til en avtale med deg.
          </li>
          <li>
            Berettiget interesse: Når vi har en berettiget interesse i å behandle opplysningene, for eksempel for å
            forbedre tjenestene våre eller for sikkerhetsmessige formål.
          </li>
          <li>
            Samtykke: I tilfeller der vi ber om ditt samtykke til behandling av personopplysninger, for eksempel for
            markedsføringsformål.
          </li>
          <li>Rettslige forpliktelser: Når behandlingen er nødvendig for å overholde lovpålagte forpliktelser.</li>
        </ul>

        <h2>5. Informasjonskapsler (cookies)</h2>
        <p>
          Vår nettside bruker informasjonskapsler (cookies) for sesjonshåndtering. Dette er små tekstfiler som lagres på
          din enhet når du besøker nettsiden. Vi bruker kun nødvendige informasjonskapsler for å sikre at nettsiden
          fungerer optimalt.
        </p>

        <h2>6. Deling av personopplysninger</h2>
        <p>Vi deler personopplysninger med følgende tredjeparter:</p>
        <ul>
          <li>Stripe: For behandling av betalinger.</li>
          <li>TikTok API: For å levere analytics-tjenester.</li>
          <li>Supabase: For sikker lagring og håndtering av data.</li>
        </ul>
        <p>
          Disse tjenesteleverandørene behandler data på våre vegne og i samsvar med våre instruksjoner. De har ikke
          tillatelse til å bruke dataene til andre formål enn å levere tjenester til oss.
        </p>
        <p>
          Vi deler ikke dine personopplysninger med andre tredjeparter med mindre vi er rettslig forpliktet til det.
        </p>

        <h2>7. Datalagring og sikkerhet</h2>
        <p>
          Vi tar sikkerhet på alvor og implementerer passende tekniske og organisatoriske tiltak for å beskytte dine
          personopplysninger mot uautorisert tilgang, endring, offentliggjøring eller ødeleggelse.
        </p>
        <p>For sikker lagring og kryptering av data benytter vi Supabase, som tilbyr robuste sikkerhetsløsninger.</p>

        <h2>8. Lagringstid</h2>
        <p>
          Vi oppbevarer dine personopplysninger kun så lenge det er nødvendig for å oppfylle formålene beskrevet i denne
          personvernerklæringen, eller så lenge vi er pålagt å lagre dem i henhold til gjeldende lovgivning.
        </p>
        <ul>
          <li>Kontaktskjemainformasjon oppbevares til henvendelsen er besvart og eventuell oppfølging er fullført.</li>
          <li>Kundeinformasjon og fakturaopplysninger oppbevares i samsvar med regnskapslovens krav (normalt 5 år).</li>
        </ul>
        <p>
          Når opplysningene ikke lenger er nødvendige for formålene de ble samlet inn for, vil vi slette eller
          anonymisere dem på en sikker måte.
        </p>

        <h2>9. Dine rettigheter</h2>
        <p>I henhold til personvernforordningen har du følgende rettigheter:</p>
        <ul>
          <li>
            Rett til innsyn: Du har rett til å få informasjon om hvilke personopplysninger vi har om deg og hvordan de
            behandles.
          </li>
          <li>Rett til retting: Du har rett til å få uriktige personopplysninger om deg rettet.</li>
          <li>Rett til sletting: Under visse omstendigheter har du rett til å få dine personopplysninger slettet.</li>
          <li>
            Rett til begrensning av behandling: Under visse omstendigheter har du rett til å kreve at behandlingen av
            dine personopplysninger begrenses.
          </li>
          <li>
            Rett til dataportabilitet: Du har rett til å motta personopplysninger om deg selv i et strukturert,
            alminnelig anvendt og maskinlesbart format.
          </li>
          <li>
            Rett til å protestere: Du har rett til å protestere mot behandling av dine personopplysninger basert på
            berettiget interesse eller direkte markedsføring.
          </li>
        </ul>

        <h2>10. Prosess for utøvelse av dine rettigheter</h2>
        <p>Vi har etablert en formell prosess for å håndtere forespørsler knyttet til dine personvernrettigheter:</p>

        <h3>10.1 Slik sender du en forespørsel</h3>
        <p>Du kan sende inn forespørsler om dine rettigheter gjennom følgende kanaler:</p>
        <ul>
          <li>
            E-post:{" "}
            <a href="mailto:hey@hepta.biz" className="text-orange-500 hover:text-orange-400">
              hey@hepta.biz
            </a>
          </li>
          <li>Kontaktskjemaet på vår nettside</li>
          <li>Brev til vår postadresse: Setervegen 23, 6411 Molde</li>
        </ul>

        <h3>10.2 Hva forespørselen bør inneholde</h3>
        <p>For å hjelpe oss med å behandle din forespørsel effektivt, vennligst inkluder:</p>
        <ul>
          <li>Ditt fulle navn</li>
          <li>Din kontaktinformasjon</li>
          <li>Hvilken rettighet du ønsker å utøve</li>
          <li>Eventuelle detaljer som kan hjelpe oss med å identifisere dine opplysninger</li>
        </ul>

        <h3>10.3 Vår behandlingsprosess</h3>
        <ol>
          <li>Bekreftelse av mottak: Vi bekrefter mottak av din forespørsel innen 3 arbeidsdager.</li>
          <li>
            Identitetsverifisering: Vi vil verifisere din identitet for å sikre at personopplysninger ikke utleveres til
            feil person.
          </li>
          <li>Vurdering av forespørselen: Vi vurderer din forespørsel i henhold til gjeldende lovgivning.</li>
          <li>
            Gjennomføring av forespørselen: Vi vil gjennomføre de nødvendige tiltakene for å imøtekomme din forespørsel.
          </li>
          <li>
            Svar: Du vil motta et svar på din forespørsel uten unødig opphold og senest innen 30 dager fra mottak.
          </li>
        </ol>
        <p>
          For komplekse forespørsler eller når vi mottar mange forespørsler, kan vi forlenge svarfristen med ytterligere
          60 dager. I slike tilfeller vil du bli informert om forlengelsen og årsaken til denne innen de første 30
          dagene.
        </p>

        <h3>10.4 Begrensninger</h3>
        <p>I noen tilfeller kan vi ikke imøtekomme din forespørsel fullt ut, for eksempel:</p>
        <ul>
          <li>Når vi er rettslig forpliktet til å beholde visse opplysninger</li>
          <li>Når forespørselen er åpenbart grunnløs eller overdreven</li>
          <li>Når forespørselen ville påvirke andre personers rettigheter eller friheter</li>
        </ul>
        <p>I slike tilfeller vil vi informere deg om årsaken til at forespørselen ikke kan imøtekommes fullt ut.</p>

        <h2>11. Markedsføring</h2>
        <p>
          Hvis du samtykker til det, kan vi sende deg markedsføringsmateriell via e-post. Du kan når som helst trekke
          tilbake ditt samtykke ved å klikke på avmeldingslenken i e-postene eller ved å kontakte oss direkte.
        </p>

        <h2>12. Endringer i personvernerklæringen</h2>
        <p>
          Vi forbeholder oss retten til å oppdatere eller endre denne personvernerklæringen. Eventuelle endringer vil
          bli publisert på denne siden med oppdatert dato. Vi oppfordrer deg til å gjennomgå denne personvernerklæringen
          regelmessig.
        </p>

        <h2>13. Kontaktinformasjon</h2>
        <p>
          Hvis du har spørsmål om denne personvernerklæringen eller hvordan vi behandler dine personopplysninger, kan du
          kontakte oss på:
        </p>
        <p>
          Hepta AS
          <br />
          Organisasjonsnummer: 934762002
          <br />
          Personvernansvarlig: Alexander Bolgen Amundsen
          <br />
          E-post:{" "}
          <a href="mailto:hey@hepta.biz" className="text-orange-500 hover:text-orange-400">
            hey@hepta.biz
          </a>
          <br />
          Adresse: Setervegen 23, 6411 Molde
        </p>

        <h2>14. Klagerett</h2>
        <p>
          Hvis du mener at vår behandling av personopplysninger ikke overholder personvernlovgivningen, har du rett til
          å klage til Datatilsynet. Du finner mer informasjon på{" "}
          <a
            href="https://www.datatilsynet.no"
            className="text-orange-500 hover:text-orange-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.datatilsynet.no
          </a>
          .
        </p>

        <p className="text-sm text-gray-400 mt-8">Sist oppdatert: 30-03-2025</p>
      </div>
    </div>
  )
}

