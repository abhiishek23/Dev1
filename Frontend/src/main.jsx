import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // 👈 Tailwind must be imported here
import './App.css'; // ✅ Must be imported or Tailwind won't run
import { Provider } from 'react-redux';
import { store } from './redux/store';

// ✅ Import BrowserRouter to provide routing context globally
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter> {/* ✅ Wrapping App with BrowserRouter */}
      <App />
    </BrowserRouter>
  </Provider>
);
