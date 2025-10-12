@echo off
setlocal

REM Usage: git-fix-commands.bat [REMOTE_URL]
REM Example: git-fix-commands.bat https://github.com/Rishank-21/SkillMatch.AI.git

REM 1) ensure branch main
git branch -M main 2>nul

REM 2) remove .env from index if present (Windows-friendly) in repo root, frontend, backend
if exist .env (
  echo Removing .env from root index...
  git rm --cached .env 2>nul
)
if exist frontend\.env (
  echo Removing frontend\.env from index...
  git rm --cached frontend\.env 2>nul
)
if exist backend\.env (
  echo Removing backend\.env from index...
  git rm --cached backend\.env 2>nul
)

REM 3) stage all changes
git add .

REM 4) commit only if there are staged changes
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Initial commit"
) else (
  echo No staged changes to commit.
)

REM 5) optionally set or update origin if a URL argument was provided
if not "%~1"=="" (
  echo Setting remote origin to %~1
  REM If origin exists, update its URL; otherwise add it
  git remote get-url origin >nul 2>nul
  if %ERRORLEVEL%==0 (
    echo origin exists — updating URL to %~1 ...
    git remote set-url origin %~1
  ) else (
    echo origin does not exist — adding origin %~1 ...
    git remote add origin %~1
  )
)

REM 6) fetch remote and rebase local main onto remote main if it exists
echo Fetching origin...
git fetch origin 2>nul

REM Check if origin/main exists
git ls-remote --exit-code --heads origin main >nul 2>nul
if %ERRORLEVEL%==0 (
  echo Attempting to rebase local main onto origin/main (autostash enabled)...
  git rebase --autostash origin/main
  if errorlevel 1 (
    echo.
    echo Rebase failed. You must resolve conflicts manually:
    echo 1) Edit conflicted files, then: git add <file>
    echo 2) Continue rebase: git rebase --continue
    echo Or abort: git rebase --abort
    echo After finishing the rebase, run: git push -u origin main
    exit /b 1
  ) else (
    echo Rebase completed successfully.
  )
) else (
  echo No origin/main found; will push local main as new branch.
)

REM 7) push
echo Pushing to origin main...
git push -u origin main
if errorlevel 1 (
  echo.
  echo Push failed. Possible reasons:
  echo - Your local branch is still behind origin/main (remote changed while you rebased).
  echo - Or you lack permission to push.
  echo Suggestions:
  echo 1) Fetch and rebase again: git fetch origin && git rebase --autostash origin/main
  echo 2) If you intend to overwrite remote (dangerous), use: git push --force-with-lease origin main
  exit /b 1
)

echo Done.
endlocal
