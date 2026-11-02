import { sanityFetch } from '@/sanity/lib/fetch';
import { ANNOUNCEMENTS_QUERY } from '@/sanity/lib/queries';

export type AnnouncementTypes = {
  announcements: {
    announcementAboveHeader?: string;
    announcementBelowHeader?: string;
  };
};

export const fetchAnnouncements = async (): Promise<AnnouncementTypes> => {
  return await sanityFetch<AnnouncementTypes>({
    query: ANNOUNCEMENTS_QUERY,
  });
};
