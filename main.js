const { Plugin, PluginSettingTab, Setting } = require('obsidian');

const DEFAULTS = {
  lang: 'zh',       // 'zh' | 'en'
  pinned: [],       // command ids pinned to the top of the menu
  hiddenItems: [],  // menu item labels to hide
  knownItems: [],   // labels seen so far
  separate: true,
};

const STR = {
  zh: {
    title: '右键菜单',
    intro: '在正文里右键几次，菜单项会被收集到这里，然后逐个开关。',
    lang: '界面语言',
    separate: '自定义命令前加分隔线',
    hide: '隐藏右键菜单项',
    hideDesc: (n) => `已收集 ${n} 项 · 勾选 = 显示，取消 = 移除`,
    searchItems: '搜索菜单项…',
    pin: '添加命令到右键菜单',
    pinDesc: '勾选后出现在右键菜单最上方；这里列出 Obsidian 全部命令。',
    searchCmds: '搜索命令名…',
    empty: '还没收集到菜单项，去正文里右键几次再回来',
    noItems: '没有匹配的菜单项',
    noCmds: '没有匹配的命令',
  },
  en: {
    title: 'Right-click menu',
    intro: 'Right-click in a note a few times: items are collected here, then toggle each one.',
    lang: 'Language',
    separate: 'Separator before custom commands',
    hide: 'Hide menu items',
    hideDesc: (n) => `Collected ${n} · checked = shown, unchecked = removed`,
    searchItems: 'Search menu items…',
    pin: 'Pin commands to the context menu',
    pinDesc: 'Checked commands appear at the top of the menu. All commands are listed.',
    searchCmds: 'Search commands…',
    empty: 'No menu items collected yet — right-click in a note a few times',
    noItems: 'No matching menu items',
    noCmds: 'No matching commands',
  },
};

const nameOf = (c) => (typeof c.name === 'function' ? c.name() : c.name);
const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();

class MenuTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.query = '';
    this.itemQuery = '';
  }

  t(k) {
    const dict = STR[this.plugin.settings.lang] || STR.zh;
    const v = dict[k] !== undefined ? dict[k] : STR.zh[k];
    return typeof v === 'function' ? v(this.plugin.settings.knownItems.length) : v;
  }

  display() {
    const el = this.containerEl;
    el.empty();
    el.createEl('h2', { text: this.t('title') });
    el.createEl('div', { cls: 'setting-item-description', text: this.t('intro') });

    new Setting(el)
      .setName(this.t('lang'))
      .addDropdown((d) =>
        d
          .addOption('zh', '中文')
          .addOption('en', 'English')
          .setValue(this.plugin.settings.lang)
          .onChange(async (v) => {
            this.plugin.settings.lang = v === 'en' ? 'en' : 'zh';
            await this.plugin.saveSettings();
            this.display();
          })
      );

    new Setting(el).setName(this.t('separate')).addToggle((tog) =>
      tog.setValue(this.plugin.settings.separate).onChange(async (v) => {
        this.plugin.settings.separate = v;
        await this.plugin.saveSettings();
      })
    );

    const itemsBox = el.createDiv();
    this.styleBox(itemsBox);
    if (this.plugin.settings.knownItems.length === 0) {
      itemsBox.createDiv({ cls: 'setting-item-description', text: this.t('empty') });
    }
    new Setting(el)
      .setName(this.t('hide'))
      .setDesc(this.t('hideDesc'))
      .addText((tx) => {
        tx.setPlaceholder(this.t('searchItems'));
        tx.onChange((v) => {
          this.itemQuery = v.trim().toLowerCase();
          this.renderItems(itemsBox);
        });
      });
    el.appendChild(itemsBox);
    this.renderItems(itemsBox);

    const cmdBox = el.createDiv();
    this.styleBox(cmdBox);
    new Setting(el)
      .setName(this.t('pin'))
      .setDesc(this.t('pinDesc'))
      .addText((tx) => {
        tx.setPlaceholder(this.t('searchCmds'));
        tx.onChange((v) => {
          this.query = v.trim().toLowerCase();
          this.renderCommands(cmdBox);
        });
      });
    el.appendChild(cmdBox);
    this.renderCommands(cmdBox);
  }

  styleBox(box) {
    box.style.cssText =
      'max-height:320px;overflow:auto;border:1px solid var(--background-modifier-border);' +
      'border-radius:6px;padding:6px 8px;margin-bottom:10px';
  }

  row(title, id, checked, onToggle) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:3px 0';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = checked;
    const label = document.createElement('span');
    label.textContent = title;
    label.style.cssText = 'flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    const meta = document.createElement('span');
    meta.textContent = id || '';
    meta.style.cssText =
      'opacity:.35;font-size:.72em;max-width:46%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    cb.addEventListener('change', () => onToggle(cb.checked));
    row.append(cb, label, meta);
    return row;
  }

  renderItems(box) {
    box.empty();
    const s = this.plugin.settings;
    const q = this.itemQuery;
    const all = Array.from(new Set(s.knownItems)).sort((a, b) => a.localeCompare(b));
    const list = all.filter((x) => x.toLowerCase().includes(q));
    if (!list.length) {
      if (!all.length) return;
      box.createDiv({ cls: 'setting-item-description', text: this.t('noItems') });
      return;
    }
    list.forEach((label) => {
      box.appendChild(
        this.row(label, '', !s.hiddenItems.includes(label), async (on) => {
          const i = s.hiddenItems.indexOf(label);
          if (!on && i < 0) s.hiddenItems.push(label);
          if (on && i >= 0) s.hiddenItems.splice(i, 1);
          await this.plugin.saveSettings();
        })
      );
    });
  }

  renderCommands(box) {
    box.empty();
    const q = this.query;
    const pinned = this.plugin.settings.pinned;
    const all = Object.values(this.app.commands.commands)
      .map((c) => ({ id: c.id, name: nameOf(c) }))
      .filter((c) => c.name && c.name.toLowerCase().includes(q));
    all.sort((a, b) => a.name.localeCompare(b.name));
    if (!all.length) {
      box.createDiv({ cls: 'setting-item-description', text: this.t('noCmds') });
      return;
    }
    all.forEach((c) => {
      box.appendChild(
        this.row(c.name, c.id, pinned.includes(c.id), async (on) => {
          const i = pinned.indexOf(c.id);
          if (on && i < 0) pinned.push(c.id);
          if (!on && i >= 0) pinned.splice(i, 1);
          await this.plugin.saveSettings();
        })
      );
    });
  }
}

module.exports = class RightClickMenu extends Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULTS, await this.loadData());
    for (const k of ['pinned', 'hiddenItems', 'knownItems']) {
      if (!Array.isArray(this.settings[k])) this.settings[k] = [];
    }
    if (this.settings.lang !== 'en') this.settings.lang = 'zh';

    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu) => {
        this.processMenu(menu);

        const usable = this.settings.pinned
          .map((id) => this.app.commands.commands[id])
          .filter(Boolean);
        if (!usable.length) return;
        if (this.settings.separate) menu.addSeparator();
        for (const cmd of usable) {
          menu.addItem((item) =>
            item
              .setTitle(nameOf(cmd))
              .setIcon(cmd.icon || 'terminal')
              .onClick(() => this.app.commands.executeCommandById(cmd.id))
          );
        }
      })
    );

    this.addSettingTab(new MenuTab(this.app, this));
  }

  // Collect item labels and drop the hidden ones from menu.items (submenus too)
  processMenu(menu) {
    const hidden = this.settings.hiddenItems;
    const known = this.settings.knownItems;
    let changed = false;

    const walk = (m) => {
      if (!m || !Array.isArray(m.items)) return;
      for (const it of m.items) {
        if (!it) continue;
        const label = it.titleEl ? norm(it.titleEl.textContent) : '';
        if (label && !known.includes(label)) {
          known.push(label);
          changed = true;
        }
        if (it.submenu) walk(it.submenu);
      }
      m.items = m.items.filter((it) => {
        const label = it && it.titleEl ? norm(it.titleEl.textContent) : '';
        return !label || !hidden.includes(label);
      });
    };

    walk(menu);
    if (changed) this.saveSettings();
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
};
