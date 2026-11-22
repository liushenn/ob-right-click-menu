# Right-click Menu

**Clean up Obsidian's editor right-click menu — and put the commands you actually use on top of it.**

Obsidian's right-click menu keeps growing: core items, plugin items, nested submenus. This plugin turns the whole menu into a checklist. Right-click a few times, everything that ever appears in that menu gets collected in the settings tab, and you simply switch off what you never use. The other way round, you can pin any command in Obsidian to the top of the menu.

## Why

- Long menus slow you down. Cut/Copy/Paste are useful, but "Insert footnote", five different plugin submenus and a wall of markup commands usually are not.
- Some plugins add items to the menu that you never asked for. Hide them without uninstalling the plugin.
- Commands you use all day (e.g. *Add comment*, *Insert table*, *Open today's note*) can be one right-click away, instead of buried in the command palette.

## Features

| Feature | What it does |
| --- | --- |
| **Hide any menu item** | Every item that appears in the editor context menu is collected automatically — Obsidian's built-in items (Cut, Copy, Paste, Insert…), items added by other plugins, and submenus such as `Track changes ▸`. Uncheck an item and it disappears from the menu. |
| **Pin any command** | Searches all commands from Obsidian and every installed plugin. Checked commands are appended to the top of the right-click menu. |
| **Separator toggle** | Keeps your pinned commands visually separated from the native items. |
| **Bilingual UI** | 中文 / English, switchable in the settings tab. |

## Usage

1. Enable the plugin in **Settings → Community plugins**.
2. Open **Settings → Right-click menu**.
3. Right-click a few times inside a note (open a submenu too, if you want to control its items).
   Items are collected on use — the plugin cannot know about a menu item before it has been shown once.
4. Go back to the settings tab:
   - **Hide menu items** — uncheck anything you don't want (checked = visible).
   - **Pin commands to the context menu** — search and check the commands you want on top.
5. Right-click in a note again to see the result.

### Notes

- Items are matched by their displayed label, in the language Obsidian is running in. If you switch the app language, the labels change and you may need to re-collect/re-hide them.
- The list only grows when you use the menu; nothing is collected in the background.
- Hiding an item only affects the menu. The command itself is still available through the command palette and hotkeys.

## Installation

**From the community directory:** search for *Right-click Menu* in **Settings → Community plugins → Browse**.

**Manual:** copy `main.js` and `manifest.json` into `<vault>/.obsidian/plugins/ob-right-click-menu/` and enable the plugin in the settings.

## 中文说明

**作用：给你自己的 Obsidian 右键菜单做减法和加法。**

- 右键菜单里出现的每一项（Obsidian 自带的剪切/复制/粘贴/插入，以及其他插件塞进来的项、甚至 `Track changes ▸` 这类子菜单）都会被自动收集到设置里，不想看的取消勾选即可隐藏，不用卸载插件。
- 反过来，可以把任意命令（来自 Obsidian 或任何插件）固定到右键菜单最上方，常用操作一次右键就能点到。
- 界面支持中文/英文切换。

**用法**：设置 → 右键菜单 → 先在正文里右键几次（插件只能收集「出现过」的菜单项）→ 回到设置里取消勾选不想要的项 / 搜索并勾选想固定到顶部的命令 → 再右键即可看到效果。

注意：菜单项按「显示文字」匹配，切换 Obsidian 界面语言后需要重新收集和隐藏。

## License

MIT
