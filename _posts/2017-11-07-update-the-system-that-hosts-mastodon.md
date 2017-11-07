---
layout: post
date: 2017-11-07 09:57:53 +0900
title: Mastodon을 호스트하는 시스템 업데이트하기
slug: update-the-system-that-hosts-mastodon
categories:
  - Mastodon
tags: 
post_license: by-nc-sa
code_license: Unlicense
---

사이트가 있다면 사이트가 돌아가는 시스템이 있기 마련이고, 시스템을 이루는 소프트웨어는 언젠가는 업데이트를 할 필요가 있을 것이다. 이 포스트에서는 [Mastodon] 인스턴스를 호스트하는 시스템의 소프트웨어를 업데이트하는 과정에서 내가 겪었던 문제와 그 해결법에 대해 이야기해보고자 한다.

## 사건의 발단

나는 평소처럼 시스템 업데이트를 진행하고 있었다. 일반적인 경우, 시스템 업데이트는 정말 길어도 5분 이내에는 완료될 정도로 짧고 간단한 작업이다.

```terminal
$ yaourt -Syu
[sudo] password for mayu: 
:: Synchronizing package databases...
 core                     124.7 KiB   179K/s 00:01 [######################] 100%
 extra                   1654.4 KiB  2.29M/s 00:01 [######################] 100%
 community                  4.1 MiB  8.61M/s 00:00 [######################] 100%

==> Software upgrade (new version) :
core/curl                 7.56.0-1           -> 7.56.1-1
core/libsystemd           235.8-1            -> 235.38-1
core/libutil-linux        2.30.2-1           -> 2.31-1
core/linux                4.13.8-1           -> 4.13.9-1
core/linux-firmware       20170907.a61ac5c-1 -> 20171009.bf04291-1
core/mkinitcpio           23-2               -> 24-2
core/pacman-mirrorlist    20171017-1         -> 20171027-1
core/s-nail               14.9.4-1           -> 14.9.5-1
core/systemd              235.8-1            -> 235.38-1
core/systemd-sysvcompat   235.8-1            -> 235.38-1
core/util-linux           2.30.2-1           -> 2.31-1
extra/harfbuzz            1.6.0-1            -> 1.6.3-1
extra/mesa                17.2.2-1           -> 17.2.3-2
extra/protobuf            3.3.2-1            -> 3.4.1-1
extra/python              3.6.2-1            -> 3.6.3-1
extra/python-cryptography 2.1.1-1            -> 2.1.2-1
extra/sdl2                2.0.6-2            -> 2.0.7-1
community/nodejs          8.8.0-1            -> 8.8.1-1

==> Continue upgrade ? [Y/n]
==> [V]iew package detail   [M]anually select packages
==> --------------------------------------------------
==> 
:: Starting full system upgrade...
resolving dependencies...
looking for conflicting packages...

Packages (18) curl-7.56.1-1  harfbuzz-1.6.3-1  libsystemd-235.38-1
              libutil-linux-2.31-1  linux-4.13.9-1
              linux-firmware-20171009.bf04291-1  mesa-17.2.3-2  mkinitcpio-24-2
              nodejs-8.8.1-1  pacman-mirrorlist-20171027-1  protobuf-3.4.1-1
              python-3.6.3-1  python-cryptography-2.1.2-1  s-nail-14.9.5-1
              sdl2-2.0.7-1  systemd-235.38-1  systemd-sysvcompat-235.38-1
              util-linux-2.31-1

Total Download Size:   165.92 MiB
Total Installed Size:  551.75 MiB
Net Upgrade Size:        1.54 MiB

:: Proceed with installation? [Y/n] 
:: Retrieving packages...
 libutil-linux-2.31-...   347.9 KiB   365K/s 00:01 [######################] 100%
 curl-7.56.1-1-x86_64     963.3 KiB  2024K/s 00:00 [######################] 100%
 libsystemd-235.38-1...   335.9 KiB  46.9M/s 00:00 [######################] 100%
 linux-firmware-2017...    45.6 MiB  7.67M/s 00:06 [######################] 100%
 util-linux-2.31-1-x...  1958.2 KiB  8.07M/s 00:00 [######################] 100%
 systemd-235.38-1-x86_64    4.3 MiB  8.88M/s 00:00 [######################] 100%
 mkinitcpio-24-2-any       40.6 KiB  0.00B/s 00:00 [######################] 100%
 linux-4.13.9-1-x86_64     65.5 MiB  7.87M/s 00:08 [######################] 100%
 pacman-mirrorlist-2...     5.9 KiB  0.00B/s 00:00 [######################] 100%
 systemd-sysvcompat-...     7.4 KiB  0.00B/s 00:00 [######################] 100%
 harfbuzz-1.6.3-1-x86_64  375.3 KiB   122M/s 00:00 [######################] 100%
 mesa-17.2.3-2-x86_64      11.7 MiB  8.12M/s 00:01 [######################] 100%
 python-3.6.3-1-x86_64     34.3 MiB  8.00M/s 00:04 [######################] 100%
 sdl2-2.0.7-1-x86_64      581.4 KiB   142M/s 00:00 [######################] 100%
(18/18) checking keys in keyring                   [######################] 100%
(18/18) checking package integrity                 [######################] 100%
(18/18) loading package files                      [######################] 100%
(18/18) checking for file conflicts                [######################] 100%
(18/18) checking available disk space              [######################] 100%
:: Processing package changes...
( 1/18) upgrading libutil-linux                    [######################] 100%
( 2/18) upgrading curl                             [######################] 100%
( 3/18) upgrading harfbuzz                         [######################] 100%
( 4/18) upgrading libsystemd                       [######################] 100%
( 5/18) upgrading linux-firmware                   [######################] 100%
( 6/18) upgrading util-linux                       [######################] 100%
( 7/18) upgrading systemd                          [######################] 100%
( 8/18) upgrading mkinitcpio                       [######################] 100%
( 9/18) upgrading linux                            [######################] 100%
>>> Updating module dependencies. Please wait ...
(10/18) upgrading mesa                             [######################] 100%
(11/18) upgrading nodejs                           [######################] 100%
(12/18) upgrading pacman-mirrorlist                [######################] 100%
warning: /etc/pacman.d/mirrorlist installed as /etc/pacman.d/mirrorlist.pacnew
(13/18) upgrading protobuf                         [######################] 100%
(14/18) upgrading python                           [######################] 100%
(15/18) upgrading python-cryptography              [######################] 100%
(16/18) upgrading s-nail                           [######################] 100%
(17/18) upgrading sdl2                             [######################] 100%
(18/18) upgrading systemd-sysvcompat               [######################] 100%
:: Running post-transaction hooks...
(1/5) Updating linux initcpios
==> Building image from preset: /etc/mkinitcpio.d/linux.preset: 'default'
  -> -k /boot/vmlinuz-linux -c /etc/mkinitcpio.conf -g /boot/initramfs-linux.img
==> Starting build: 4.13.9-1-ARCH
  -> Running build hook: [base]
  -> Running build hook: [udev]
  -> Running build hook: [autodetect]
  -> Running build hook: [modconf]
  -> Running build hook: [block]
  -> Running build hook: [filesystems]
  -> Running build hook: [keyboard]
  -> Running build hook: [fsck]
==> Generating module dependencies
==> Creating gzip-compressed initcpio image: /boot/initramfs-linux.img
==> Image generation successful
==> Building image from preset: /etc/mkinitcpio.d/linux.preset: 'fallback'
  -> -k /boot/vmlinuz-linux -c /etc/mkinitcpio.conf -g /boot/initramfs-linux-fallback.img -S autodetect
==> Starting build: 4.13.9-1-ARCH
  -> Running build hook: [base]
  -> Running build hook: [udev]
  -> Running build hook: [modconf]
  -> Running build hook: [block]
==> WARNING: Possibly missing firmware for module: aic94xx
==> WARNING: Possibly missing firmware for module: wd719x
  -> Running build hook: [filesystems]
  -> Running build hook: [keyboard]
  -> Running build hook: [fsck]
==> Generating module dependencies
==> Creating gzip-compressed initcpio image: /boot/initramfs-linux-fallback.img
==> Image generation successful
(2/5) Updating udev hardware database...
(3/5) Updating system user accounts...
(4/5) Creating temporary files...
(5/5) Arming ConditionNeedsUpdate...
$ sudo reboot
```

쨘. 평소에는 여기까지만 하면 시스템 업그레이드도 끝이고, 마스토돈 인스턴스도 바로 사용할 수 있는 상태가 된다.

하지만 어째선지 그날만큼은 오류가 발생했다는 알림이 나를 반기고 있었다.

![마스토돈 오류 화면에 표시되는 이미지](https://github.com/tootsuite/mastodon/raw/v2.0.0/public/oops.gif)

일시적인 오류겠거니 하며 다시 리붓을 하고 몇 분 기다려도 봤지만 상황은 변하지 않았다. 그 순간 나는 직감했다.

> 이거 의존성 깨졌구나..

일단 사태의 심각성을 파악한 나는 서둘러 로그를 살폈다.

```terminal
# journalctl -u mastodon-web
```

```plaintext
-- Reboot --
Oct 31 03:49:09 uri systemd[1]: Started mastodon-web.
-- Subject: Unit mastodon-web.service has finished start-up
-- Defined-By: systemd
-- Support: https://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit mastodon-web.service has finished starting up.
-- 
-- The start-up result is RESULT.
Oct 31 03:49:11 uri bundle[232]: [232] Puma starting in cluster mode...
Oct 31 03:49:11 uri bundle[232]: [232] * Version 3.10.0 (ruby 2.4.2-p198), codename: Russell's Teapot
Oct 31 03:49:11 uri bundle[232]: [232] * Min threads: 5, max threads: 5
Oct 31 03:49:11 uri bundle[232]: [232] * Environment: production
Oct 31 03:49:11 uri bundle[232]: [232] * Process workers: 2
Oct 31 03:49:11 uri bundle[232]: [232] * Preloading application
Oct 31 03:49:14 uri bundle[232]: [232] ! Unable to load application: LoadError: Could not open library '/var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/../ext/cld3/libcld3.so': libprotobuf.so.13: cannot open shared object file: No such file or directory
Oct 31 03:49:14 uri bundle[232]: bundler: failed to load command: puma (/var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/bin/puma)
Oct 31 03:49:14 uri bundle[232]: LoadError: Could not open library '/var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/../ext/cld3/libcld3.so': libprotobuf.so.13: cannot open shared object file: No such file or directory
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/ffi-1.9.18/lib/ffi/library.rb:147:in `block in ffi_lib'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/ffi-1.9.18/lib/ffi/library.rb:100:in `map'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/ffi-1.9.18/lib/ffi/library.rb:100:in `ffi_lib'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/cld3.rb:117:in `<module:Unstable>'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/cld3.rb:114:in `<module:CLD3>'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/cld3.rb:24:in `<top (required)>'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/bootsnap-1.1.3/lib/bootsnap/load_path_cache/core_ext/kernel_require.rb:50:in `require'
Oct 31 03:49:14 uri bundle[232]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:82:in `block (2 levels) in require'
Oct 31 03:49:14 uri bundle[232]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:77:in `each'
Oct 31 03:49:14 uri bundle[232]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:77:in `block in require'
Oct 31 03:49:14 uri bundle[232]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:66:in `each'
Oct 31 03:49:14 uri bundle[232]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:66:in `require'
Oct 31 03:49:14 uri bundle[232]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler.rb:108:in `require'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/config/application.rb:7:in `<top (required)>'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/config/environment.rb:2:in `require_relative'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/config/environment.rb:2:in `<top (required)>'
Oct 31 03:49:14 uri bundle[232]:   config.ru:4:in `require'
Oct 31 03:49:14 uri bundle[232]:   config.ru:4:in `block in <main>'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:55:in `instance_eval'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:55:in `initialize'
Oct 31 03:49:14 uri bundle[232]:   config.ru:in `new'
Oct 31 03:49:14 uri bundle[232]:   config.ru:in `<main>'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:49:in `eval'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:49:in `new_from_string'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:40:in `parse_file'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/configuration.rb:314:in `load_rackup'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/configuration.rb:243:in `app'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/runner.rb:138:in `load_and_bind'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/cluster.rb:397:in `run'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/launcher.rb:183:in `run'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/cli.rb:77:in `run'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/bin/puma:10:in `<top (required)>'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/bin/puma:23:in `load'
Oct 31 03:49:14 uri bundle[232]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/bin/puma:23:in `<top (required)>'
Oct 31 03:49:14 uri systemd[1]: mastodon-web.service: Main process exited, code=exited, status=1/FAILURE
Oct 31 03:49:14 uri systemd[1]: mastodon-web.service: Failed with result 'exit-code'.
Oct 31 03:49:14 uri systemd[1]: mastodon-web.service: Service hold-off time over, scheduling restart.
Oct 31 03:49:14 uri systemd[1]: mastodon-web.service: Scheduled restart job, restart counter is at 1.
```

흠.. 요약하자면, *libprotobuf.so.13*이라는 파일이 없어서 이 난리가 난 거란 말이지..

## 문제의 해결 〜 오답편

> 그럼 저 파일이 있게 해주면 되겠네!

지금 생각해보면 진짜로 무슨 발상이었는지 모르겠는데, 아무튼 저 파일을 만들어주기로 했다.

```terminal
# cd /usr/lib
# ls -l libprotobuf.*
lrwxrwxrwx 1 root root      21 Oct 15 19:44 libprotobuf.so -> libprotobuf.so.14.0.0
lrwxrwxrwx 1 root root      21 Oct 15 19:44 libprotobuf.so.14 -> libprotobuf.so.14.0.0
-rwxr-xr-x 1 root root 2832504 Oct 15 19:44 libprotobuf.so.14.0.0
# ln -s libprotobuf.so libprotobuf.so.13
```

```text
Oct 31 04:12:52 uri systemd[1]: Started mastodon-web.
-- Subject: Unit mastodon-web.service has finished start-up
-- Defined-By: systemd
-- Support: https://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit mastodon-web.service has finished starting up.
-- 
-- The start-up result is RESULT.
Oct 31 04:12:53 uri bundle[741]: [741] Puma starting in cluster mode...
Oct 31 04:12:53 uri bundle[741]: [741] * Version 3.10.0 (ruby 2.4.2-p198), codename: Russell's Teapot
Oct 31 04:12:53 uri bundle[741]: [741] * Min threads: 5, max threads: 5
Oct 31 04:12:53 uri bundle[741]: [741] * Environment: production
Oct 31 04:12:53 uri bundle[741]: [741] * Process workers: 2
Oct 31 04:12:53 uri bundle[741]: [741] * Preloading application
Oct 31 04:12:54 uri bundle[741]: [741] ! Unable to load application: LoadError: Could not open library '/var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/../ext/cld3/libcld3.so': /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/../ext/cld3/libcld3.so: undefined symbol: _ZN6google8protobuf2io22LazyStringOutputStreamD1Ev
Oct 31 04:12:54 uri bundle[741]: bundler: failed to load command: puma (/var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/bin/puma)
Oct 31 04:12:54 uri bundle[741]: LoadError: Could not open library '/var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/../ext/cld3/libcld3.so': /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/../ext/cld3/libcld3.so: undefined symbol: _ZN6google8protobuf2io22LazyStringOutputStreamD1Ev
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/ffi-1.9.18/lib/ffi/library.rb:147:in `block in ffi_lib'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/ffi-1.9.18/lib/ffi/library.rb:100:in `map'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/ffi-1.9.18/lib/ffi/library.rb:100:in `ffi_lib'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/cld3.rb:117:in `<module:Unstable>'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/cld3.rb:114:in `<module:CLD3>'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/lib/cld3.rb:24:in `<top (required)>'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/bootsnap-1.1.3/lib/bootsnap/load_path_cache/core_ext/kernel_require.rb:50:in `require'
Oct 31 04:12:54 uri bundle[741]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:82:in `block (2 levels) in require'
Oct 31 04:12:54 uri bundle[741]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:77:in `each'
Oct 31 04:12:54 uri bundle[741]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:77:in `block in require'
Oct 31 04:12:54 uri bundle[741]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:66:in `each'
Oct 31 04:12:54 uri bundle[741]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:66:in `require'
Oct 31 04:12:54 uri bundle[741]:   /usr/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler.rb:108:in `require'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/config/application.rb:7:in `<top (required)>'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/config/environment.rb:2:in `require_relative'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/config/environment.rb:2:in `<top (required)>'
Oct 31 04:12:54 uri bundle[741]:   config.ru:4:in `require'
Oct 31 04:12:54 uri bundle[741]:   config.ru:4:in `block in <main>'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:55:in `instance_eval'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:55:in `initialize'
Oct 31 04:12:54 uri bundle[741]:   config.ru:in `new'
Oct 31 04:12:54 uri bundle[741]:   config.ru:in `<main>'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:49:in `eval'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:49:in `new_from_string'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/rack-2.0.3/lib/rack/builder.rb:40:in `parse_file'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/configuration.rb:314:in `load_rackup'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/configuration.rb:243:in `app'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/runner.rb:138:in `load_and_bind'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/cluster.rb:397:in `run'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/launcher.rb:183:in `run'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/lib/puma/cli.rb:77:in `run'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/puma-3.10.0/bin/puma:10:in `<top (required)>'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/bin/puma:23:in `load'
Oct 31 04:12:54 uri bundle[741]:   /var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/bin/puma:23:in `<top (required)>'
Oct 31 04:12:54 uri systemd[1]: mastodon-web.service: Main process exited, code=exited, status=1/FAILURE
Oct 31 04:12:54 uri systemd[1]: mastodon-web.service: Failed with result 'exit-code'.
Oct 31 04:12:55 uri systemd[1]: mastodon-web.service: Service hold-off time over, scheduling restart.
Oct 31 04:12:55 uri systemd[1]: mastodon-web.service: Scheduled restart job, restart counter is at 90.
```

까고자빠졌넴마-! 진짜로 그게 먹힐 거라고 생각했냐!!

..아무튼 안된다는 걸 확인했기 때문에, *protobuf*를 이전 버전으로 되돌리기로 했다. 업데이트 로그에 따르면 *protobuf*는 버전 *3.3.2-1*에서 *3.4.1-1*로 올라간 모양이니, 다시 *3.3.2-1* 버전을 설치하면 되는 것이다.

```terminal
# PACKAGE='protobuf'  # 각자 상황에 맞는 패키지로 바꿔주자.
# VERSION='3.3.2-1'  # 각자 상황에 맞는 버전으로 바꿔주자.
# pacman -U /var/cache/pacman/pkg/$PACKAGE-$VERSION-x86-64.tar.xz
```

이렇게 하면 일단 해결은 된다. 다만 다음번 업데이트 때 *protobuf*를 업데이트하지 않도록 주의해야 할 것이다. 아니면 다른 패키지가 말썽을 일으키든가..

## 문제의 해결 〜 정답편

자, 일단은 로그를 한 번 다시 살펴보자. */var/lib/mastodon/live/vendor/bundle/ruby/2.4.0/gems/cld3-3.2.0/ext/cld3/libcld3.so*에서 *libprotobuf.so.13*을 참조하려 했지만 참조될 파일이 존재하지 않아서 난 오류다. 여기서 약간 혼란스러운 부분이 있는데, [새 Mastodon 인스턴스 설치하기] 포스트에 따르면 우리는 분명 루비 젬을 시스템 와이드하게 설치하도록 구성했다. 이게 Bundler의 사양인지 아니면 뭐가 따로 있는 건지 난 잘 모르겠는데, 아무튼 중요한 건 마스토돈에서 필요로 하는 젬이 모두 */var/lib/mastodon/live/vendor/bundle* 아래에 설치되어 있을 것이라는 점이다.

로그를 읽고, 문제는 낡은 라이브러리를 사용해서 빌드된 젬에 있다는 사실을 알 수 있었다. 나는 모든 젬을 지우고 다시 설치하기로 했다.

일단 모든 마스토돈 서비스를 종료하고, *mastodon* 명의로 셸을 열자.

```terminal
# systemctl stop 'mastodon-*'
# sudo -u mastodon /bin/bash
```

젬을 지우자.

```terminal
$ cd ~/live/vendor
$ rm -r bundle
```

젬을 설치하자.

```terminal
$ cd ~/live
$ bundle install --deployment --without development test
```

서비스를 다시 시작하기 귀찮으니까 리붓하자.

```terminal
$ exit
# reboot
```

이제 *libcld3.so*는 현재 설치된 버전의 *libprotobuf.so*를 참조할 것이다. 진짜로 문제 해결!

그리고 미리 말해두지만 이 짓을 앞으로 `yaourt -Syu` 칠 때마다 해야 한다. 귀찮게..

## 주요 링크

* [새 Mastodon 인스턴스 설치하기]


[Mastodon]: https://joinmastodon.org
[새 Mastodon 인스턴스 설치하기]: {% post_url 2017-10-22-setup-new-mastodon-instance %}
