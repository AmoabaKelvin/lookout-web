import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { LookoutLogo } from "@/components/lookout-logo";

const baseOptions: BaseLayoutProps = {
  nav: {
    title: <LookoutLogo as="span" />,
    url: "/",
  },
  themeSwitch: { enabled: false },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
    },
  ],
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RootProvider theme={{ enabled: false }}>
      <DocsLayout tree={source.pageTree} {...baseOptions}>
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
