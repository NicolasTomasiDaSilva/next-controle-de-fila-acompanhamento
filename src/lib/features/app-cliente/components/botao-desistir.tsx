"use client";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BotaoDesisitir({
  handleDesisitir,
}: {
  handleDesisitir: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkIsMobile() {
      setIsMobile(window.innerWidth < 768); // breakpoint para mobile/tablet
    }
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const trigger = (
    <Button
      variant="ghost"
      className="!text-[2em] text-accent-foreground hover:text-red-500 mt-[0.5em]"
    >
      <LogOut className="!h-[1em] !w-[1em] text-accent-foreground hover:text-red-500 text-inherit" />
      Desistir da fila
    </Button>
  );
  const content = (
    <>
      <SheetHeader>
        <SheetTitle>Confirmar saída</SheetTitle>
        <SheetDescription>Deseja realmente sair da fila?</SheetDescription>
      </SheetHeader>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => setIsOpen(false)}>
          Cancelar
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            handleDesisitir();
            setIsOpen(false);
          }}
        >
          Confirmar
        </Button>
      </div>
    </>
  );

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-t-2xl"
      >
        {content}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>{content}</DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
