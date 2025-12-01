import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Concepts from './pages/Concepts';
import ConceptDetail from './pages/ConceptDetail';
import PaperSummary from './pages/PaperSummary';
import Forum from './pages/Forum';
import Glossary from './pages/Glossary';
import References from './pages/References';
import Profile from './pages/Profile';
import Bookmarks from './pages/Bookmarks';
import Notes from './pages/Notes';
import Visualizations from './pages/Visualizations';
import Calculator from './pages/Calculator';
import Login from './components/Login';
import Signup from './components/Signup';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* 인증 페이지 (Layout 없음) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 메인 레이아웃 */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/concepts/:slug" element={<ConceptDetail />} />
            <Route path="/papers" element={<PaperSummary />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/calculator" element={<Calculator />} />
            
            {/* 보호된 라우트 */}
            <Route 
              path="/forum" 
              element={
                <ProtectedRoute>
                  <Forum />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
            
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/references" element={<References />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
