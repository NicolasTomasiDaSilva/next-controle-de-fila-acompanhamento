import AppClienteContent from "@/features/app-cliente/components/app-cliente-content";
import { clienteService } from "@/features/app-cliente/services/cliente-service";
import { SomProvider } from "@/features/shared/contexts/som-context";
export const dynamic = "force-dynamic";
export default async function AppClientePage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;

  const dadosIniciasCliente = await clienteService.pegarDadosInicias({
    hash: hash,
  });

  return (
    <SomProvider>
      <AppClienteContent
        dadosIniciasCliente={dadosIniciasCliente}
        hash={hash}
      />
    </SomProvider>
  );
}
