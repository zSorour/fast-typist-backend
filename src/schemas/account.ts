import z from 'zod';

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Username must not be empty.' })
    .min(3, 'Username must be at least 3 characters long.')
    .max(20, 'Username must be at most 20 characters long.'),
  password: z
    .string({ required_error: 'Password must not be empty' })
    .min(8, 'Password must be at least 8 characters long.')
});

export const registerSchema = z.object(loginSchema.shape).extend({
  email: z
    .string({ required_error: 'Email must not be empty.' })
    .email({ message: 'Email must be a valid email address.' })
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
