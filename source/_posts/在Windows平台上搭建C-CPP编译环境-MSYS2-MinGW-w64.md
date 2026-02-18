---
title: 在 Windows 平台上搭建 C/C++ 编译环境（MSYS2 + MinGW-w64）
date: 2026-02-05 21:24:23
titleSlugified: mingw-windows-tutorial
tags: ["Windows", "C", "C++", "MinGW-w64", "MSYS2", "GCC"]
categories: ["编程", "C/C++", "环境搭建"]
description: 详细介绍如何在 Windows 平台上使用 MSYS2 搭建 MinGW-w64 GCC 编译环境，包括 MSYS2 安装、MinGW-w64 工具链选择、环境变量配置及后续更新维护。
cover:
---

## ➤ 什么是 C/C++ 编译环境（了解请跳过）

### ➥ 开发环境 & 编译环境

#### 开发环境

**开发环境**（在信息技术领域，开发通常都是指*软件开发*）是我们完成软件开发这件事的整个流程所需要的整个软件环境，而软件开发这件事，通常包含**生产代码**和**构建最终软件产品**两个部分。那么所谓的开发环境，通常就包含，直接支持或间接辅助我们生产代码的**代码编辑软件**，以及，直接参与或间接辅助生成最终软件产品的一系列**最终软件构建软件**。

通常我们**搭建开发环境**，都会直接安装 **IDE**，即**集成开发环境**。所谓集成开发环境，就是它把开发所需要的各种零碎的东西都打包好了，比如用来编辑代码的**编辑器**、用来把代码翻译成可执行文件的**编译器**、用来调试代码的**调试器**等。IDE 的优点是开箱即用，安装一个 IDE，立马就可以开始开发了，所以很多课程、教学最开始都会推荐新手安装 IDE。但 IDE 也有缺点，就是隐藏编译细节（对编译过程有一定的了解还是很有必要的）和捆绑（很不方便控制编译过程中的某些细节）。

#### 编译环境

而**编译环境**，是开发环境中只负责*构建最终软件产品*的部分。

为什么要独立搭建编译环境，而不总是搭建完整的开发环境？因为：

- 我们有时候只需要参与*构建最终软件产品*，不需要参与*生产代码*（比如很多开源软件，都支持下载源代码后自己编译）；
- 能够帮助我们理解*软件开发*的本质；
- 能够更灵活地组建开发环境；
- 能够更便捷地编译简单的项目；

### ➥ C/C++ 编译环境

不同的编程语言（这里主要指编译型语言，因为另一种语言，解释型语言，往往需要执行环境而不是编译环境），编译环境所需要的工具会有所不同，并且往往不止需要一个工具，比如 C/C++ 语言需要**链接器**。因此，我们将从源代码到可执行文件的编译过程中所需要的一系列工具，称为**编译工具链**，更准确些。

Linux 平台往往自带 C/C++ 的编译环境，即使没有，搭建它也非常简单，通常只需要一个命令，比如 `sudo apt install gcc`。这导致我们经常认为，搭建编译环境，就等于安装编译器，这种说法没错，但不严谨。重要的是我们要理解我们经常挂在嘴边的“编译器”意味着什么。

通常我们通过 `sudo apt install gcc` 安装的，不光是 `gcc` 这个我们常用的命令，还有其它命令行工具，以及**标准库**（标准头文件，以及实现它们的库文件等），它们构成了一个完整的编译工具链。

所以，C/C++ 编译环境，或者说 **C/C++ 编译工具链**，实际上可以分为

- 一系列编译用的可执行文件；
- 一系列标准库文件。

## ➤ Windows 平台上有哪些主流 C/C++ 编译环境

这里我们只考虑最终生成的是 Windows 可执行程序的编译环境（排除 WSL、虚拟机、兼容层等）：

- **MSVC**（**M**icro**s**oft **V**isual **C**++），Windows 平台原生编译工具链，对 Windows 平台兼容性最好，开发原生 Windows 程序的首选，Visual Studio 深度集成；
- **MinGW-w64**（**Min**imalist **G**NU for **W**indows **64**-bit），GCC 工具链的移植，因为是移植所以没有官方提供统一安装包，所有编译好可直接安装的版本，几乎都是第三方项目，作为子工具，以工具包的形式发布，这也就导致了各种工具包所包含的工具不统一；
- **Clang**，Clang 是和 GCC 不相上下的一款 C/C++ 编译工具链，并且它有一个优点，就是官方提供编译、打包好的安装包，不过包含内容太过全面，很多内容已经超出编译环境的范畴，比如代码格式化工具等；

### ➥ 为什么选择 MinGW-w64

就因为它是 GCC 的移植。GCC 是对 C/C++ 标准支持最好的编译器，我们可以简单看一张图：

![C 编译器对 C23 支持情况表格](/img/mingw-windows-tutorial/01-c23-support.webp)

另外使用 MinGW-w64 还有以下优点：

- 类似在 Linux 上的使用体验；
- 对命令行编译友好；
- 对跨平台开发支持最好。

### ➥ 安装 MinGW-w64 的方法有哪些

之前也说过，MinGW-w64 没有官方提供统一安装包，所以就导致了安装它的方法有很多，有以下这些工具包包含 MinGW-w64（数据来源于 [MinGW-w64 官网](https://www.mingw-w64.org/downloads/#pre-built-toolchains-and-packages)）：

- Cygwin，通过兼容层模拟 Unix 环境，让 Unix 软件在 Windows 上运行，它生成的不是原生的 Windows 程序，所以排除；
- LLVM-MinGW，并不是 GCC + MinGW-w64，而是 Clang + MinGW-w64，所以排除；
- MinGW-W64-builds，提供完整的 GCC 工具链，由个人开发者维护；
- MSYS2，提供类 Unix 命令行环境，但通过它安装的 MinGW-w64 可以生成原生的 Windows 程序；
- w64devkit，极简、便捷的 GCC 工具链；
- WinLibs，同时支持 GCC 和 Clang。

{% note 'fas fa-lightbulb' %}
严格意义上来说，MinGW-w64 与 GCC 没有直接关系，通常我们认为的，以及本文大部分情况所说的 MinGW-w64 是完整的 GCC 工具链，这是由于 MinGW-w64 的前身 MinGW 提供完整的 GCC 工具链，而 MinGW-w64 只包含前文所述编译工具链的标准库部分。下图是[官网](https://www.mingw-w64.org/)的介绍：

![MinGW-w64 官网介绍](/img/mingw-windows-tutorial/02-mingw-intro.webp)
{% endnote %}

### ➥ 为什么选择 MSYS2

在众多的工具包中，我们选择 MSYS2。MSYS2 相较于其它并不是最便捷的，并且它本身并不是我们要安装的工具链，而是一个模拟 Unix 环境的命令行工具。那么为什么选择 MSYS2 呢？

- **能够保证工具链版本是最新的**，MSYS2 移植了著名 Linux 发行版 Arch Linux 上的包管理器 Pacman，而 Pacman 采用滚动更新机制；
- **我们在需要时能够按需添加其它工具**，MSYS2 项目提供了一个包管理器，并且 MSYS2 项目还维护了很多工具（比如我们要安装的工具链的命令行工具部分是由 MSYS2 项目维护的）；
- **安装和更新方便**，由于其使用包管理器，所以安装和更新工具包往往只需要一行命令；
- **提供类 Unix 环境**，使得我们能获得更贴近 Unix 环境的使用体验。

## ➀ 下载安装 MSYS2

### 方式一：通过 WinGet 安装（推荐）

这种方法适用于支持 WinGet 的 Windows 版本，通常是 Windows 10 及以上。

打开终端，输入以下命令：

```pwsh
winget install MSYS2.MSYS2
```

等待安装完成即可。

### 方式二：通过安装包安装

1. 打开 MSYS2 官网【<https://www.msys2.org/>】，找到下载按钮，根据自己情况选择：

![从 MSYS2 官网下载安装包](/img/mingw-windows-tutorial/03-msys2-download.webp)

1. 下载完成后，打开安装包，欢迎界面，点【Next】：

![MSYS2 安装步骤：欢迎界面](/img/mingw-windows-tutorial/04-msys2-welcome.webp)

1. 选择安装路径界面，{% label 建议保持默认 green %}，如果要修改也最好保证安装路径不要有中文和空格，然后点击【Next】：

![MSYS2 安装步骤：选择安装路径](/img/mingw-windows-tutorial/05-msys2-path.webp)

1. 选择开始菜单文件夹界面，保持默认，然后点击【Next】：

![MSYS2 安装步骤：选择开始菜单文件夹](/img/mingw-windows-tutorial/06-msys2-startmenu.webp)

1. 等待安装：

![MSYS2 安装步骤：等待安装](/img/mingw-windows-tutorial/07-msys2-installing.webp)

1. 安装完成，【Run MSYS now.】（安装过程结束后立即运行 MSYS2）可勾可不勾，然后点击【Finish】：

![MSYS2 安装步骤：完成](/img/mingw-windows-tutorial/08-msys2-finish.webp)

## ➁ 安装 MinGW-w64

1. 打开 MSYS2，先输入以下命令，同步软件包数据库并升级所有软件包：

```bash
pacman -Syu
```

中途出现任何询问**直接回车**即可，有可能需要重启才能完成更新，重新启动后再执行一遍，确保更新完成（如果不确定就多跑几遍，直到结果出现“there is nothing to do”，如下图）。

![MSYS2 更新完成](/img/mingw-windows-tutorial/09-msys2-update.webp)

1. 安装 MinGW-w64：

MSYS2 提供了 3 种使用 GCC 的 MinGW-w64 工具链，分别是：

| 工具链 | 包名 |
| --- | --- |
| **mingw32** | `mingw-w64-i686-gcc` |
| **mingw64** | `mingw-w64-x86_64-gcc` |
| **ucrt64** | `mingw-w64-ucrt-x86_64-gcc` |

三者区别在于生成的 Windows 程序的架构不同，以及使用的 **C 运行时库**不同：

- mingw32 用于生成 32 位 Windows 应用程序，其它两个生成的都是 64 位；
- ucrt64 使用了较新的 **C 运行时库**，其它两个使用了较老的 **C 运行时库**。

目前最推荐使用的是 ucrt64，这里就以它为例，当然如果你有特殊需求也可以安装别的，并且可以同时安装多个。在 MSYS2 中输入以下命令安装：

```bash
pacman -S mingw-w64-ucrt-x86_64-gcc
```

等待命令执行完成即可。

## ➂ 配置环境变量

安装成功后，还不能直接使用，还需要配置 Path 环境变量。

### 配置 Windows 环境变量

#### 找到 MinGW-w64 的安装路径

在配置环境变量前，我们要找到 MinGW-w64 的安装路径，这取决于两个因素，你的 MSYS2 的安装路径，以及你安装了哪个工具链（如果安装了多个，那么只能同时配置一个，这个很容易理解）。

1. 首先找到 MSYS2 的安装路径，以默认的 `C:\msys64` 为例，在此路径下有 3 个文件夹，分别对应之前说的 3 种工具链：

![MSYS2 安装路径下的文件夹](/img/mingw-windows-tutorial/10-msys2-folders.webp)

1. 选择你所安装的工具链对应的文件夹，这里以 `ucrt64` 为例，该文件夹下的 `bin` 文件夹的路径，就是我们要添加到 Path 变量中的值：

![MinGW-w64 安装路径下的 bin 文件夹](/img/mingw-windows-tutorial/11-bin-folder.webp)

因此，我们需要在 Path 变量中添加的路径为 `C:\msys64\ucrt64\bin`。

#### 配置 Path 环境变量

1. 键盘按【Win + R】打开运行窗口，输入 `sysdm.cpl` 回车，打开系统属性窗口：

![配置 Windows 环境变量：运行窗口输入 sysdm.cpl](/img/mingw-windows-tutorial/12-env-run.webp)

1. 依次点击【高级】、【环境变量】，找到【系统变量】的【Path】变量，双击它：

![配置 Windows 环境变量：点击高级](/img/mingw-windows-tutorial/13-env-advanced.webp)

![配置 Windows 环境变量：点击环境变量](/img/mingw-windows-tutorial/14-env-vars.webp)

![配置 Windows 环境变量：找到系统 Path 变量](/img/mingw-windows-tutorial/15-env-path.webp)

1. 然后点击【新建】，粘贴刚才的路径，回车：

![配置 Windows 环境变量：点击新建](/img/mingw-windows-tutorial/16-env-new.webp)

![配置 Windows 环境变量：粘贴路径](/img/mingw-windows-tutorial/17-env-paste.webp)

1. 依次点击 3 次【确定】：

![配置 Windows 环境变量：点击确定 1](/img/mingw-windows-tutorial/18-env-ok-1.webp)

![配置 Windows 环境变量：点击确定 2](/img/mingw-windows-tutorial/19-env-ok-2.webp)

![配置 Windows 环境变量：点击确定 3](/img/mingw-windows-tutorial/20-env-ok-3.webp)

最后打开一个新的终端窗口输入 `gcc --version` 验证一下：

![配置 Windows 环境变量：验证](/img/mingw-windows-tutorial/21-verify-gcc.webp)

## ➤ 后续更新

后续如果要更新 MSYS2 和 MinGW-w64，只需要在 MSYS2 中输入以下命令：

```bash
pacman -Syu
```

等待命令执行完成即可。
