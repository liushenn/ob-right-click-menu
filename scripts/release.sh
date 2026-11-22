#!/usr/bin/env bash
# 一键发版：同步 main.js + 改版本号 + 提交推送 + 打 tag + 建 release + 传附件
# 用法：./scripts/release.sh 1.0.1 "这次改了什么"
set -euo pipefail

VER="${1:?用法: ./scripts/release.sh <版本号 如 1.0.1> [发行说明]}"
NOTE="${2:-Release $VER}"
REPO="liushenn/ob-right-click-menu"
PLUGIN_DIR="$HOME/Desktop/独者知识库/.obsidian/plugins/ob-right-click-menu"
TOKEN_FILE="$HOME/.gh_token"

[[ -f "$TOKEN_FILE" ]] || { echo "缺少 $TOKEN_FILE"; exit 1; }
TOKEN=$(cat "$TOKEN_FILE")
[[ -f "$PLUGIN_DIR/main.js" ]] || { echo "找不到 $PLUGIN_DIR/main.js"; exit 1; }

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
echo "→ 拉取仓库"
git clone -q "git@github.com:$REPO.git" "$WORK/repo"
cd "$WORK/repo"

echo "→ 同步 main.js"
cp "$PLUGIN_DIR/main.js" main.js

echo "→ 写入版本 $VER"
python3 - "$VER" <<'PY'
import json, sys
v = sys.argv[1]
m = json.load(open('manifest.json'))
m['version'] = v
json.dump(m, open('manifest.json', 'w'), ensure_ascii=False, indent=2)
open('manifest.json', 'a').write('\n')
json.dump({v: m['minAppVersion']}, open('versions.json', 'w'), ensure_ascii=False, indent=2)
open('versions.json', 'a').write('\n')
PY

git add -A
git -c user.name="liushenn" -c user.email="1753985021@qq.com" commit -q -m "release: $VER"
git push -q origin HEAD:main
git tag -f "$VER" >/dev/null
git push -q -f origin "$VER"

echo "→ 创建 release"
REL=$(curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/releases" \
  -d "$(python3 -c 'import json,sys;print(json.dumps({"tag_name":sys.argv[1],"name":sys.argv[1],"body":sys.argv[2]}))' "$VER" "$NOTE")")
ID=$(printf '%s' "$REL" | python3 -c 'import json,sys;print(json.load(sys.stdin).get("id",""))')
[[ -n "$ID" ]] || { echo "release 创建失败: $REL"; exit 1; }

for f in main.js manifest.json; do
  curl -s -X POST \
    -H "Authorization: token $TOKEN" \
    -H "Content-Type: text/plain" \
    --data-binary @"$f" \
    "https://uploads.github.com/repos/$REPO/releases/$ID/assets?name=$f" >/dev/null
  echo "   附件 $f 已上传"
done

# 同步回本地库，让 Obsidian 里的版本号一致
python3 - "$PLUGIN_DIR/manifest.json" "$VER" <<'PY'
import json, sys
p, v = sys.argv[1], sys.argv[2]
m = json.load(open(p)); m['version'] = v
json.dump(m, open(p, 'w'), ensure_ascii=False, indent=2)
open(p, 'a').write('\n')
PY

echo
echo "✅ $VER 已发布：https://github.com/$REPO/releases/tag/$VER"
echo "→ 最后一步：打开 https://community.obsidian.md/plugins/ob-right-click-menu"
echo "   在 Updates 里点 Publish，商店才会用上新版本。"
