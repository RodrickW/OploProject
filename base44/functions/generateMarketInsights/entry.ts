import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get recent market news
    const recentNews = await base44.asServiceRole.entities.MarketNews.list('-created_date', 20);
    
    // Get current restaurants data
    const restaurants = await base44.asServiceRole.entities.Restaurant.list();
    
    // Generate insights based on news
    const insightsData = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un consultant stratégique pour un groupe de restaurants haut de gamme.

Données du groupe :
${restaurants.map(r => `- ${r.name} : ${r.monthly_revenue}€/mois, ${r.type}, ${r.satisfaction_score}/5`).join('\n')}

Actualités récentes du marché :
${recentNews.map(n => `[${n.category}] ${n.title} - ${n.summary}`).join('\n\n')}

Génère 3 à 5 insights stratégiques pertinents qui :
1. Connectent les actualités du marché aux opportunités/menaces pour ce groupe
2. Sont actionnables et concrets
3. Ont un impact business quantifiable
4. Sont prioritisés par urgence

Pour chaque insight, fournis :
- Un titre accrocheur
- Une description détaillée (3-4 phrases)
- La priorité (critical/high/medium/low)
- La catégorie COMPAST pertinente
- L'impact estimé en euros
- Une action recommandée concrète`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                priority: { type: "string" },
                category: { type: "string" },
                impact_value: { type: "number" },
                recommended_action: { type: "string" }
              }
            }
          }
        }
      }
    });

    // Save insights
    const savedInsights = [];
    for (const insight of insightsData.insights || []) {
      const saved = await base44.asServiceRole.entities.Insight.create({
        title: insight.title,
        description: insight.description,
        priority: insight.priority || 'medium',
        category: insight.category || 'market',
        status: 'new',
        impact_value: insight.impact_value || 0,
        recommended_action: insight.recommended_action
      });
      savedInsights.push(saved);
    }

    return Response.json({
      success: true,
      insightsCount: savedInsights.length,
      insights: savedInsights,
      basedOnNewsCount: recentNews.length
    });

  } catch (error) {
    console.error('Error generating market insights:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});