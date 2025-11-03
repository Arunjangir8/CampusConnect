const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        role: userData.role.toUpperCase()
      }
    });
  }

  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  static async findByVerificationToken(token) {
    return await prisma.user.findFirst({
      where: { verificationToken: token }
    });
  }

  static async updateById(id, data) {
    return await prisma.user.update({
      where: { id },
      data
    });
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;