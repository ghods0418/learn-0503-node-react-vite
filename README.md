# 오늘의 명언 생성기

React와 Vite로 만든 간단한 명언 생성 웹앱입니다. 개발 서버는 **5173** 포트에서 실행됩니다.

## 실행 방법

프로젝트를 처음 받은 경우 아래만 순서대로 실행하면 됩니다.

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속하세요.

`npm run dev`는 **Vite(5173)**와 **API 서버(3001)**를 동시에 띄웁니다. GPT 기능만 쓰려면 루트에 `.env`를 두고 `OPENAI_API_KEY`를 넣은 뒤 실행하세요. 예시는 [.env.example](.env.example)를 참고하면 됩니다.

## GPT API (로컬 전용)

- API 키는 **절대** 프론트에 넣지 않습니다. `server/index.mjs`가 루트 `.env`의 `OPENAI_API_KEY`만 읽습니다.
- Vite 개발 서버가 `/api` 요청을 `http://127.0.0.1:3001`으로 넘깁니다.
- **GitHub Pages** 정적 배포에는 백엔드가 없으므로, 호스팅된 사이트에서는 GPT 호출이 동작하지 않습니다.

## 기타 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite(5173) + API(3001) 동시 실행 |
| `npm run dev:vite` | Vite만 |
| `npm run dev:api` | API만 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 미리보기(5173). GPT 쓰려면 별도 터미널에서 `npm run dev:api` 필요 |

## GitHub Pages 배포

### 1) 저장소에서 Pages 켜기 (푸시보다 먼저 해도 됨)

[Settings → Pages](https://github.com/ghods0418/learn-0503-node-react-vite/settings/pages)에서 **Build and deployment → Source**를 **GitHub Actions**로 선택합니다.  
이 설정이 없으면 배포 단계에서 `Failed to create deployment (404)`처럼 실패할 수 있습니다.

### 2) 워크플로 실행

`main`에 푸시하면 [GitHub Actions](.github/workflows/deploy-github-pages.yml)가 빌드 후 Pages에 올립니다.  
이미 실패한 실행이 있다면, 위 1)을 저장한 뒤 [Actions](https://github.com/ghods0418/learn-0503-node-react-vite/actions)에서 해당 워크플로를 **Re-run all jobs** 하면 됩니다.

- **사이트 주소:** [https://ghods0418.github.io/learn-0503-node-react-vite/](https://ghods0418.github.io/learn-0503-node-react-vite/)

로컬에서 GitHub Pages와 동일한 경로로 빌드하려면:

```bash
set BASE_PATH=/learn-0503-node-react-vite/
npm run build
```

(PowerShell에서는 `$env:BASE_PATH='/learn-0503-node-react-vite/'; npm run build`)
