"use client"

import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const formId = useParams().formId
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" >
                {formId}
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              2
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              3
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            4
          </div>
        </div>
  )
}

export default page
