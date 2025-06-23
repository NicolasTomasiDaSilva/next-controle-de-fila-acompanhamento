import MonitorContent from "@/features/monitor/components/monitor-content";
import { ConfiguracaoProvider } from "@/features/monitor/context/configuracao-context";
import { FilaProvider } from "@/features/monitor/context/fila-context";
import { configuracaoService } from "@/features/monitor/services/configuracao-service";
import { filaService } from "@/features/monitor/services/fila-service";
import { SomProvider } from "@/features/shared/contexts/som-context";

export default async function MonitorPage() {
  const configuracao = await configuracaoService.obterConfiguracao();
  const fila = await filaService.obterFila();

  return (
    <ConfiguracaoProvider configuracaoInicial={configuracao}>
      <FilaProvider filaInicial={fila}>
        <SomProvider>
          <MonitorContent />
        </SomProvider>
      </FilaProvider>
    </ConfiguracaoProvider>
  );
}
