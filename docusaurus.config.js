const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
  module.exports = {
    title: "SKIP",
    tagline: "Statens Kartverks Infrastrukturplatform",
    url: "https://skip.pages.statkart.no",
    baseUrl: "/docs/",
    onBrokenLinks: "warn",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon/favicon.ico",
    organizationName: "skip", // Usually your GitHub org/user name.
    projectName: "SKIP", // Usually your repo name.

    presets: [
      [
        "@docusaurus/preset-classic",
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve("./sidebars.js"),
            editUrl: "https://gitlab.statkart.no/skip/docs/-/edit/master/",
          },
          blog: {
            blogTitle: 'SKIP-oppdateringer',
            blogDescription: 'Oppdateringer om signifikante endringer for SKIP-brukere',
            blogSidebarTitle: 'Siste poster',
            feedOptions: {
              type: "all",
              copyright: `Copyright © ${new Date().getFullYear()} Statens Kartverk`,
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
            docId: "intro",
            position: "left",
            label: "Docs",
          },
          {
            type: "doc",
            docId: "roadmap",
            position: "left",
            label: "Roadmap",
          },
          {
            to: "blog",
            label: "Blog",
            position: "left",
          },
          {
            href: "https://confluence.statkart.no/display/SKIP",
            label: "Confluence",
            position: "right",
          },
          {
            href: "https://gitlab.statkart.no/skip",
            label: "GitLab",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Introduction",
                to: "/docs/docs/intro",
              },
              {
                label: "Roadmap",
                to: "/docs/docs/roadmap",
              },
              {
                label: "Blog",
                to: "/docs/blog",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitLab",
                href: "https://gitlab.statkart.no/skip",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Statens Kartverk. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java"],
      },
    },
  }
);
