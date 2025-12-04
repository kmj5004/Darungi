import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from "virtual:pwa-register";
import App from './App.tsx'

import "./index.css";

registerSW({
  onNeedRefresh() {
    console.log("새 버전이 준비되었습니다.");
  },
  onOfflineReady() {
    console.log("오프라인 사용 준비 완료");
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
