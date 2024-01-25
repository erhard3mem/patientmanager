function diagnosis(parent, args, context) {
    return context.prisma.prescription({ id: parent.id }).diagnosis()
  }
  function medication(parent, args, context) {
    return context.prisma.prescription({ id: parent.id }).medication()
  }
  
  
  module.exports = {
    diagnosis,
    medication
  }