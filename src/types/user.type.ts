import { z } from "zod";

export const userSchema = z.object({
    id: z.string().min(1),
    email: z.email(),
    createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
