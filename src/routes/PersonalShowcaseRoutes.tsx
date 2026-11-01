import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Portfolio from '../pages/Portfolio';
import ProjectDetail from '../pages/ProjectDetail';
import AboutMeContent from '../components/AboutMeContent';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
export default function PersonalShowcaseRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/about" element={<AboutMeContent />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
