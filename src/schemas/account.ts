import z from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20)
});

export const registerSchema = z.object(loginSchema.shape).extend({
  email: z.string().email()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
