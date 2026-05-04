# 오늘의 명언 생성기

React와 Vite로 만든 간단한 명언 생성 웹앱입니다. 개발 서버는 **5173** 포트에서 실행됩니다.

## 실행 방법

프로젝트를 처음 받은 경우 아래만 순서대로 실행하면 됩니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속하세요.

## 기타 스크립트

| 명령 | 설명 |
|------|------|
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 (포트 5173) |

## GitHub Pages 배포

저장소에 푸시하면 [GitHub Actions](.github/workflows/deploy-github-pages.yml)가 빌드 후 Pages에 올립니다.

- **사이트 주소:** [https://ghods0418.github.io/learn-0503-node-react-vite/](https://ghods0418.github.io/learn-0503-node-react-vite/)
- 저장소 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택해야 첫 배포가 동작합니다.

로컬에서 GitHub Pages와 동일한 경로로 빌드하려면:

```bash
set BASE_PATH=/learn-0503-node-react-vite/
npm run build
```

(PowerShell에서는 `$env:BASE_PATH='/learn-0503-node-react-vite/'; npm run build`)
