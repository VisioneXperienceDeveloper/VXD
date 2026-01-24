# 명령어,설명

```bash
git config --global user.name "이름" # 사용자 이름 설정
git config --global user.email "이메일" # 사용자 이메일 설정
git init # 현재 디렉토리를 Git 저장소로 초기화
git clone --bare <url> .bare # 워크트리 사용을 위한 Bare Clone
```

## 워크트리
워크트리 사용을 위한 명령어
root 폴더에 .bare 폴더를 생성하고 그 안에 워크트리 폴더를 생성
**항상 root 폴더에서 명령어를 실행해야 함**

```bash

git -C .bare worktree list # 현재 생성된 모든 워크트리(작업 폴더) 목록 확인
git -C .bare worktree add ../<폴더명> <브랜치명> # 새 브랜치를 따면서 새 폴더 생성
git -C .bare worktree add ../<폴더명> # 기존 브랜치를 새 폴더로 체크아웃
git -C .bare worktree remove <폴더명> # 작업 폴더 삭제 (Git 연결 해제)
git -C .bare worktree prune # 폴더를 강제 삭제(rm -rf)했을 때 찌꺼기 정리
git -C .bare worktree move <구폴더> ../<신폴더> # 워크트리 폴더 경로/이름 변경
```

## 커밋

```bash
git status # 현재 파일 상태(변경됨, 스테이징됨) 확인
git add . # 모든 변경사항을 스테이징 영역(Staging Area)에 추가
git add <파일> # 특정 파일만 스테이징
git commit -m "메시지" # 스테이징된 변경사항 확정(저장)
git commit --amend # 방금 한 커밋의 메시지나 파일 수정 (덮어쓰기)
```

## 브랜치

```bash
git branch # 로컬 브랜치 목록 확인
git branch -r # 원격 브랜치 목록 확인
git branch <이름> # 새 브랜치 생성 (이동은 안 함)
git branch -m <새이름> # 현재 브랜치 이름 변경
git branch -d <이름> # 브랜치 삭제 (병합된 것만)
git branch -D <이름> # 브랜치 강제 삭제
git switch <브랜치> # 해당 브랜치로 이동
git switch -c <이름> # 새 브랜치 만들면서 이동
```

## 원격 저장소

```bash
git fetch # 원격 저장소의 최신 이력만 가져옴 (병합 X)
git pull origin <브랜치> # 원격 내용을 가져와서 합침 (Fetch + Merge)
git push origin <브랜치> # 내 커밋을 원격 저장소에 올림
git push -u origin <브랜치> # 업스트림 설정 (다음부턴 git push만 해도 됨)
git merge <브랜치> # 다른 브랜치를 현재 브랜치로 합침
git rebase <브랜치> # 내 브랜치의 시작점을 타겟 브랜치 끝으로 옮김 (깔끔한 히스토리)
```

## 복구

```bash
git restore <파일> # 작업 중인 파일 변경사항 취소 (마지막 커밋 상태로)
git restore --staged <파일> # git add 취소 (스테이징 내리기)
git reset --soft HEAD~1 # 커밋은 취소하되, 변경사항은 스테이징 상태로 보존
git reset --hard HEAD~1 # 커밋과 변경사항 모두 날려버림 (복구 불가)
git revert <커밋ID> # 특정 커밋의 내용을 반대로 수행하는 새 커밋 생성 (협업 시 안전)
```

## 임시 저장
임시 저장 하지 않음. 워크트리 사용.

## 히스토리

```bash
git log # 커밋 히스토리 조회
git log --oneline --graph # 히스토리를 그래프 형태로 한 줄 요약해서 보기
git diff # 스테이징되지 않은 변경사항 확인
git show <커밋ID> # 특정 커밋의 상세 변경 내용 확인
git blame <파일> # "파일의 각 라인을 누가, 언제 수정했는지 범인(?) 찾기"
git bisect # 이진 탐색으로 버그가 발생한 커밋 찾아내기
```
