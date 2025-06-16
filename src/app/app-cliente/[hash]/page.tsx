import AppClienteContent from "@/lib/features/app-cliente/components/app-cliente-content";
import { clienteService } from "@/lib/features/app-cliente/services/cliente-service";
import MonitorContent from "@/lib/features/monitor/components/monitor-content";
import { ConfiguracaoProvider } from "@/lib/features/monitor/context/configuracao-context";
import { FilaProvider } from "@/lib/features/monitor/context/fila-context";
import { configuracaoService } from "@/lib/features/monitor/services/configuracao-service";
import { filaService } from "@/lib/features/monitor/services/fila-service";

interface AppUsuarioPageProps {
  params: { hash: string };
}

export default async function AppClientePage({ params }: AppUsuarioPageProps) {
  const hash = params?.hash;
  const dadosIniciasCliente = await clienteService.pegarDadosInicias({
    hash: hash,
  });

  console.log(dadosIniciasCliente);

  return (
    <AppClienteContent dadosIniciasCliente={dadosIniciasCliente} hash={hash} />
  );
}
