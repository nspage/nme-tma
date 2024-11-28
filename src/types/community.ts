import { z } from "zod"

export const memberSchema = z.object({
  id: z.string(),
  address: z.string(),
  displayName: z.string(),
  avatar: z.string().optional(),
  role: z.string(),
  joinedAt: z.string(),
  badges: z.array(z.string()),
  reputation: z.number(),
  groups: z.array(z.string()),
  socialLinks: z.object({
    twitter: z.string().optional(),
    telegram: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
  }),
})

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string(),
  memberCount: z.number(),
  isPrivate: z.boolean(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Member = z.infer<typeof memberSchema>
export type Group = z.infer<typeof groupSchema>
