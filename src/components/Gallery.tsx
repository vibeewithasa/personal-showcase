import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PortfolioImage as ImageData } from '../content/schema';
import { motionFinished, playMotion, useMediaQuery } from '../motion/motion';
import PortfolioImage from './PortfolioImage';

export default function Gallery({ images, title }: { images: ImageData[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [session, setSession] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLParagraphElement>(null);
  const closing = useRef<Animation | null>(null);
  const opening = useRef<Animation | null>(null);
  const direction = useRef(1);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  useLayoutEffect(() => {
    if (reduced) { opening.current?.cancel(); closing.current?.cancel(); }
    if (!dialog.current?.open) return;
    const animations = [playMotion(image.current, direction.current > 0 ? 'image-next' : 'image-previous'), playMotion(counter.current, 'counter')];
    return () => animations.forEach(animation => animation?.cancel());
  }, [index, session, reduced]);
  useEffect(() => () => { opening.current?.cancel(); closing.current?.cancel(); }, []);
  if (!images.length) return null;
  const step = (change: number) => {
    direction.current = change;
    setIndex(current => (current + change + images.length) % images.length);
  };
  const close = () => {
    const viewer = dialog.current;
    if (!viewer?.open || closing.current) return;
    opening.current?.cancel();
    viewer.dataset.closing = '';
    closing.current = playMotion(viewer, 'gallery-close');
    void motionFinished(closing.current).then(() => viewer.close());
  };
  return (
    <section className="gallery" aria-label={`${title} gallery`}>
      <div className="gallery-grid">
        {images.map((item, position) => <button className="gallery-image" data-motion={position % 2 ? 'picture-reverse' : 'picture'} type="button" key={`${item.src}-${position}`} onClick={event => {
          opener.current = event.currentTarget;
          setIndex(position);
          setSession(current => current + 1);
          direction.current = 1;
          delete dialog.current!.dataset.closing;
          dialog.current?.showModal();
          opening.current = playMotion(dialog.current, 'gallery-open');
        }} aria-label={`Enlarge image ${position + 1}: ${item.alt}`} aria-haspopup="dialog">
          <PortfolioImage image={item} eager={position === 0} />
          <span className="image-action" aria-hidden="true">Enlarge ↗</span>
        </button>)}
      </div>
      <dialog ref={dialog} className="lightbox" onClose={() => {
        closing.current = null;
        if (dialog.current) delete dialog.current.dataset.closing;
        opener.current?.focus();
      }} onCancel={event => { event.preventDefault(); close(); }} aria-label={`${title} image viewer`} onClick={event => {
        if (event.target === event.currentTarget) close();
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
        <div className="lightbox-toolbar"><p ref={counter} role="status" aria-live="polite">{index + 1} / {images.length}</p><button type="button" autoFocus onClick={close}>Close <span aria-hidden="true">×</span></button></div>
        <div ref={image} className="lightbox-image"><PortfolioImage key={images[index].src} image={images[index]} eager /></div>
        <div className="lightbox-caption"><p>{images[index].alt}</p>{images.length > 1 && <div className="lightbox-controls"><button type="button" onClick={() => step(-1)} aria-label="Previous image">←</button><button type="button" onClick={() => step(1)} aria-label="Next image">→</button></div>}</div>
      </dialog>
    </section>
  );
}
