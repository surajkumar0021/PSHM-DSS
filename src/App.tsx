/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TextAnalysis from './pages/TextAnalysis';
import ImageAnalysis from './pages/ImageAnalysis';
import LinkAnalysis from './pages/LinkAnalysis';
import Reports from './pages/Reports';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/text" element={<TextAnalysis />} />
          <Route path="/image" element={<ImageAnalysis />} />
          <Route path="/link" element={<LinkAnalysis />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

