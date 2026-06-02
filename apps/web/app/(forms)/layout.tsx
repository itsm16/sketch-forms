"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "~/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import Loader from "~/components/loader"
import { useAuth } from "~/hooks/auth-hooks"
import { useUserStore } from "~/store/user-store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import useLoaderStore from "~/store/loaderStore"
import { toast } from "sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
    const path = usePathname()
    const paths = path.split("/").filter(Boolean)
    const router = useRouter()
    // const {user, setUser} = useUserStore();
    // const {show, hide} = useLoaderStore();
    // console.log("u", user);
    // const { getMe } = useAuth();

    // useEffect(()=>{
    //   show("Loading...")
    //   if(!user?.id) {
    //     toast.info("Login required", {position: "top-right"})
    //     router.push("/sign-in");
    //     return;
    //   }

    //   const fetchUser = async () => {
    //     // const {id, fullName, email} = await getMe(user?.id as string)
    //     setUser({id, name: fullName, email})
    //     hide()
    //   }
    //   fetchUser()
    // }, [user?.id])

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
            <div>{paths && paths[0] ? paths[0] : "New"}</div>
            <Breadcrumb>
            </Breadcrumb>
          </div>
        </header>
        <div className="relative flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          <Loader />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
