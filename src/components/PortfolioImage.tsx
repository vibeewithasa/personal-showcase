import { useState } from 'react';
import type { PortfolioImage as ImageData } from '../content/schema';
import { assetUrl } from '../content/config';

export default function PortfolioImage({ image, eager = false, className = '', full = false }: { image: ImageData; eager?: boolean; className?: string; full?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <span style={image.width && image.height ? { aspectRatio: `${image.width} / ${image.height}` } : undefined} className={`image-frame ${image.width && image.height && image.height > image.width ? 'is-portrait' : ''} ${loaded ? 'is-loaded' : ''} ${className}`}>
      {failed ? (
        <span className="image-error" role="img" aria-label={`${image.alt}. Image unavailable.`}>
          <span>Image unavailable</span><span className="small">{image.alt}</span>
        </span>
      ) : (
        <img src={assetUrl((full ? image.display : image.thumbnail) || image.src)} alt={image.alt} width={image.width || 1200} height={image.height || 900}
          loading={eager ? 'eager' : 'lazy'} decoding="async"
          onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      )}
    </span>
  );
}
