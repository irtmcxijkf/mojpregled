//selecting dom elements
let ul = document.querySelector('ul')
let input = document.querySelector('input')



//getting data
let jsonData = []
fetch('./json/specijalisti.json').then(res => res.json()).then(data => {
  data.forEach(el => jsonData.push({ ime: el.ime, specijalnost: el.specijalnost, lokacija: el.lokacija, tags: el.tags }))
})
fetch('./json/aparati.json').then(res => res.json()).then(data => {
  data.forEach(el => jsonData.push({ ime: el.ime, ustanova: el.ustanova, lokacija: el.lokacija, tags: el.tags })
  )
})


//typing in search bar
input.addEventListener('input', ev => {
  let typed = ev.target.value.toLowerCase()
  let cyrilic = replaceLetters(typed)//replace latin with cyrilic
  let words = split(cyrilic)//split into words
  let result = searching(jsonData, words)//checking for match
  //rendering
  html = ''
  result.forEach((el, index) => index < 50 ? html += `<li onclick="clickMe(this)">${el.ime} / / ${el.specijalnost || el.ustanova} / / ${el.lokacija}</li>` : 0)
  ul.innerHTML = html
})






//////////////////////////////////////////////

//clicking the names
function clickMe(elt) {
  elt.innerHTML += '<div>unutrasno</div>'
}

//searching basically is checking if the data element contains all of the input words
function searching(data, words) {
  let result = []
  data.forEach(el => {
    let tags = el.tags
    if (tags.includes(words[0])
      && tags.includes(words[1])
      && tags.includes(words[2])
      && tags.includes(words[4])
      && tags.includes(words[5])
      && tags.includes(words[6])
      && tags.includes(words[7])
      && tags.includes(words[8])
      && tags.includes(words[9])) {
      result.push(el)
    }
  })
  return result;
}

//convert string into array of 10 substrings. anything over 10 is removed. less than 10 is filled with ''
function split(txt) {
  let arr = txt.toLowerCase().split(' ').filter(elt => {
    return elt != ''
  })
  for (let i = 0; i < 10; i++) {
    if (arr.length < 10) {
      arr.push('')
    } else if (arr.length > 10) {
      arr.pop()
    }
  }
  return arr;
}

//replace latin with cyrilic
function replaceLetters(txt) {
  let converted = txt
    .replaceAll('q', 'љ')
    .replaceAll('w', 'њ')
    .replaceAll('e', 'е')
    .replaceAll('r', 'р')
    .replaceAll('t', 'т')
    .replaceAll('y', 'ѕ')
    .replaceAll('u', 'у')
    .replaceAll('i', 'и')
    .replaceAll('o', 'о')
    .replaceAll('p', 'п')
    .replaceAll('[', 'ш')
    .replaceAll(']', 'ѓ')
    .replaceAll('\\', 'ж')
    .replaceAll('a', 'а')
    .replaceAll('s', 'с')
    .replaceAll('d', 'д')
    .replaceAll('f', 'ф')
    .replaceAll('g', 'г')
    .replaceAll('h', 'х')
    .replaceAll('j', 'ј')
    .replaceAll('k', 'к')
    .replaceAll('l', 'л')
    .replaceAll(';', 'ч')
    .replaceAll('\'', 'ќ')
    .replaceAll('z', 'з')
    .replaceAll('x', 'џ')
    .replaceAll('c', 'ц')
    .replaceAll('v', 'в')
    .replaceAll('b', 'б')
    .replaceAll('n', 'н')
    .replaceAll('m', 'м')
    .replaceAll('Q', 'Љ')
    .replaceAll('W', 'Њ')
    .replaceAll('E', 'Е')
    .replaceAll('R', 'Р')
    .replaceAll('T', 'Т')
    .replaceAll('Y', 'Ѕ')
    .replaceAll('U', 'У')
    .replaceAll('I', 'И')
    .replaceAll('O', 'О')
    .replaceAll('P', 'П')
    .replaceAll('{', 'Ш')
    .replaceAll('}', 'Ѓ')
    .replaceAll('|', 'Ж')
    .replaceAll('A', 'А')
    .replaceAll('S', 'С')
    .replaceAll('D', 'Д')
    .replaceAll('F', 'Ф')
    .replaceAll('G', 'Г')
    .replaceAll('H', 'Х')
    .replaceAll('J', 'Ј')
    .replaceAll('K', 'К')
    .replaceAll('L', 'Л')
    .replaceAll(':', 'Ч')
    .replaceAll('"', 'Ќ')
    .replaceAll('Z', 'З')
    .replaceAll('X', 'Џ')
    .replaceAll('C', 'Ц')
    .replaceAll('V', 'В')
    .replaceAll('B', 'Б')
    .replaceAll('N', 'Н')
    .replaceAll('M', 'М')
  return converted;
}