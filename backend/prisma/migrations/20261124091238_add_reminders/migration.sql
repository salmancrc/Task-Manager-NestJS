-- CreateEnum
CREATE TYPE "ReminderType" AS ENUM ('DUE_SOON', 'OVERDUE');

-- CreateTable
CREATE TABLE "Reminder" (
    "id" SERIAL NOT NULL,
    "type" "ReminderType" NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_userId_readAt_createdAt_idx" ON "Reminder"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Reminder_taskId_key" ON "Reminder"("taskId");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
