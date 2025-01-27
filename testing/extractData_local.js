
const fs = require('fs')
const data = require('../json/side_navigation.json')
const specijalisti = []
const aparati = []


//Extract specijalisti
data[0].subsections.forEach(elSpecijalnost => {
  let optionalTags = ''
  elSpecijalnost.subsections.forEach(elLokacija => {
    elLokacija.subsections.forEach(elUstanova => {
      elUstanova.subsections.forEach(elSpecijalist => {
        specijalisti.push(
          {
            specijalnost: elSpecijalnost.name,
            lokacija: elLokacija.name,
            ustanova: elUstanova.name,
            ime: elSpecijalist.name,
            id: elSpecijalist.id,
            tags: `${elSpecijalnost.name.toLowerCase()} ${elLokacija.name.toLowerCase()} ${elUstanova.name.toLowerCase()} ${elSpecijalist.name.toLowerCase()} доктор доктори лекар лекари специјалист специјалисти ${optionalTags}`
          }
        )
      })
    })
  })
});


//Extract aparati
data[1].subsections.forEach(elTip => {
  let optionalTags = ''
  elTip.subsections.forEach(elLokacija => {
    elLokacija.subsections.forEach(elUstanova => {
      elUstanova.subsections.forEach(elAparat => {
        aparati.push(
          {
            tip: elTip.name,
            lokacija: elLokacija.name,
            ustanova: elUstanova.name,
            ime: elAparat.name,
            id: elAparat.id,
            tags: `${elTip.name.toLowerCase()} ${elLokacija.name.toLowerCase()} ${elUstanova.name.toLowerCase()} ${elAparat.name.toLowerCase()} апарат апарати ${optionalTags}`
          }
        )
      })
    })
  })
});


//Adding extra tags to specijalisti (ex: 'Otorinolaringologija' means adding 'uvo nos grlo usi')
specijalisti.forEach(obj => {
  let extraTags = ''
  extraTags += addTags(obj.specijalnost, 'Оториноларингологија', ' уво нос грло уши ушно')
  extraTags += addTags(obj.specijalnost, 'Офталмологија', ' око очи очно')
  extraTags += addTags(obj.ime, 'нефроло', ' нефрологија')
  extraTags += addTags(obj.ustanova, 'нефроло', ' нефрологија')
  extraTags += addTags(obj.ustanova, 'ГОБ 8-ми Септември', ' 8ми осми')
  obj.tags += extraTags
})


//Adding extra tags to aparati
aparati.forEach(obj => {
  let extraTags = ''
  extraTags += addTags(obj.ime, 'нефроло', ' нефрологија')
  extraTags += addTags(obj.ustanova, 'нефроло', ' нефрологија')
  extraTags += addTags(obj.ustanova, 'ГОБ 8-ми Септември', ' 8ми осми')
  extraTags += addTags(obj.tip, 'РТГ', ' рентген рендген ренген')
  obj.tags += extraTags
})


fs.writeFileSync('../json/specijalisti.json', JSON.stringify(specijalisti))
fs.writeFileSync('../json/aparati.json', JSON.stringify(aparati))






//Comparing 2 string arguments, return the 3rd if they are equal (or partially equal)
function addTags(property, toMatch, tagsToAdd) {
  property = property.toLowerCase()
  toMatch = toMatch.toLowerCase()
  if (property == toMatch || property.includes(toMatch)) {
    return tagsToAdd;
  }
  else {
    return '';
  }
}

