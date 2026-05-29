"use client";
import React from "react";
import { useRouter } from "next/navigation";
import "wired-elements";
import { generateRandomString } from "~/lib/utils";
import { toast } from "sonner";
import { FormsTable } from "~/components/Table";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [expirationDate, setExpirationDate] = React.useState("");
  const [noExpiration, setNoExpiration] = React.useState(false);
  const handleClick = () => {
    if (!title) {
      toast("Please enter a title for the form", {
        position: "top-right",
      });
      return;
    }
    const randomString = generateRandomString()
    router.push(`/form/${title}-${randomString}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-2 rounded-xl bg-muted/50 p-4">
      <div className="flex flex-col min-h-[40%] max-h-[40%]">
        <label className="flex flex-col text-xl">
          Form Title
          <wired-input
            className="h-[40px] py-1 px-1 pl-2 w-[450px]"
            value={title}
            placeholder="Enter title"
            onChange={(e: any) => setTitle(e.target.value)}
          />
        </label>
        <wired-calendar selected="Jul 4, 2025">
        </wired-calendar>
        <wired-checkbox
          style={{ marginTop: "6px" }}
          checked={noExpiration}
        >
          No expiration date
        </wired-checkbox>
        <wired-button
          onClick={handleClick}
          elevation={2}
          className="mt-5 w-fit text-md"
        >
          Create
        </wired-button>
      </div>
      <wired-card className="max-h-[60%] min-h-[60%] overflow-y-auto rounded-xl p-3">
        <FormsTable />
      </wired-card>
    </div>
  )
}
