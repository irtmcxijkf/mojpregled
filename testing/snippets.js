// Timestamp of current date/time (27.01.2025 15:34:04)
function getDateTime() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  if (month.toString().length == 1) {
    month = '0' + month;
  }
  if (day.toString().length == 1) {
    day = '0' + day;
  }
  if (hour.toString().length == 1) {
    hour = '0' + hour;
  }
  if (minute.toString().length == 1) {
    minute = '0' + minute;
  }
  if (second.toString().length == 1) {
    second = '0' + second;
  }
  const dateTime = `${day}.${month}.${year} ${hour}:${minute}:${second}`
  return dateTime;
}

// Number to month  (ex: '02' -> 'Февруари', '05' -> 'Maj')
function numToMonth(num) {
  let months = ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  let month = months[Number(num) - 1]
  return month;
}


// Month to number (ex: 'March' -> 3, 'August' -> 8 etc.)
function monthToNum(month) {
  let months = ["Јануари", "Февруари", "Март", "Април", "Мај", "Јуни", "Јули", "Август", "Септември", "Октомври", "Ноември", "Декември"];
  let num = months.indexOf(month) + 1
  return num;
}


//Adding suffix to the day ('01' -> '01ви', '05' -> '05ти' etc.)
function addSuffix(num) {
  switch (num) {
    case '01': return num += 'ви'; break;
    case '02': return num += 'ри'; break;
    case '21': return num += 'ви'; break;
    case '22': return num += 'ри'; break;
    case '31': return num += 'ви'; break;
  }
  return num += 'ти';
}


// Iterating array in chunks
let arr = [1, 2, 3, 4, 5, 6, 7, 8]
function chunkProcessing(arr, chunkSize) {
  let index = 0
  function doChunk() {
    let chunkCounter = chunkSize
    while (chunkCounter-- && index < arr.length) {
      console.log(
        arr[index]
      );
      index++
    }
    if (index < arr.length) {
      setTimeout(doChunk, 1000)
    }
  }
  doChunk()
}


// Stopwatch
'<div class="stopwatch"></div>'
let STOPWATCH = 0
const DIV_STOPWATCH = document.querySelector('.stopwatch')
DIV_STOPWATCH.textContent = STOPWATCH
setInterval(function () {
  STOPWATCH++
  DIV_STOPWATCH.textContent = STOPWATCH
}, 1000)


// Rendering cards in chunks
function chunkProcessing(cards, chunkSize) {
  let timer = null
  let index = 0
  function doChunk() {
    let chunkIndex = chunkSize
    while (chunkIndex-- && index < cards.length) {
      if (cards[index].tags.includes(inputWords[0])
        && cards[index].tags.includes(inputWords[1])
        && cards[index].tags.includes(inputWords[2])
        && cards[index].tags.includes(inputWords[3])
        && cards[index].tags.includes(inputWords[4])
        && cards[index].tags.includes(inputWords[5])
        && cards[index].tags.includes(inputWords[6])
        && cards[index].tags.includes(inputWords[7])
        && cards[index].tags.includes(inputWords[8])
        && cards[index].tags.includes(inputWords[9])
      ) {
        cards[index].element.classList.remove('hide')
      }
      else { cards[index].element.classList.add('hide') }
      index++
    }
    if (index < cards.length) { timer = setTimeout(doChunk, 2) }
  }
  doChunk()
}

