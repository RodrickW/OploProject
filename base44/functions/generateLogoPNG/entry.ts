import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Use the Core integration to generate the logo image
    const response = await base44.integrations.Core.GenerateImage({
      prompt: "A modern minimalist logo featuring two overlapping rounded rectangles positioned at angles. Left rectangle rotated -20 degrees in light periwinkle blue (#7B8CFF), right rectangle rotated 20 degrees in medium periwinkle blue (#9EAFFF). The rectangles have rounded corners and create a dynamic, flowing design suggesting movement and connection. Clean, professional, minimalist style. Square format 512x512px with transparent background."
    });

    return Response.json({ 
      logoUrl: response.url,
      message: "Logo PNG generated successfully"
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
