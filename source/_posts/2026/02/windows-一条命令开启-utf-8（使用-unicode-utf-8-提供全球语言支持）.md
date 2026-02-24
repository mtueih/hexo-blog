---
title: Windows 一条命令开启 UTF-8（使用 Unicode UTF-8 提供全球语言支持）
date: 2026-02-24 09:52:20
titleSlugified: enable-utf-8-in-windows-with-one-command
tags: ["Windows", "UTF-8", "Unicode", "多语言", "编码"]
categories: ["系统维护", "Windows"]
description:
cover:
---

#  Windows 一条命令开启 UTF-8（使用 Unicode UTF-8 提供全球语言支持）

## 手动开启步骤

1. 【控制面板】->【更改日期、时间或数字格式】->【管理】->【更改系统区域设置】；

2. 勾选【Beta 版：使用 Unicode UTF-8 提供全球语言支持】；
3. **重启**。

## 原理

开启【Beta 版：使用 Unicode UTF-8 提供全球语言支持】本质上是修改**注册表**的 3 个键的值为 `65001`：

`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Nls\CodePage` 下的 `ACP`、`MACCP` 和 `OEMCP`；

这 3 个键含义分别如下：

- `ACP`：ANSI Code Page，**Windows 系统默认的 ANSI 代码页**，用于 Win32 API 的 ANSI 版本（如 `CreateFileA` 等以 `A` 结尾的 API）；
- `MACCP`：Mac Code Page，**Macintosh 系统兼容用的代码页**，用于与 Mac 系统的字符编码兼容；
- `OEMCP`：OEM Code Page，**原始设备制造商代码页**，主要用于控制台（CMD）、批处理文件和 MS-DOS 兼容程序。

## 一条命令开启🌟

> [!NOTE]
>
> 以下两种都需要以**管理员**身份执行。

> [!WARNING]
>
> 后面给出的命令执行完修改后会**重启**系统。

> [!TIP]
>
> 如果不希望修改后立即重启系统，将最后的 `Restart-Computer` 和 `shutdown /r /t 0` 删除即可。

### Powershell

Windows Powershell 和 Powershell 都行。

```powershell
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage" -Name "ACP" -Value "65001"; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage" -Name "MACCP" -Value "65001"; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage" -Name "OEMCP" -Value "65001"; Restart-Computer
```

### CMD

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Nls\CodePage" /v ACP /t REG_SZ /d 65001 /f && reg add "HKLM\SYSTEM\CurrentControlSet\Control\Nls\CodePage" /v MACCP /t REG_SZ /d 65001 /f && reg add "HKLM\SYSTEM\CurrentControlSet\Control\Nls\CodePage" /v OEMCP /t REG_SZ /d 65001 /f && shutdown /r /t 0
```

## 恢复

> [!NOTE]
>
> 语言不同，这 3 个注册表键的默认值就不同，以下以中文为例，具体可根据情况修改。

### Powershell

```powershell
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage" -Name "ACP" -Value "936"; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage" -Name "MACCP" -Value "10008"; Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\Nls\CodePage" -Name "OEMCP" -Value "936"; Restart-Computer
```

### CMD

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Nls\CodePage" /v ACP /t REG_SZ /d 936 /f && reg add "HKLM\SYSTEM\CurrentControlSet\Control\Nls\CodePage" /v MACCP /t REG_SZ /d 10008 /f && reg add "HKLM\SYSTEM\CurrentControlSet\Control\Nls\CodePage" /v OEMCP /t REG_SZ /d 936 /f && shutdown /r /t 0
```