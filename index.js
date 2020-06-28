const express = require('express')
const app = express()
const port = 3000
const path = require('path');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// Database
const students = {
                  '0001':'Jacob Searles',
                  '0002': 'Karl Armstrong',
                  '0003': 'Nick Vigilant',
                  '0004': 'Mikael Vanhemert',
                  '0005': 'Steve Peterson',
                  '0006': 'Vintrell Cook',
                  '0007': 'Karl Armstrong'
                 }

const grades ={
  '0001': [{'TDD':'A'},{'XP':'B+'},{'PMA':'A+'}],
  '0002': [{'TDD':'A'},{'XP':'B+'},{'PMA':'A+'}],
  '0003': [{'TDD':'B'},{'XP':'B+'},{'PMA':'A+'}],
  '0004': [{'TDD':'A'},{'XP':'B+'},{'PMA':'A+'}],
  '0005': [{'TDD':'A+'},{'XP':'B+'},{'PMA':'A+'}],
  '0006': [{'TDD':'A'},{'XP':'A+'},{'PMA':'A+'}],
  '0007': [{'TDD':'B'},{'XP':'A'},{'PMA':'A+'}]
}

let tableStartHtml = '<table><tr><th>ID</th><th>Name</th></tr>'
let tableCloseHtml = '</table>'

//Views
function buildStudentList(){
  let html= tableStartHtml
   Object.keys(students).forEach( (key,index)=>{
    html = html + (`<tr><td><h5>${key}</h5></td><td><h5>   ${students[key]}</h5><td></tr>`);
  });
  html = html+tableCloseHtml
  return(html);
}

function searchById(id){
  let html = tableStartHtml
  Object.keys(students).forEach( (key,index)=>{
    if(key===id){
      html = html + (`<tr><td><h5>${key}</h5></td><td><h5>   ${students[key]}</h5><td></tr>`);
    }
  })
  html = html + tableCloseHtml
  return html
}

function searchByName(name){
  let html = tableStartHtml
  Object.keys(students).forEach( (key, index)=>{
      if(chomp(students[key])===chomp(name)){
        html = html + (`<tr><td><h5>${key}</h5></td><td><h5>${students[key]}</h5><td></tr>`);
      }
  })
  html = html + tableCloseHtml
  return html
}



function getStudentGradesById(id){
  let name = getStudentNameById(id);
  let html = `Grades for ${name}`;
  let gradeDictList = []

  // Build Grade table Header
  html = html+`<table><tr>`
  // Build table headers
  grades[id].forEach( (dict,index)=>{
    gradeDictList.push(dict)
    html=html+`<th>${Object.keys(dict)[0]}</th>`
  })
  html = html + `</tr><tr>`

  // Now build grade table body
  gradeDictList.forEach( (dict, index)=>{
    html = html+`<td>${Object.values(dict)[0]}</td>`
  })

  html = html + '</tr><table/>'
  return html
}

//Utilities
function chomp(str){
  return str.toLowerCase().replace(/\s+/g, '')
}

function getStudentNameById(id){
  let name = ''
  Object.keys(students).forEach( (key,index)=>{
    if(id===key){
      name = students[key]
    }
   })
   return name;
}

function addGradeByStudentId(id, assignment, grade){
  newgrade = {}
  newgrade[assignment] = grade
  Object.keys(students).forEach( (key,index)=>{
    if(key===id){
      let gradeList = grades[key]
      gradeList.push(newgrade)
    }
  })
}


// *********************************
// *  REST API
// ********************************

app.get('/students', (req, res) => {

  if (req.query.search){
    res.send(searchByName(req.query.search))
  }
  else{
    res.send(buildStudentList())
  }

})

app.get('/students/:studentId', (req, res)=>{
  res.send(searchById(req.params.studentId));
})

app.get('/grades/:studentId', (req,res)=>{
  res.send(getStudentGradesById(req.params.studentId));
})

app.get('/gradeform', (req,res)=>{
  res.sendFile( path.join(__dirname + '/gradeform.html'))
})

app.post('/gradeform', (req,res)=>{
  let studentId = req.body['studentId'];
  let assignment = req.body['assignment'];
  let grade = req.body['grade']
  addGradeByStudentId(studentId,assignment,grade);
  res.redirect(req.get('referer'));
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
