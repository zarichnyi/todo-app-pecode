import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'normalize.css';
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
// import { DragDropProvider } from '@atlaskit/pragmatic-drag-and-drop-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <DragDropProvider> */}
        <App />
      {/* </DragDropProvider> */}
    </Provider>
  </StrictMode>,
)
