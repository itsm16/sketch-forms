"use client";

import Link from "next/link";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { SketchToggle } from "~/components/sketch-toggle";
import { useLiveUrl } from "~/hooks/use-live-url";
import { useWiredElements } from "~/hooks/use-wired-elements";
import { trpc } from "~/trpc/client";

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

function LiveFormLink({ formId }: { formId: string }) {
  const liveUrl = useLiveUrl(formId);

  if (!liveUrl) return <span className="text-muted-foreground">—</span>;

  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={liveUrl}
      className="text-sm underline"
    >
      Open
    </a>
  );
}

export function FormsTable({ showLive = true }: { showLive?: boolean }) {
  useWiredElements();
  const utils = trpc.useUtils();
  const formsQuery = trpc.form.GetUserForms.useQuery(undefined, {
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const updateForm = trpc.form.UpdateForm.useMutation({
    onSuccess: async () => {
      await utils.form.GetUserForms.invalidate();
      toast.success("Form updated");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteForm = trpc.form.DeleteForm.useMutation({
    onSuccess: async () => {
      await utils.form.GetUserForms.invalidate();
      toast.success("Form deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleDelete = (formId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteForm.mutate({ formId });
  };

  if (formsQuery.isLoading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        Loading forms...
      </div>
    );
  }

  if (formsQuery.isError) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        {formsQuery.error.message}
      </div>
    );
  }

  const forms = [...(formsQuery.data ?? [])].sort((a, b) => {
    const aTime = new Date(a.createdAt as string).getTime() || 0;
    const bTime = new Date(b.createdAt as string).getTime() || 0;
    return bTime - aTime;
  });

  return (
    <Table>
      <TableCaption>
        {forms.length ? "Your forms" : "You have not created any forms yet"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[220px]">Title</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Updated</TableHead>
          {showLive && <TableHead className="text-center">Live</TableHead>}
          <TableHead className="text-center">Live page</TableHead>
          <TableHead className="text-center">Responses</TableHead>
          <TableHead className="text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id}>
            <TableCell className="font-medium">
              <Link href={`/form/${form.id}`} className="hover:underline">
                {form.title}
              </Link>
            </TableCell>
            <TableCell>{formatDate(form.createdAt)}</TableCell>
            <TableCell className="text-right">
              {formatDate(form.updatedAt)}
            </TableCell>
            {showLive && (
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <SketchToggle
                    checked={form.isLive}
                    disabled={updateForm.isPending}
                    label={`Toggle live status for ${form.title}`}
                    onCheckedChange={(checked) =>
                      updateForm.mutate({ formId: form.id, isLive: checked })
                    }
                  />
                </div>
              </TableCell>
            )}
            <TableCell className="text-center">
              <LiveFormLink formId={form.id} />
            </TableCell>
            <TableCell className="text-center">
              <Link
                href={`/responses/${form.id}`}
                className="text-sm underline"
              >
                View
              </Link>
            </TableCell>
            <TableCell className="text-right">
              <wired-button
                style={{ color: "#ac1229" }}
                elevation={2}
                onClick={() => handleDelete(form.id, form.title)}
                disabled={deleteForm.isPending}
              >
                <MdDelete size={18} />
              </wired-button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
