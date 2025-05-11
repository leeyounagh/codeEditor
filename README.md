#  ✅ Commit Convention

| 타입 | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 (README 등) |
| `style` | 코드 스타일 수정 (세미콜론, 들여쓰기 등) |
| `refactor` | 코드 리팩토링 (기능 변화 없음) |
| `test` | 테스트 코드 추가/수정 |
| `chore` | 빌드, 패키지, 설정 등 변경 (CI, 설정파일 등) |
| `perf` | 성능 개선 |
| `ci` | CI 관련 설정 수정 |

## 🧩 프로젝트 아키텍처 및 코드 설명


### 🏗️ 프로젝트 구조

```

code-editor/
├── src/
│   ├── app/                     # 레이아웃, 초기 파일트리 로딩 및 앱 구조 정의
│   ├── shared/                  # 공통 유틸, 스타일, 컴포넌트
│   │   ├── lib/                 # 유틸 함수들
│   │   │   └── fileNode.ts           # zip 파일을 FileNode 트리로 파싱하는 핵심 유틸 함수 (chunk 단위로 데이터를 나누어 처리하며, setTimeout을 이용해 렌더링 블로킹을 방지함)
│   │   │   └── dfsWithBinaryCheck.ts # 파일 트리 구조를 DFS로 순회하며, 각 파일 노드의 확장자에 따라 isBinary 여부를 설정하고 선택적으로 콜백을 실행하는 유틸 함수
│   │   │   └── findFirstFile.ts      # 파일 트리(FileNode[])를 DFS 방식으로 탐색하여 가장 먼저 발견되는 파일 노드를 반환 (초기 자동 탭용)
│   │   │   └── getFileType.ts        # 파일 이름의 확장자를 기반으로 해당 파일이 이미지인 binary 타입인지 여부를 판별
│   │   │   └── monaco-setup.ts       # Monaco 에디터의 워커 설정을 위한 세팅 파일 (Vite는 Web Worker의 자동 번들링을 지원하지 않아 수동 지정 필요)
│   │   ├── styles/              # 공통 스타일 정의
│   │   │   └── global.ts        # reset.css 및 전역 스타일 세팅
│   │   └── ui/                  # 공용 UI 컴포넌트
│   │       └── Button.tsx       # 공통 버튼 컴포넌트
│
│   ├── entities/
│   │   ├── file-tree/           # 파일 트리 UI 및 상태 관리 (Zustand)
│   │   │   ├── model/           
│   │   │   │   └── fileTreeStore.ts  # 파일 트리 관련 Zustand 상태 관리 store 정의
│   │   │   │   └── types.ts          # FileNode 타입 정의
│   │   │   └── ui/                  
│   │   │       └── FileTree.tsx      # 파일 트리의 루트 컴포넌트
│   │   │       └── TreeNode.tsx      # 파일 트리의 노드 컴포넌트 (자식 노드가 열릴때만 재귀적으로 렌더링)
│   │   └── monaco-editor/      # Monaco 기반 코드 편집기
│   │       ├── model/
│   │       │   └── extensionToLang.ts # 파일 확장자와 Monaco 언어 ID 매핑 정의
│   │       └── ui/
│   │           └── MonacoEditor.tsx   # Monaco Editor 커스텀 구현 컴포넌트
│
│   ├── features/
│   │   ├── editor-tabs/         # 탭 UI 및 상태 정의
│   │   │   ├── model/
│   │   │   │   └── types.ts          # 탭 관련 타입 정의
│   │   │   └── ui/
│   │   │       └── Tabs.tsx          # 열린 파일 목록(openedTabs)을 기반으로 탭 UI 렌더링
│   │   │       └── TabItem.tsx       # 단일 탭 UI 및 삭제/활성화 기능 포함
│   │   └── file-upload/         # zip 업로드, 파일/폴더 추가/삭제 기능 정의
│   │       └── ui/
│   │           └── AddFileButton.tsx     # 선택된 위치에 텍스트 파일 추가
│   │           └── AddFolderButton.tsx   # 선택된 위치에 폴더 추가
│   │           └── DeleteButton.tsx      # 선택된 노드 삭제 및 다음 파일 자동 선택
│   │           └── DownloadButton.tsx    # 트리를 zip으로 압축하여 다운로드
│   │           └── UploadButton.tsx      # zip 파일을 업로드하여 트리로 변환
│   │           └── UploadHandler.tsx     # 업로드 관련 버튼(추가, 삭제, 업로드 등)을 하나로 묶는 컨테이너 컴포넌트
│
│   ├── mock/                    # mock 데이터 세팅 (초기 트리 구조 등)
│   └── __tests__/               # 단위 테스트 (Vitest + React Testing Library)
├── e2e/                         # E2E 테스트 (Playwright)
├── fixtures/                    # 테스트용 샘플 zip 파일
├── public/                      # 정적 파일
└── README.md                    # 프로젝트 설명 문서




### ⚙️ 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Editor**: Monaco Editor (직접 바인딩 및 설정)
- **State Management**: Zustand + IndexedDB (persist)
- **File I/O**: JSZip + FileReader API
- **Testing**:
  - Unit: Vitest + React Testing Library
  - E2E: Playwright


| 기능               | 설명                                                                                  |
|--------------------|---------------------------------------------------------------------------------------|
| 📦 zip 업로드       | zip 파일을 파싱하여 트리 구조를 생성하고 Zustand를 통해 상태에 반영합니다.  
|                    | 📁 `features/file-upload/ui/UploadButton.tsx`  
|                    | 📁 `shared/lib/parseZipToFileTree.ts`  
| 🧭 파일 트리        | DFS 탐색을 활용하여 폴더 및 파일 구조를 재귀적으로 렌더링하며, 확장자에 따라 아이콘을 동적으로 설정합니다.  
|                    | 📁 `entities/file-tree/ui/TreeNode.tsx`  
|                    | 📁 `shared/lib/model/dfsWithBinaryCheck.ts`  
| 🖼️ 이미지 파일 미리보기| 파일 형식이 이미지(`.png`, `.jpg`, `.svg` 등)일 경우 에디터 대신 이미지 뷰어를 렌더링하며, 텍스트 파일이면 Monaco 에디터가 보여집니다.  
|                    | 📁 `app/Main.tsx` (`selectedNode.isBinary` 조건으로 분기 렌더링 )  
| 📄 파일/폴더 추가   | 사용자가 직접 새로운 파일 또는 폴더를 추가할 수 있으며, 트리 구조에 동적으로 반영됩니다.  
|                    | 📁 `features/file-upload/ui/AddFileButton.tsx`  
|                    | 📁 `features/file-upload/ui/AddFolderButton.tsx`  
|                    | 📁 `entities/file-tree/model/fileTreeStore.ts` (`addNode` 액션 함수)  
| 📝 코드 에디터      | Monaco Editor를 통해 선택된 파일을 실시간으로 편집할 수 있으며, 파일 확장자에 따라 언어 감지를 처리합니다.  
|                    | (undo/redo 기능 제공: `ctrl+z`, `ctrl+shift+z`, auto completion 지원, syntax highlighting, multi-model editor)  
|                    | main.tsx에서 `shared/lib/model/monaco-setup.ts` 경로에서 세팅한 worker 설정을 임포트 하고 있습니다.  
|                    | 📁 `entities/monaco-editor/ui/MonacoEditor.tsx`  
|                    | 📁 `entities/monaco-editor/model/extensionToLang.ts`  
|                    | 📁 `shared/lib/model/monaco-setup.ts`  
| 🧵 탭 시스템        | 여러 파일을 탭으로 열 수 있으며, 현재 선택된 탭은 강조되어 에디터와 동기화됩니다.  
|                    | 📁 `features/editor-tabs/ui/Tabs.tsx`  
|                    | 📁 `features/editor-tabs/ui/TabItem.tsx`  
| 💾 상태 저장        | Zustand와 IndexedDB를 통해 트리, 열린 탭, 선택된 노드를 영속적으로 저장하고 복원, 삭제합니다.  
|                    | 📁 `entities/file-tree/model/fileTreeStore.ts`  
| 📥 zip 다운로드     | 수정된 파일 트리 구조를 zip으로 다시 압축해 다운로드하며, 이미지 파일은 base64를 디코딩하여 다운로드 됩니다.  
|                    | 📁 `features/file-upload/ui/DownloadButton.tsx`  
|                    | 📁 `shared/lib/addToZip.ts`  
| ✅ 테스트           | 단위 테스트는 Zustand store, 유틸 함수를 검증하며, E2E 테스트는 zip 업로드 → 수정 → 다운로드 전체 플로우를 시뮬레이션합니다.  
|                    | 📁 `src/__tests__/*.test.ts`  
|                    | 📁 `e2e/upload-edit-download.spec.ts`  






### 🧠 상태 관리 구조

- 전역 상태를 `zustand`로 구성하고, `persist` 미들웨어를 통해 IndexedDB에 저장합니다.
- 테스트 환경에서는 저장소를 사용하지 않도록 분기 처리합니다.

```ts
const isTestEnv = typeof process !== 'undefined' && process.env.VITEST;
const storage = isTestEnv ? undefined : createJSONStorage(...);
```

주요 상태:

- `tree`: 파일 트리 구조
- `selectedNode`: 선택된 노드
- `openedTabs`: 열린 탭 목록
- `updateFileContent` : 에디터에서 상태값이 바뀔때 바뀐상태값을 처리하는 함수

### 🧪 테스트 구조

- `src/__tests__/`에 주요 함수와 상태 로직 단위 테스트
- `e2e/`에 Playwright 기반의 실제 사용 흐름 테스트:

  - zip 업로드 → 트리 렌더링 → 에디터 수정 → 다운로드 검증

- 아이콘 버튼 등에는 `data-testid` 속성을 명시적으로 부여하여 셀렉터 안정성 확보




