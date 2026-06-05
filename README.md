# 2048

가벼운 순수 HTML/CSS/JavaScript 2048 게임입니다. GitHub에 올리고 Vercel에서 바로 배포할 수 있게 만들었습니다.

## 기능

- 4x4 보드
- 시작 시 랜덤 위치에 `2` 또는 `4` 타일 2개 생성
- 방향키로 이동
- 같은 숫자 충돌 시 병합
- 이동 후 빈 칸에 새 타일 생성
- 이동 불가 시 게임 오버
- `2048` 타일 생성 시 승리 메시지
- 모바일용 화면 버튼
- 최고 점수는 `localStorage`에 저장

## Firebase

용량을 줄이기 위해 Firebase는 설치하지 않았습니다. `src/firebase.js`에서 설정값을 채우면 필요한 순간에만 CDN 모듈을 동적으로 불러옵니다.

추가 기능이 필요할 때만 해당 Firebase 제품 모듈을 import하세요. 예를 들어 Firestore 점수 저장이 필요하면 Firestore 모듈만 추가하는 식이 가장 가볍습니다.

## Vercel 배포

이 프로젝트는 빌드 과정이 필요 없는 정적 사이트입니다.

1. GitHub 저장소에 파일을 올립니다.
2. Vercel에서 해당 저장소를 Import 합니다.
3. Framework Preset은 `Other` 또는 정적 프로젝트로 둡니다.
4. Build Command는 비워둡니다.
5. Output Directory는 `.` 로 둡니다.

## 로컬 실행

브라우저에서 `index.html`을 열면 바로 실행됩니다.

로컬 서버로 확인하려면:

```bash
npx serve .
```

이 명령은 실행 시 `serve`를 임시로 내려받을 수 있습니다. 다운로드를 피하려면 `index.html`을 직접 열어도 됩니다.
