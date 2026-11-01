import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { portfolio } from './content/config';
import './index.css';

Object.entries(portfolio.theme).forEach(([name, colour]) => document.documentElement.style.setProperty(`--${name}`, colour));

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
