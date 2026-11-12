import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Gemini client on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = Number(process.env.PORT || 3000);

  // API Routes for Gemini AI features in OmniDesk CRM
  app.post("/api/gemini/suggest-reply", async (req, res) => {
    try {
      const { customerName, channel, lastMessage, conversationHistory, companyContext } = req.body;
      
      const prompt = `Você é um assistente de atendimento ao cliente sênior.
Contexto da empresa: ${companyContext || "Central de Atendimento ao Cliente"}
Cliente: ${customerName}
Canal: ${channel} (WhatsApp, Instagram ou E-mail)
Última mensagem do cliente: "${lastMessage}"
Histórico recente da conversa:
${JSON.stringify(conversationHistory || [])}

Escreva 3 opções de resposta profissional, empática e prestativa em português do Brasil que o atendente possa enviar rapidamente.
Formate a resposta estritamente como um objeto JSON válido com a seguinte estrutura:
{
  "suggestions": [
    { "title": "Orçamento / Agendamento", "text": "..." },
    { "title": "Informação / Esclarecimento", "text": "..." },
    { "title": "Confirmação", "text": "..." }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          systemInstruction: "Você é um especialista em atendimento omnichannel com foco em excelência, clareza e agilidade.",
        },
      });

      const text = response.text || "{}";
      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error("Error in suggest-reply:", error);
      res.status(500).json({ error: error.message || "Erro ao gerar sugestões de resposta." });
    }
  });

  app.post("/api/gemini/chatbot", async (req, res) => {
    try {
      const { message, conversationHistory, knowledgeBase, companyContext } = req.body;
      const prompt = `Você é o assistente virtual automatizado da empresa. Sua função é atender clientes no WhatsApp, Instagram e Widget do site com simpatia, agilidade e precisão técnica quando a equipe humana estiver offline.
Contexto da empresa: ${companyContext || "Atendimento ao Cliente"}
Base de Conhecimento da empresa:
${JSON.stringify(knowledgeBase)}

Histórico recente da conversa:
${JSON.stringify(conversationHistory || [])}

Mensagem do cliente: "${message}"

Responda como o bot da empresa. Se o cliente quiser agendar um atendimento ou solicitar orçamento, oriente cordialmente sobre os dados necessários e informe que nossa equipe confirmará em instantes. Responda em português do Brasil.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction: "Você é o assistente virtual oficial da empresa. Seja prestativo, profissional e resolutivo.",
        },
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Error in chatbot:", error);
      res.status(500).json({ error: error.message || "Erro no bot de atendimento." });
    }
  });

  app.post("/api/gemini/generate-caption", async (req, res) => {
    try {
      const { topic } = req.body;
      const prompt = `Crie uma legenda cativante, profissional e otimizada para redes sociais (Instagram e Facebook) sobre o seguinte tema: "${topic || 'Novidades e dicas para nossos clientes'}".
Inclua hashtags populares, uma chamada para ação (CTA) para o cliente entrar em contato ou chamar no WhatsApp. Responda apenas com o texto da legenda pronta para publicar.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ caption: response.text });
    } catch (error: any) {
      console.error("Error in generate-caption:", error);
      res.status(500).json({ error: error.message || "Erro ao gerar legenda." });
    }
  });

  app.post("/api/gemini/summarize", async (req, res) => {
    try {
      const { conversationMessages } = req.body;

      const prompt = `Resuma a seguinte conversa de atendimento ao cliente em 3 pontos principais (Contexto do problema, Ações tomadas/em andamento, Próximo passo recomendado). Responda em português do Brasil em formato JSON:
{
  "summary": "...",
  "issue": "...",
  "statusRecommendation": "..."
}
Conversa:
${JSON.stringify(conversationMessages)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Error in summarize:", error);
      res.status(500).json({ error: error.message || "Erro ao resumir conversa." });
    }
  });

  app.post("/api/gemini/sentiment", async (req, res) => {
    try {
      const { message } = req.body;

      const prompt = `Analise o sentimento da seguinte mensagem de cliente e classifique em um dos três: "Positivo", "Neutro" ou "Frustrado/Urgente". Dê também uma pontuação de urgência de 1 a 5 e um breve motivo. Responda em JSON:
{
  "sentiment": "Positivo | Neutro | Frustrado/Urgente",
  "urgencyScore": 3,
  "reason": "..."
}
Mensagem: "${message}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("Error in sentiment:", error);
      res.status(500).json({ error: error.message || "Erro ao analisar sentimento." });
    }
  });

  app.post("/api/gemini/kb-search", async (req, res) => {
    try {
      const { query, knowledgeBase } = req.body;

      const prompt = `Com base na base de conhecimento abaixo, responda à pergunta do atendente para ajudar a responder o cliente com precisão. Responda em português de forma clara e direta.
Base de Conhecimento:
${JSON.stringify(knowledgeBase)}

Pergunta do Atendente: "${query}"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ answer: response.text });
    } catch (error: any) {
      console.error("Error in kb-search:", error);
      res.status(500).json({ error: error.message || "Erro ao buscar na base de conhecimento." });
    }
  });

  // VPS Proxy Route to bypass Mixed Content (HTTP on HTTPS) and CORS issues
  app.post("/api/proxy/evolution", async (req, res) => {
    try {
      const { targetUrl, method, apiKey, body } = req.body;

      if (!targetUrl) {
        return res.status(400).json({ error: "URL de destino é obrigatória." });
      }

      const response = await fetch(targetUrl, {
        method: method || "GET",
        headers: {
          "apikey": apiKey || "",
          "Content-Type": "application/json"
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json().catch(() => ({}));
      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Erro ao conectar com a VPS via Proxy." });
    }
  });

  // Vite middleware setup for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OmniDesk CRM Server running on http://localhost:${PORT}`);
  });
}

startServer();
