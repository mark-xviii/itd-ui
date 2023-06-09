import { RouterProvider } from 'react-router';
import { AuthStore } from '../../stores/auth.store';
import { Routing } from '../Routing/Routing';
import { AuthContext } from '../../stores/auth.store';
import './App.sass';

function App() {
  return (
    <AuthContext.Provider value={new AuthStore()}>
      <RouterProvider router={Routing} />
    </AuthContext.Provider>
  );
}

export default App;
