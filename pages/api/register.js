import User from '../../models/user';
import dbConnect from '../../config/dbConnect';
import { JWT } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    dbConnect();

    try {
      const { name, email, password } = req.body;

      const user = await User.create({ name, email, password });
      res.status(201).json({ user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
}
