"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useSom } from "../../shared/hooks/use-som";

interface AtivarNotificacoesSonorasDialogProps {
  descricao?: string | null;
}

export default function AtivarNotificacoesSonorasDialog({
  descricao,
}: AtivarNotificacoesSonorasDialogProps) {
  const { mostrarDialog, setMostrarDialog, liberarSom } = useSom();

  return (
    <Dialog open={mostrarDialog} onOpenChange={setMostrarDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deseja ativar notificações sonoras?</DialogTitle>
          {descricao && <DialogDescription>{descricao}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant={"azul"} onClick={() => liberarSom()}>
            Permitir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
