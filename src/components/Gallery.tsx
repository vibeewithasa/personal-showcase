import { useRef, useState } from 'react';
import type { PortfolioImage as ImageData } from '../content/schema';
import PortfolioImage from './PortfolioImage';

export default function Gallery({ images, title }: { images: ImageData[]; title: string }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  if (!images.length) return null;
  const step = (direction: number) => setIndex(current => (current + direction + images.length) % images.length);
  return (
    <section className="gallery" aria-label={`${title} gallery`}>
      <div className="gallery-grid">
        {images.map((image, position) => <button className="gallery-image" type="button" key={`${image.src}-${position}`} onClick={() => {
          setIndex(position);
          dialog.current?.showModal();
        }} aria-label={`Enlarge image ${position + 1}: ${image.alt}`} aria-haspopup="dialog">
          <PortfolioImage image={image} eager={position === 0} />
          <span className="image-action" aria-hidden="true">Enlarge ↗</span>
        </button>)}
      </div>
      <dialog ref={dialog} className="lightbox" aria-label={`${title} image viewer`} onClick={event => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }} onKeyDown={event => {
        if (event.key === 'Tab') {
          const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
          const first = buttons[0], last = buttons[buttons.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      }}>
        <div className="lightbox-toolbar"><p role="status" aria-live="polite">{index + 1} / {images.length}</p><button type="button" autoFocus onClick={() => dialog.current?.close()}>Close <span aria-hidden="true">×</span></button></div>
        <PortfolioImage key={images[index].src} image={images[index]} eager />
        <div className="lightbox-caption"><p>{images[index].alt}</p>{images.length > 1 && <div className="lightbox-controls"><button type="button" onClick={() => step(-1)} aria-label="Previous image">←</button><button type="button" onClick={() => step(1)} aria-label="Next image">→</button></div>}</div>
      </dialog>
    </section>
  );
}
