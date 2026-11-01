// URL construction works in Vite and in Node-based catalog tooling.
const brandLogo = new URL('../assets/chriz-logo.jpg', import.meta.url).href;

export interface Photograph {
  id: string;
  src: string;
  alt: string;
  // Supply measured original dimensions together; omit when not yet verified.
  width?: number;
  height?: number;
  focalPoint?: string;
  caption?: string;
  credit?: string;
}
export interface PortfolioProject {
  slug: string;
  title: string;
  category?: string;
  coverId?: string;
  coverFit?: 'contain' | 'cover';
  coverAspectRatio?: number;
  description?: string;
  metadata?: { label: string; value: string }[];
  images: Photograph[];
  video?: {
    src: string;
    title: string;
    captions?: { src: string; label: string; language: string }[];
  };
}
export interface PortfolioContent {
  name: string;
  profession: string;
  biography?: string;
  logo: string;
  logoWidth?: number;
  logoHeight?: number;
  email?: string;
  socials: { label: string; url: string }[];
  categories: string[];
  projects: PortfolioProject[];
}
const cloud = 'https://res.cloudinary.com/dimmyentl/image/upload/';
export const portfolio: PortfolioContent = {
  name: 'CHRIZ',
  profession: 'Photographer & filmmaker',
  logo: brandLogo,
  logoWidth: 4096,
  logoHeight: 4096,
  socials: [
    { label: 'Instagram', url: 'https://www.instagram.com/chriizz___/' },
  ],
  categories: [],
  projects: [
    {
      slug: 'devon-x-chriz',
      title: 'DEVON X CHRIZ',
      images: [
        {
          id: 'devon-cover',
          src: `${cloud}v1753950999/Imagen_de_WhatsApp_2025-07-31_a_las_01.32.01_0859db68_esjsx9.jpg`,
          alt: 'DEVON X CHRIZ — project photograph',
        },
      ],
    },
    {
      slug: 'ucbfw-x-chriz',
      title: 'UCBFW X CHRIZ',
      images: [
        {
          id: 'ucbfw-cover',
          src: `${cloud}v1753951613/UCBFW_x_CHRIZ_Album_kypoor.jpg`,
          alt: 'UCBFW X CHRIZ — project photograph',
        },
      ],
    },
    {
      slug: 'itza-x-chriz',
      title: 'ITZA X CHRIZ',
      images: [
        {
          id: 'itza-cover',
          src: `${cloud}v1753951607/ITZA_x_CHRIZ_Album_zqwbob.jpg`,
          alt: 'ITZA X CHRIZ — project photograph',
        },
      ],
    },
  ],
};

export function supportsResponsiveImages(src: string) {
  return (
    src.startsWith('https://res.cloudinary.com/') &&
    src.includes('/image/upload/')
  );
}

// Only optimize known Cloudinary delivery URLs; keep other authorized hosts intact.
export function imageUrl(src: string, width: number) {
  return supportsResponsiveImages(src)
    ? src.replace(
        '/image/upload/',
        `/image/upload/f_auto,q_auto,c_limit,w_${width}/`,
      )
    : src;
}

export function projectCover(project: PortfolioProject) {
  return (
    project.images.find((p) => p.id === project.coverId) || project.images[0]
  );
}
