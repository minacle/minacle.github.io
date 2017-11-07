---
layout: post
date: 2017-10-22 09:28:11 +0900
title: 새 Mastodon 인스턴스 설치하기
slug: setup-new-mastodon-instance
categories:
  - Mastodon
tags:
post_license: by-nc-sa
code_license: Unlicense
---

> 여러분이 직접 호스트하는, 세계적으로 상호 연결된 마이크로 블로깅 커뮤니티  
> —[tootsuite/mastodon](https://github.com/tootsuite/mastodon)

[Mastodon](https://joinmastodon.org)은 간단히 말해서 분산형 [Twitter](https://twitter.com)라고 할 수 있다. 예전부터 인스턴스를 하나 만들어야지 생각은 하고 있었는데, 한참이나 지난 바로 어제가 돼서야 만들 수 있었다. 마스토돈 인스턴스는 [Docker](https://www.docker.com)를 이용해서 큰 힘 들이지 않고 바로 구성할 수도 있는 모양이지만, 기왕 만드는 거 매뉴얼대로 차근차근 따라해보기로 했다.

## 어떤 서비스를 이용할까?

마스토돈 인스턴스를 처음부터 구성하려면 서버가 있어야 한다. [Microsoft Azure](https://azure.microsoft.com)를 쓸 수도 있고 [AWS(Amazon Web Services)](https://aws.amazon.com)를 쓸 수도 있겠지만, 나는 비교적 저렴한 [ConoHa]를 이용하기로 했다.

서버 추가 탭에서 타입은 VPS로, 리전은 토쿄, 메모리는 512MB로 지정하고, OS는 내 취향에 따라 [Arch Linux]로 지정했다. 나머지 옵션은 재량껏 지정해주고, 추가 디스크를 선택하지 않았다면 매월 630엔으로 VPS를 이용할 수 있게 된다.

서버가 준비되기까지는 시간이 꽤 걸리니 [Mastodon Production Guide](https://github.com/tootsuite/documentation/blob/master/Running-Mastodon/Production-guide.md)를 쭈욱 훑어보았다.

## 그러고보니 도메인도 필요한데?

나는 도메인 관련해서는 [GoDaddy]를 이용한다. 마음에 드는 도메인 이름을 검색하고, 결정했다면 구매를 하도록 하자. 나는 *uri.life*라는 도메인으로 결정했다. *우리.인생*이라고 읽는다.

도메인이 손에 들어왔다면 다시 ConoHa로 돌아가서 DNS 탭으로 간 뒤, 해당 도메인을 입력하고 저장하자. 그러면 해당 도메인에 대한 레코드 목록을 보거나 작성할 수 있게 되는데, 기본적으로 몇 개의 NS 레코드가 지정되어 있을 것이다. GoDaddy로 가서 해당 도메인의 DNS 관리 페이지로 이동한 뒤, 네임서버에 ConoHa가 기본적으로 제공한 NS 레코드의 값을 그대로 베껴쓰자. 내 경우에는 아래 세 종류였다.

    ns-a1.conoha.io
    ns-a2.conoha.io
    ns-a3.conoha.io

여기까지 하면 서버가 완전히 준비되었을 것이다. ConoHa의 서버 탭에서 아까 생성한 VPS의 네임 태그를 누르면 해당 서버에 대한 정보가 표시된다. IPv4의 IP 주소와 IPv6의 IP 주소를 복사해두고, DNS 탭의 아까 생성한 도메인을 눌러 레코드를 보자. 이제 이 도메인이 어느 아이피로 연결되어야 하는지에 대한 정보를 넣어줘야 한다. 편집 모드로 가서 추가 버튼을 누르고, 타입은 *A(통상)*로, 이름은 *@*으로, TTL은 *3600*으로, 값은 아까 복사해둔 IPv4의 IP를 넣어주자. 이어서 다시 추가 버튼을 누르고, 타입은 *AAAA*로, 이름은 *@*으로, TTL은 3600으로, 값은 아까 복사해둔 IPv6의 IP를 넣어주자. 여기까지 했으면 일단 저장. 적용까지는 어느정도 시간이 걸리겠지만 내 경우에는 즉시 사용할 수 있었다.

모든 준비가 끝났다. 이제 본론으로 들어가자.

## 마스토돈은 어떻게 설치하지?

아까 한 번 읽어본 가이드는 [Ubuntu Server 16.04 LTS](https://www.ubuntu.com/server)를 기준으로 작성되어 있었다. 아차, 나는 이미 아치로 구성했는데.. 하지만 걱정은 없다. 나는 지금까지 아치를 써오던 사람이 아닌가. ~~이 글을 읽는 당신이 그렇지 않다면 정말 미안하다.~~

서버가 준비되었으면 SSH로 접속하여 모든 패키지 업데이트부터 하자. 이 포스트 작성 당시 ConoHa는 2017년 7월 10일자 이미지를 제공하고 있기 때문에 거의 모든 패키지가 최신이 아닌 상태다.

```terminal
# pacman -Syu
```

본격적으로 마스토돈을 설치해보자.

일단 의존 패키지를 설치해줘야 한다. 가이드에서 밝히는 바로는 아래 패키지에 의존을 갖는다고 한다.

- *imagemagick* - 마스토돈은 이미지에 관련된 작업을 할 때 imagemagick을 사용한다.
- *ffmpeg* - 마스토돈은 GIF를 mp4로 변환할 때 ffmpeg를 사용한다.
- *libprotobuf-dev*와 *protobuf-compiler* - 마스토돈은 얘네들을 언어 감지에 사용한다.
- *nginx* - nginx는 우리 프론트엔드 웹 서버다.
- *redis-\** - 마스토돈은 redis를 메모리 상의 데이터 구조 저장에 사용한다.
- *postgresql-\** - 마스토돈은 PostgreSQL을 SQL 데이터베이스로 사용한다.
- *nodejs* - Node는 마스토돈 스트리밍 API에 사용한다.
- *yarn* - Yarn은 Node.js의 패키지 매니저다.
- 그 외 개발 패키지 - 얘네들은 ruby-build를 이용해 Ruby를 빌드할 때 사용한다.

저것들은 모두 우분투에서의 패키지명인 모양이다. 일부 패키지는 아치에서 다른 이름으로 존재하고 있었다. 그건 그렇고.. 루비를 왜 빌드해야 하지? 난 미리 컴파일된 루비를 쓸 것이야. 그럼 패키지를 설치해보자.

```terminal
# pacman -S imagemagick ffmpeg protobuf nginx redis postgresql nodejs yarn ruby
```

루비 젬은 기본적으로 유저마다 분리되어 설치된다. 왜 그래야 하지? */etc/gemrc*를 열어 내용을 수정해주자.

```patch
@@ -6,1 +6,1 @@
-gem: --user-install
+gem: --no-user-install
```

마스토돈을 어떤 디렉토리에 풀지도 약간 고민되는 주제였는데, 가이드에서는 */home/mastodon*을 사용하고 있었다.. 아니야 안돼.. 마스토돈은 서비스지 사용자가 아니야..

그렇다. 마스토돈은 서비스다. 서비스의 대부분의 정보는 일반적으로 */var/lib* 아래에 있다.[^1]

```terminal
# mkdir /var/lib/mastodon
# cd /var/lib/mastodon
```

마스토돈을 풀어보자. 가이드에 따르면 Git 레포지토리를 그대로 클론하라는 모양이다. 그리고 테스트 서버를 대비하게 하기 위함인지 *live*라는 디렉토리에 풀고 있다.

```terminal
# git clone https://github.com/tootsuite/mastodon live
# cd live
```

물론 클론된 레포지토리는 *master* 브랜치를 가리키고 있다. 가이드에서는 아래 방법으로 최신 스태블 브랜치를 체크아웃할 수 있다고 한다.

```terminal
# git checkout $(git tag -l | grep -v 'rc[0-9]*$' | sort -V | tail -n 1)
```

이제 루비 패키지와 node.js 패키지를 설치할 차례다.

```terminal
# gem install bundler
# bundle install --deployment --without development test
# yarn install --pure-lockfile
```

다음은 마스토돈이 사용할 PostgreSQL 유저를 만들어줄 차례다. 유저를 만들 때는 패스워드를 지정하지 말자.

```terminal
# sudo -u postgres psql
```

```
CREATE USER mastodon CREATEDB;
\q
```

### nginx 구성하기

다 했으면.. 아 맞다, nginx는 기본적으로 *sites-available*과 *sites-enabled*를 제공하지 않는다. 먼저 이것부터 해결하도록 하자. 선호하는 편집기로 */etc/nginx/nginx.conf*의 내용을 전부 지우고 다음과 같이 입력하고 저장하자.

```nginx
worker_processes auto;
worker_cpu_affinity auto;

events {
    worker_connections 2048;
}

http {
    include mime.types;
    default_type application/octet-stream;
    sendfile on;
    tcp_nopush on;
    aio threads;
    server_tokens off;
    charset utf-8;
    index index.html index.htm;
    include sites-enabled/*;
}
```

우리에게 친숙한 그 디렉토리를 만들자.

```terminal
# mkdir /etc/nginx/sites-available
# mkdir /etc/nginx/sites-enabled
```

이제 언제나 쓰던 그 방법으로 사이트를 만들고 활성화할 수 있게 되었다. 마스토돈 인스턴스를 인터넷을 통해 접근할 수 있도록 서버를 구성해주자.

서버 구성 파일의 이름은 딱히 정해진 규칙은 없지만 나는 *도메인명.conf*로 통일하고 있다. 이렇게 하면 수정을 해야 할 때 어떤 사이트인지 알아보기 편하다는 장점이 있다.

```terminal
# DOMAIN='example.com'  # 각자의 도메인명으로 바꿔주자.
# cd /etc/nginx/sites-available
# touch "$DOMAIN.conf"
```

선호하는 편집기로 구성 파일을 열고 아래와 같은 내용으로 저장해주자.

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;
    location /.well-known/acme-challenge/ { allow all; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $DOMAIN;

#   ssl_protocols TLSv1.2;
#   ssl_ciphers HIGH:!MEDIUM:!LOW:!aNULL:!NULL:!SHA;
#   ssl_prefer_server_ciphers on;
#   ssl_session_cache shared:SSL:10m;

#   ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
#   ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    keepalive_timeout 70;
    sendfile on;
    client_max_body_size 0;

    root /var/lib/mastodon/live/public;

    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    add_header Strict-Transport-Security "max-age=31536000";

    location / {
        try_files $uri @proxy;
    }

    location ~ ^/(emoji|packs|system/accounts/avatars|system/media_attachments/files) {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri @proxy;
    }
    
    location /sw.js {
        add_header Cache-Control "public, max-age=0";
        try_files $uri @proxy;
    }

    location @proxy {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Proxy "";
        proxy_pass_header Server;

        proxy_pass http://127.0.0.1:3000;
        proxy_buffering off;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        tcp_nodelay on;
    }

    location /api/v1/streaming {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header Proxy "";

        proxy_pass http://127.0.0.1:4000;
        proxy_buffering off;
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        tcp_nodelay on;
    }

    error_page 500 501 502 503 504 /500.html;
}
```

아까 입력했던 호스트명을 서버 구성 파일에 적용하자.

```terminal
# sed -i "s/\\\$DOMAIN/$DOMAIN/g" "$DOMAIN.conf"
```

잘 된 것 같으면 사이트를 활성화하고,

```terminal
# cd ../sites-enabled
# ln -s ../sites-available/example.com.conf
```

[Let's Encrypt]에서 TLS 인증서를 발급받자.

```terminal
# pacman -S certbot-nginx
# certbot --nginx certonly
```

이 인증서는 기간이 90일로, 만료되기 전에 자동적으로 갱신되게 해야 하지만, 당장은 귀찮은 관계로 그런 짓은 따로 해두지 않았다. 이 글을 쓴 시점으로 88일 후에도 인증서 갱신하기 귀찮으면 나가 죽어야지 뭐..

이제 인증서가 있으니 서버 구성 파일에서 SSL 관련 주석을 풀어주자.

```terminal
# sed -i 's/^#/ /g' "$DOMAIN.conf"
```

### 마스토돈 애플리케이션 구성하기

마스토돈에 DB와 메일 계정 등을 연결하기 위해 구성을 약간 해줘야 한다. 다행히도 샘플이 있으니 이걸로 시작을 해보자.

```terminal
# cd /var/lib/mastodon/live
# cp .env.production.sample .env.production
```

*.env.production* 파일을 열고 차근차근 수정을 해보자.

```patch
@@ -4,2 +4,2 @@
-REDIS_HOST=redis
+REDIS_HOST=127.0.0.1
 REDIS_PORT=6379
@@ -7,5 +7,5 @@
-DB_HOST=db
-DB_USER=postgres
-DB_NAME=postgres
+DB_HOST=/var/run/postgresql
+DB_USER=mastodon
+DB_NAME=mastodon_production
 DB_PASS=
 DB_PORT=5432
@@ -131,1 +131,1 @@
-STREAMING_CLUSTER_NUM=1
+# STREAMING_CLUSTER_NUM=1
```

도메인도 수정해주자.

```terminal
# sed -i "s/example\\.com/$DOMAIN/g" .env.production
```

몇몇 부분은 암호화를 위해 난수를 요구하고 있는데, 특정 명령을 이용하여 얻어내야 한다고 안내하고 있다. 요구에 응해주도록 하자.

```terminal
# sed -i "s/^PAPERCLIP_SECRET=.*/PAPERCLIP_SECRET=$(RAILS_ENV=production bundle exec rake secret)/g" .env.production
# sed -i "s/^SECRET_KEY_BASE=.*/SECRET_KEY_BASE=$(RAILS_ENV=production bundle exec rake secret)/g" .env.production
# sed -i "s/^OTP_SECRET=.*/OTP_SECRET=$(RAILS_ENV=production bundle exec rake secret)/g" .env.production
# eval $(RAILS_ENV=production bundle exec rake mastodon:webpush:generate_vapid_key)
# sed -i "s/^VAPID_PRIVATE_KEY=.*/VAPID_PRIVATE_KEY=$VAPID_PRIVATE_KEY/g" .env.production
# sed -i "s/^VAPID_PUBLIC_KEY=.*/VAPID_PUBLIC_KEY=$VAPID_PUBLIC_KEY/g" .env.production
```

마스토돈은 이메일 인증, 패스워드 찾기 등의 기능을 위해 메일을 보낼 필요가 있다. 나는 메일도 외부 서비스를 이용했다. 가이드에서 소개하고 있듯이 [Mailgun]은 매월 1만 통의 메일을 무료로 보낼 수 있다.

#### Mailgun에 도메인 등록하기

Mailgun의 서비스를 이용하려면 메일을 발송할 도메인을 등록해야 하는데, 이 절차가 개인적으로 약간 혼돈의 도가니였기 때문에 따로 기술해두기로 했다.

도메인 탭에서 새 도메인 추가 버튼을 누르면 도메인이 인증되지 않은 상태로 등록된다. 등록할 때 서브도메인을 사용하지 않으면 자기네들은 서브도메인을 사용할 것을 강력히 권장한다고 하는데, 무시하고 진행이 가능하다. 내 경우에는 무엇이 문제였는지 모르겠지만 서브도메인을 사용하니 도메인 인증이 되지 않았다.

도메인을 인증하려면 해당 도메인 페이지에서 요구하는 레코드를 DNS에 추가할 필요가 있다. 일단 아까 열어두었던 ConoHa의 DNS 탭으로 가서 새로고침을 한 번 눌러주자. [뭐? 닫았다고?](https://manage.conoha.jp/DNS/)

해당 도메인에 Mailgun에서 요구하는 레코드를 추가해주자. 내 경우에는 아래와 같은 레코드를 추가해야 했다.

|타입|이름|TTL|값
|---|---|---|---
|MX|@|3600|mxa.mailgun.org (우선도: 10)
|MX|@|3600|mxb.mailgun.org (우선도: 10)
|TXT|@|3600|v=spf1 include:mailgun.org ~all
|TXT|krs._domainkey|3600|k=rsa; p=(...)
|CNAME|email|3600|mailgun.org

주의할 점이라면 ConoHa는 많은 레코드를 한꺼번에 저장할 수 없는 것 같다. 같은 일을 몇번이고 반복하고 싶지는 않으니 한 레코드씩 또박또박 저장하도록 하자.

전부 입력하고 저장한 뒤 Mailgun에서 지금 DNS 레코드 확인 버튼을 누르면.. 쨘! 이제 해당 도메인으로 메일을 보낼 수 있게 되었다.

해당 도메인 페이지 상단에 있는 도메인 정보 섹션에서 마스토돈 구성 파일에 적어줘야 하는 내용을 확인해보자. 포스트 작성 시점의 마스토돈 버전은 2.0.0이며, 요구로 하는 정보는 아래와 같다. *.env.production* 파일에서 대응하는 부분을 찾아 값을 변경해주자.

- SMTP Hostname → *SMTP_SERVER*
- Default SMTP Login → *SMTP_LOGIN*
- Default Password → *SMTP_PASSWORD*

### 마스토돈 초기화

구성이 끝났으면 데이터베이스를 초기화하자.

```terminal
# RAILS_ENV=production bundle exec rails db:setup
```

애셋도 프리컴파일해야 한다.

```terminal
# RAILS_ENV=production bundle exec rails assets:precompile
```

드디어 마스토돈이 완전히 준비되었다! 하지만 이대로 *root*로 실행해버리면 보안 위협이 있을 수 있으니 별도의 시스템 사용자로 분리시켜 두도록 하자.

```terminal
# useradd -d /var/lib/mastodon -rs /usr/bin/nologin mastodon
# chown -R mastodon:mastodon /var/lib/mastodon
```

### 마스토돈 서비스 생성

이제 직접 실행해도 상관은 없겠지만 기왕이면 서비스를 만들어서 자동으로 실행되게 하면 관리가 더욱 편해질 것이다. Arch는 서비스 매니저로 [systemd]를 사용하니, 가이드에서 제공하는 서비스를 커스텀하여 넣어보기로 하자.

먼저, 서비스가 있는 디렉토리로 이동하자. Arch에서는 시스템 서비스를 */usr/lib/systemd/system*에 보관한다.

```terminal
# cd /usr/lib/systemd/system
```

첫 번째는 마스토돈 웹 서비스. 선호하는 편집기로 *mastodon-web.service* 파일을 열고 아래 내용을 붙여넣은 다음 저장하자.

```ini
[Unit]
Description=mastodon-web
After=network.target

[Service]
Type=simple
User=mastodon
WorkingDirectory=/var/lib/mastodon/live
Environment="RAILS_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/bundle exec puma -C config/puma.rb
ExecReload=/bin/kill -SIGUSR1 $MAINPID
TimeoutSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

두 번째는 마스토돈 백그라운드 큐 서비스. 선호하는 편집기로 *mastodon-sidekiq.service* 파일을 열고 아래 내용을 붙여넣은 다음 저장하자.

```ini
[Unit]
Description=mastodon-sidekiq
After=network.target

[Service]
Type=simple
User=mastodon
WorkingDirectory=/var/lib/mastodon/live
Environment="RAILS_ENV=production"
Environment="DB_POOL=5"
ExecStart=/usr/bin/bundle exec sidekiq -c 5 -q default -q mailers -q pull -q push
TimeoutSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

세 번째는 마스토돈 스트리밍 API 서비스. 선호하는 편집기로 *mastodon-streaming.service* 파일을 열고 아래 내용을 붙여넣은 다음 저장하자.

```ini
[Unit]
Description=mastodon-streaming
After=network.target

[Service]
Type=simple
User=mastodon
WorkingDirectory=/var/lib/mastodon/live
Environment="NODE_ENV=production"
Environment="PORT=4000"
ExecStart=/usr/bin/npm run start
TimeoutSec=15
Restart=always

[Install]
WantedBy=multi-user.target
```

### 서비스 활성화하기

새로 생성한 마스토돈 서비스를 포함해서 nginx와 postgresql, redis 서비스를 활성화해야 한다.

```terminal
# systemctl enable mastodon-* nginx postgresql redis
```

## 이제 리붓하면 마스토돈 인스턴스가 생긴다!

서비스들을 직접 실행해줘도 상관 없지만 모처럼이니 리붓을 한 번 해주자.

```terminal
# reboot
```

끝!

## 그런데 이 마스토돈 인스턴스.. 관리는 어떻게 하지?

관리하기에 앞서 관리자 되는 사람의 계정이 있어야 한다. 계정 등록은 웹 인터페이스를 써도 좋고, 셸에서 커맨드를 입력해도 좋다.

계정이 있다면 다음과 같은 귀찮은 방법을 통해 사용자를 관리자로 승격시킬 수 있다.

```terminal
# USERNAME='admin'  # 각자의 계정명으로 바꿔주자.
# cd /var/lib/mastodon
# RAILS_ENV=production bundle exec rails mastodon:make_admin USERNAME=$USERNAME
```

이제 당신은 관리자다! 인스턴스를 마음껏 관리하되, 지배하는 일은 없도록 하자.

> 큰 힘에는 큰 책임이 따른다.  
> —Peter B. Parker

## 주요 링크

- [Mastodon]
- [ConoHa]
- [Arch Linux]
- [Mastodon Production Guide]
- [GoDaddy]
- [Mailgun]


[^1]: 정확히는 서비스가 영구적으로 보관해야 할 데이터가 있는 경우 이 디렉토리 아래에 저장된다.

[Mastodon]: https://joinmastodon.org
[Twitter]: https://twitter.com
[Docker]: https://www.docker.com
[ConoHa]: https://www.conoha.jp
[Arch Linux]: https://www.archlinux.org
[Mastodon Production Guide]: https://github.com/tootsuite/documentation/blob/master/Running-Mastodon/Production-guide.md
[GoDaddy]: https://godaddy.com
[Let's Encrypt]: https://letsencrypt.org
[Mailgun]: https://www.mailgun.com
[systemd]: https://www.freedesktop.org/wiki/Software/systemd/
