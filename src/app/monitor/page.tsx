import MonitorContent from "@/lib/features/monitor/components/monitor-content";
import { ConfiguracaoProvider } from "@/lib/features/monitor/context/configuracao-context";
import { configuracaoService } from "@/lib/features/monitor/services/configuracao-service";

export default async function MonitorPage() {
  const configuracao = await configuracaoService.obterConfiguracao();
  console.log("PASSOU AQUI ");
  console.log("PASSOU AQUI ");
  console.log("PASSOU AQUI ");
  console.log(configuracao);
  console.log("PASSOU AQUI ");
  console.log("PASSOU AQUI ");

  return (
    <ConfiguracaoProvider configuracaoInicial={configuracao}>
      <MonitorContent />
    </ConfiguracaoProvider>
  );
}
