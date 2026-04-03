import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get latest market news and trends
    const marketData = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un analyste de marché spécialisé dans la restauration en France.

Recherche et analyse les actualités les plus récentes (dernières 24h) concernant :
- Le marché de la restauration en France
- Les tendances émergentes
- Les nouveaux concurrents ou changements dans la concurrence
- Les nouvelles réglementations
- Les innovations technologiques dans la restauration
- Les changements économiques impactant la restauration

Pour chaque actualité trouvée, fournis :
- Un titre concis
- Un résumé de 2-3 phrases
- La source
- La catégorie (trends/competitors/regulations/technology/economy)
- L'impact potentiel (high/medium/low)
- L'URL source si disponible
- La date

Focus sur les actualités pertinentes pour un groupe de restaurants haut de gamme à Paris.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          news: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                summary: { type: "string" },
                source: { type: "string" },
                category: { type: "string" },
                impact: { type: "string" },
                url: { type: "string" },
                date: { type: "string" }
              }
            }
          }
        }
      }
    });

    // Save each news item
    const savedNews = [];
    for (const newsItem of marketData.news || []) {
      const saved = await base44.asServiceRole.entities.MarketNews.create({
        title: newsItem.title,
        summary: newsItem.summary,
        source: newsItem.source || 'Internet',
        category: newsItem.category || 'trends',
        impact: newsItem.impact || 'medium',
        url: newsItem.url || '',
        date: newsItem.date || new Date().toISOString().split('T')[0]
      });
      savedNews.push(saved);
    }

    return Response.json({
      success: true,
      newsCount: savedNews.length,
      news: savedNews
    });

  } catch (error) {
    console.error('Error updating market data:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});