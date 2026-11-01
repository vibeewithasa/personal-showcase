import { useState } from 'react';
import type { PortfolioImage as ImageData } from '../content/schema';
import { assetUrl } from '../content/config';

export default function PortfolioImage({ image, eager = false, className = '' }: { image: ImageData; eager?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <span className={`image-frame ${loaded ? 'is-loaded' : ''} ${className}`}>
      {failed ? (
        <span className="image-error" role="img" aria-label={`${image.alt}. Image unavailable.`}>
          <span>Image unavailable</span><span className="small">{image.alt}</span>
        </span>
      ) : (
        <img src={assetUrl(image.src)} alt={image.alt} width="1200" height="900"
          loading={eager ? 'eager' : 'lazy'} decoding="async"
          onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />
      )}
    </span>
  );
}
