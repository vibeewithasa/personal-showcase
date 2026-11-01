import Arrow from './Arrow';
import { portfolio } from '../content/portfolio';
import Photo from './Photo';
export default function AboutMeContent() {
  return (
    <div className="about-layout">
      <div className="brand-image">
        <Photo
          photo={{
            id: 'brand',
            src: portfolio.logo,
            alt: `${portfolio.name} branding`,
            width: portfolio.logoWidth,
            height: portfolio.logoHeight,
          }}
          eager
        />
      </div>
      <div>
        <p className="eyebrow">Behind the frame</p>
        <h1>{portfolio.name}</h1>
        <p className="large-copy">{portfolio.profession}</p>
        {portfolio.biography && (
          <p className="body-copy">{portfolio.biography}</p>
        )}
        {portfolio.socials.map((social) => (
          <a
            key={social.label}
            className="text-link"
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Follow the work on {social.label} <Arrow />
          </a>
        ))}
      </div>
    </div>
  );
}
