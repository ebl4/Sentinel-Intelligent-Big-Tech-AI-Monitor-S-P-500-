import React from "react";
import { StockMetric } from "../types";
import { ArrowUpRight, ArrowDownRight, Flame, ShieldCheck, HelpCircle, Activity, ChevronRight } from "lucide-react";

interface MetricCardProps {
  initialMetric: StockMetric;
  onOverride: (ticker: string, updated: StockMetric) => void;
  isCustomized: boolean;
  key?: string;
}

export function MetricCard({ initialMetric, onOverride, isCustomized }: MetricCardProps) {
  const { ticker, name, peCurrent, peFiveYearAvg, revenueGrowthYoY, fcfYield, capexRecentBillion, cloudRevenueGrowthYoY, reasoning, status } = initialMetric;

  // Derive customized rating dynamically based on matrix constraints if overridden
  const evaluateStatus = (
    tk: string,
    pe: number,
    growth: number,
    fcf: number,
    capex: number
  ): "Subavaliado" | "Preço Justo" | "Esticado" | "Bolha Especulativa" => {
    if (tk === "NVDA") {
      if (pe > 50) return "Bolha Especulativa";
      if (pe > 42) return "Esticado";
      if (pe < 28) return "Subavaliado";
      return "Preço Justo";
    }
    if (tk === "PLTR") {
      if (pe > 150) return "Bolha Especulativa";
      if (pe > 100) return "Esticado";
      if (pe < 55) return "Subavaliado";
      return "Preço Justo";
    }
    // MSFT and AVGO
    if (pe > 40) return "Bolha Especulativa";
    if (pe > 34) return "Esticado";
    if (pe < 24) return "Subavaliado";
    return "Preço Justo";
  };

  const handlePeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const newStatus = evaluateStatus(ticker, val, revenueGrowthYoY, fcfYield, capexRecentBillion);
    onOverride(ticker, {
      ...initialMetric,
      peCurrent: val,
      status: newStatus,
      reasoning: `[Simulação] múltiplo de P/E ajustado pelo usuário para ${val}x. O status mudou de forma automatizada conforme as diretrizes quantitativas.`
    });
  };

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onOverride(ticker, {
      ...initialMetric,
      revenueGrowthYoY: val
    });
  };

  const handleFcfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onOverride(ticker, {
      ...initialMetric,
      fcfYield: val
    });
  };

  const handleCapexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onOverride(ticker, {
      ...initialMetric,
      capexRecentBillion: val
    });
  };

  // Setup company aesthetics
  const getBrandDetails = (tk: string) => {
    switch (tk) {
      case "NVDA":
        return {
          logoColor: "text-[#00FF88]",
          bgColor: "bg-white/5",
          borderColor: "border-white/10 hover:border-[#00FF88]/50",
          gradient: "gradient-card-nvda",
          tint: "emerald"
        };
      case "PLTR":
        return {
          logoColor: "text-amber-400",
          bgColor: "bg-white/5",
          borderColor: "border-white/10 hover:border-amber-400/50",
          gradient: "gradient-card-pltr",
          tint: "amber"
        };
      case "MSFT":
        return {
          logoColor: "text-sky-400",
          bgColor: "bg-white/5",
          borderColor: "border-white/10 hover:border-sky-400/50",
          gradient: "gradient-card-msft",
          tint: "sky"
        };
      case "AVGO":
        return {
          logoColor: "text-rose-400",
          bgColor: "bg-white/5",
          borderColor: "border-white/10 hover:border-rose-400/50",
          gradient: "gradient-card-avgo",
          tint: "rose"
        };
      default:
        return {
          logoColor: "text-slate-400",
          bgColor: "bg-white/5",
          borderColor: "border-white/10",
          gradient: "bg-slate-900",
          tint: "slate"
        };
    }
  };

  const brand = getBrandDetails(ticker);

  // Status Badge styles
  const getStatusBadge = (st: string) => {
    switch (st) {
      case "Subavaliado":
        return {
          bg: "bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88] font-bold uppercase",
          icon: <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#00FF88]" />,
          glow: "glow-subavaliado"
        };
      case "Preço Justo":
        return {
          bg: "bg-[#00FF88]/10 border-[#00FF88]/20 text-[#00FF88] font-bold uppercase",
          icon: <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#00FF88]" />,
          glow: "glow-justo"
        };
      case "Esticado":
        return {
          bg: "bg-amber-400/10 border-amber-400/20 text-amber-400 font-bold uppercase",
          icon: <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />,
          glow: "glow-esticado"
        };
      case "Bolha Especulativa":
        return {
          bg: "bg-rose-500/10 border-rose-500/20 text-rose-500 font-bold uppercase animate-pulse",
          icon: <Flame className="w-3.5 h-3.5 mr-1 text-rose-500" />,
          glow: "glow-bolha"
        };
      default:
        return {
          bg: "bg-white/5 border-white/10 text-slate-300 uppercase",
          icon: null,
          glow: ""
        };
    }
  };

  const { bg: badgeBg, icon: badgeIcon, glow: glowClass } = getStatusBadge(status);

  // Math variables
  const premiumPercent = peFiveYearAvg ? ((peCurrent - peFiveYearAvg) / peFiveYearAvg) * 100 : 0;

  return (
    <div className={`relative overflow-hidden rounded-lg border ${brand.borderColor} ${brand.gradient} ${glowClass} p-5 bg-white/5 transition-all duration-300 flex flex-col justify-between h-full`}>
      
      {/* Main card header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xl font-bold font-mono tracking-tighter ${brand.logoColor}`}>{ticker}</span>
              {isCustomized && (
                <span className="text-[8px] bg-white/10 border border-white/10 font-mono px-1.5 py-0.5 rounded text-indigo-300 uppercase tracking-wider">
                  SIM
                </span>
              )}
            </div>
            <h3 className="text-xs font-semibold text-white/70 mt-1 line-clamp-1">{name}</h3>
          </div>
          <span className={`flex items-center text-[9px] border px-2 py-0.5 rounded ${badgeBg}`}>
            {badgeIcon}
            {status === "Bolha Especulativa" ? "Bolha" : status}
          </span>
        </div>

        {/* Dynamic metrics readout */}
        <div className="grid grid-cols-2 gap-3 bg-[#050608]/60 p-3 rounded border border-white/5 font-mono">
          <div>
            <span className="text-[9px] text-white/40 uppercase block">P/E ATUAL</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="text-lg font-bold text-white tracking-tight">{peCurrent.toFixed(1)}x</span>
              <span className={`text-[9px] flex items-center ${premiumPercent > 0 ? 'text-rose-400' : 'text-[#00FF88]'}`}>
                {premiumPercent > 0 ? "+" : ""}
                {premiumPercent.toFixed(0)}%
              </span>
            </div>
          </div>

          <div>
            <span className="text-[9px] text-white/40 uppercase block">P/E MÉDIO (5Y)</span>
            <div className="text-lg font-bold text-white/70 mt-0.5">{peFiveYearAvg ? `${peFiveYearAvg.toFixed(1)}x` : 'N/A'}</div>
          </div>

          <div>
            <span className="text-[9px] text-white/40 uppercase block">CRESC. RECEITA (YoY)</span>
            <div className="text-lg font-bold text-[#00FF88] mt-0.5">+{revenueGrowthYoY.toFixed(1)}%</div>
          </div>

          <div>
            <span className="text-[9px] text-white/40 uppercase block">FCF YIELD</span>
            <div className="text-lg font-bold text-cyan-400 mt-0.5">{fcfYield.toFixed(2)}%</div>
          </div>
        </div>

        {/* Narrative reasoning */}
        <div className="space-y-1">
          <span className="text-[9px] font-bold tracking-wider text-white/40 block uppercase">Avaliação do Modelo:</span>
          <p className="text-[11px] text-white/70 leading-relaxed bg-[#050608]/40 p-3 rounded border border-white/5 min-h-[72px]">
            {reasoning}
          </p>
        </div>

        {/* Extra critical parameters */}
        <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-4 text-[10px] text-white/50 font-mono">
          <div>
            <span className="text-[8px] text-white/30 uppercase block">CAPEX TRIMESTRAL</span>
            <span className="font-semibold text-white/80">{capexRecentBillion.toFixed(2)}B USD</span>
          </div>
          {cloudRevenueGrowthYoY !== undefined && (
            <div>
              <span className="text-[8px] text-white/30 uppercase block">CRESC. CLOUD/IA</span>
              <span className="font-semibold text-indigo-300">+{cloudRevenueGrowthYoY.toFixed(1)}% YoY</span>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Sliders */}
      <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00FF88] block flex items-center space-x-1">
          <Activity className="w-3 h-3 text-[#00FF88]" />
          <span>Controles de Teste Estressado</span>
        </span>

        {/* P/E Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-mono">
            <span className="text-white/40 uppercase">P/E Múltiplo:</span>
            <span className="text-[#00FF88] font-bold">{peCurrent.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="10"
            max="220"
            step="1"
            value={peCurrent}
            onChange={handlePeChange}
            className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-[#00FF88]"
          />
        </div>

        {/* Expandable granular sliders */}
        <div className="space-y-3 pt-1">
          {/* Revenue growth slider */}
          <div className="space-y-1 text-white/40">
            <div className="flex justify-between text-[9px] font-mono">
              <span className="uppercase">Cresc. Receita YoY:</span>
              <span className="font-mono text-[#00FF88] font-bold">{revenueGrowthYoY.toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={revenueGrowthYoY}
              onChange={handleRevenueChange}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-[#00FF88]"
            />
          </div>

          {/* FCF Yield slider */}
          <div className="space-y-1 text-white/40">
            <div className="flex justify-between text-[9px] font-mono">
              <span className="uppercase">FCF Yield:</span>
              <span className="font-mono text-cyan-400 font-bold">{fcfYield.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="15.0"
              step="0.1"
              value={fcfYield}
              onChange={handleFcfChange}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* CAPEX slider */}
          <div className="space-y-1 text-white/40">
            <div className="flex justify-between text-[9px] font-mono">
              <span className="uppercase">CAPEX ($B):</span>
              <span className="font-mono text-indigo-300 font-bold">{capexRecentBillion.toFixed(1)}B</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="30.0"
              step="0.5"
              value={capexRecentBillion}
              onChange={handleCapexChange}
              className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-indigo-400"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
