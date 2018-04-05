const generateId = require('./generate-id')

function generateKompetansebevis (maal) {
  const sorted = maal.reduce((prev, curr) => {
    const id = generateId(curr.utdanningsprogram)
    if (!prev.hasOwnProperty(id)) {
      prev[id] = {
        name: curr.utdanningsprogram,
        maal: []
      }
    }
    prev[id].maal.push({
      name: curr.kompetanseMaal,
      oppgaver: curr.arbeidsOppgaver
    })
    return prev
  }, {})
  const data = Object.values(sorted)
  return data
}

module.exports = data => {
  const filtered = data.reduce((prev, current) => {
    if (prev.hasOwnProperty(current.studentId)) {
      prev[current.studentId] = prev[current.studentId].skjemaUtfyllingStop < current.skjemaUtfyllingStop ? current : prev[current.studentId]
    } else {
      prev[current.studentId] = current
    }
    return prev
  }, {})
  const raw = Object.values(filtered)
  const students = raw.map(student => Object.assign({}, {
    name: student.studentName,
    classLevel: student.classLevel,
    utdanningsprogram: student.utdanningsprogram,
    data: generateKompetansebevis(student.lokalPlanMaal)
  }))

  return students
}
