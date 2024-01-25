function diagnosis(parent, args, context) {
    return context.prisma.record({ id: parent.id }).diagnosis()
  }
  
  module.exports = {
    diagnosis
  }