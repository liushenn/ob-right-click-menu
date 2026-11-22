# 右键菜单 / Right-click Menu

**给 Obsidian 编辑器的右键菜单做减法，同时把常用命令放到最上面。**

Obsidian 的右键菜单会越用越长：自带的剪切/复制/粘贴/插入，各个插件塞进来的项，还有一层层子菜单。这个插件把整份菜单变成一个清单——在正文里右键几次，出现过的菜单项都会被收集到设置里，不想看的取消勾选就消失；反过来，任意命令都可以固定到菜单顶部，常用操作一次右键就能点到。

## 它解决什么问题

- **菜单太长**：剪切、复制、粘贴确实常用，但「插入脚注」「某插件的五层子菜单」「一整排标记命令」通常用不上。
- **插件硬塞菜单项**：有的插件会往右键菜单加你根本不需要的项，现在可以单独隐藏，不用卸载插件。
- **常用命令藏得深**：加批注、插入表格、打开今日日记这类天天用的命令，不必每次去命令面板搜，固定到右键顶部即可。

## 功能

| 功能 | 说明 |
| --- | --- |
| **隐藏任意菜单项** | 编辑器右键菜单里出现过的每一项都会被自动收集——包括 Obsidian 自带的（剪切、复制、粘贴、插入…）、其他插件添加的，以及 `Track changes ▸` 这类子菜单。取消勾选即从菜单中移除。 |
| **固定任意命令** | 可搜索 Obsidian 和所有已装插件注册的命令。勾选后追加到右键菜单最上方。 |
| **自定义分隔线** | 让固定的命令和原生菜单项在视觉上分开。 |
| **中英双语界面** | 设置页可切换中文 / English。 |

## 使用方法

1. 在 **设置 → 第三方插件** 里启用本插件；
2. 打开 **设置 → 右键菜单**；
3. 先在正文里右键几次（想管理子菜单的话，把子菜单也展开一次）。
   插件只能收集「已经出现过」的菜单项，没打开过的项它无从知晓；
4. 回到设置页操作：
   - **隐藏右键菜单项**：取消勾选不想看的项（勾选 = 显示）；
   - **添加命令到右键菜单**：搜索并勾选要固定到顶部的命令；
5. 再次右键正文即可看到结果。

## 注意事项

- 菜单项按**显示文字**匹配，跟随 Obsidian 界面语言。切换应用语言后，文字变了，需要重新收集并重新隐藏。
- 列表只在真正用过菜单时才增长，插件不会在后台扫描。
- 隐藏只影响右键菜单本身；对应命令仍可通过命令面板和快捷键使用。

## 安装

- **社区目录**：设置 → 第三方插件 → 浏览，搜索 *Right-click Menu*；
- **手动**：把 `main.js` 和 `manifest.json` 放进 `<库>/.obsidian/plugins/ob-right-click-menu/`，再在设置里启用。

## 许可

MIT

---

# English

**Clean up Obsidian's editor right-click menu — and put the commands you actually use on top of it.**

Obsidian's right-click menu keeps growing: built-in items, items added by plugins, nested submenus. This plugin turns the whole menu into a checklist. Right-click a few times and everything that ever appears in that menu is collected in the settings tab — uncheck what you never use and it's gone. The other way round, any command can be pinned to the top of the menu.

## Features

| Feature | What it does |
| --- | --- |
| **Hide any menu item** | Every item that appears in the editor context menu is collected automatically — Obsidian's built-in items (Cut, Copy, Paste, Insert…), items added by other plugins, and submenus such as `Track changes ▸`. Uncheck an item and it disappears. |
| **Pin any command** | Searches all commands from Obsidian and every installed plugin. Checked commands are appended to the top of the right-click menu. |
| **Separator toggle** | Keeps pinned commands visually separated from the native items. |
| **Bilingual UI** | 中文 / English, switchable in the settings tab. |

## Usage

1. Enable the plugin in **Settings → Community plugins**.
2. Open **Settings → Right-click menu**.
3. Right-click a few times inside a note (open any submenu you want to manage too) — items are only collected once they have been shown.
4. In the settings tab, uncheck the items you want hidden, and check the commands you want pinned on top.
5. Right-click again to see the result.

## Notes

- Items are matched by their displayed label, in the language Obsidian is running in. Switching the app language changes the labels, so you may need to re-collect and re-hide them.
- The list only grows when you use the menu; nothing is collected in the background.
- Hiding an item only affects the menu — the command stays available through the command palette and hotkeys.

## Installation

From the community directory: search for *Right-click Menu* in **Settings → Community plugins → Browse**. Manual: copy `main.js` and `manifest.json` into `<vault>/.obsidian/plugins/ob-right-click-menu/` and enable the plugin.

## License

MIT
