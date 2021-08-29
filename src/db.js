const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ rejectOnNotFound: false, log: ['query', 'info', 'warn'] })

module.exports = prisma