import AppClienteContent from "@/lib/features/app-cliente/components/app-cliente-content";
import { clienteService } from "@/lib/features/app-cliente/services/cliente-service";

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
