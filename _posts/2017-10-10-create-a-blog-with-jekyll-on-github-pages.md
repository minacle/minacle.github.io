---
layout: post
date: 2017-10-10 14:30:26 +0900
title: GitHub Pages에 Jekyll로 블로그 만들기
slug: create-a-blog-with-jekyll-on-github-pages
categories:
tags:
  - GitHub Pages
  - Jekyll
post_license: by-nc-sa
code_license: Unlicense
---

> 이 문제는 전에 그 방법대로 하니까 해결됐는데, 그 방법이 도대체 어디 있더라..

이런 일상에 지쳤기 때문에, 뭐든지 문제를 해결하고 나면 그것을 정리하는 블로그를 만들기로 했다.

## 어떤 서비스를 이용할까?

나는 예전부터 블로그를 열었다 하면 서비스가 마음에 안 들어서, 커스텀할 수 있는 부분에 한계가 있어서, 기반 엔진이 마음에 안 들어서 등의 이유로 블로그를 자주 이전하곤 했다. 이번만큼은 그렇게 하지 않으리라 다짐하며 어떤 내용을 담을지, 어떤 서비스가 적합할지 약간 생각을 해봤고, 어렵지 않게 답을 낼 수 있었다.

[GitHub Pages]는 [Jekyll]을 이용하여 정적 사이트를 호스트할 수 있다. *유저명.github.io*라는 이름으로 레포지토리를 생성하고 *master* 브랜치에 바로 사이트를 구성해도 되고, 다른 이름의 레포지토리를 생성한 뒤에 *gh-pages* 브랜치를 생성하여 그곳에 사이트를 구성해도 된다. 나는 전자의 방법대로 진행하기로 하였다.

## Jekyll은 어떻게 쓰지?

나는 [Ruby]를 사용하지 않는다. 그렇기 때문에 Ruby를 포함하여 초기 실행에 관련된 모든 라이브러리를 설치해야만 했다. macOS에는 Ruby가 내장되어 있지만 내장된 Ruby에 새로운 라이브러리를 설치하려면 `sudo`를 써야만 하는 것이 마음에 들지 않기 때문에.

일단은 Ruby와 Jekyll을 설치했다.

```terminal
$ brew install ruby
$ gem install jekyll
```

그리고는 새 Jekyll 사이트를 생성하고 디렉토리를 [Visual Studio Code]로 열어서 생성된 파일을 살폈다.

```terminal
$ jekyll new minacle.github.io
$ cd minacle.github.io
$ code .
```

*_layouts* 디렉토리는 보이지 않았다. 분명 예전에는 저기서 레이아웃을 만질 수 있었던 것 같은데? 의아한 마음으로 직접 사이트를 보기로 했다.

```terminal
$ jekyll serve
/usr/local/Cellar/ruby/2.4.2/lib/ruby/2.4.0/rubygems/core_ext/kernel_require.rb:55:in `require': cannot load such file -- bundler (LoadError)
	from /usr/local/Cellar/ruby/2.4.2/lib/ruby/2.4.0/rubygems/core_ext/kernel_require.rb:55:in `require'
	from /usr/local/lib/ruby/gems/2.4.0/gems/jekyll-3.6.0/lib/jekyll/plugin_manager.rb:48:in `require_from_bundler'
	from /usr/local/lib/ruby/gems/2.4.0/gems/jekyll-3.6.0/exe/jekyll:11:in `<top (required)>'
	from /usr/local/bin/jekyll:23:in `load'
	from /usr/local/bin/jekyll:23:in `<main>'
```

와, 뭐지? 잘 보니까 *bundler*가 없다고 한다.

```terminal
$ gem install bundler
$ jekyll serve
/usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:396:in `block in verify_gemfile_dependencies_are_found!': Could not find gem 'minima (~> 2.0)' in any of the gem sources listed in your Gemfile. (Bundler::GemNotFound)
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:366:in `each'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:366:in `verify_gemfile_dependencies_are_found!'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:212:in `start'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:191:in `resolve'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:235:in `resolve'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:159:in `specs'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:218:in `specs_for'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:207:in `requested_specs'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:109:in `block in definition_method'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:21:in `setup'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler.rb:101:in `setup'
	from /usr/local/lib/ruby/gems/2.4.0/gems/jekyll-3.6.0/lib/jekyll/plugin_manager.rb:50:in `require_from_bundler'
	from /usr/local/lib/ruby/gems/2.4.0/gems/jekyll-3.6.0/exe/jekyll:11:in `<top (required)>'
	from /usr/local/bin/jekyll:23:in `load'
	from /usr/local/bin/jekyll:23:in `<main>'
```

그래.. 이번엔 *minima*가 없다고 한다.

```terminal
$ gem install minima
$ jekyll serve
/usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:396:in `block in verify_gemfile_dependencies_are_found!': Could not find gem 'jekyll-feed (~> 0.6)' in any of the gem sources listed in your Gemfile. (Bundler::GemNotFound)
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:366:in `each'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:366:in `verify_gemfile_dependencies_are_found!'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:212:in `start'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/resolver.rb:191:in `resolve'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:235:in `resolve'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:159:in `specs'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:218:in `specs_for'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/definition.rb:207:in `requested_specs'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:109:in `block in definition_method'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler/runtime.rb:21:in `setup'
	from /usr/local/lib/ruby/gems/2.4.0/gems/bundler-1.15.4/lib/bundler.rb:101:in `setup'
	from /usr/local/lib/ruby/gems/2.4.0/gems/jekyll-3.6.0/lib/jekyll/plugin_manager.rb:50:in `require_from_bundler'
	from /usr/local/lib/ruby/gems/2.4.0/gems/jekyll-3.6.0/exe/jekyll:11:in `<top (required)>'
	from /usr/local/bin/jekyll:23:in `load'
	from /usr/local/bin/jekyll:23:in `<main>'
```

와, 제발 부탁이니까 한꺼번에 말해줘. 이젠 *jekyll-feed*가 없다고 한다..

```terminal
$ gem install jekyll-feed
$ jekyll serve
```

좋아.. 이번엔 제대로 된 모양이다. 서버 주소는 *http://127.0.0.1:4000/*이라고 하니 바로 들어가봤다. 사이트는 기본값으로 보이는 레이아웃이 적용되어 표시되고 있었다. 하지만 *_layouts* 디렉토리도 *_includes* 디렉토리도 없는데? 어떻게?

이렇게 혼란스러웠던 것은 바로 내가 낡은 문서를 보고 있기 때문이었다. 나는 [Jekyll의 번역 문서](http://jekyllrb-ko.github.io)를 보고 있었고, 이 번역 문서에서 설명하는 Jekyll의 버전은 내가 사용하는 Jekyll 버전과는 맞지 않았던 것이다. 나는 번역 문서를 내던지고 [공식 문서](https://jekyllrb.com)를 찾아 읽었고, 이에 따르면 다음과 같은 변경점이 있었던 모양이다.

- Jekyll은 이제 *Gemfile*을 사용할 수 있으며, 따라서 Jekyll과 함께 [Bundler](http://bundler.io)를 설치해야 한다.
- 새 Jekyll 사이트는 [Minima](https://github.com/jekyll/minima)라는 Gem 기반 테마를 사용한다. 원래대로라면 새 Jekyll 사이트를 생성할 때 필요한 라이브러리가 자동으로 설치되는데, 나는 Bundler가 없었기 때문에 이 과정이 생략되고 만 것이다.

그러니까 요약하자면.. *Gemfile*을 지우고 *_layouts* 디렉토리를 만들어서 내가 원하는 레이아웃을 써넣으면 된다는 거지?

### 레이아웃 만들기

예전에 언젠가 Jekyll 레이아웃을 직접 만든 적이 있는데 솔직히 이제와서 기억따윈 나지 않으므로 열심히 구글링. Jekyll은 템플릿 엔진으로 [Liquid]를 사용하며, 대략적인 사용법은 [Jinja2](http://jinja.pocoo.org)와 비슷한 모양이다. 변수와 필터에 대해서는 어떻게 검색해도 결국 [CloudCannon Academy]라는 사이트로 귀결되었고, 특히나 이 사이트에서 제공하는 [커닝 페이퍼](https://learn.cloudcannon.com/jekyll-cheat-sheet/)가 아주아주 유용했다!

마음 같아서는 카테고리 페이지랑 태그 페이지도 만들고 싶었는데, 아무래도 별도 플러그인을 사용하지 않고서는 카테고리마다 직접 파일을 만들어줘야 하는 비효율적인 작업을 해야만 하는 모양이기 때문에 일단은 미뤄두기로.

### 포스트 쓰기

포스트는 적당히 [Github풍 마크다운]으로 기본적인 기능들만 사용해서 작성하기로 했다.

포스트 맨 위에는 [Front Matter]를 써야 한다. 여기에는 포스트를 표시할 레이아웃의 종류, 포스트를 작성한 날짜, 제목, [슬러그](https://en.wikipedia.org/wiki/Semantic_URL#Slug), 카테고리, 태그 등을 써넣을 수 있는데, 나는 특히 날짜와 슬러그를 손으로 직접 써넣어야 한다는 사실이 아무리 생각해도 납득이 되지 않았다. 그래서 파이썬으로 새 포스트를 만들어주는 이런 간단한 스크립트를 만들어보았다.

```py
#!/usr/bin/env python3
from slugify import slugify
import sys
import time

layout = "post"

now = time.localtime()

if len(sys.argv) > 1:
    title = " ".join(sys.argv[1:])
else:
    title = "Title"

slug = slugify(title)

filename = "%s-%s.md" % (time.strftime("%Y-%m-%d", now), slug)

with open("_posts/%s" % filename, "w", encoding="utf-8") as f:
    f.write("---\n")
    f.write("layout: %s\n" % layout)
    f.write("date: %s\n" % time.strftime("%Y-%m-%d %H:%M:%S %z", now))
    f.write("title: %s\n" % title)
    f.write("slug: %s\n" % slug)
    f.write("categories: \n")
    f.write("tags: \n")
    f.write("---\n")
```

이 스크립트가 사이트 디렉토리 아래에 있으면 어떻게든 실제 사이트에서 접근할 수 있게 된다. 원하는 파일은 *_site* 디렉토리로 복제되지 않도록 구성할 필요가 있다.

### 사이트 구성하기

*_config.yml* 파일을 열고 구성할 것들을 생각해봤다. 일단은 포스트 고유 주소 포맷부터. 각 포스트의 주소가 */post/title1/*, */post/title2/* 와 같은 모양이 되었으면 좋겠다.

```yaml
permalink: /post/:slug/
```

다음은 마크다운 컨버터. GitHub Pages는 언제부턴가 [kramdown]만을 쓸 수 있도록 강제하고 있다. 뭐.. 좋아.

```yaml
markdown: kramdown
```

kramdown에도 약간 설정을 가하도록 하자. 나는 [GitHub풍 마크다운]에서 지원하는 것과 똑같은 구문 강조 문법을 사용하고 싶다.

```yaml
kramdown:
  input: GFM
  syntax_highlighter: rouge
```

마지막으로, 모든 파이썬 스크립트는 *_site* 디렉토리로 복사되지 않으면 좋겠다.

```yaml
exclude:
  - "*.py"
```

모든 구성을 마쳤다. 이제 남은 일은 ~~나중으로 미룬 카테고리, 태그 페이지 만들기와~~ 이 포스트를 저장하고 리모트 레포지토리에 푸시하는 일 뿐이다.

## 이제 커밋하고 푸시하면 블로그가 생긴다!

먼저 사이트 디렉토리를 [Git] 레포지토리로 만들자.

```terminal
$ git init
```

아까 GitHub에 만든 레포지토리가 있을 것이다. [뭐, 없다고?](https://github.com/new) 내 레포지토리 페이지 주소는 *https://github.com/minacle/minacle.github.io*다. 각자의 주소를 origin 리모트로 추가하자.

```terminal
$ URL='https://github.com/minacle/minacle.github.io'  # 각자의 것으로 수정해주자
$ git remote add origin "$URL"
```

다 됐다. 커밋하고 푸시하자.

```terminal
$ git add .
$ git commit
$ git push -u origin master
```

## 주요 링크

- [Github Pages]
- [Jekyll]
- [Liquid]
- [CloudCannon Academy]
- [Github풍 마크다운]
- [Front Matter]
- [kramdown]


[Github Pages]: https://pages.github.com
[Jekyll]: https://jekyllrb.com
[Ruby]: https://www.ruby-lang.org/ko/
[Visual Studio Code]: https://code.visualstudio.com
[Liquid]: https://shopify.github.io/liquid/
[CloudCannon Academy]: https://learn.cloudcannon.com
[GitHub풍 마크다운]: https://github.github.com/gfm/
[Front Matter]: https://jekyllrb.com/docs/frontmatter/
[kramdown]: https://kramdown.gettalong.org
[Git]: https://git-scm.com
