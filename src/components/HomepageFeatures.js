import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Fremtidsrettet platform',
    Svg: require('../../static/img/undraw_code_review.svg').default,
    description: (
      <>
        SKIP ble bygget fra bunnen av til å være fremtidsrettet og tilrettelegge
        for autonomi og moderne utviklingsmønstre som containers, hybridsky,
        mikrotjenester og sky-native tankegang.
      </>
    ),
  },
  {
    title: 'Innebygde best practices',
    Svg: require('../../static/img/undraw_voice_control.svg').default,
    description: (
      <>
        SKIP lar deg fokusere på applikasjonen din mens SKIP bygger inn best
        practices i arbeidsflyten. Dette fører til en sikrere, enklere og mer
        standardisert utvikling- og driftsopplevelse for alle.
      </>
    ),
  },
  {
    title: 'Stabilitet',
    Svg: require('../../static/img/undraw_programmer.svg').default,
    description: (
      <>
        Platformen vil i bakgrunnen sørge for at applikasjonen skalerer opp ved
        mye traffikk og ned når det ikke lenger er nødvendig.
        I tillegg sørger den for at applikasjonene restartes ved ustabilitet og
        gir deg data og metrikker til å overvåke tjenesten din.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
