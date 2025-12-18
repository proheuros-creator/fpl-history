import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 배포 시 경로 문제를 방지하기 위해 base 설정을 추가할 수 있습니다.
  base: './',
})
