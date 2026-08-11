# Loki电子书转换器

一个简洁的桌面电子书格式转换工具，使用 Calibre 的转换引擎，支持单个或批量转换。

支持常见的 `epub`、`mobi`、`azw3`、`pdf`、`docx`、`txt` 等格式互转。

## 按系统下载

| 电脑系统 | 下载版本 | 安装包 |
| --- | --- | --- |
| macOS，Apple Silicon / Intel | [v1.1.2](https://github.com/loki2046-mao/loki-ebook-converter/releases/tag/v1.1.2) | `Loki电子书转换器-1.1.2-universal.dmg` |
| Windows 10 1809+ / Windows 11，x64 | [v1.1.1](https://github.com/loki2046-mao/loki-ebook-converter/releases/tag/v1.1.1) | `Loki.Setup.1.1.1.exe` |

Mac 和 Windows 安装包不能混用。普通使用只需要下载对应系统的安装包，不需要下载源码 ZIP。

## 普通用户下载安装

不要使用 GitHub 页面上的 `Code > Download ZIP`。源码压缩包不能直接运行。

请打开仓库的 [Releases](https://github.com/loki2046-mao/loki-ebook-converter/releases) 页面，按照上面的系统表下载对应的安装包。

### macOS

Mac 版本发布在 `v1.1.2` Release 中，文件名为：

```text
Loki电子书转换器-1.1.2-universal.dmg
```

这个 DMG 同时支持 Apple Silicon 芯片和 Intel 芯片。

安装步骤：

1. 下载并双击打开 DMG 文件。
2. 将 `Loki电子书转换器.app` 拖到 `Applications` 文件夹。
3. 打开 `Applications`，找到 `Loki电子书转换器.app`。
4. 第一次启动时，建议右键应用，选择“打开”，再在确认窗口中点击“打开”。
5. 如果右键“打开”后仍然无法启动，打开“系统设置 > 隐私与安全性”，在安全性区域找到被阻止的 Loki 电子书转换器，点击“仍要打开”，完成认证后再次启动应用。

Mac 版本没有 Apple Developer 签名，因此第一次启动可能会出现“无法验证开发者”提示。这只需要对本应用放行一次，不需要关闭 Gatekeeper，也不要执行削弱系统安全性的终端命令。

Mac 版本已经内置 Calibre 转换运行时：

- 不需要另外安装 Calibre。
- 不需要安装 Node.js、npm 或 Electron。
- 转换过程中不会打开 Calibre 图形界面，也不会出现 Calibre Dock 图标反复弹跳。

### Windows

Windows 版本发布在 `v1.1.1` Release 中，文件名为：

```text
Loki.Setup.1.1.1.exe
```

当前提供 x64 安装包，支持 Windows 10 1809 及更新版本，以及 Windows 11。

安装步骤：

1. 下载并双击运行 `Loki.Setup.1.1.1.exe`。
2. 如果 Windows SmartScreen 提示“Windows 已保护你的电脑”，点击“更多信息”，确认应用名称后点击“仍要运行”。当前安装包尚未进行代码签名，因此可能出现这个提示。
3. 按安装向导选择安装位置并完成安装。安装过程中可能会请求管理员权限，这是因为 Calibre 需要作为转换引擎安装到系统中。
4. 如果电脑尚未安装 Calibre，安装器会自动运行随包附带的官方 Calibre 安装程序。按照 Calibre 安装向导完成安装即可。
5. 安装完成后，从开始菜单或桌面快捷方式启动 `Loki电子书转换器`。

Windows 版本的 Calibre 安装只发生在首次安装阶段：

- 如果检测到默认位置已经有 Calibre，Loki 安装器会跳过重复安装。
- 日常转换只调用 Calibre 的 `ebook-convert.exe`。
- 转换时不会打开 Calibre 主界面，也不会闪出命令行窗口。
- 不需要另外安装 Node.js、npm 或 Electron。

## 如何使用

1. 启动 `Loki电子书转换器`。
2. 将一个或多个电子书文件拖入窗口，或者点击添加文件按钮选择文件。
3. 在“输出格式”中选择目标格式。
4. 在“输出到”中选择保存位置。不选择时，文件默认保存到源文件所在文件夹。
5. 点击开始转换。
6. 批量转换时，窗口会显示总体进度和当前文件进度；每个文件完成后会立即出现在结果列表中。
7. 转换完成后，可以点击结果旁的文件夹按钮，在 Finder 或 Windows 文件资源管理器中打开输出文件所在位置。

转换不会删除原始电子书文件。输出文件通常会沿用原文件名，只改变扩展名；如果目标文件已经存在，建议先选择其他输出文件夹或处理已有文件。

## 常见问题

### 为什么我在 GitHub 里找不到可以直接运行的文件？

请进入 [Releases](https://github.com/loki2046-mao/loki-ebook-converter/releases)，不要下载仓库 ZIP：

- Mac 下载 `.dmg`。
- Windows 下载 `.exe` 安装包。

### 转换时会不会弹出 Calibre？

不会。Mac 和 Windows 版本都只使用 Calibre 的后台转换引擎，不启动 Calibre 图形界面。

### 为什么 Mac 安装后占用空间比较大？

Mac DMG 内置了完整的 Calibre 后台运行时，包括 Python、Qt、格式插件、字体和相关组件，因此用户不需要另行安装 Calibre。DMG 下载包约 600MB，安装后占用空间会更大，这是“下载后直接使用”的代价。

### Windows 安装器为什么要安装 Calibre？

Loki电子书转换器本身提供界面和批量转换流程，实际的电子书格式转换由 Calibre 引擎完成。Windows 安装器随包附带官方 Calibre MSI，并在安装阶段完成安装，避免你再单独寻找和配置转换引擎。

### PDF 转换后是扫描版吗？

通过电子书转换生成的 PDF 通常包含文本层，不是把页面简单保存成图片。但部分 PDF 阅读器或 Agent 可能因为 PDF 缺少语义标签而识别不准确。如果需要继续交给 Agent 阅读，优先使用 EPUB、MOBI 或 TXT 格式。

## 用 Agent 安装

在 Mac 上，可以把下面的文字交给 Agent：

```text
打开 GitHub 仓库 loki2046-mao/loki-ebook-converter 的 Releases 页面，下载 v1.0.0 中的 Loki-Ebook-Converter-1.0.0-universal.dmg，挂载后把 Loki电子书转换器.app 复制到 /Applications 并启动。如果 macOS 阻止首次启动，右键应用选择“打开”并确认；如果仍然被阻止，到“系统设置 > 隐私与安全性”中对这个应用选择“仍要打开”。
```

在 Windows 上，可以把下面的文字交给 Agent：

```text
打开 GitHub 仓库 loki2046-mao/loki-ebook-converter 的 Releases 页面，下载 v1.1.1 中的 Loki.Setup.1.1.1.exe 并运行安装器。按向导完成安装；如果 Windows SmartScreen 拦截，点击“更多信息”后选择“仍要运行”。安装器会在需要时自动安装 Calibre 转换引擎。
```

## 开发者说明

### 环境要求

- macOS 或 Windows
- Node.js 20 或更新版本
- npm

安装开发依赖：

```bash
npm install
```

启动开发版本：

```bash
npm start
```

开发模式下：

- macOS 会使用本地准备的 Calibre 后台 worker。
- Windows 会查找默认 Calibre 安装位置或系统 PATH 中的 `ebook-convert.exe`。
- 转换过程不会启动 Calibre 图形界面。

### 构建 macOS DMG

在安装了 Calibre 的 macOS 上执行：

```bash
npm run build:mac
```

脚本会从本机 Calibre 安装生成后台 worker，并构建 Apple Silicon + Intel 通用 DMG。输出文件写入 `dist/`。

### 构建 Windows 安装包

在 macOS 或 Windows 上执行：

```bash
npm run build:win
```

脚本会自动下载官方 Calibre Windows MSI，并将它作为安装器的前置安装步骤打入 NSIS 安装包。最终安装包写入 `dist/`。

Windows 安装包当前未签名。正式商业分发前，建议使用 Windows 代码签名证书签署应用和安装器，并在真实 Windows 环境中完成安装、Calibre 前置安装、单文件转换和批量转换测试。

## 项目结构

- `main.js`：Electron 主进程、Calibre 检测、转换和 IPC 处理
- `preload.js`：安全的渲染层桥接
- `renderer/index.html`：拖放、格式选择、输出目录和进度界面
- `scripts/prepare-runtime.js`：准备 macOS 后台 worker
- `scripts/prepare-runtime-win.js`：准备官方 Calibre Windows MSI
- `scripts/installer.nsh`：Windows NSIS 自定义安装步骤
- `runtime/`：本地构建输入，不提交到 Git

## 许可证与第三方组件

Loki电子书转换器自有源代码使用 [MIT License](LICENSE)。

内置的 Calibre 转换运行时和 Windows 安装器中的 Calibre MSI 使用 GNU GPL v3 许可证。相关项目地址和许可证信息：

- [Calibre GitHub](https://github.com/kovidgoyal/calibre)
- [Calibre License](https://calibre-ebook.com/about#license)
- [第三方组件声明](THIRD_PARTY_NOTICES.md)
