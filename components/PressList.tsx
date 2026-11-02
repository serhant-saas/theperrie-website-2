import { Article } from '@/components/Article';
import { LayoutGrid } from '@/components/LayoutGrid';
import { cn } from '@/lib/utils';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PRESS_LIST_QUERY } from '@/sanity/lib/queries';
import type { PRESS_LIST_QUERYResult } from '@/sanity/types';

export const PressList = async () => {
  const pressList = await sanityFetch<PRESS_LIST_QUERYResult>({
    query: PRESS_LIST_QUERY,
  });

  return (
    <LayoutGrid>
      {pressList.map((article) => (
        <Article
          key={article._id}
          featuredImage={article.featuredImage}
          url={article.url}
          file={article.fileUrl ?? ''}
          title={article.title}
          publisher={article.publisher}
          publishedAt={article.publishedAt ?? ''}
          className={cn(
            'col-span-full sm:col-span-6 md:col-span-4 xl:col-span-3'
          )}
        />
      ))}
    </LayoutGrid>
  );
};
