import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// ag grid: registration
import { AllCommunityModule as AG_ACM, ModuleRegistry as AG_MR} from 'ag-grid-community';
import { AllCommunityModule as AC_ACM, ModuleRegistry as AC_MR} from "ag-charts-community";
AG_MR.registerModules([AG_ACM]);
AC_MR.registerModules([AC_ACM]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
