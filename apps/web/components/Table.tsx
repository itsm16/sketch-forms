"use client";

import "wired-elements";
import { MdDelete } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"

const forms = [
  {
    id: "1",
    title: "Contact Form",
    isLive: true,
    expiresAt: null,
    createdAt: "2026-05-20",
    updatedAt: "2026-05-27",
  },
  {
    id: "2",
    title: "Feedback Survey",
    isLive: true,
    expiresAt: "2026-06-15",
    createdAt: "2026-05-18",
    updatedAt: "2026-05-25",
  },
  {
    id: "3",
    title: "Booking Request",
    isLive: false,
    expiresAt: null,
    createdAt: "2026-05-10",
    updatedAt: "2026-05-22",
  },
  {
    id: "4",
    title: "Order Form",
    isLive: true,
    expiresAt: "2026-07-01",
    createdAt: "2026-05-05",
    updatedAt: "2026-05-28",
  },
  {
    id: "5",
    title: "Newsletter Signup",
    isLive: false,
    expiresAt: null,
    createdAt: "2026-04-28",
    updatedAt: "2026-05-15",
  },
  {
    id: "6",
    title: "RSVP Form",
    isLive: true,
    expiresAt: "2026-06-01",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-20",
  },
]

export function FormsTable({ showLive = true }: { showLive?: boolean }) {
  return (
    <Table>
      <TableCaption>Active / Previous Forms</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Title</TableHead>
          <TableHead>Expires</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Updated</TableHead>
          {showLive && <TableHead className="text-center">Live</TableHead>}
          <TableHead className="text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id}>
            <TableCell className="font-medium">{form.title}</TableCell>
            <TableCell>{form.expiresAt ?? "—"}</TableCell>
            <TableCell>{form.createdAt}</TableCell>
            <TableCell className="text-right">{form.updatedAt}</TableCell>
            {showLive && (
              <TableCell className="text-center">
                <wired-toggle checked={form.isLive}></wired-toggle>
              </TableCell>
            )}
            <TableCell className="text-right">
              <wired-button style={{ color: "#ac1229"}} elevation={2}>
                <MdDelete size={18} /> 
              </wired-button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
