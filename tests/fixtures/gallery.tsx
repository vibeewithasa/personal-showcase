import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Portfolio from '../../src/pages/Portfolio';
import { portfolio } from '../../src/content/portfolio';
import ErrorBoundary from '../../src/components/ErrorBoundary';
import Gallery from '../../src/components/Gallery';
import '../../src/index.css';
// Synthetic shapes for interaction tests only; not portfolio photography.
const shape = (width: number, height: number) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#444"/></svg>`,
  );
const photos = [
  {
    id: 'one',
    src: shape(400, 600),
    alt: 'First test shape',
    caption: 'First caption',
    width: 400,
    height: 600,
  },
  {
    id: 'two',
    src: shape(600, 400),
    alt: 'Second test shape',
    caption: 'Second caption',
    width: 600,
    height: 400,
  },
];
const mode = new URLSearchParams(window.location.search).get('mode');
export function Crash(): never {
  throw new Error('Synthetic render failure');
}
createRoot(document.getElementById('root')!).render(
  mode === 'crash' ? (
    <ErrorBoundary>
      <Crash />
    </ErrorBoundary>
  ) : mode === 'portfolio' ? (
    <BrowserRouter>
      <Portfolio
        content={{
          ...portfolio,
          categories: ['Test collection', 'Empty collection'],
          projects: [{ ...portfolio.projects[0], category: 'Test collection' }],
        }}
      />
    </BrowserRouter>
  ) : (
    <Gallery
      photos={
        mode === 'empty'
          ? []
          : mode === 'loading'
            ? [{ ...photos[0], src: '/slow-test-photo.svg' }]
            : mode === 'long'
              ? [{ ...photos[0], caption: 'Long test caption. '.repeat(100) }]
              : photos
      }
    />
  ),
);
