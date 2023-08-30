import { useRouter } from "next/router";
import { useConfig } from "nextra-theme-docs";

export default {
  logo: <span>🌉 Unified Bridge Adapter SDK</span>,
  project: {
    link: "https://github.com/ElasticBottle/bridge-adapter-sdk/",
  },
  docsRepositoryBase:
    "https://github.com/ElasticBottle/bridge-adapter-sdk/tree/main/apps/bridge-adapter-docs/src/pages",
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s - Unified Bridge Adapter SDK",
      };
    }
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      "https://bridge-adapter-docs.vercel.app" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta
          property="og:title"
          content={frontMatter.title || "Unified Bridge Adapter SDK"}
        />
        <meta
          property="og:description"
          content={frontMatter.description || "The 1 stop liquidity solution"}
        />
      </>
    );
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://github.com/ElasticBottle" target="_blank">
          Winston Yeo
        </a>
        .
      </span>
    ),
  },
};
