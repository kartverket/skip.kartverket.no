import React from 'react';
import ShipIllustration from '../../static/img/undraw_container_ship.svg';
import styles from './GetStarted.module.css';

function OnboardingStep({ title, emoji, children }) {
  return (
    <li className={styles.onboardingStep}>
      <div className={styles.dot}>{emoji}</div>
      <div className={styles.line} />
      <b className={styles.onboardingStepTitle}>{title}</b>
      <p className={styles.onboardingStepBody}>{children}</p>
    </li>
  );
}

export default function GetStarted() {
  return (
    <section className={styles.wrapper}>
      <div className="container">
        <div className={styles.innerWrapper}>
          <div>
            <ShipIllustration className={styles.svg} />
            <h2 className={styles.heading}>Stig ombord!</h2>
          </div>
          <ul className={styles.onboardingList}>
            <OnboardingStep title="Kontakt SKIP" emoji="👋">
              Vi på SKIP-teamet står klare til å ta dere imot på plattformen!
              <br />
              <br />
              Første steg er at produktteamet deres tar kontakt. Etter dette
              setter vi opp et uformelt møte for å diskutere om applikasjonen
              egner seg for containermiljø eller om det er andre tiltak man
              burde ta før man tenker på SKIP.
              <br />
              <br />
              Her vil dere også få tilgang til kurs på sky og kubernetes. Det
              anbefales at dere sørger for at alle på teamet med ønske og behov
              for å styrke kompetansen på dette
            </OnboardingStep>
            <OnboardingStep title="Få tilganger" emoji="🎁">
              Teamet deres får tilganger til alle de moderne arbeidsverktøyene
              dere trenger! GitHub, eget Google Cloud-prosjekt, namespace på
              Kubernetes, og så videre.
            </OnboardingStep>
            <OnboardingStep title="Deploy" emoji="🚀">
              Dere setter opp en deploy-løype ved hjelp av GitHub Actions og
              Terraform. Her kan SKIP-teamet hjelpe til om dere ønsker bistand
              mens dere lærer plattformen å kjenne 💪
            </OnboardingStep>
            <OnboardingStep title="Overvåk" emoji="👀">
              Når alt er oppe og kjøre vil dere kunne nye godt av den dype
              innsikten som plattformen gir i ytelsesmetrikker, loggagreggering,
              nettverkstrafikk og feilende kall, varsling til slack og ikke
              minst oversikten over den kjørende applikasjonen i Google Cloud.
            </OnboardingStep>
          </ul>
        </div>
      </div>
    </section>
  );
}

