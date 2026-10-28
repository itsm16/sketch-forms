"use client";

import { useEffect } from "react";

let wiredElementsPromise: Promise<void> | null = null;

async function loadWiredElements() {
  const { ZigZagFiller } = await import("roughjs/bin/fillers/zigzag-filler");

  // wired-elements expects roughjs fillers to expose `fillPolygon`.
  if (
    typeof ZigZagFiller !== "undefined" &&
    !("fillPolygon" in ZigZagFiller.prototype)
  ) {
    type FillerWithPolygons = {
      fillPolygons: (points: unknown[], options: unknown) => unknown;
    };

    (
      ZigZagFiller.prototype as unknown as {
        fillPolygon: (points: unknown, options: unknown) => unknown;
      }
    ).fillPolygon = function (points: unknown, options: unknown) {
      return (this as unknown as FillerWithPolygons).fillPolygons(
        [points],
        options,
      );
    };
  }

  await import("wired-elements");
}

export function useWiredElements() {
  useEffect(() => {
    wiredElementsPromise ??= loadWiredElements();
  }, []);
}
