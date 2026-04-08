import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, aspect_ratio = '1:1', style = 'vivid' } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

    if (!apiKey || !baseUrl) {
      return new Response(
        JSON.stringify({ error: 'OnSpace AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build enhanced prompt with style
    const styleMap: Record<string, string> = {
      vivid: 'vibrant colors, highly detailed, professional photography',
      natural: 'natural lighting, realistic, photorealistic',
      artistic: 'artistic, painterly, expressive brushstrokes, fine art style',
      anime: 'anime style, manga illustration, japanese animation art',
      'fantasy': 'fantasy art, magical, ethereal, epic cinematic',
      'cyberpunk': 'cyberpunk aesthetic, neon lights, futuristic cityscape, dark atmosphere',
    };
    const styleHint = styleMap[style] || '';
    const enhancedPrompt = styleHint ? `${prompt.trim()}, ${styleHint}` : prompt.trim();

    console.log('Generating image:', { prompt: enhancedPrompt, aspect_ratio, model: 'google/gemini-2.5-flash-image' });

    // Call OnSpace AI
    const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        modalities: ['image', 'text'],
        messages: [
          {
            role: 'user',
            content: enhancedPrompt,
          },
        ],
        image_config: {
          aspect_ratio,
          image_size: '1K',
        },
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('OnSpace AI error:', errText);
      return new Response(
        JSON.stringify({ error: `OnSpace AI: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    // Extract image base64
    const imageUrl: string | undefined = aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textContent: string = aiData?.choices?.[0]?.message?.content || '';

    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(aiData).slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'No image returned from AI model' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert base64 data URL to Blob
    const base64Data = imageUrl.split(',')[1];
    const binaryData = atob(base64Data);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/png' });

    // Upload to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const fileName = `generated/${crypto.randomUUID()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, blob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      // Return base64 directly as fallback
      return new Response(
        JSON.stringify({ imageUrl, textContent, stored: false }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    console.log('Image stored at:', publicUrl);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, textContent, stored: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: `Internal error: ${err instanceof Error ? err.message : String(err)}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
