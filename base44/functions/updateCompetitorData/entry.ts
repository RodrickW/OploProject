import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get our restaurants to compare
    const ourRestaurants = await base44.asServiceRole.entities.Restaurant.list();
    
    // Get current competitors
    const existingCompetitors = await base44.asServiceRole.entities.Competitor.list();

    // Update competitor data with real-time web search
    const competitorData = await base44.integrations.Core.InvokeLLM({
      prompt: `Tu es un analyste de la concurrence pour des restaurants haut de gamme à Paris.

Nos restaurants :
${ourRestaurants.map(r => `- ${r.name} : ${r.type}, note ${r.satisfaction_score}/5, ${r.city}`).join('\n')}

Concurrents existants à analyser :
${existingCompetitors.map(c => `- ${c.name} (${c.city})`).join('\n')}

Recherche et analyse pour CHAQUE concurrent :
1. Note Google actuelle et nombre d'avis
2. Fourchette de prix (€, €€, €€€, €€€€)
3. Type de cuisine et spécialités
4. Points forts (d'après les avis clients) - liste de 3-5 éléments
5. Points faibles identifiés - liste de 2-3 éléments
6. Capacité estimée (couverts)
7. CA mensuel estimé
8. Niveau de menace (critical/high/medium/low)
9. Avantages compétitifs : qu'est-ce qui les rend meilleurs que nos établissements ?
10. Changements récents (nouveau chef, rénovation, nouveau menu, etc.)

Sois précis et factuel. Base-toi sur les avis clients récents et les informations publiques.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          competitors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                address: { type: "string" },
                city: { type: "string" },
                google_rating: { type: "number" },
                review_count: { type: "number" },
                price_range: { type: "string" },
                cuisine_type: { type: "string" },
                strengths: { type: "array", items: { type: "string" } },
                weaknesses: { type: "array", items: { type: "string" } },
                threat_level: { type: "string" },
                estimated_revenue: { type: "number" },
                capacity: { type: "number" },
                specialties: { type: "array", items: { type: "string" } },
                recent_changes: { type: "string" },
                competitive_advantages: { type: "string" },
                website: { type: "string" },
                phone: { type: "string" }
              }
            }
          }
        }
      }
    });

    // Update each competitor
    const updated = [];
    for (const comp of competitorData.competitors || []) {
      const existing = existingCompetitors.find(e => e.name === comp.name);
      
      if (existing) {
        const updatedComp = await base44.asServiceRole.entities.Competitor.update(existing.id, {
          ...comp,
          last_updated: new Date().toISOString()
        });
        updated.push(updatedComp);
      } else {
        const newComp = await base44.asServiceRole.entities.Competitor.create({
          ...comp,
          last_updated: new Date().toISOString()
        });
        updated.push(newComp);
      }
    }

    return Response.json({
      success: true,
      updated: updated.length,
      competitors: updated
    });

  } catch (error) {
    console.error('Error updating competitor data:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});