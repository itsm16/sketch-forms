"use client";
import React from "react";
import { useRouter } from "next/navigation";
import "wired-elements";
import { TableFooterExample } from "~/components/Table";
import { generateRandomString } from "~/lib/utils";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const handleClick = () => {
    if(!title) {
      toast("Please enter a title for the form", {
        position: "top-right",
      });
      return;
    }
    const randomString = generateRandomString()
    router.push(`/form/${title}-${randomString}`);
  }

  return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 max-h-[90vh] bg-muted/50 rounded-xl">
          <div className="flex flex-col min-h-[40%] max-h-[40%] pt-5">
            <label className="flex flex-col text-2xl">
              Form Title
              <wired-input
                className="h-[45px] py-1 px-1 pl-2 w-[450px]"
                value={title}
                placeholder="Enter title"
                onChange={(e: any) => setTitle(e.target.value)}
              />
            </label>
            <wired-button
              onClick={handleClick}
              elevation={2}
              className="mt-5 w-fit text-lg"
            >
              Create
            </wired-button>
          </div>
          <wired-card className="max-h-[60%] min-h-[60%] overflow-y-auto rounded-xl p-3">
            <TableFooterExample/>
          </wired-card>
        </div>
  )
}
