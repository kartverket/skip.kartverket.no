import React from 'react';
import clsx from 'clsx';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import GetStarted from '../components/GetStarted';
import ShipAnimation from '../components/ShipAnimation';
import logo from '../../static/img/skip.png';
import { initializeFaro } from '@grafana/faro-react';

initializeFaro({
  url: 'https://faro.atkv3-sandbox.kartverket.cloud/collect',
  app: {
    name: 'skip.kartverket.no',
  },
});

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <img
          src={logo}
          alt="Logo for SKIP, viser en båt i Kartverkets farger"
        />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <a
            className="button button--secondary button--lg"
            href="https://kartverket.atlassian.net/wiki/spaces/SKIPDOK">
            Docs
          </a>
          <a
            className="button button--secondary button--lg"
            href="blog">
            Tech blog
          </a>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="SKIP – Statens Kartverks Infrastrukturplatform"
      description="Statens Kartverks Infrastrukturplatform">
      <Head>
        <html lang="no" />
      </Head>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <GetStarted />
      </main>
      <ShipAnimation />
    </Layout>
  );
}
