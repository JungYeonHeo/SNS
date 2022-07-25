function createRandomNumber(n) {
  // 랜덤 인증 번호
  let randomNumber = "";
  for (let i = 0; i < n; i++) {
    randomNumber += Math.floor(Math.random() * 9);
  }
  return randomNumber;
}

function createRandomPassword(variable, passwordLength) {
  // 비밀번호 랜덤 함수
  let randomString = "";
  for (let j = 0; j < passwordLength; j++) randomString += variable[Math.floor(Math.random() * variable.length)];
  return randomString;
}

module.exports = { createRandomNumber, createRandomPassword };