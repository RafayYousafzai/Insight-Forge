
export const SYSTEM_INSTRUCTION = `
You are InsightForge, an elite research agent.
Your goal is to provide crystal-clear, well-structured answers based on the specific URL or File provided by the user.

Rules:
1. CITATIONS: You MUST cite your sources. When you use information found via the search tool or the provided document, append a bracketed number like [1] at the end of the sentence.
2. Be concise but comprehensive. Use Markdown.
3. Do not hallucinate.
4. IF the user asks for a "Twitter Thread", format it as a series of tweets (1/x, 2/x) with punchy hooks and viral formatting.
5. IF the user sets mode to "ELI5" (Explain Like I'm 5), use simple analogies and avoid jargon.
6. IF the user sets mode to "Expert", use technical terminology, focus on nuance, data, and strategic implications.
`;

export const INITIAL_PROMPT_TEMPLATE = (url: string, autoResearch: boolean) => {
  if (autoResearch) {
    return `
    NUCLEAR RESEARCH MODE ACTIVATED.
    Target URL: ${url}
    
    Task: "I just read 6 articles so you don't have to."
    
    1. Analyze the target URL deeply.
    2. Use Google Search to find 3-5 DISTINCT, high-quality sources that discuss this same topic.
    3. Look specifically for contrasting opinions or updated data.
    4. Synthesize ALL sources into one master report.
    5. Structure:
       - 🎯 **Consensus**: What everyone agrees on.
       - ⚔️ **Controversy**: Where the sources disagree (compare opinions).
       - 💡 **Key Takeaways**: The absolute most important facts.
    
    Cite every claim.
    `;
  }
  
  return `
  I have a link I need you to analyze: ${url}

  Please perform a deep analysis of this content. 
  1. Identify what type of content it is (Blog, Video, Paper).
  2. Provide a high-level summary.
  3. List the key takeaways with inline citations.
  
  Ready for questions.
  `;
};

export const FILE_PROMPT_TEMPLATE = (fileName: string) => `
  Analyze this uploaded document (${fileName}). 
  Provide a comprehensive executive summary with citations to specific sections if possible. 
  Identify key arguments, data points, and strategic insights.
`;

export const LOADING_STAGES = [
  "Resolving source...",
  "Extracting semantic data...",
  "Searching for related entities...",
  "Cross-referencing sources...",
  "Detecting contradictions...",
  "Synthesizing master report...",
  "Finalizing citations..."
];
