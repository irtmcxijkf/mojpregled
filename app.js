const INP_SEARCH = document.querySelector('input')
const DIV_CARD_CONTAINER = document.querySelector('.card-container') //place for all the cards
const DIV_CARD_TEMPLATE = document.querySelector('.card-template') //card template
const ARR_CARDS = [] //created cards are stored here


// Creating html card for each element(object) in json file
function makeCards() {
  fetch('./json/aparati.json').then(res => res.json()).then(data => {
    data.forEach(obj => {
      //create html card
      const divCard = DIV_CARD_TEMPLATE.content.cloneNode(true).children[0]
      const divIme = divCard.querySelector('.ime')
      const divLokacija = divCard.querySelector('.lokacija')
      const divUstanova = divCard.querySelector('.ustanova')
      divLokacija.textContent = obj.lokacija
      // divUstanova.textContent = obj.ustanova
      divIme.textContent = obj.ime
      divCard.id = obj.id
      DIV_CARD_CONTAINER.append(divCard)
      //...and save it for future use
      ARR_CARDS.push({
        lokacija: obj.lokacija,
        ustanova: obj.ustanova,
        ime: obj.ime,
        id: obj.id,
        tags: obj.tags,
        element: divCard
      })
    });
  }).catch(err => err)
  //same thing, different json file
  fetch('./json/specijalisti.json').then(res => res.json()).then(data => {
    data.forEach(obj => {
      //create html card
      const divCard = DIV_CARD_TEMPLATE.content.cloneNode(true).children[0]
      const divIme = divCard.querySelector('.ime')
      const divLokacija = divCard.querySelector('.lokacija')
      const divSpecijalnost = divCard.querySelector('.specijalnost')
      divSpecijalnost.textContent = obj.specijalnost
      divLokacija.textContent = obj.lokacija
      divIme.textContent = capitalize(obj.ime)
      divCard.id = obj.id
      DIV_CARD_CONTAINER.append(divCard)
      //...and save it for future use
      ARR_CARDS.push({
        specijalnost: obj.specijalnost,
        lokacija: obj.lokacija,
        ime: obj.ime,
        id: obj.id,
        tags: obj.tags,
        test: obj.tip,
        element: divCard
      })
    });
  }).catch(err => err)
}

makeCards()


// When typing in search bar:
INP_SEARCH.addEventListener('input', ev => {
  //store the caret position
  let carStart = INP_SEARCH.selectionStart
  let carEnd = INP_SEARCH.selectionEnd
  //replace latin letters with cyrilic
  let inputText = ev.target.value
  let cyrilicText = replaceLetters(inputText)
  ev.target.value = cyrilicText
  //stop the caret from jumping to the end. reason is line 82 (changing to cyrilic)
  INP_SEARCH.selectionStart = carStart
  INP_SEARCH.selectionEnd = carEnd
  //split text into words
  let searchWords = split(cyrilicText)
  //check the cards for a match and show/hide accordingly
  filterCards(searchWords)
})


// When a card is clicked:
async function clickCard(elt) {
  //toggle it
  const divTermini = elt.querySelector('.termini')
  divTermini.classList.toggle('hide')
  //check if card is already clicked/expanded
  const divShouldRefresh = elt.querySelector('.should-refresh')//hidden element, for storing info on whether a card is expanded or collapsed
  if (divShouldRefresh.textContent == 'yes') {
    //if it's not clicked or if it's collapsed, fetch and render data
    getDataMakeHtml()
  } else {
    //if it's clicked and expanded, collapse it, do not refetch and rerender
    divShouldRefresh.textContent = 'yes'
    divTermini.innerHTML = '<div class="loading"></div>'
  }
  //useful for future styling of the card ex: red color if all slots are taken, green if there are availables, warning if fetching fails etc.
  let hasSlots = false;//fetched data is not empty, slot info is present
  let hasFreeSlots = false;////fetched data is not empty, slot info is present, and some/all are available
  let isErr = false//unsuccessful fetching, no data is present
  //fetch mojtermin data, check for free slots, render the result
  let html = ''
  async function getDataMakeHtml() {
    divShouldRefresh.textContent = 'no'
    //get the data
    let url = `/termini?id=${elt.id}`
    let slots = await fetch(url).then(res => res.json()).then(data => data.timeslots).catch(err => isErr = true)
    //look for available slots and make html
    for (property in slots) {
      let monthNumber = property.substr(0, 10).split('-')[1] //04, 02, 03 etc.
      let monthName = numberToMonth(monthNumber) //04 to April, 02 to February, 03 to March etc.
      let checkDay = ''
      slots[property].forEach(el => {
        let dayNumber = el.term.substr(8, 2) //1, 2, 5, 17 etc.
        let daySuffix = addSuffix(dayNumber)
        if (dayNumber !== checkDay) {//to prevent rendering the same data multiple times
          checkDay = dayNumber
          let styleDate = 'color:black'
          html += `<span style=${styleDate}>На ${daySuffix} ${monthName} во:</span><br>`//make sentence for each day in a month ex: На 17ти Март во:
          slots[property].forEach(el => {
            let innerDay = el.term.substr(8, 2)
            if (el.isAvailable == true && innerDay == checkDay) {//if slot is available:
              let term = el.term.substr(11, 5) //extract the time ex: 10:40, 12:20 etc.
              let styleTerm = 'background-color:green;color:white;padding:.3rem;border-radius:.5rem'
              html += ` <span style=${styleTerm}>${term}ч</span> `//concatenate green pill-styled timestamps to the previous sentence ex: На 17ти Март во 12:40ч, 13:00ч. 13:20ч etc.
              hasFreeSlots = true//
            } else if (el.isAvailable == false && innerDay == checkDay) {//if slot is taken:
              let term = el.term.substr(11, 5) //extract the time ex: 10:40, 12:20 etc.
              let styleTerm = 'background-color:red;color:white;padding:.3rem;border-radius:.5rem'
              html += ` <span style=${styleTerm}>${term}ч</span> `//concatenate red pill-styled timestaps to the previous sentence ex: На 17ти Март во 12:40ч, 13:00ч. 13:20ч etc.
              hasSlots = true
            }
          })
          html += `<br><br>`
        }
      })
    }
    //rendering
    if (hasFreeSlots) {//at least one slot is available
      divTermini.innerHTML = html
      elt.classList.add('available-yes')
    } else if (!hasFreeSlots && hasSlots) {//no available slots at all
      divTermini.innerHTML = html
      elt.classList.add('available-no')
    }
    else if (!hasSlots && !isErr) {//slot info is not present
      let style = 'background-color:red;color:white;padding:.3rem;border-radius:.5rem'
      divTermini.innerHTML = ` <span style=${style}> Нема објавени термини </span> `
      elt.classList.add('available-no')
    }
    else if (isErr) {//slot info is not fetched at all, error in the get request
      divTermini.innerHTML = 'Неуспешна врска!<br>Пробај повторно.'
    }
  }
}





// Check for a match and show/hide cards accordingly
function filterCards(searchWords) {
  //check if the tags of the card contain all the search words
  ARR_CARDS.forEach(card => {
    if (card.tags.includes(searchWords[0])
      && card.tags.includes(searchWords[1])
      && card.tags.includes(searchWords[2])
      && card.tags.includes(searchWords[4])
      && card.tags.includes(searchWords[5])
      && card.tags.includes(searchWords[6])
      && card.tags.includes(searchWords[7])
      && card.tags.includes(searchWords[8])
      && card.tags.includes(searchWords[9])) {
      //if they do, show the card
      card.element.classList.remove('hide')
    }
    else {
      //if not, hide the card 
      card.element.classList.add('hide')
    }
  })
}


// Split text into words
function split(txt) {
  //splitting the text, removing white spaces, lowercasing
  let arr = txt.toLowerCase().split(' ').filter(elt => {
    return elt != ''
  })
  //lenght is always 10 words. if typed less, rest is filled with ''. excess is removed
  for (let i = 0; i < 10; i++) {
    if (arr.length < 10) {
      arr.push('')
    } else if (arr.length > 10) {
      arr.pop()
    }
  }
  return arr;
}


// Number to month (3 to 'Март', '07' to 'Јули' etc.)
function numberToMonth(number) {
  let months = ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  let monthName = months[Number(number) - 1]
  return monthName;
}


// Add suffix to the day ('01' -> '01ви', '05' -> '05ти' etc.)
function addSuffix(day) {
  switch (day) {
    case '01': return day += 'ви'; break;
    case '02': return day += 'ри'; break;
    case '21': return day += 'ви'; break;
    case '22': return day += 'ри'; break;
    case '31': return day += 'ви'; break;
  }
  return day += 'ти';
}


// Capitalize first letter
function capitalize(txt) {
  //but only when the text is entirely upper case
  if (txt = txt.toUpperCase()) {
    let round1 = txt.toLowerCase().split(' ').map(el => el.charAt(0).toUpperCase() + el.slice(1)).join(' ')
    let round2 = round1.split('-').map(el => el.charAt(0).toUpperCase() + el.slice(1)).join('-')
    let round3 = round2.split(' - ').map(el => el.charAt(0).toUpperCase() + el.slice(1)).join(' - ')
    return round3;
  }
  return txt;
}


// Replace latin letters with cyrilic
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
  return converted;     //......return......//
}