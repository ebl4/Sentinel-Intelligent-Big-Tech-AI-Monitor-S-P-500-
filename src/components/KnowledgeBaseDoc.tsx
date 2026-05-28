import React from "react";
import { BookOpen, TrendingUp, AlertOctagon, HelpCircle, ShieldAlert } from "lucide-react";

export function KnowledgeBaseDoc() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 lg:p-8 text-white/90 shadow-xl space-y-6">
      <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
        <BookOpen className="w-5 h-5 text-[#00FF88]" />
        <h2 className="text-base font-bold tracking-widest text-white uppercase font-sans">
          Base de Conhecimento: Modelo Quantitativo do Analista
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Diretriz Principal */}
        <div className="bg-[#050608]/40 p-4 rounded border border-white/5 space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#00FF88]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">1. Diretriz de Investimento em Valor</span>
          </div>
          <p className="text-[11px] text-white/60 leading-relaxed font-sans">
            Foco rigoroso em dados e fluxos de caixa reais (Value Investing), separando a narrativa da realidade financeira.
            Monitora distorções de preço, riscos de bolha de inteligência artificial e pontos ótimos de entrada e saída.
          </p>
        </div>

        {/* Termômetro Critico */}
        <div className="bg-[#050608]/40 p-4 rounded border border-white/5 space-y-2">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">2. CAPEX como Termômetro da Bolha</span>
          </div>
          <p className="text-[11px] text-white/60 leading-relaxed font-sans">
            Se Microsoft, Alphabet, Amazon e Meta começarem a estagnar o CAPEX, a Nvidia sofrerá um colapso imediato de receita.
            O CAPEX precisa crescer junto com a receita de Nuvem (Azure, AWS, Google Cloud).
          </p>
        </div>
      </div>

      {/* Critérios da Matriz */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" /> Limites e Alertas Críticos da Matriz de Risco
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] font-mono">
          <div className="bg-white/5 p-3.5 rounded border-l-2 border-[#00FF88] border-y border-r border-white/5">
            <p className="font-bold text-white uppercase tracking-wider">NVIDIA (NVDA)</p>
            <p className="text-white/40 mt-1">Múltiplos altos são aceitos. Alerta crítico se o Forward P/E ultrapassar <span className="text-[#00FF88] font-bold">50x</span>.</p>
          </div>
          <div className="bg-white/5 p-3.5 rounded border-l-2 border-amber-400 border-y border-r border-white/5">
            <p className="font-bold text-white uppercase tracking-wider font-mono">PALANTIR (PLTR)</p>
            <p className="text-white/40 mt-1">Alerta vermelho disparado imediatamente se o P/E ultrapassar <span className="text-amber-400 font-bold">150x</span> sem aceleração correspondente.</p>
          </div>
          <div className="bg-white/5 p-3.5 rounded border-l-2 border-cyan-400 border-y border-r border-white/5">
            <p className="font-bold text-white uppercase tracking-wider">MAGNIFICENT 7 / AVGO</p>
            <p className="text-white/40 mt-1">Operação ideal entre <span className="text-cyan-400 font-bold">25x e 35x</span>. Superior a 40x exige crescimento extraordinário.</p>
          </div>
        </div>
      </div>

      {/* Regras de Decisão */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
        <div className="space-y-2">
          <p className="font-bold text-[#00FF88] uppercase tracking-[0.15em] text-[10px]">🟢 Estratégia de Entrada (Comprar)</p>
          <ul className="list-disc pl-4 space-y-1 text-white/60">
            <li><strong className="text-white">Correção (Drawdown):</strong> Compra fracionada se o Nasdaq 100/ETF VOO recuar &gt;10% sob fundamentos estáveis.</li>
            <li><strong className="text-white">Método DCA:</strong> Aportes mensais fixos constantes para atenuar o risco de entrada em topos de ciclo.</li>
            <li><strong className="text-white">Compressão de Múltiplo:</strong> Ativo de lado enquanto o Lucro por Ação (EPS) sobe, degradando o P/E.</li>
          </ul>
        </div>
        <div className="space-y-2">
          <p className="font-bold text-rose-400 uppercase tracking-[0.15em] text-[10px]">🔴 Estratégia de Saída (Realizar Lucro)</p>
          <ul className="list-disc pl-4 space-y-1 text-white/60">
            <li><strong className="text-white">Desbalanceamento:</strong> Tech &gt;30% do patrimônio exige rebalanceamento imediato para ativos de valor.</li>
            <li><strong className="text-white">Saturação e YoY:</strong> Desaceleração de receita anual por 2 trimestres seguidos sob cotações em alta.</li>
            <li><strong className="text-white">Margem Operacional:</strong> Degradação de margem bruta por concorrência acirrada ou guerra de preços.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
