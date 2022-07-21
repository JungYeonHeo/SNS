function makeSearchWord(search) { 
  // 검색한 단어 만들기 (대소문자, 띄어쓰기)
  let words = search.split(" ");
  let wordArr = [];
  for (const word of words) {
    wordArr.push(word);
    wordArr.push(word.toUpperCase()); 
    wordArr.push(word.toLowerCase()); 
    wordArr.push(word.replace(/^[a-z]/, char => char.toUpperCase())); // 첫글자 대문자
  }
  const wordSet = new Set(wordArr);
  wordArr = [...wordSet];
  return wordArr.join("|");
}

module.exports = makeSearchWord;