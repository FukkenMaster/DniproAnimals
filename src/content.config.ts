import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Колекція «animals» — профілі котів.
 * Кожен кіт — це один файл у src/content/animals/*.md
 * Поля описані нижче; якщо поле заповнене неправильно, збірка сайту
 * підкаже, що саме треба виправити.
 */
const animals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/animals' }),
  schema: z.object({
    name: z.string(),
    sex: z.enum(['male', 'female']),
    ageMonths: z.number().int().min(0).max(360),
    breed: z.string(),
    status: z.enum(['available', 'reserved', 'adopted']),
    photos: z.array(z.string()).min(1),
    traits: z.array(z.string()).default([]),
    summary: z.string(),
    intakeDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { animals };
