---
layout: post
date: 2017-10-10 23:57:34 +0900
title: pyenv로 Python 설치하기
slug: installing-python-with-pyenv
categories:
    - Python
tags:
    - pyenv
---

디렉토리 별로 실행할 [Python]의 버전을 지정할 수 있는 [pyenv]는 매번 Python을 설치할 때마다 코드를 직접 컴파일한다. 그렇기 때문에 의존성 문제가 발생할 수 있는데, 특히나 macOS에서는 기본적으로 제공하지 않는 라이브러리가 있어 꽤 까다로운 편이다.

## 일단 pyenv를 설치하자.

pyenv를 포함해 이번에 설치할 것들은 모두 [Homebrew]로 설치할 수 있다.

```terminal
$ brew install pyenv
$ pyenv init
```

설치했으면 사용하는 셸의 *.\*rc*[^1]파일에 아래 코드를 추가하자.

```sh
eval "$(pyenv init -)"
```

## Python이 필요로 하는 라이브러리를 설치하자.

Python을 macOS에서 빌드할 때는 [zlib]과 [OpenSSL](https://www.openssl.org)을 필요로 한다는 요지의 오류가 발생한다. 구글링해보면 Xcode가 설치된 상태에서 Xcode에 포함된 헤더 파일에 플래그를 주고 빌드하면 된다고들 하는데, 나는 뭘 잘못했는지 순순히 빌드가 되어주지 않았다. 애초에 그렇게 쉽게 됐으면 내가 이런 글을 안 썼겠지.

zlib을 설치하자. zlib은 keg-only formula기 때문에 직접 링크해줘야 한다.

```terminal
$ brew install zlib
$ brew link -f zlib
```

다음은 OpenSSL인데, 나는 개인적으로 [LibreSSL]을 더 선호하는 편이다. macOS High Sierra부터도 기본적으로 OpenSSL 대신 LibreSSL이 포함되어 있다. LibreSSL은 keg-only formula고, 링크할 수 없다.

```terminal
$ brew install libressl
```

LibreSSL 포함돼있다면서 왜 또 설치하는 거냐? 실행파일만 포함돼있기 때문이다. 혹시 실행파일로도 빌드를 할 수 있을 것 같다면 천재 해커의 길을 걸어보도록 하자.

## Python을 설치하자!

설치하기에 앞서 설치할 수 있는 버전을 쭉 살펴보자.

```terminal
$ pyenv install -l
```

anaconda와 그 아래로는 솔직히 설치해본 적이 없으니 의존 라이브러리가 뭐가 더 필요할지 잘 모르겠다. 버전 번호만 써있는 것들 중에서 엄선하여 설치하도록 하자. 나는 *3.6.3*을 설치했다.

```terminal
$ export CFLAGS="-I$(brew --prefix libressl)/include"
$ export LDFLAGS="-L$(brew --prefix libressl)/lib"
$ pyenv install 3.6.3
```

실패한다면 [이 글](https://github.com/pyenv/pyenv/wiki/Common-build-problems)을 읽어보자.

## 주요 링크

- [Python]
- [pyenv]
- [Homebrew]


[^1]: *rc*는 *run commands*를 뜻한다.

[Python]: https://www.python.org
[pyenv]: https://github.com/pyenv/pyenv
[Homebrew]: https://brew.sh
[zlib]: https://zlib.net
[LibreSSL]: https://www.libressl.org
