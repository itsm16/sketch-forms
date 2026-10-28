"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  getCanvasData,
  getInsideFormContainer,
  type DataItem,
} from "~/store/canvasStore";
import { useLiveUrl } from "~/hooks/use-live-url";
import { trpc } from "~/trpc/client";

function fieldLabel(item: DataItem) {
  const name = item.field_name?.trim() || `field-${item.id}`;
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function fieldKey(item: DataItem) {
  return item.field_name?.trim() || `field-${item.id}`;
}

function formatDate(value: unknown) {
  if (!value) return "—";
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function FormResponsesPage() {
  const params = useParams<{ formId: string }>();
  const formId = Array.isArray(params.formId) ? params.formId[0] : params.formId;

  const responsesQuery = trpc.form.GetFormResponses.useQuery(
    { formId: formId ?? "" },
    {
      enabled: Boolean(formId),
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    },
  );
  const liveUrl = useLiveUrl(formId);

  if (!formId) {
    return <p className="p-6 text-muted-foreground">Invalid form id.</p>;
  }

  if (responsesQuery.isLoading) {
    return <p className="p-6 text-muted-foreground">Loading responses...</p>;
  }

  if (responsesQuery.isError || !responsesQuery.data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">
          {responsesQuery.error?.message ?? "Form not found"}
        </p>
        <Link href="/responses" className="mt-3 inline-block text-sm underline">
          Back to responses
        </Link>
      </div>
    );
  }

  const form = responsesQuery.data.form;
  const responses = responsesQuery.data.responses;
  const fields = getInsideFormContainer(
    getCanvasData(form.canvasJson),
  ).filter((item) =>
    ["input-container", "textarea-container"].includes(item.type ?? ""),
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/responses"
            className="text-xs text-muted-foreground hover:underline"
          >
            ← All forms
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                form.isLive
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {form.isLive ? "Accepting responses" : "Closed"}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {responses.length} response{responses.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex max-w-full flex-col items-end gap-2 text-sm">
          <Link href={`/form/${form.id}`} className="underline">
            Edit form
          </Link>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="max-w-[24rem] break-all text-right text-muted-foreground hover:text-foreground hover:underline"
            >
              <span className="font-semibold text-[#4F72FC]">Live at:</span>{" "}
              {liveUrl}
            </a>
          )}
        </div>
      </div>

      <wired-card className="max-h-[80%] min-h-[50%] overflow-auto rounded-xl p-3">
        <Table>
          <TableCaption>
            {responses.length
              ? "Responses for this form"
              : "No responses yet. Share the live link to collect some."}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead className="w-[180px]">Submitted</TableHead>
              {fields.map((field) => (
                <TableHead key={field.id}>{fieldLabel(field)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response, index) => {
              const answers = (response.answers ?? {}) as Record<
                string,
                string | string[] | undefined
              >;

              return (
                <TableRow key={response.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate(response.createdAt)}</TableCell>
                  {fields.map((field) => {
                    const answer = answers[fieldKey(field)];
                    return (
                      <TableCell key={field.id} className="max-w-[240px] whitespace-pre-wrap">
                        {Array.isArray(answer)
                          ? answer.join(", ")
                          : (answer ?? "—")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </wired-card>
    </div>
  );
}
