const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function allPatients(parent, args, context) {
  const userId = getUserId(context)
  const patients = await context.prisma.patients()
  return patients
}

function allMedications(parent, args, context) {
  const userId = getUserId(context)
  const ms = context.prisma.medications()
  return ms
}

function allInsurances(parent, args, context) {
  const userId = getUserId(context)
  const ms = context.prisma.insurances()
  return ms
}

function allDiagnoses(parent, args, context) {
  const userId = getUserId(context)
  const ds = context.prisma.diagnoses()
  return ds
}

function searchDiagnoses(parent, args, context) {
  const userId = getUserId(context)
  const ds = context.prisma.diagnoses(
    { where: { name_contains: args.name }  
  })
  return ds
}

module.exports = {
  allPatients,
  allMedications,
  allDiagnoses,
  searchDiagnoses,
  allInsurances
}