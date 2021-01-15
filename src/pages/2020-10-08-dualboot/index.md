---
path: "/2020-10-08-dualboot"
date: "2020-10-08"
title: "About dualboot Arch + Win"
author: "Constantine Yarushkin"
description: "Things to do after installing OSes"
image: "avel-chuklanov-ZEiqbaQhmvE-unsplash.jpg"
tags: "arch, win, os, dualboot"
---

_Photo by_ [_Avel Chuklanov_](https://unsplash.com/@chuklanov?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) _on_ [_Unsplash_](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

# Idea

Below are just things to remember and do when installing two OS'es. Because I'm always forgetting something and then thinking "I should've written this down as a step-by-step guide" :relieved:.

## Order matters

Always install Windows first, and then Arch. That way Win will create a boot partition and other stuff it needs. So when installing Arch you just need to create partitions for `/` and `/home`.

# Windows stuff

## Separate drives

Yes, drives `C:` and `D:` is a salvation. That way you can keep games, downloads, documents, etc. when reinstalling Win. So just do that and install Windows on drive `C:`. And `D:` will be the "storage".

## UTC time

Just do this to spare yourself from thinking "Why the Windows time is X hours behind/ahead?".

- run `regedit`
- navigate to `HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\TimeZoneInformation`
- create new DWORD (32-bit) value named `RealTimeIsUniversal`
- set this value to `1`

## Disable fastboot

It just messes with linux for some reason. So `Settings` > `Power` > `Advanced (or w/e) params` > `Power button actions` > Click on `Change params` > Uncheck `Enable fast boot (recommended)`.

## The case for reinstalling Windows

Before installing do all of the above, obviously. But when you reformat drive `C:` and try to install in that partition it will say something like "Not enough space on main partition". So you need to reformat `boot` partition too. Yes, it will wipe Arch bootloader but that is easy to restore.

### Restoring Arch bootloader [[rEFInd](https://wiki.archlinux.org/index.php/REFInd)]

Boot with a live cd/usb and mount `/` to `/mnt` and `/boot` to `/mnt/boot`. Then `arch-chroot` in `/mnt` and install `linux` package. Then just `refind-install`, and edit `/boot/EFI/refind.conf`. Delete unnecessary lines and change `ro` to `rw`.

Maybe, after booting change refind theme.

# Arch stuff

## Partitioning

Set EFI partition created by Win as `/boot` when creating new table. And create separate partition for `/home`, just like drives `C:` and `D:` for Win. That's pretty much it.

## `D:` aka Storage

When generating `fstab` don't forget to add Windows' drive `D:`, for example as a `/storage`.

## Installation

Just follow the [official wiki](https://wiki.archlinux.org/index.php/Installation_guide) and you're good :wink:
