const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'SKIP',
  tagline: 'Statens Kartverks Infrastrukturplatform',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon/favicon.ico',
  organizationName: 'skip', // Usually your GitHub org/user name.
  projectName: 'SKIP', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://gitlab.statkart.no/skip/docs/-/edit/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'SKIP',
        logo: {
          alt: 'My Site Logo',
          src: 'img/skip.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://confluence.statkart.no/display/SKIP/TVP+-+Features',
            label: 'Roadmap',
            position: 'left',
          },
          {
            href: 'https://gitlab.statkart.no/skip',
            label: 'GitLab',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitLab',
                href: 'https://gitlab.statkart.no/skip',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Statens Kartverk. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
