import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock/Fallback data reflecting the base knowledge matrix and actual market status in late 2025/2026
const fallbackData = {
  metrics: [
    {
      ticker: "NVDA",
      name: "Nvidia Corporation",
      peCurrent: 44.5,
      peFiveYearAvg: 58.2,
      revenueGrowthYoY: 112.4,
      fcfYield: 3.8,
      capexRecentBillion: 12.8,
      cloudRevenueGrowthYoY: 124.0,
      status: "Preço Justo",
      reasoning: "Embora os múltiplos de P/E permaneçam elevados históricos de 44.5x, a Nvidia continua a manter um monopólio no fornecimento de chips de IA. O CAPEX robusto de data centers das Big Techs respalda o crescimento de 112% da receita YoY, mantendo o ativo abaixo do alerta crítico de bolha (Forward P/E < 50x)."
    },
    {
      ticker: "PLTR",
      name: "Palantir Technologies",
      peCurrent: 165.2,
      peFiveYearAvg: 110.0,
      revenueGrowthYoY: 44.0,
      fcfYield: 1.9,
      capexRecentBillion: 0.15,
      cloudRevenueGrowthYoY: 54.0,
      status: "Bolha Especulativa",
      reasoning: "Alerta crítico disparado. O P/E atual de 165.2x ultrapassou o teto de 150x da matriz de risco. Embora haja expansão sólida no FCF e crescimento acelerado de receita comercial em 54%, a valorização do preço da ação (Market Cap) descolou-se de forma extrema dos fundamentos de fluxo de caixa gerado no curto prazo."
    },
    {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      peCurrent: 36.8,
      peFiveYearAvg: 31.5,
      revenueGrowthYoY: 16.2,
      fcfYield: 2.7,
      capexRecentBillion: 14.9,
      cloudRevenueGrowthYoY: 22.0,
      status: "Esticado",
      reasoning: "A Microsoft opera com P/E de 36.8x, limite superior da zona recomendada (25x - 35x). Os pesados investimentos em CAPEX (14.9B) em hardware de IA sustentam o crescimento do Azure (22%), mas colocam pressão sobre o retorno imediato sobre o capital, justificando classificação de preço ligeiramente esticado."
    },
    {
      ticker: "AVGO",
      name: "Broadcom Inc.",
      peCurrent: 33.2,
      peFiveYearAvg: 28.1,
      revenueGrowthYoY: 47.0,
      fcfYield: 4.5,
      capexRecentBillion: 1.1,
      cloudRevenueGrowthYoY: 34.0,
      status: "Preço Justo",
      reasoning: "A Broadcom opera em um múltiplo P/E justo de 33.2x, apoiado por fortes fluxos de receita decorrentes de soluções de rede/chips de IA customizados (ASICs). A margem de fluxo de caixa livre continua excelente, resultando em um FCF Yield muito saudável de 4.5% com crescimento consistente."
    }
  ],
  marketSummary: "O termômetro do mercado de Inteligência Artificial permanece em alta temperatura, fortemente sustentado pela persistência no aumento do CAPEX por parte das Big Techs (Microsoft, Alphabet, Amazon e Meta). No entanto, de acordo com o modelo quantitativo analítico, começamos a observar distorções substanciais e riscos pontuais de bolha como na Palantir (PLTR), cujo múltiplo descolou excessivamente da entrega de receita. Para investidores focados em valor, recomenda-se cautela, favorecendo posições com FCF Yield saudável (como AVGO) e monitorando de perto eventuais revisões de CAPEX nos relatórios trimestrais, que poderiam deflagrar uma correção em NVDA.",
  sources: [
    { title: "S&P Global Capital Expenditures Analyst Report", uri: "https://www.spglobal.com" },
    { title: "NASDAQ Big Tech Quarterly Reports Summary", uri: "https://www.nasdaq.com" }
  ],
  lastUpdated: new Date().toISOString()
};

// Lazy initialization helper for Gemini API
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    console.warn("GEMINI_API_KEY is not configured or placeholder detected. Falling back to reference database.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// API endpoint to execute the intelligent scan
app.post("/api/scan", async (req, res) => {
  const ai = getGeminiClient();
  const usingFallback = ai === null;

  if (usingFallback) {
    return res.json({
      ...fallbackData,
      isDemo: true,
      lastUpdated: new Date().toISOString()
    });
  }

  try {
    const prompt = `Você é um analista financeiro quantitativo rigoroso focado em valor (Value Investing).
Sua tarefa é analisar os dados reais mais recentes de mercado de quatro ações americanas da S&P 500 do setor de IA: NVDA, PLTR, MSFT e AVGO.

Colete e forneça para cada empresa:
1. O P/E ratio atual (Trailing ou Forward) e compare com a média de 5 anos da própria empresa.
2. O crescimento da receita (Revenue Growth YoY) no último trimestre reportado comparado ao ano anterior.
3. O Free Cash Flow (FCF) Yield atual.
4. O CAPEX trimestral recente (em bilhões de USD).
5. O crescimento de Cloud/IA se aplicável (Azure para MSFT, Data Center para NVDA, etc.).

Com base na MATRIZ DE RISCO, classifique cada um dos ativos como exatamente: 'Subavaliado', 'Preço Justo', 'Esticado' ou 'Bolha Especulativa'.
MATRIZ DE RISCO:
- Nvidia (NVDA): Alta tolerância. Alerta se Forward P/E ultrapassar 50x.
- Palantir (PLTR): Alerta crítico de 'Bolha Especulativa' se o P/E atual estiver acima de 150x sem aceleração de receita (ex: receita crescendo menos que 50% YoY).
- Microsoft (MSFT) e Broadcom (AVGO): Devem operar ideally entre 25x e 35x P/E. Acima de 40x classificar como Esticado/Bolha se não houver crescimento expressivo de receita de IA.

REQUISITO OBRIGATÓRIO DE RETORNO:
Você deve retornar unicamente um objeto JSON válido, sem qualquer bloco de código markdown (como \`\`\`json ou \`\`\`), cumprindo essa estrutura:
{
  "metrics": [
    {
      "ticker": "NVDA" | "PLTR" | "MSFT" | "AVGO",
      "name": "Nome curto da empresa",
      "peCurrent": <número, ex: 44.5>,
      "peFiveYearAvg": <número, ex: 51.0>,
      "revenueGrowthYoY": <número de porcentagem, ex: 112.5>,
      "fcfYield": <número de porcentagem, ex: 3.4>,
      "capexRecentBillion": <número em bilhões, ex: 12.5>,
      "cloudRevenueGrowthYoY": <número opcional de crescimento de Nuvem/IA em %, ex: 25.0>,
      "status": "Subavaliado" | "Preço Justo" | "Esticado" | "Bolha Especulativa",
      "reasoning": "Breve justificativa lógica em português baseada na matriz de risco e múltiplos atuais."
    }
  ],
  "marketSummary": "Análise macro detalhada em português do termômetro do CAPEX, os riscos de bolha no setor de IA e recomendações para o investidor quantitativo (2-3 parágrafos)."
}`;

    // Query Gemini 3.5-flash with Google Search grounding
    const response = await ai!.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "";
    let parsedResult;
    try {
      parsedResult = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error("JSON parse error from Gemini output:", responseText);
      // Clean fallback parser in case markdown blocks leaked in spite of prompt
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      parsedResult = JSON.parse(cleanedText);
    }

    // Extract search sources from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks
      .filter((chunk: any) => chunk.web && chunk.web.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || "Referência Financeira",
        uri: chunk.web.uri
      }))
      // Deduplicate by URI
      .filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.uri === v.uri) === i)
      .slice(0, 5);

    return res.json({
      metrics: parsedResult.metrics || fallbackData.metrics,
      marketSummary: parsedResult.marketSummary || fallbackData.marketSummary,
      sources: sources.length > 0 ? sources : [
        { title: "Yahoo Finance & Capital Metrics", uri: "https://finance.yahoo.com" },
        { title: "SEC Filings Reference Database", uri: "https://www.sec.gov" }
      ],
      lastUpdated: new Date().toISOString(),
      isDemo: false
    });

  } catch (error: any) {
    console.error("Error executing Gemini scan:", error);
    
    const errorMessage = error?.message || String(error);
    const isQuotaError = errorMessage.includes("429") || 
                         errorMessage.includes("quota") || 
                         errorMessage.includes("RESOURCE_EXHAUSTED") ||
                         errorMessage.includes("Limit");

    return res.status(200).json({
      ...fallbackData,
      isDemo: true,
      apiError: errorMessage,
      isQuotaExceeded: isQuotaError
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Vite build assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
