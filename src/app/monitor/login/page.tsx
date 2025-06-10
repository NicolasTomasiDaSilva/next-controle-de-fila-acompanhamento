import LoginContent from "@/lib/features/autenticacao/components/login-content";
import MonitorContent from "@/lib/features/monitor/components/monitor-content";
import { ConfiguracaoProvider } from "@/lib/features/monitor/context/configuracao-context";
import { FilaProvider } from "@/lib/features/monitor/context/fila-context";
import { configuracaoService } from "@/lib/features/monitor/services/configuracao-service";
import { filaService } from "@/lib/features/monitor/services/fila-service";

export default async function LoginPage() {
  return <LoginContent />;
}
