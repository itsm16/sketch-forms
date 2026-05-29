"use client"
import React from 'react'
// Patch roughjs filler API mismatch: ensure ZigZagFiller has fillPolygon (wired-elements expects it)
import { ZigZagFiller } from 'roughjs/bin/fillers/zigzag-filler'
if (typeof ZigZagFiller !== 'undefined' && !('fillPolygon' in ZigZagFiller.prototype)) {
  // @ts-ignore - augmenting prototype for runtime compatibility
  ZigZagFiller.prototype.fillPolygon = function (points: any, o: any) {
    // convert single polygon to polygon list expected by fillPolygons
    return this.fillPolygons([points], o);
  }
}

import 'wired-elements'
import useLoaderStore from '~/store/loaderStore';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wired-spinner': any;
    }
  }
}

const Loader: React.FC = () => {
  const { loading, message } = useLoaderStore(state => state)
  if (!loading) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60">
      <div className="flex flex-col items-center gap-4 w-[100%] h-[100%] items-center justify-center backdrop-blur-xs rounded-lg">
        <wired-spinner spinning duration={1000}></wired-spinner>
        <div className="text-sm text-muted-foreground">{message || 'loading...'}</div>
      </div>
    </div>
  )
}

export default Loader
