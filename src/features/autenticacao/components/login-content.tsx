"use client";

import LoginForm from "./login-form";
import LogoCervantes from "@/assets/images/logo-cervantes.jpg";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function MonitorContent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 max-w-xl mx-auto">
      <div className="flex flex-col items-center gap-4">
        <Image
          src={LogoCervantes}
          alt="Logo"
          className="size-30 rounded-md mx-auto"
        />
        <h2 className="text-4xl font-bold">Monitor de Fila</h2>
      </div>
      <Separator className=" bg-white !w-4/4 !h-1 rounded-full" />

      <LoginForm></LoginForm>
    </div>
  );
}
