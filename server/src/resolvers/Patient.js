function records(parent, args, context) {
    return context.prisma.patient({ id: parent.id }).records()
  }
  
  function prescriptions(parent, args, context) {
    return context.prisma.patient({ id: parent.id }).prescriptions()
  }

  function insurance(parent, args, context) {
    return context.prisma.patient({ id: parent.id }).insurance()
  }
  
  module.exports = {
    prescriptions,
    records,
    insurance
  }