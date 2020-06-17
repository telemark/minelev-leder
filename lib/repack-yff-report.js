const generateId = require('./generate-id')

const classCodes = {
  VG1: {
    header: 'YFF4106 Yrkesfaglig fordypning Vg1',
    hours: 168
  },
  VG2: {
    header: 'YFF4209 Yrkesfaglig fordypning Vg2',
    hours: 253
  }
}

function generateKompetansebevis (maal) {
  const sorted = maal.reduce((prev, curr) => {
    const id = generateId(`${curr.utdanningsprogram} - ${curr.programomrade}`)
    if (!Object.prototype.hasOwnProperty.call(prev, id)) {
      prev[id] = {
        name: curr.programomrade,
        maal: []
      }
    }

    // Filter away maal that already exists.
    const existingMaal = prev[id].maal.find(item => item.name === curr.kompetanseMaal && item.omrade === curr.programomrade)
    if (!existingMaal || existingMaal.length === 0) {
      prev[id].maal.push({
        name: curr.kompetanseMaal,
        omrade: curr.programomrade,
        oppgaver: curr.arbeidsOppgaver
      })
    }
    return prev
  }, {})
  const data = Object.values(sorted)
  return data
}

module.exports = data => {
  const filtered = data.reduce((prev, current) => {
    if (Object.prototype.hasOwnProperty.call(prev, current.studentId)) {
      prev[current.studentId] = prev[current.studentId].skjemaUtfyllingStop < current.skjemaUtfyllingStop ? current : prev[current.studentId]
    } else {
      prev[current.studentId] = current
    }
    return prev
  }, {})
  const raw = Object.values(filtered)
  const students = raw.map(student => Object.assign({}, classCodes[student.classLevel], {
    userId: student.studentUserName,
    name: student.studentName,
    classLevel: student.classLevel,
    utdanningsprogram: student.utdanningsprogram,
    data: generateKompetansebevis(student.lokalPlanMaal)
  }))

  return students
}
