import { ImageResponse } from 'next/og';
import { getPublicSnippet } from '@/lib/actions/sharing';
import { getPublicTechnology } from '@/lib/actions/technology-sharing';
import { getPublicCollection } from '@/lib/actions/collection-sharing';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') || 'snippet';

    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }

    let data;
    let title = '';
    let subtitle = '';
    let icon = '';
    let badge = '';
    let views = 0;

    // Fetch data based on type
    if (type === 'technology') {
      const tech = await getPublicTechnology(slug);
      if (!tech) return new Response('Technology not found', { status: 404 });
      
      data = tech;
      title = tech.name;
      subtitle = `${tech.snippets?.length || 0} public snippets curated for you`;
      icon = tech.icon || '🚀';
      badge = 'Technology';
      views = tech.views;
    } else if (type === 'collection') {
      const collection = await getPublicCollection(slug);
      if (!collection) return new Response('Collection not found', { status: 404 });
      
      data = collection;
      title = collection.title;
      subtitle = collection.description || `${collection.entries.length} items in this collection`;
      icon = '📚';
      badge = 'Collection';
      views = collection.views;
    } else {
      // Default to snippet
      const snippet = await getPublicSnippet(slug);
      if (!snippet) return new Response('Snippet not found', { status: 404 });

      // Extract text content logic...
      const extractText = (content: any): string => {
        if (typeof content === 'string') return content;
        if (!content || !content.content) return '';
        
        let text = '';
        const traverse = (node: any) => {
          if (node.type === 'text') {
            text += node.text + ' ';
          }
          if (node.content && Array.isArray(node.content)) {
            node.content.forEach(traverse);
          }
        };
        traverse(content);
        return text.slice(0, 150) + '...';
      };

      data = snippet;
      title = snippet.title;
      subtitle = extractText(snippet.content);
      icon = snippet.technologyIcon || '📝';
      badge = snippet.technologyName || 'Snippet';
      views = snippet.views;
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
            padding: '60px 80px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '8px 16px',
                color: '#60a5fa',
                fontSize: '24px',
                fontWeight: '500',
                display: 'flex',
              }}
            >
              {icon} {badge}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '28px',
                color: '#9ca3af',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '28px',
                color: '#6b7280',
              }}
            >
              <span>Made with</span>
              <span
                style={{
                  color: '#3b82f6',
                  fontWeight: 'bold',
                }}
              >
                Snippets
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '24px',
                color: '#6b7280',
              }}
            >
              👁️ {views} views
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image generation failed:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
