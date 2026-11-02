export type VimeoVideoDimensions = {
  width: number;
  height: number;
};

type VimeoVideoDimensionsPromise = VimeoVideoDimensions & {
  mobile: boolean;
};

/**
 * Fetches Vimeo video dimensions from the given URL.
 *
 * @param url - The Vimeo video URL.
 * @param mobile - Indicates if dimensions are for mobile.
 * @returns A Promise resolving to the video's width, height, and mobile flag.
 */
export const fetchVimeoVideoDimensions = async (
  url: string,
  mobile: boolean
): Promise<VimeoVideoDimensionsPromise> => {
  let data;
  try {
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?url=${url}`,
      {
        method: 'get',
        cache: 'no-cache',
        mode: 'cors',
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch video data: ${response.statusText}`);
    }
    data = await response.json();
  } catch (error) {
    console.error(error);
  }

  if (mobile) {
    return { width: data.width, height: data.height, mobile: true };
  } else {
    return { width: data.width, height: data.height, mobile: false };
  }
};

/**
 * Retrieves the dimensions (width and height) of a Vimeo video for both desktop and mobile versions.
 *
 * @param videoUrl - The URL of the Vimeo video for the desktop version. Optional.
 * @param videoMobileUrl - The URL of the Vimeo video for the mobile version. Optional.
 * @returns A promise that resolves to an object containing the dimensions for both desktop and mobile versions.
 *
 * If no URLs are provided or if they are empty, default dimensions of 1920x1080 are returned for both desktop and mobile.
 *
 * If valid URLs are provided, it fetches the video dimensions using the `fetchVimeoVideoDimensions` function.
 * The function waits for all fetch promises to settle and then updates the dimensions accordingly.
 * If a fetch call fails, the dimensions remain at their default values, and the error is logged to the console.
 */
export const getVimeoVideoDimensions = async (
  videoUrl?: string,
  videoMobileUrl?: string
): Promise<{
  desktopDimensions: VimeoVideoDimensions;
  mobileDimensions: VimeoVideoDimensions;
}> => {
  let desktopDimensions: VimeoVideoDimensions = {
    width: 1920,
    height: 1080,
  };
  let mobileDimensions: VimeoVideoDimensions = {
    width: 1920,
    height: 1080,
  };

  if (videoUrl === undefined || videoUrl === '')
    return { desktopDimensions, mobileDimensions };

  const vimeoAPIFetchPromises: Promise<VimeoVideoDimensionsPromise>[] = [];

  if (videoUrl) {
    vimeoAPIFetchPromises.push(fetchVimeoVideoDimensions(videoUrl, false));
  }

  if (videoMobileUrl) {
    vimeoAPIFetchPromises.push(fetchVimeoVideoDimensions(videoMobileUrl, true));
  }

  try {
    const results = await Promise.allSettled(vimeoAPIFetchPromises);
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.mobile) {
          mobileDimensions = {
            width: result.value.width,
            height: result.value.height,
          };
        } else {
          desktopDimensions = {
            width: result.value.width,
            height: result.value.height,
          };
        }
      }
    });
  } catch (error) {
    console.error('At least one fetch call rejected: ', error);
  }

  return { desktopDimensions, mobileDimensions };
};
