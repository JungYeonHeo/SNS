function createRandomNumber(n) {
  // 랜덤 인증 번호 - 6자리 숫자
  let randomNumber = "";
  for (let i = 0; i < n; i++) {
    randomNumber += Math.floor(Math.random() * 9);
  }
  return randomNumber;
}

function createRandomPassword(passwordLength) {
  // 램덤 임시 비밀번호 최소 8자리 이상 : 영어 대문자, 소문자, 숫자, 특수문자 중 3종류 조합
  const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[.!@#&$^])[0-9a-zA-Z]{8,}/, "g");
  const specialCharacters = ".,!,@,#,&,$,^".split(",");
  let randomString = Math.random().toString(36).slice(2, passwordLength);
  randomString += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  randomString += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];
  if (passwordRegex.test(randomString)) {
    return randomString;
  }
}
module.exports = { createRandomNumber, createRandomPassword };