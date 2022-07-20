create database sns;
use sns;
create table user ( -- 회원
	userId varchar(50) not null,
	userPw varchar(100) not null,
	primary key(userId)
);
create table posting ( -- 게시글
	postId int not null auto_increment, 
	userId varchar(50) not null,
  title varchar(100) not null,
  content text not null,
  writeDate datetime default now(),
  likeNum int default 0 not null,
  views int default 0 not null,
  state int default 0 check (state in(0, 1)),
	primary key(postId),
	constraint posting_user_fk FOREIGN KEY (userId)
	REFERENCES user(userId) ON UPDATE CASCADE
);
create table tag ( -- 태그 
	tagId int not null auto_increment,
  tag varchar(100) unique not null,
	primary key(tagId)
);
create table hashtag ( -- 해시태그
	postId int not null, 
  tagId int not null,
	constraint hashtag_postId_fk FOREIGN KEY (postId)
	REFERENCES posting(postId) ON UPDATE CASCADE,
	constraint hashtag_tagId_fk FOREIGN KEY (tagId)
	REFERENCES tag(tagId) ON UPDATE CASCADE
);