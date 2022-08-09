<div align="center">

  # SNS(Social Network Service) 백엔드 구현
<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=Express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=Sequelize&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat&logo=Redis&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white"/>
</p>
<p> 
  <img src="https://img.shields.io/badge/REST API-009639?style=flat&logo=&logoColor=white"/>
  <img src="https://img.shields.io/badge/MVC-000000?style=flat&logo=&logoColor=white"/>
  <img src="https://img.shields.io/badge/jwt token-FF9900?style=flat&logo=&logoColor=white"/>
  <img src="https://img.shields.io/badge/express validator-2496ED?style=flat&logo=&logoColor=white"/>
  <img src="https://img.shields.io/badge/nodemailer-527FFF?style=flat&logo=&logoColor=white"/>
  <img src="https://img.shields.io/badge/winston logger-DC382D?style=flat&logo=&logoColor=white"/>
</p>
</div> 

<br/>

## 프로젝트

#### **📌 필수 기능**
- [X] 유저 이메일로 로그인&회원가입, jwt 토큰 발급
- [X] 게시글 CRUD (게시글 생성, 수정, 삭제&복원, 검색)

⇒ 위에 명시된 기능을 제외한 다른 기능은 개인적으로 추가 정의하여 구현한 기능이며, 혼자 진행한 프로젝트입니다.

#### **📌 개발기간**
`2022.07.20 ~ 2022.07.22(필수 기능 구현 기간) + α(추가 정의 구현 기간)`

#### **📌 유저**
- [X] express-validator를 통한 회원가입 입력값 검증
  - [X] 빈 값 확인
  - [X] 이메일ID 사용
  - [X] 비밀번호 3가지조합 8자리이상
  - [X] 이름 특수문자 입력 체크 - sql injection, xss 방어
- [X] jwt를 이용한 로그인 구현
- [X] 회원가입시 입력한 이메일로 메일을 보내 실제 본인 이메일이 맞는지 인증
- [X] 접속한 적 없는 ip, os, device, browser로 접속 시 확인 메일 보내 검증
- [X] 비밀번호 찾기 - 가입한 메일로 임시 비밀번호 생성해 발송
- [X] 유저 검색 기능 - userId으로 검색 -> 이메일, 이름, 팔로우&팔로워수, 게시글 수, 게시글 목록 
- [X] 팔로잉 동작 기능
- [X] 팔로우, 팔로워 목록 확인
- [X] 회원정보 조회
- [X] 회원정보 수정
- [X] 좋아요 누른 게시글 조회

#### **📌 게시글**
- [X] 제목, 내용, 해시태그(option, 여러 개)를 입력받아 게시글 작성
- [X] express-validator를 통한 게시글 입력값 검증
  - [X] 빈 값 확인
  - [X] 제목&내용 글자수 체크
  - [X] 모든 입력값 특수문자 입력 체크 - sql injection, xss 방어
- [X] 작성한 게시글 수정 
- [X] 작성한 게시글 삭제
- [X] 삭제한 게시글 복원
- [X] 게시글 상세보기 
- [X] 게시글 상세보기를 하면 조회수 증가 
- [X] 사용자가 게시글 조회한 정보를 기록해 조회수는 사용자 당 1회만 증가하도록 구현
- [X] 게시글에 좋아요 누르기
- [X] 게시글에 좋아요를 눌렀던 적이 있으면 좋아요 취소
- [X] 게시글 목록 및 검색
  - [X] 제목으로 검색 - 검색어 (띄어쓰기, 대소문자 구별 없이 검색되도록 구현)
  - [X] 작성일, 조회수, 좋아요 수로 정렬 (default: 작성일)
  - [X] 오름차순/내림차순으로 정렬할 것인지 선택 (default: desc)
  - [X] Filtering - 해당 해시태그를 가진 게시글만 보도록 
  - [X] Pagination - 페이지 당 몇 개의 게시글을 볼 것인지 선택 (default: 10개)
- [X] 게시글 댓글 달기
  - [X] 댓글 작성
  - [ ] 댓글 수정
  - [ ] 댓글 삭제
  - [ ] 댓글 좋아요/좋아요 취소
  - [ ] 게시글 댓글 목록

#### **📌 운영**
- [X] 서버가 운영 중 멈추는 일이 없도록 모든 기능에 대한 예외처리
- [X] winston을 통한 info, error 로그 남기기 
- [X] docker를 사용한 환경 구축

#### **📌 구현 예정** 
- [ ] 팔로잉한 사람의 읽지 않은 새로운 게시글 목록 구현
- [ ] DM 기능 구현 (1:1 채팅)
- [ ] error가 나면 슬랙에 알림이 울리도록 구현
- [ ] swagger

<br/>

## 데이터베이스 설계

#### **📌 Mysql (ERD)**
![sns_erd](https://user-images.githubusercontent.com/94504613/183548719-7f02b016-9849-4de8-bc5b-cff68a750744.png)
- `users` 유저 정보 저장 테이블
- `posts` 게시글 저장 테이블
- `hashtags` 해시태그 저장 테이블
- `postLogs` 게시글 본 기록 저장 테이블
- `postLikes` 게시글 좋아요 기록 저장 테이블
- `accessLogs` 유저 웹 접근 기록 저장 테이블
- `followLogs` 팔로우 기록 저장 테이블
- `comments` 게시글 댓글 저장 테이블
- `commentLikes` 게시글 좋아요 기록 저장 테이블

#### **📌 Redis**
**이메일 본인 인증**: 6자리 랜덤 인증 번호 저장 (expire: 180으로 3분간 저장)

```
key: { userId }
value: { 6자리 랜덤 인증 번호 }
```

**비밀번호 찾기 기능**: 임시 비밀번호 저장 (expire: 180으로 3분간 저장)

```
key: { userId }
value: { 임시 발급된 비밀번호(3가지 조합 8자리 이상) }
```

⇒ 두 기능이 같은 key를 사용하는데 이메일 본인 인증은 회원가입하는 경우 사용되고 비밀번호 찾기 기능은 보통 회원가입하고 한참 뒤 비밀번호를 잊어버렸을 경우 사용되기 때문에 두 기능이 3분 안에 값이 덮어씌워질 확률가 적다고 판단하여 같은 key를 사용하였다.  
⇒ 또한 회원가입이 완료되고 3분안에 바로 비밀번호 찾기를 하는 경우, 회원가입에 쓰인 **이메일 본인 인증 번호는 이미 인증을 완료하였기 때문에 더 이상 필요없어져 비밀번호 찾기를 할 때 임시 비밀번호로 값이 덮어씌워지더라고 문제가 없다** 판단하였다. 

<br/>

## REST API

#### **📌 이메일 본인 확인 메일 보내기**
**`POST` /user/joinEmailConfirm**
```
request {
  "userId": "hwjddussls@naver.com"
}
```
```
response {
  "message": "이메인 본인 확인 메일을 보냈습니다. 확인해주세요."
}
```

![이메일본인인증](https://user-images.githubusercontent.com/94504613/183245333-0970632c-7c09-4db9-a33d-a2591e9ba246.jpg)

#### **📌 랜덤 인증번호로 이메일 인증**
**`POST` /user/joinRandomNumberConfirm**   
 ✔︎ 아이디 이메일 형식 확인  
 ✔︎ 인증번호 6자리 숫자 확인  
```
request {
  "userId": "hwjddussls@naver.com",
  "randomNum": "564534"
}
```
- 받은 인증번호가 redis에 저장된 인증번호와 동일한 경우
```
response {
  "message": "인증번호가 확인되었습니다.",
  "EmailConfirm": 1
}
```
- 받은 인증번호가 redis에 저장된 인증번호와 다른 경우
```
response {
  "message": "인증번호가 올바르지 않습니다.",
  "EmailConfirm": 0
}
```
- 시간초과(180초)로 redis에 인증번호가 없는 경우
```
response {
  "message": "인증번호가 만료되었습니다.",
  "EmailConfirm": 0
}
```

#### **📌 회원가입**
**`POST` /user/join**  
  ✔︎ `userId` 이메일 형식 확인  
  ✔︎ `userPw` 3가지 조합 8자 이상 확인  
  ✔︎ `userName` 특수문자 제한 확인  
  ✔︎ `emailConfirm` 이메일 본인 인증을 했는지 여부 (0: 인증X, 1: 인증O)
```
request {
  "userId": "qwer1234@naver.com",
  "userPw": "Qwer1234!",
  "confirmPw": "Qwer1234!",
  "userName": "골골",
  "emailConfirm": 1
}
```
```
response {
  "message": "회원가입 되었습니다."
}
```

#### **📌 로그인**
**`POST` /user/login**
```
request {
  "userId": "qwer1234@naver.com",
  "userPw": "Qwer1234!"
}
```
```
response {
  "message": "로그인 되었습니다.",
  "token": token
}
```

![로그인정보](https://user-images.githubusercontent.com/94504613/183245338-156b0fdf-44c3-4c4d-9a9a-52ea30b857c6.jpg)

#### **📌 로그인 확인 메일에 대한 사용자 응답 처리**
사용자가 받은 메일에서 "본인이 맞습니까?"라는 물음에 `예` 또는 `아니오` 버튼을 누르면 서버로 오는 요청  
**`GET` /user/loginConfirm?answer=2&userId=qwer1234@naver.com&id=1**  
  ✔︎ 본인이 로그인한 것이 맞다고 응답한 경우  -> 해당 기록 인증 처리  
**`GET` /user/loginConfirm?answer=3&userId=qwer1234@naver.com&id=1**  
  ✔︎ 본인이 로그인한 것이 아니라고 응답한 경우 -> 접속 제한 처리

#### **📌 비밀번호 찾기**
**`GET` /user/findPw**
```
request {
  "userId": "qwer1234@naver.com"
}
```
- 없는 사용자인 경우
```
request {
  "message": "해당 이메일로 가입된 적이 없습니다."
}
```
- 있는 사용자인 경우
```
request {
  "message":  "해당 메일로 임시 비밀번호를 발급했습니다. 해당 비밀번호는 3분간 유효하며 해당 비밀번호로 로그인하고 꼭 비밀번호를 수정하시기 바랍니다."
}
```

![비밀번호찾기](https://user-images.githubusercontent.com/94504613/183245340-4c347422-b8e0-44d0-be56-5f0de2eb12bb.jpg)


#### **📌 사용자 정보 검색**
**`GET` /user/search**
```
{
  "message": "hwjddussls@naver.com으로 사용자 검색하였습니다.",
  "userId": "hwjddussls@naver.com",
  "userName": "골골",
  "followers": 0,
  "followings": 0,
  "posts": 2,
  "postList": [
    {
      "id": 1,
      "title": "강릉 여행",
      "content": "너무 재미있었다.",
      "likes": 0,
      "views": 0,
      "createdAt": "2022-08-08 03:31:56",
      "updatedAt": "2022-08-08 03:31:56",
      "hashtags.hashtags": "#맛집,#강릉,#카페,#주말"
    },
    {
      "id": 2,
      "title": "부산 여행",
      "content": "너무 재미있었다.",
      "likes": 0,
      "views": 0,
      "createdAt": "2022-08-08 03:33:11",
      "updatedAt": "2022-08-08 03:33:11",
      "hashtags.hashtags": "#맛집,#카페"
    }
  ]
}
```

#### **📌 팔로우**
**`POST` /user/follow**
```
request {
  "follow": "qwer1234@naver.com"
}
```
- 없는 user를 팔로우 하려는 경우
```
response {
  "message": "없는 유저입니다.",
}
```
- 나를 팔로우 하려는 경우
```
response {
  "message": "나를 팔로우할 수 없습니다.",
}
```
- 팔로우한 적 없는 경우
```
response {
  "message": "팔로우 되었습니다.",
}
```
- 팔로우한 적 있는 경우
```
response {
  "message": "팔로우 취소 되었습니다.",
}
```

#### **📌 팔로잉 목록 조회**
**`GET` /user/followingList**
```
request {
  "target": "qwer1234@naver.com"
}
```
- 팔로잉 목록이 없는 경우
```
response {
  "message": "팔로잉 리스트가 없습니다.",
}
```
- 팔로잉 목록이 있는 경우
```
response {
  "message": "팔로잉 리스트를 조회했습니다.",
  "followingList": [
    {
      "userId": "hwjddussls@naver.com"
    }
  ]
}
```

#### **📌 팔로우 목록 조회**
**`GET` /user/followerList**
```
request {
  "target": "qwer1234@naver.com"
}
```
- 팔로우 목록이 없는 경우
```
response {
  "message": "팔로우 리스트가 없습니다.",
}
```
- 팔로우 목록이 있는 경우
```
response {
  "message": "팔로우 리스트를 조회했습니다.",
  "followerList": [
    {
      "userId": "hwjddussls@naver.com"
    }
  ]
}
```

#### **📌 내 정보 조회**
**`GET` /user/myInfo**
```
response {
  "message": "사용자 정보를 조회했습니다.",
  "userId": "qwer1234@naver.com",
  "userName": "골골",
  "followers": 0,
  "followings": 0
}
```

#### **📌 내 정보 수정**
**`PATCH` /user/update**
```
request {
  "userPw": "Qwer1234!",
  "confirmPw": "Qwer1234!",
  "userName": "골골이"
}
```
```
response {
  "message": "사용자 정보를 수정했습니다.",
}
```

#### **📌 좋아요 누른 게시글 목록**
**`GET` /user/likeList**
```
response {
  "message": "좋아요 누른 게시글을 조회했습니다.",
  "myLikeList": [
    {
      "id": 9,
      "title": "속초여행",
      "content": "너무 즐거웠던 주말 속초 여행",
      "likes": 1,
      "views": 0,
      "createdAt": "2022-07-21 06:03:49",
      "updatedAt": "2022-07-21 06:03:49",
      "hashtags.hashtags": "#맛집,#속초,#카페,#주말"
    }
  ]
}
```

#### **📌 게시글 생성**
**`POST` /post/create**
```
request {
  "title":  "속초여행", 
  "content": "너무 즐거웠던 주말 속초 여행",
  "hashtags":  "#맛집,#속초,#카페,#주말"
}
```
```
response {
  "message": "포스팅 되었습니다."
}
```

#### **📌 게시글 수정**
**`PATCH` /post/create**  
  ✔︎ 작성자만 수정가능
```
request {
  "title":  "강릉여행", 
  "content": "너무 즐거웠던 주말 강릉 여행",
  "hashtags":  "#맛집,#강릉,#여행,#주말"
}
```
```
response {
  "message": "포스팅 되었습니다."
}
```

#### **📌 게시글 삭제**
**`PATCH` /post/delete/:id**  
  ✔︎ 작성자만 삭제가능
```
response {
  "message": "게시글이 삭제되었습니다. 삭제된 게시글은 복원할 수 있습니다."
}
```

#### **📌 게시글 삭제된 목록 보기**
**`GET` /post/deletedList**
- 삭제된 게시물이 있을 경우
```
response {
  "message": "삭제된 게시물을 조회했습니다.",
  "deletedListInfo": [
    {
      "id": 8,
      "title": "아무거나",
      "content": "아무렇게나",
      "likes": 1,
      "views": 1,
      "createdAt": "2022-07-24 03:43:49",
      "updatedAt": "2022-07-24 09:06:11",
      "hashtags.hashtags": "#대강"
    }
  ]
}
```
- 삭제된 게시물이 없을 경우
```
response {
  "message": "삭제된 게시물이 없습니다."
}
```

#### **📌 게시글 복원**
**`PATCH` /post/restore/:id**
```
response {
  "message": "게시글이 복원되었습니다."
}
```

#### **📌 게시글 상세보기**
**`GET` /post/detail/:id**  
  ✔︎ 게시글 조회시 사용자 당 조회수 1회만 증가
```
response {
  "message": "상세정보가 조회되었습니다.",
  "detailInfo": {
    "id": 4,
    "userId": "qwer1234@naver.com",
    "title": "강릉여행",
    "content": "너무 즐거웠던 주말 강릉 여행",
    "likes": 3,
    "views": 10,
    "createdAt": "2022-07-20 11:01:02",
    "updatedAt": "2022-07-21 06:06:14",
    "hashtags.hashtags": "#맛집,#강릉,#카페,#주말"
  }
}
```

#### **📌 게시글 좋아요**
**`PATCH` /post/like/:id**
- 해당 게시글에 좋아요를 누른 적이 없는 경우
```
response {
  "message": "해당 게시글에 좋아요를 표시했습니다."
}
```
- 이미 좋아요를 누른 게시글인 경우
```
response {
  "message": "해당 게시글에 좋아요를 취소했습니다."
}
```

#### **📌 게시글 목록 및 검색**
**`GET` /post/list?search=여행&sort=views&orderBy=desc&hashtags=맛집,카페&perPage=5&page=1**
- 검색결과가 있을 때
```
response {
  "message": "게시글 목록을 조회했습니다.",
  "filter": {
    "search": "여행",
    "sort": "views",
    "orderBy": "desc",
    "hashtags": "맛집,카페",
    "perPage": 5,
    "page": 1
  },
  "listInfo": [
    {
      "id": 4,
      "userId": "qwer1234@naver.com",
      "title": "강릉여행",
      "content": "너무 즐거웠던 주말 강릉 여행",
      "likes": 3,
      "views": 10,
      "createdAt": "2022-07-20 11:01:02",
      "updatedAt": "2022-07-21 06:07:15",
      "hashtags.hashtags": "#맛집,#강릉,#카페,#주말"
    },
    {
      "id": 5,
      "userId": "qwer1234@naver.com",
      "title": "부산 여행",
      "content": "너무 재미있었다.",
      "likes": 0,
      "views": 0,
      "createdAt": "2022-07-21 09:28:38",
      "updatedAt": "2022-07-21 09:28:38",
      "hashtags.hashtags": "#맛집,#카페"
    },
    {
      "id": 9,
      "userId": "qwer1234@naver.com",
      "title": "속초여행",
      "content": "너무 즐거웠던 주말 속초 여행",
      "likes": 0,
      "views": 0,
      "createdAt": "2022-07-21 06:03:49",
      "updatedAt": "2022-07-21 06:03:49",
      "hashtags.hashtags": "#맛집,#속초,#카페,#주말"
    }
    ...
  ]
}
```
- 검색 결과가 없을 때
```
response {
  "message": "게시글이 없습니다.",
  "filter": {
    "search": "여행",
    "sort": "views",
    "orderBy": "desc",
    "hashtags": "맛집,카페,서울",
    "perPage": 5,
    "page": 1
  }
}
```

#### **📌 게시글 댓글 작성**
**`POST` /post/comment/1**
```
request {
  "comment":  "오오!", 
}
```
```
response {
  "message": "게시글에 댓글을 달았습니다."
}
```

#### **📌 게시글 댓글 수정**
**`PATCH` /post/comment/1**
```
request {
  "comment":  "여행 좋아보여요!", 
}
```
```
response {
  "message": "댓글을 수정했습니다."
}
```

#### **📌 상황별 http status code**
`200` : 성공  
`201` : 생성  
`400` : 입력값 형식이 맞지 않을 경우  
`401` : 인증토큰 문제  
`403` : 권한 없는 사용자가 수정, 삭제, 복원을 원할 경우  
`404` : 잘못된 경우, 요청 parameter가 없는 경우일 때  
`409` : 아이디 충돌  
`422` : 아이디나 비밀번호가 맞지 않을 경우  
`500` : 서버 에러 try catch 
 
<br/>

## 프로젝트 후 작성한 블로그 링크
상세한 개발과정을 볼 수 있습니다.

- [조회/좋아요 수 증가](https://golgol22.github.io/posts/nodejs-sequelize-increment/)
- [게시글 검색 (검색어, 해시태그, 정렬, pagination)](https://golgol22.github.io/posts/nodejs-sequelize-hashtag/)
- [express-validator로 값 검증하기](https://golgol22.github.io/posts/nodejs-express-validator/)
- [jwt 토큰 발급하기](https://golgol22.github.io/posts/nodejs-jwt/)
- [접속정보 알아내기](https://golgol22.github.io/posts/nodejs-access-info/)
- [winston으로 로그남기기](https://golgol22.github.io/posts/nodejs-winston/)
- [nodejs에서 redis 사용하기](https://golgol22.github.io/posts/nodejs-redis/)
- [메일보내기(이메일본인인증, 로그인 접속정보, 비밀번호 찾기)](https://golgol22.github.io/posts/nodejs-mail-sender/)