#!/usr/bin/env bash

set -euo pipefail

# generate_backdated_commits.sh
# Creates a series of backdated, meaningful commits in the current git repo.
#
# Defaults:
#   - Creates 100 commits
#   - Date range: 2024-10-01 to 2025-01-31 (inclusive)
#   - Writes changes to docs/changelog-autogen.md
#   - Uses or creates a branch named backdated-history unless overridden
#
# Usage examples:
#   scripts/generate_backdated_commits.sh
#   scripts/generate_backdated_commits.sh --count 120 --branch historic-updates
#   scripts/generate_backdated_commits.sh --start 2024-10-15 --end 2025-01-20 --dry-run
#   scripts/generate_backdated_commits.sh --file docs/meaningful-log.md --push origin

COUNT=100
START_DATE="2024-10-01"
END_DATE="2025-01-31"
TARGET_FILE="docs/changelog-autogen.md"
BRANCH="backdated-history"
PUSH_REMOTE=""
DRY_RUN=0

print_help() {
  echo "generate_backdated_commits.sh - create backdated, meaningful commits"
  echo
  echo "Options:"
  echo "  --count N          Number of commits (default: $COUNT)"
  echo "  --start YYYY-MM-DD Start date inclusive (default: $START_DATE)"
  echo "  --end YYYY-MM-DD   End date inclusive (default: $END_DATE)"
  echo "  --branch NAME      Branch to create/use (default: $BRANCH)"
  echo "  --file PATH        File to modify each commit (default: $TARGET_FILE)"
  echo "  --push REMOTE      After commits, push to REMOTE (e.g., origin)"
  echo "  --dry-run          Print actions without making changes"
  echo "  -h, --help         Show this help"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --count)
      COUNT="$2"; shift 2;;
    --start)
      START_DATE="$2"; shift 2;;
    --end)
      END_DATE="$2"; shift 2;;
    --branch)
      BRANCH="$2"; shift 2;;
    --file)
      TARGET_FILE="$2"; shift 2;;
    --push)
      PUSH_REMOTE="$2"; shift 2;;
    --dry-run)
      DRY_RUN=1; shift;;
    -h|--help)
      print_help; exit 0;;
    *)
      echo "Unknown argument: $1"; print_help; exit 1;;
  esac
done

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

require_cmd git
require_cmd date

# Validate repo
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: This script must be run within a git repository" >&2
  exit 1
fi

# Ensure working tree is clean to avoid mixing unrelated changes
if [[ $(git status --porcelain) != "" ]]; then
  echo "Error: Working tree is not clean. Commit or stash your changes first." >&2
  exit 1
fi

# Resolve absolute path for target file's directory
TARGET_DIR=$(dirname "$TARGET_FILE")

# Convert dates to epoch seconds
start_epoch=$(date -d "$START_DATE 00:00:00" +%s)
end_epoch=$(date -d "$END_DATE 23:59:59" +%s)

if [[ "$start_epoch" -gt "$end_epoch" ]]; then
  echo "Error: start date is after end date" >&2
  exit 1
fi

if [[ "$COUNT" -le 0 ]]; then
  echo "Error: --count must be > 0" >&2
  exit 1
fi

# Curated set of meaningful commit messages
read -r -d '' MSGS << 'EOF'
Create sidebar navigation
Add footer links and contact section
Fix layout spacing issues on dashboard
Create new analytics overview page
Add chart interactivity and tooltips
Refactor API client for retries
Implement search with debounce
Add loading skeletons to list views
Improve error handling and toasts
Create inventory management page
Add unit tests for hooks
Fix ESLint and TypeScript issues
Optimize images and lazy loading
Add user profile settings page
Integrate map view for stores
Add Dark Mode toggle
Fix navbar active link highlight
Create sales reporting dashboard
Add CSV export for reports
Refactor state management into context
Add pagination to results pages
Fix SSR hydration warnings
Create notifications center UI
Add role-based access control checks
Improve form validation messages
Create email templates for outreach
Add KPIs cards to dashboard
Fix mobile responsiveness issues
Add breadcrumbs to detail pages
Refactor components into presentational/container
Create checkout flow scaffold
Add price formatting utilities
Fix date parsing edge cases
Add useLocalStorage hook
Improve performance of large tables
Create feature flag utilities
Add 404 and error boundary pages
Fix z-index stacking context for modals
Create message center service
Add WebSocket heartbeat handling
Refactor query keys constants
Add data prefetching for routes
Fix race conditions in data loading
Create analytics service methods
Add unit tests for services
Improve accessibility attributes
Create store locator page
Add map clustering for markers
Fix clipping in charts on resize
Create email campaign scheduler
Add retry/backoff for API errors
Refactor http client interceptors
Add session persistence
Fix sidebar collapse animation
Create orders management view
Add optimistic updates for carts
Improve empty states and placeholders
Create dashboard widgets system
Add i18n scaffolding
Fix duplicate requests on refocus
Create admin role management UI
Add audit log entries display
Refactor routes config
Add deep link support
Fix memory leak in listeners
Create inventory low-stock alerts
Add confirmation dialogs
Improve code splitting
Create reusable modal component
Add tooltips system
Fix focus traps for modals
Create email unsubscribe flow
Add SSO button styles
Refactor theme provider
Add semantic HTML tags
Fix scroll restoration
Create stores grid layout
Add sorting to tables
Improve test coverage
Create mock server handlers
Add analytics event tracking
Fix flaky tests
Create user activity timeline
Add print styles
Improve lighthouse scores
Create changelog generator
Add security headers config
Fix content layout shift
Create onboarding checklist
Add clipboard utilities
Improve docs and README
Create status badges
Add CI workflow config
Fix typos across UI
Create batch actions in tables
Add keyboard shortcuts
Refactor folder structure
Add code owners file
Fix bundle size regressions
Create developer experience scripts
Add commit message conventions
Fix release notes formatting
EOF

mapfile -t MESSAGES < <(printf '%s\n' "$MSGS")
num_messages=${#MESSAGES[@]}

# Generate evenly distributed timestamps between start and end, then jitter within each bucket
range=$(( end_epoch - start_epoch ))
if [[ "$range" -lt "$COUNT" ]]; then
  # If range is smaller than count in seconds, just collapse to sequential seconds
  step=1
else
  step=$(( range / COUNT ))
fi

declare -a epochs
for ((i=0; i<COUNT; i++)); do
  base=$(( start_epoch + i * step ))
  jitter=$(( (RANDOM % (step>0?step:1)) ))
  ts=$(( base + jitter ))
  if [[ "$ts" -gt "$end_epoch" ]]; then ts=$end_epoch; fi
  epochs+=($ts)
done

# Sort epochs to keep linear history
IFS=$'\n' sorted=($(sort -n <<<"${epochs[*]}"))
unset IFS

current_branch=$(git rev-parse --abbrev-ref HEAD)

echo "Preparing branch: $BRANCH (current: $current_branch)"
if [[ "$DRY_RUN" -eq 0 ]]; then
  if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
    git checkout "$BRANCH"
  else
    git checkout -b "$BRANCH"
  fi
else
  echo "[dry-run] would checkout/create branch $BRANCH"
fi

# Ensure target directory exists
if [[ "$DRY_RUN" -eq 0 ]]; then
  mkdir -p "$TARGET_DIR"
else
  echo "[dry-run] would mkdir -p $TARGET_DIR"
fi

touch_line() {
  local ts="$1"
  local iso
  iso=$(date -u -d "@$ts" +"%Y-%m-%dT%H:%M:%SZ")
  echo "- $iso: $2" >> "$TARGET_FILE"
}

for ((i=0; i<COUNT; i++)); do
  ts=${sorted[$i]}
  msg_index=$(( i % num_messages ))
  commit_msg="${MESSAGES[$msg_index]}"

  human_date=$(date -d "@$ts" +"%Y-%m-%d %H:%M:%S %z")
  echo "Committing ($((i+1))/$COUNT): $commit_msg @ $human_date"

  if [[ "$DRY_RUN" -eq 1 ]]; then
    echo "[dry-run] would append to $TARGET_FILE"
    echo "[dry-run] would git add and commit with dates set"
    continue
  fi

  touch_line "$ts" "$commit_msg"
  git add "$TARGET_FILE"

  GIT_AUTHOR_DATE="$human_date" \
  GIT_COMMITTER_DATE="$human_date" \
  git commit -m "$commit_msg"
done

if [[ "$DRY_RUN" -eq 0 && -n "$PUSH_REMOTE" ]]; then
  echo "Pushing branch $BRANCH to $PUSH_REMOTE"
  git push -u "$PUSH_REMOTE" "$BRANCH"
else
  if [[ -n "$PUSH_REMOTE" ]]; then
    echo "[dry-run] would push branch $BRANCH to $PUSH_REMOTE"
  fi
fi

echo "Done. Created $COUNT backdated commits on branch $BRANCH modifying $TARGET_FILE."


