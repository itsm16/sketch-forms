"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { AppSidebar } from "~/components/app-sidebar";
import Loader from "~/components/loader";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useWiredElements } from "~/hooks/use-wired-elements";
import { useUserStore } from "~/store/user-store";
import { trpc } from "~/trpc/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  useWiredElements();
  const path = usePathname();
  const paths = path.split("/").filter(Boolean);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const me = trpc.auth.GetMe.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!me.data) return;

    setUser({
      id: me.data.id,
      name: me.data.fullName,
      email: me.data.email,
    });
  }, [me.data, setUser]);

  useEffect(() => {
    if (!me.error) return;

    toast.error(me.error.message, { position: "top-right" });
    router.replace("/sign-in");
  }, [me.error, router]);

  if (me.isLoading || me.isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <wired-spinner spinning duration={1000}></wired-spinner>
          <p className="text-sm">
            {me.isError ? "Redirecting to sign in..." : "Loading your workspace..."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="capitalize">
              {paths && paths[0] ? paths[0].replace("-", " ") : "New"}
            </div>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          <Loader />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
