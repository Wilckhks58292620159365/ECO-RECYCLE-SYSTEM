import jwt from 'jsonwebtoken';

// التأكد من وجود JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secure_secret_key_here';

export const generateToken = (payload: { id: number; role: string }) => {
  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '7d' } // استخدام قيمة ثابتة لتجنب مشاكل TypeScript
  );
};
