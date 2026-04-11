import harmfulKeywords from '../data/harmful_keywords.json';
import fakeNewsPatterns from '../data/fake_news_patterns.json';
import suspiciousPhrases from '../data/suspicious_phrases.json';
import misleadingClaims from '../data/misleading_claims.json';
import severityMapping from '../data/severity_mapping.json';

export function analyzeTextOffline(text: string) {
  const lowerText = text.toLowerCase();
  const detectedIssues: string[] = [];
  const matchedSignals: string[] = [];
  let riskScore = 0;

  // 1. Check Keywords (Harmful, Fake News, Abusive, Scam, Violence, Panic)
  Object.entries(harmfulKeywords).forEach(([category, keywords]) => {
    keywords.forEach(word => {
      if (lowerText.includes(word.toLowerCase())) {
        matchedSignals.push(word);
        if (!detectedIssues.includes(category)) {
          detectedIssues.push(category);
        }
        // Weighted scoring based on category
        if (category === 'violence' || category === 'hate_speech') riskScore += 25;
        else if (category === 'panic' || category === 'scam') riskScore += 20;
        else riskScore += 10;
      }
    });
  });

  // 2. Check Fake News Patterns
  fakeNewsPatterns.patterns.forEach(pattern => {
    if (lowerText.includes(pattern.toLowerCase())) {
      matchedSignals.push(pattern);
      if (!detectedIssues.includes("fake_news_pattern")) {
        detectedIssues.push("fake_news_pattern");
      }
      riskScore += 30;
    }
  });

  // 3. Check Suspicious Phrases (Threats, Stalking)
  suspiciousPhrases.phrases.forEach(phrase => {
    if (lowerText.includes(phrase.toLowerCase())) {
      matchedSignals.push(phrase);
      if (!detectedIssues.includes("suspicious_intent")) {
        detectedIssues.push("suspicious_intent");
      }
      riskScore += 40;
    }
  });

  // 4. Check Misleading Claims & Community Targeting
  misleadingClaims.claims.forEach(claim => {
    if (lowerText.includes(claim.toLowerCase())) {
      matchedSignals.push(claim);
      if (!detectedIssues.includes("misleading_claim")) {
        detectedIssues.push("misleading_claim");
      }
      riskScore += 15;
    }
  });

  misleadingClaims.community_targeting.forEach(target => {
    if (lowerText.includes(target.toLowerCase())) {
      matchedSignals.push(target);
      if (!detectedIssues.includes("community_targeting")) {
        detectedIssues.push("community_targeting");
      }
      riskScore += 35;
    }
  });

  // 5. Context-aware scoring (e.g., multiple exclamation marks, all caps)
  if (/[A-Z]{5,}/.test(text)) {
    riskScore += 5; // Shouting
    if (!detectedIssues.includes("aggressive_tone")) detectedIssues.push("aggressive_tone");
  }
  if (/[!?]{3,}/.test(text)) {
    riskScore += 5; // Emotional manipulation
    if (!detectedIssues.includes("emotional_manipulation")) detectedIssues.push("emotional_manipulation");
  }

  riskScore = Math.min(riskScore, 100);
  
  let category = "Safe";
  if (riskScore > 90) category = "Critical";
  else if (riskScore > 75) category = "Harmful";
  else if (riskScore > 50) category = "Suspicious";
  else if (riskScore > 20) category = "Low Risk";

  return {
    category,
    riskScore,
    confidence: 90, // Increased confidence with larger dataset
    detectedIssues,
    matchedSignals: Array.from(new Set(matchedSignals)), // Unique signals
    explanation: `Offline analysis identified ${matchedSignals.length} specific risk indicators across ${detectedIssues.length} categories. The content shows patterns consistent with ${detectedIssues.join(', ')}.`,
    recommendation: riskScore > 75 ? "Escalate for urgent review and consider legal notice." : riskScore > 50 ? "Flag for human review and keep under observation." : "No immediate action needed, but continue monitoring."
  };
}
