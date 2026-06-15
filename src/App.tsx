import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { utilities } from './utilities/registry';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to={`/${utilities[0].id}`} replace />} />
          {utilities.map(({ id, component: Component }) => (
            <Route key={id} path={id} element={<Component />} />
          ))}
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
