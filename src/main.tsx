import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { errorHandler } from './utils/errorHandler'

// Initialize error handling
errorHandler.initialize();

// Development logging
if (import.meta.env.DEV) {
  console.log('Moonwave 앱 시작 중...');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  if (import.meta.env.DEV) {
    console.error('root 요소를 찾을 수 없습니다!');
  }
} else {
  if (import.meta.env.DEV) {
    console.log('root 요소 발견, React 앱 렌더링 시작...');
  }
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}