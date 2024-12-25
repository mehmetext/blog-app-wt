#!/bin/sh

# Database migration
npx prisma db push

# Seed the database
# npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

# Start the application
npm start 