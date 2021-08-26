const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({ rejectOnNotFound: true })

module.exports = prisma