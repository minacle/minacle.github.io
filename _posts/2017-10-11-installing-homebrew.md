---
layout: post
date: 2017-10-11 01:10:23 +0900
title: Homebrew 설치하기
slug: installing-homebrew
categories: 
tags: 
---

[Homebrew]는 정말 매우 소중한 macOS용 패키지 매니저다. */usr/local* 디렉토리를 만드는 게 아니라면 어떠한 상황에도 `sudo`를 요구하지 않는다.

Homebrew를 설치할 때 */usr/local* 디렉토리가 없다면 사용자 소유로 하나 생성한다. 이 때 디렉토리의 모드는 *rwxr-xr-x*며, 다른 관리자 사용자로 `brew`를 사용하려면 `sudo`를 써야만 하는 상황에 직면하게 된다.

나는 이런 상황을 회피하고자 미리 손을 써두기로 했다.

```terminal
$ sudo mkdir /usr/local
$ sudo chown :admin /usr/local
$ sudo chmod g+w /usr/local
```

이제 */usr/local*의 소유자는 *root:admin*이고, 모드는 *rwxrwxr-x*다. 관리자 사용자는 모두 *admin* 그룹에 속하기 때문에 */usr/local* 디렉토리 안쪽에 자유롭게 파일을 쓸 수 있게 되었다.

그럼 Homebrew를 설치하자.

```terminal
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```


[Homebrew]: https://brew.sh
