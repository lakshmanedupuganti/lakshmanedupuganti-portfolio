"use client";

import React from "react";
import {
  useDynamicComponentOnDocumentStateEvent,
  useDynamicComponentOnIntersectionAndDocumentStateEvent,
} from "@src/clientlib/hooks/intersection";
import {
  ClientContentItemComponent,
  ClientContentItemComponentProps,
  IntersectParams,
} from "@src/lib/types";
import type {
  ContentEntry,
  EntryIncludes,
} from "@lakshmanedupuganti/server-library";

// it's very important to import like this, so a minimum amount of JS is added to the main client JS bundle
import { expandReferenceLinks } from "@lakshmanedupuganti/server-library/dist/src/util/expandRefs";

export type ClientContentItemComponentImportInfo = {
  component?: ClientContentItemComponent;
  importFunc?: () => Promise<ClientContentItemComponent>;
  intersectParams?: Omit<IntersectParams, "disabled">;
  useDocumentStateOnly?: boolean;
};

const defaultIntersectParams: Omit<IntersectParams, "disabled"> = {
  rootMargin: "200px",
  documentState: "interactive",
  delayMilliseconds: 1000,
};

const immediateIntersectParams: Omit<IntersectParams, "disabled"> = {
  rootMargin: "0px",
  documentState: "interactive",
  delayMilliseconds: 0,
};

const clientComponentMap: Record<string, ClientContentItemComponentImportInfo> =
  {
    /*
    can load the component directly with next/dynamic

    import dynamic from "next/dynamic";
    const HeroAreaSwiper = dynamic( () => import("@client/contenttemplates/HeroAreaSwiper"));

    HeroAreaSwiper: {
      component: HeroAreaSwiper,
    },*/
    HeadingCardsCtaSwiper: {
      importFunc: async () => {
        const ret = (
          await import("@client/contenttemplates/containertemplates/HeadingCardsCtaSwiper")
        ).default;
        return ret;
      },
      intersectParams: defaultIntersectParams,
    },
  };

export type ClientTemplateLoaderProps = ClientContentItemComponentProps & {
  includes: EntryIncludes;
  clientComponentType: string;
};

type ClientComponentDirectProps = ClientContentItemComponentProps & {
  clientComponent: ClientContentItemComponent;
};

type ClientComponentIntersectionLoadProps = ClientContentItemComponentProps & {
  importFunc: () => Promise<ClientContentItemComponent>;
  intersectParams?: Omit<IntersectParams, "disabled">;
};

const ClientComponentDirect: React.FC<ClientComponentDirectProps> = (
  props: ClientComponentDirectProps,
) => {
  const { clientComponent: Comp, ...restProps } = props;
  return <Comp {...restProps} />;
};

const ClientComponentIntersectionLoad: React.FC<
  ClientComponentIntersectionLoadProps
> = (props: ClientComponentIntersectionLoadProps) => {
  const { importFunc, intersectParams, ...restProps } = props;

  const [setRef, Comp] = useDynamicComponentOnIntersectionAndDocumentStateEvent(
    {
      rootMargin:
        intersectParams?.rootMargin || defaultIntersectParams.rootMargin,
      disabled: false,
      documentState:
        intersectParams?.documentState || defaultIntersectParams.documentState,
      delayMilliseconds:
        intersectParams?.delayMilliseconds === undefined
          ? defaultIntersectParams.delayMilliseconds
          : intersectParams.delayMilliseconds,
      importFunc,
    },
  );

  return (
    <>
      <span ref={setRef}></span>
      {Comp && <Comp {...restProps} />}
    </>
  );
};

const ClientComponentDelayLoad: React.FC<
  ClientComponentIntersectionLoadProps
> = (props: ClientComponentIntersectionLoadProps) => {
  const { importFunc, intersectParams, ...restProps } = props;

  const Comp = useDynamicComponentOnDocumentStateEvent({
    disabled: false,
    documentState:
      intersectParams?.documentState || defaultIntersectParams.documentState,
    delayMilliseconds:
      intersectParams?.delayMilliseconds === undefined
        ? defaultIntersectParams.delayMilliseconds
        : intersectParams.delayMilliseconds,
    importFunc,
  });

  return Comp ? <Comp {...restProps} /> : null;
};

const ClientComponentLoader: React.FC<ClientTemplateLoaderProps> = (
  props: ClientTemplateLoaderProps,
) => {
  const { item, includes, clientComponentType } = props;

  // check first if we have any includes, if not, we don't need to expand the item
  const expandedItem =
    includes.Asset.length === 0 && includes.Entry.length === 0
      ? item
      : expandReferenceLinks([item], includes)[0];

  const loadInfo: ClientContentItemComponentImportInfo | undefined =
    clientComponentMap[clientComponentType];
  if (loadInfo?.component) {
    return (
      <ClientComponentDirect
        {...props}
        item={expandedItem as ContentEntry}
        clientComponent={loadInfo.component}
      />
    );
  }
  if (loadInfo?.importFunc) {
    if (loadInfo.useDocumentStateOnly) {
      return (
        <ClientComponentDelayLoad
          {...props}
          item={expandedItem as ContentEntry}
          importFunc={loadInfo.importFunc}
          intersectParams={loadInfo.intersectParams}
        />
      );
    }

    return (
      <ClientComponentIntersectionLoad
        {...props}
        importFunc={loadInfo.importFunc}
        item={expandedItem as ContentEntry}
        intersectParams={loadInfo.intersectParams}
      />
    );
  }

  return null;
};

export default ClientComponentLoader;
