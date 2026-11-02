import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';
import { imageHotspotArrayPlugin } from 'sanity-plugin-hotspot-array';
import { inlineSvgInput } from '@focus-reactive/sanity-plugin-inline-svg-input';

// import { locate } from '@/sanity/presentation/locate';
import { apiVersion, dataset, projectId } from './sanity/env';
import schema from './sanity/schemas';
import { structure } from './sanity/structure';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      // locate,
      previewUrl: {
        draftMode: {
          enable: '/api/draft',
        },
      },
    }),
    imageHotspotArrayPlugin(),
    inlineSvgInput(),
  ],
});
