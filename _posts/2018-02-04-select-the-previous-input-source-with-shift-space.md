---
layout: post
date: 2018-02-04 20:37:34 +0900
title: Shift+Space 조합으로 이전 입력 소스 선택하기
slug: select-the-previous-input-source-with-shift-space
categories: macOS
tags: 
post_license: by-nc-sa
code_license: Unlicense
---

> 한영키 shift+space 전환방법 고가삼...  
> —[미노리](https://blog.minori.moe)

어떤 사람은 Command+Space 키를 입력 소스 전환 키로, 또 어떤 사람은 Control+Space 조합을 입력 소스 전환 키로 사용하고 싶을 것이다. 오늘은 조금 특별한 사람이, 조금 특별한 주문을 해왔다.

미노리는 내 소중한 친구 중 한 명으로, 본래 리눅서지만 내 ~~강요 같은~~ 추천에 의해 노트북에 해킨토시를 설치하게 되었다. 뭐 어떤 노트북이길래 어떻게 해킨토시 설치에 성공했는가에 대한 글은 추후 [이름 없는 미노리의 블로그]에 정리될 예정이라고 하니, 관심이 간다면 한 번 들러보도록 하자!

## 문제편

그럼 어째서 이런 질문이 나와야만 했을까?

macOS는 시스템 환경설정 앱의 키보드 환경설정에서 여러 단축키를 변경할 수 있게 되어 있다. 다만 모든 키가 가능한 것은 아니고 허용하지 않는 조합이 일부 존재하는데, 이 조합에는 문자 키를 단독으로 사용하는 것 또한 포함된다. 그리고 시스템 환경 설정 앱은 Shift와 문자 키 조합을 단일 문자 키로 인식하는지, 이 조합 또한 허용되지 않는다. 그런데 이 규칙이 이상하게도 Space 키에도 적용되기 때문에, Shift+Space 조합은 일반적인 방법으로는 할당할 수 없다.

하지만 나는 당시 이 사실을 몰랐기에 시스템 환경설정 앱의 키보드 환경설정에서 바꿀 수 있다고 설명해줬지만, 미노리는 이미 일반적인 방법으로 시도해 본 뒤였던 모양이다.

> 거기에서 shift space가 안눌리더라...  
> —미노리

이 말을 듣고 나도 한 번 시도해봤지만, 그저 Funk 효과음만이 나를 반겨줄 뿐이었다. 하지만 그 순간 떠오른 묘수.

> 그러네 안되네  
> defaults 를 만지면 되지 않을까  
> —마유쨔마

당연하게도 내가 떠올린 것은 defaults였다. defaults는 Windows의 레지스트리 편집기처럼 모든 앱에 대한 잔설정을 편집하기 위한 프로그램…정도라고 나는 이해하고 있다. 뭐, 실제로도 그렇고.

일단, 원하는 설정이 어느 도메인에 있는지부터 찾아내야 한다.

```terminal
$ defaults read
```

이 명령은 모든 defaults 구성을 출력하는 명령이다. 나는 무작정 하염없이 넓고 광활한 출력의 스크롤을 올리며 무엇이든 내가 알아볼 수 있는 항목이 나오기만을 기다렸다. 스크롤을 조금 더 내리자 내 텍스트 대치 설정이 보이기 시작했고, 당연히 여기 어딘가에 관련 설정이 있으리라 생각했다. 하지만 거기 있는 거라곤 사용자 정의 앱 단축키 뿐이었고, 미리 이름과 역할이 정해진 단축키에 대해서는 찾을 수 없었다.

이번에는 방법을 바꿔서 새 단축키를 만들기 전에 한 번, 만든 후에 한 번 구성을 출력해서, 두 출력을 비교해봤다.

```terminal
$ defaults read >$TMPDIR/a
$ defaults read >$TMPDIR/b
$ diff -bru $TMPDIR/a $TMPDIR/b
```

빙고! 출력에는 분명히 추가된 줄이 있었다. 그런데 잠깐… 이 부분은 아까도 봤잖아. 그렇다. 나는 머리가 나쁘기 때문에 기왕 바꾸는 김에 *이전 입력 소스 선택* 단축키를 바꿔야 한다고 생각조차 하지 못한 것이다.

## 해결편

마음을 다잡고 *이전 입력 소스 선택* 단축키를 Control+Space에서 Control+Shift+Space로 변경해보았다. 바뀐 값은 어떤 사전 형식의 값에 포함된 *60*이라는 값으로 대표되는 키 아래에 있는 배열 중 세 번째 항목의 값이었다. 조금 더 살펴본 결과, 바뀐 값을 대표하는 도메인은 *com.apple.symbolichotkeys*였고, 값은 *262144*에서 *393216*으로 바뀌어 있었다.

![위에 있는 계산기는 262144라는 결과가 표시되어 있고, 열일곱번째 비트에는 푸른 0이, 열여덟번째 비트에는 붉은 1이 강조되어 있다. 아래에 있는 계산기는 393216이라는 결과가 표시되어 있고, 열일곱번째 비트에는 푸른 1이, 열여덟번째 비트에는 붉은 1이 강조되어 있다.]({{ site.baseurl }}{% link /img/2018-02-04-select-the-previous-input-source-with-shift-space/0.png %})

이전 값은 *262144*이고, 이후 값은 *393216*이다… 이 값은 당장은 의미하는 바가 없어보이지만, 계산기로 보면 특정한 비트 플래그가 활성화되었다고 추측할 수 있다. 위 이미지에 Control 키로 예상되는 비트를 붉게, Shift 키로 예상되는 비트를 푸르게 표시해뒀다. 이 예측이 사실이라면 붉게 표시된 비트를 0으로 바꾸어 값을 *131072*로 바꾸면 Shift만 활성화된 단축키가 완성되는 것이다!

자… 그럼 일단 설정을 추출하자. 도메인은 분명 *com.apple.symbolichotkeys*였다.

```terminal
$ defaults export com.apple.symbolichotkeys - >$TMPDIR/com.apple.symbolichotkeys.plist
```

해당 파일을 열고 키가 *60*인 항목을 찾아, 그 항목 아래에 있는 배열의 세 번째 항목을 *131072*로 교체하자.

```terminal
$ open -t $TMPDIR/com.apple.symbolichotkeys.plist
```

```patch
 		<key>60</key>
 		<dict>
 			<key>enabled</key>
 			<true/>
 			<key>value</key>
 			<dict>
 				<key>parameters</key>
 				<array>
 					<integer>32</integer>
 					<integer>49</integer>
-					<integer>262144</integer>
+					<integer>131072</integer>
 				</array>
 				<key>type</key>
 				<string>standard</string>
 			</dict>
 		</dict>
```

제대로 수정했으면 다시 설정을 주입해주자. 아까 했던 것과 반대로 하면 된다.

```terminal
$ defaults import com.apple.symbolichotkeys $TMPDIR/com.apple.symbolichotkeys.plist
```

아까도 말했지만 defaults는 레지스트리 편집기와 매우 비슷해서 웬만해선 리붓하기 전까지 변경 사항이 반영되지 않는다. 재시동해주자.

그러면…

![키보드 환경설정의 단축키 탭이 선택된 시스템 환경설정 앱. 입력 소스 그룹의 이전 입력 소스 선택 단축키가 시프트 스페이스로 지정되어 있다.]({{ site.baseurl }}{% link /img/2018-02-04-select-the-previous-input-source-with-shift-space/1.png %})

입력 소스 전환 키가 Shift+Space로 할당되었다! 실제로 단축키도 그렇게 작동한다! 작전 성공!

## 주요 링크

- [이름 없는 미노리의 블로그]


[이름 없는 미노리의 블로그]: https://blog.minori.moe
