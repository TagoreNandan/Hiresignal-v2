import { pgTable, serial, varchar, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';

export const applicationStatusEnum = pgEnum('application_status', ['applied', 'interviewing', 'offer', 'rejected']);

//PGEnum - only valid vals ares stored

//PGTable - defines table structure and types for drizzle
// serial is auto intcrementing

export const applications = pgTable('applications', {
    id: serial('id').primaryKey(),

    companyName: varchar('company_name', { length: 200 }).notNull(),

    role: varchar('role', { length: 200 }).notNull(),

    source: varchar('source', { length: 100 }),

    status: applicationStatusEnum('status').default('applied'),

    appliedDate: timestamp('applied_date').defaultNow(),

    userId: integer('user_id').notNull(),
});

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 200 }).notNull().unique(),
    createdAt: timestamp('created_at').defaultNow(),
});


//Entire code - defines DB schema for applications and users tables

//SAme as models.py but in typescript and with drizzle types

