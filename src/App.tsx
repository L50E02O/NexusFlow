import { BrowserRouter } from 'react-router-dom';

import { AppRouter } from './shared/lib/app-router';
import { RouteAccessibilityShell } from './shared/components/route-accessibility-shell';

function App() {
  return (
    <BrowserRouter>
      <RouteAccessibilityShell>
        <AppRouter />
      </RouteAccessibilityShell>
    </BrowserRouter>
  );
}

export default App;
