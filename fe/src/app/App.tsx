import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from 'pages/HomePage';
import { PwaPage } from 'pages/PwaPage';
import { MainLayout, SimpleLayout } from 'widgets/Lauout';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />
        <Route
          path="/pwa"
          element={
            <SimpleLayout>
              <PwaPage />
            </SimpleLayout>
          }
        />
      </Routes>
    </Router>
  );
};
