const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

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
          // {
          //   type: "doc",
          //   docId: "intro",
          //   position: "left",
          //   label: "Docs",
          // },
          {
            href: "https://kartverket.atlassian.net/wiki/spaces/SKIPDOK",
            label: "Docs",
            position: "left",
          },
          {
            href: "https://kartverket.atlassian.net/jira/software/projects/SKIP/boards/2/roadmap",
            position: "left",
            label: "Roadmap",
          },
          {
            href: "https://kartverket.atlassian.net/wiki/spaces/SKIPDOK/blog",
            position: "left",
            label: "Nyhetsbrev",
          },
          // {
          //   to: "blog",
          //   label: "Nyhetsbrev",
          //   position: "left",
          // },
          {
            href: "https://kartverket.atlassian.net/wiki/spaces/SKIP",
            label: "Confluence",
            position: "right",
          },
          {
            href: "https://github.com/orgs/kartverket/teams/skip",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        // links: [
        //   {
        //     title: "Docs",
        //     items: [
        //       {
        //         label: "Introduction",
        //         to: "/docs/intro",
        //       },
        //       {
        //         label: "Roadmap",
        //         to: "/docs/roadmap",
        //       },
        //       {
        //         label: "Blog",
        //         to: "/blog",
        //       },
        //     ],
        //   },
        // ],
        copyright: `Copyright © ${new Date().getFullYear()} Statens Kartverk`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["java"],
      },
    },
  }
);
