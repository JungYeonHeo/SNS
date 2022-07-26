<div align="center">

  # SNS(Social Betwork Service) 백엔드 구현
<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=Express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=Sequelize&logoColor=white"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=Docker&logoColor=white"/>
  <img src ="https://img.shields.io/badge/Nginx-009639?style=flat&logo=Nginx&logoColor=white"/>
  <img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=flat&logo=Amazon EC2&logoColor=white"/>
  <img src="https://img.shields.io/badge/Amazon RDS-527FFF?style=flat&logo=Amazon RDS&logoColor=white"/>
</p>
</div> 
<br/>
<br/>

## 프로젝트

#### **📌 필수구현 기능**
- [X] 유저 이메일로 로그인&회원가입, jwt 토큰 발급
- [X] 게시글 CRUD  

이외에 기능은 개인적으로 추가 구현한 기능입니다.

#### **📌 유저**
- [X] express-validator를 통한 회원가입 입력값 검증
  - [X] 빈 값 확인
  - [X] 이메일ID 사용
  - [X] 비밀번호 3가지조합 8자리이상
  - [X] 이름 특수문자 입력 체크 - sql injection, xss 방어
- [X] jwt를 이용한 로그인 구현
- [X] 접속한 적 없는 ip, os, device, browser로 접속 시 확인 메일 보내 검증
- [X] 회원정보 조회
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

#### **📌 운영**
- [X] docker를 사용한 환경 구축
- [X] AWS EC2 & RDS를 통한 웹 서비스 배포 
- [X] 2대의 EC2 앞에 nginx를 두어 로드밸런싱을 통한 부하 분산 처리 
- [X] winston을 통한 info, error 로그 남기기 

#### **📌 개발기간**
`2022.07.20 ~ 2022.07.22(필수 기능 구현 기간) + α`

#### **📌 구현 예정**
- [ ] 회원가입시 입력한 이메일로 메일을 보내 실제 본인 이메일이 맞는지 인증 
- [ ] 비밀번호 찾기 - 가입한 메일로 임시 비밀번호 생성해 발송 
- [ ] error가 나면 슬랙에 알림이 울리도록 구현
- [ ] 게시글에 이미지, 동영상 올릴 수 있도록 구현
- [ ] 게시글에 댓글 달 수 있도록 구현
- [ ] 사용자 프로필 이미지 추가 기능
- [ ] 아이디 검색을 통한 팔로우 기능
- [ ] 팔로우, 팔로워 목록 확인
- [ ] DM 기능 구현 (1:1 채팅)
- [ ] 사용자 맞춤 추천 게시글
- [ ] 실시간 인기글 보여주기 
- [ ] 테스트 케이스 작성 
- [ ] 이미지 AWS S3에 보관
- [ ] RDS에 Slave를 두어 DB 안정성 높임
- [ ] url에 도메인, SSL 연결
- [ ] 로그 고도화 후 ELK를 통한 통합 모니터링 시스템 구축
<br/>

## AWS 배포
#### **📌 구성도**

#### **📌 배포 링크**

<br/>

## 데이터베이스 모델링(ERD)
![erd](https://user-images.githubusercontent.com/94504613/180904430-5d4f3cb1-642c-44f0-aa1b-bd431ce293b4.png)
- users: 유저 정보 저장 테이블
- posts: 게시글 저장 테이블
- hashtags: 해시태그 저장 테이블
- postLogs: 게시글 본 기록 저장 테이블
- postLikes: 게시글 좋아요 기록 저장 테이블
- accessLogs: 유저 웹 접근 기록 저장 테이블
<br/>

## REST API

#### **📌 회원가입**
**`POST` /user/join**
```json
request {
  "userId": "qwer1234@naver.com",
  "userPw": "Qwer1234!",
  "confirmPw": "Qwer1234!",
  "userName": "골골"
}
```
```json
response {
  "message": "회원가입 되었습니다."
}
```

#### **📌 로그인**
**`POST` /user/login**
```json
request {
  "userId": "qwer1234@naver.com",
  "userPw": "Qwer1234!"
}
```
```json
response {
  "message": "로그인 되었습니다."
}
```

#### **📌 내 정보 조회**
**`GET` /user/myInfo**
```json
response {
  "message": "사용자 정보를 조회했습니다.",
  "userId": "qwer1234@naver.com",
  "userName": "골골"
}
```

#### **📌 좋아요 누른 게시글 목록**
**`GET` /user/likeList**
```json
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
```json
request {
  "title":  "속초여행", 
  "content": "너무 즐거웠던 주말 속초 여행",
  "hashtags":  "#맛집,#속초,#카페,#주말"
}
```
```json
response {
  "message": "포스팅 되었습니다."
}
```

#### **📌 게시글 수정**
**`PATCH` /post/create**  
✔︎ 작성자만 수정가능
```json
request {
  "title":  "강릉여행", 
  "content": "너무 즐거웠던 주말 강릉 여행",
  "hashtags":  "#맛집,#강릉,#여행,#주말"
}
```
```json
response {
  "message": "포스팅 되었습니다."
}
```

#### **📌 게시글 삭제**
**`PATCH` /post/delete/:id**  
✔︎ 작성자만 삭제가능
```json
response {
  "message": "게시글이 삭제되었습니다. 삭제된 게시글은 복원할 수 있습니다."
}
```

#### **📌 게시글 삭제된 목록 보기**
**`GET` /post/deletedList**
- 삭제된 게시물이 있을 경우
```json
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
```json
response {
  "message": "삭제된 게시물이 없습니다."
}
```

#### **📌 게시글 복원**
**`PATCH` /post/restore/:id**
```json
response {
  "message": "게시글이 복원되었습니다."
}
```

#### **📌 게시글 상세보기**
**`GET` /post/detail/:id**  
✔︎ 게시글 조회시 사용자당 조회수 1회만 증가
```json
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
```json
response {
  "message": "해당 게시글에 좋아요를 표시했습니다."
}
```
- 이미 좋아요를 누른 게시글인 경우
```json
response {
  "message": "해당 게시글에 좋아요를 취소했습니다."
}
```

#### **📌 게시글 목록 및 검색**
**`GET` /post/list?search=여행&sort=views&orderBy=desc&hashtags=맛집,카페&perPage=5&page=1**
- 검색결과가 있을 때
```json
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
```json
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
<br/>

## 구현 내용 상세

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

#### **📌 입력값 검증**

#### **📌 사용자 인증 및 메일 보내기**

#### **📌 게시글 검색**

#### **📌 log 남기기**

#### **📌 error 발생시 슬랙 알림**

<br/>

## 프로젝트 후 블로그 작성한 링크
- 추후 작성 예정