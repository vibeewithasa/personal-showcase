import Arrow from './Arrow';
import { lazy, Suspense, useState } from 'react';
import type { Photograph } from '../content/portfolio';
import Photo from './Photo';
const Lightbox = lazy(() => import('./Lightbox'));
export default function Gallery({ photos }: { photos: Photograph[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  if (!photos.length)
    return (
      <p className="empty-state">
        This collection is being prepared. Explore another project in the
        meantime.
      </p>
    );
  return (
    <>
      <div className="gallery">
        {photos.map((photo, index) => (
          <figure key={photo.id}>
            <button
              className="gallery-photo"
              onClick={() => setSelected(index)}
              aria-label={`Open photograph: ${photo.alt}`}
            >
              <Photo
                key={`${photo.src}:${attempt}`}
                photo={photo}
                onFailure={() => setFailed(true)}
                eager={index === 0}
                sizes={
                  photos.length === 1 ? '90vw' : '(max-width: 700px) 90vw, 45vw'
                }
              />
              <span className="image-cta" aria-hidden="true">
                View fullscreen <Arrow />
              </span>
            </button>
            {(photo.caption || photo.credit) && (
              <figcaption>
                {photo.caption}
                {photo.credit && ` © ${photo.credit}`}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      {failed && (
        <div className="media-notice">
          <p>Some photographs could not be loaded.</p>
          <button
            className="text-link"
            onClick={() => {
              setFailed(false);
              setAttempt((n) => n + 1);
            }}
          >
            Retry photographs
          </button>
        </div>
      )}
      {selected !== null && (
        <Suspense fallback={<p role="status">Opening photo viewer…</p>}>
          <Lightbox
            photos={photos}
            initial={selected}
            onClose={() => setSelected(null)}
          />
        </Suspense>
      )}
    </>
  );
}
