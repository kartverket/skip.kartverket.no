import { themes } from "prism-react-renderer"
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "SKIP",
    tagline: "Statens Kartverks Infrastrukturplatform",
    url: "https://skip.kartverket.no",
    baseUrl: "/",
    projectName: 'skip-docs',
    organizationName: 'kartverket',
    trailingSlash: false,
    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon/favicon.ico",

    markdown: {
        mermaid: true,
    },

    themes: ['@docusaurus/theme-mermaid'],

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            editUrl: "https://github.com/kartverket/skip-docs/edit/main/",
          },
          blog: {
            blogTitle: 'SKIP Tech Blog',
            blogDescription: 'SKIP\'s latest!',
            blogSidebarTitle: 'Recent posts',
            feedOptions: {
              type: "all",
            },
          },
          theme: {
            customCss: require.resolve("./src/css/custom.css"),
          },
        }),
      ],
    ],

    themeConfig: {
      navbar: {
        title: "SKIP",
        logo: {
          alt: "SKIP",
          src: "img/skip.png",
        },
        items: [
          {
            type: "doc",
            docId: "index",
            position: "left",
            label: "Docs",
          },
          {
            to: "blog",
            label: "Tech Blog",
            position: "left",
          },
          {
            href: "https://kartverket.atlassian.net/wiki/spaces/SIK/overview",
            label: "Sikkerhetshåndboka",
            position: "right",
          },
          {
            href: "https://github.com/kartverket",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Lenker",
            items: [
              {
                label: "Tilgjengelighetserklæring",
                href: "https://uustatus.no/nb/erklaringer/publisert/7148395f-f0cf-4019-9c45-3b83d79fd544",
              },
            ],
          },
        ],

        copyright: `Copyright © ${new Date().getFullYear()} Statens Kartverk`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java", "hcl", "docker"],
      },
    },
    scripts: [
        'https://platform.twitter.com/widgets.js'
    ],
    plugins: [
      [require.resolve('docusaurus-lunr-search'), {
          languages: ['en', 'no']
      }],
      [
        '@docusaurus/plugin-client-redirects',
        {
          redirects: [
          ],
        },
      ],
    ],
  }
);
