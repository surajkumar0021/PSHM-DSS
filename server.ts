import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import chatbotKnowledge from './src/data/chatbot_knowledge.json';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Mock database for history
  const analysisHistory: any[] = [];

  // API Routes
  app.get("/api/dashboard/summary", (req, res) => {
    const total = analysisHistory.length;
    const risky = analysisHistory.filter(h => h.riskScore > 50).length;
    const safe = total - risky;
    
    res.json({
      totalAnalyses: total,
      safeAnalyses: safe,
      riskyAnalyses: risky,
      recentAnalyses: analysisHistory.slice(-5).reverse(),
      modeUsage: {
        api: analysisHistory.filter(h => h.mode === 'API').length,
        offline: analysisHistory.filter(h => h.mode === 'Offline').length
      }
    });
  });

  app.get("/api/reports", (req, res) => {
    res.json(analysisHistory.slice().reverse());
  });

  app.post("/api/analyze/save", (req, res) => {
    const report = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body
    };
    analysisHistory.push(report);
    res.json({ success: true, report });
  });

  app.post("/api/action/fir", (req, res) => {
    res.json({ success: true, message: "FIR Filed Successfully (Demo Only)" });
  });

  app.post("/api/action/notice", (req, res) => {
    res.json({ success: true, message: "Notice Sent Successfully (Demo Only)" });
  });

  // Chatbot API
  app.post("/api/chatbot/query", (req, res) => {
    const { message } = req.body;
    const query = message.toLowerCase();
    
    let bestMatch = null;
    let maxMatches = 0;

    // Search through knowledge base
    chatbotKnowledge.categories.forEach(category => {
      category.knowledge.forEach(k => {
        // Count how many keywords are present in the query
        const matches = k.keywords.filter(kw => query.includes(kw.toLowerCase())).length;
        
        // Also check if the query is very similar to one of the category's questions
        const questionMatch = category.questions.some(q => q.toLowerCase().includes(query) || query.includes(q.toLowerCase()));
        
        const totalScore = matches + (questionMatch ? 2 : 0);

        if (totalScore > maxMatches) {
          maxMatches = totalScore;
          bestMatch = k.answer;
        }
      });
    });

    if (bestMatch && maxMatches > 0) {
      res.json({ 
        answer: bestMatch,
        type: 'knowledge'
      });
    } else {
      res.json({ 
        answer: "I'm sorry, I don't have specific information on that topic in my offline knowledge base. Please try asking about social media laws, posting guidance (dos/donts), or human rights.",
        type: 'fallback'
      });
    }
  });

  app.get("/api/chatbot/suggestions", (req, res) => {
    const { q } = req.query;
    const query = (q as string || '').toLowerCase();
    
    const allQuestions = chatbotKnowledge.categories.flatMap(c => c.questions);
    
    if (!query) {
      // Return default suggestions if no query
      return res.json(allQuestions.slice(0, 6));
    }

    // Filter questions that contain the query or have keywords matching the query
    const filtered = allQuestions.filter(question => 
      question.toLowerCase().includes(query)
    );

    // If not enough direct matches, look at keywords
    if (filtered.length < 3) {
      chatbotKnowledge.categories.forEach(category => {
        category.knowledge.forEach(k => {
          if (k.keywords.some(kw => kw.toLowerCase().includes(query)) && !filtered.includes(category.questions[0])) {
            filtered.push(...category.questions.filter(q => !filtered.includes(q)));
          }
        });
      });
    }

    res.json(Array.from(new Set(filtered)).slice(0, 5));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
