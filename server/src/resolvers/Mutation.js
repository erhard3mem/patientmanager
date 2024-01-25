const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function newPatient(parent, args, context, info) {
  const userId = getUserId(context)
  if(!userId) throw new Error('Not authenticated')
  return await context.prisma.createPatient({
    fName: args.fName,
    lName: args.lName,
    bDate: args.bDate,
    sex: args.sex,
    insurance: { connect: { id: args.insuranceId } }
  })
}

function newMedication(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createMedication({
    name: args.name
  })
}

function newMedicationCompany(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createMedicationCompany({
    name: args.name
  })
}

function newDiagnosis(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createDiagnosis({
    name: args.name
  })
}

function newInsurance(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createInsurance({
    name: args.name
  })
}

function newPrescription(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createPrescription({
    patient: { connect: { id : args.patientId } },
    medication: { connect: { id : args.medicationId } },
    diagnosis: { connect: { id : args.diagnosisId } },
    dosis: args.dosis
  })
}

function newRecord(parent, args, context, info) {
  const userId = getUserId(context)
  return context.prisma.createRecord({
    patient: { connect: { id : args.patientId } },
    diagnosis: { connect: { id : args.diagnosisId } },
    date: args.date,
    details: args.details,
    discharged: args.discharged
  })
}

function discharge(parent, args, context, info) {
  const userId = getUserId(context)  
  return context.prisma.updateRecord({    
    data: { discharged: args.discharged },
    where: { id: args.recordId }
  })
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}


module.exports = {
  newPatient,
  newMedication,
  newDiagnosis,
  newPrescription,
  newRecord,  
  discharge,
  signup,
  login,
  newInsurance
}