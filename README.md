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
