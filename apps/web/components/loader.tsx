"use client";

import React from "react";

import { useWiredElements } from "~/hooks/use-wired-elements";
import useLoaderStore from "~/store/loaderStore";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wired-spinner": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          spinning?: boolean;
          duration?: number;
        },
        HTMLElement
      >;
    }
  }
}

const Loader: React.FC = () => {
  useWiredElements();

  const { loading, message } = useLoaderStore((state) => state);

  if (!loading) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60">
      <div className="flex h-full w-full items-center justify-center rounded-lg backdrop-blur-xs">
        <div className="flex flex-col items-center gap-4">
          <wired-spinner spinning duration={1000}></wired-spinner>
          <div className="text-sm text-muted-foreground">
            {message || "loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
