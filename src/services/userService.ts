import  User  from '../models/User';

export const userService = {
  async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  },

  async findById(id: string) {
    return await User.findByPk(id);
  },

  async create(data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: 'user' | 'admin';
  }) {
    const user = await User.create({
      email: data.email,
      password: data.password,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: data.role || 'user',
    });
    return user;
  },

  async getAllUsers() {
    return await User.findAll();
  },

  async deactivateUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) return null;
    user.active = false;
    await user.save();
    return user;
  },

  async activateUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) return null;
    user.active = true;
    await user.save();
    return user;
  }
};
