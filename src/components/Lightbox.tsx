import { useEffect, useRef, useState } from 'react';
import type { Photograph } from '../content/portfolio';
import Photo from './Photo';
export default function Lightbox({
  photos,
  initial,
  onClose,
}: {
  photos: Photograph[];
  initial: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initial);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const move = (delta: number) =>
    setIndex((i) => (i + delta + photos.length) % photos.length);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const modal = dialog.current;
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  const photo = photos[index];
  return (
    <dialog
      ref={dialog}
      className="lightbox"
      aria-label="Photo viewer"
      aria-describedby="photo-caption"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Tab') {
          const buttons = dialog.current?.querySelectorAll<HTMLElement>(
            'button, [tabindex="0"]',
          );
          if (buttons?.length) {
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          move(1);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          move(-1);
        }
      }}
    >
      <div className="lightbox-toolbar">
        <span aria-live="polite">
          {index + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          onTouchEnd={(event) => {
            // A genuine touch must close the viewer even when a synthetic click is suppressed.
            event.preventDefault();
            onClose();
          }}
          aria-label="Close photo viewer"
        >
          Close ×
        </button>
      </div>
      <figure
        onTouchCancel={() => {
          touchStart.current = null;
        }}
        onTouchStart={(e) => {
          const touch = e.changedTouches[0];
          if (e.touches.length === 1)
            touchStart.current = { x: touch.clientX, y: touch.clientY };
          else touchStart.current = null;
        }}
        onTouchEnd={(e) => {
          if (touchStart.current !== null) {
            const touch = e.changedTouches[0];
            const delta = touchStart.current.x - touch.clientX;
            const vertical = touchStart.current.y - touch.clientY;
            if (Math.abs(delta) > 50 && Math.abs(delta) > Math.abs(vertical))
              move(delta > 0 ? 1 : -1);
            touchStart.current = null;
          }
        }}
      >
        <Photo key={photo.id} photo={photo} full eager />
        <figcaption id="photo-caption" tabIndex={0}>
          {photo.caption || photo.alt}
          {photo.credit && <small>© {photo.credit}</small>}
        </figcaption>
      </figure>
      {photos.length > 1 && (
        <div className="lightbox-controls">
          <button onClick={() => move(-1)} aria-label="Previous photograph">
            ← Previous
          </button>
          <button onClick={() => move(1)} aria-label="Next photograph">
            Next →
          </button>
        </div>
      )}
    </dialog>
  );
}
