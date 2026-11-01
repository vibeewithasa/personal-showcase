import { useState } from 'react';
import {
  imageUrl,
  supportsResponsiveImages,
  type Photograph,
} from '../content/portfolio';

export default function Photo({
  photo,
  eager = false,
  full = false,
  fit = 'contain',
  sizes = '(max-width: 700px) 90vw, 90vw',
  onFailure,
}: {
  photo: Photograph;
  eager?: boolean;
  full?: boolean;
  fit?: 'contain' | 'cover';
  sizes?: string;
  onFailure?: () => void;
}) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>(
    'loading',
  );
  const [naturalRatio, setNaturalRatio] = useState<number>();
  const ratio =
    photo.width && photo.height
      ? photo.width / photo.height
      : naturalRatio || 4 / 3;
  return (
    <span
      className={`photo-frame photo-is-${state}`}
      style={{ aspectRatio: ratio }}
      aria-busy={state === 'loading'}
    >
      {state === 'failed' ? (
        <span className="photo-fallback" role="img" aria-label={photo.alt}>
          <span>Photograph unavailable</span>
          <small>{photo.alt}</small>
        </span>
      ) : (
        <>
          {state === 'loading' && (
            <span className="photo-loading" role="status">
              Loading photograph…
            </span>
          )}
          <img
            src={imageUrl(photo.src, full ? 2400 : 1440)}
            srcSet={
              supportsResponsiveImages(photo.src)
                ? (full ? [480, 960, 1440, 1920, 2400] : [480, 960, 1440, 1920])
                    .map((w) => `${imageUrl(photo.src, w)} ${w}w`)
                    .join(', ')
                : undefined
            }
            sizes={sizes}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              objectFit: fit,
              objectPosition: photo.focalPoint || '50% 50%',
            }}
            onLoad={(event) => {
              setNaturalRatio(
                event.currentTarget.naturalWidth /
                  event.currentTarget.naturalHeight,
              );
              setState('loaded');
            }}
            onError={() => {
              setState('failed');
              onFailure?.();
            }}
          />
        </>
      )}
    </span>
  );
}
