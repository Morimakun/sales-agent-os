-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "priceMin" INTEGER NOT NULL DEFAULT 0,
    "priceMax" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "target" TEXT NOT NULL DEFAULT '',
    "deliverables" TEXT NOT NULL DEFAULT '',
    "salesAngle" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceType" TEXT NOT NULL DEFAULT 'other',
    "sourceName" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "rawText" TEXT NOT NULL DEFAULT '',
    "companyName" TEXT NOT NULL DEFAULT '',
    "personName" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "budgetHint" TEXT NOT NULL DEFAULT '',
    "candidateType" TEXT NOT NULL DEFAULT 'z',
    "referrerName" TEXT NOT NULL DEFAULT '',
    "painPoints" TEXT NOT NULL DEFAULT '',
    "tools" TEXT NOT NULL DEFAULT '',
    "temperature" TEXT NOT NULL DEFAULT 'medium',
    "fitScore" INTEGER,
    "priority" TEXT NOT NULL DEFAULT 'unknown',
    "status" TEXT NOT NULL DEFAULT 'new',
    "painHypothesis" TEXT NOT NULL DEFAULT '',
    "offerHypothesis" TEXT NOT NULL DEFAULT '',
    "recommendedOffer" TEXT NOT NULL DEFAULT '',
    "reason" TEXT NOT NULL DEFAULT '',
    "nextAction" TEXT NOT NULL DEFAULT '',
    "nextActionAt" DATETIME,
    "memo" TEXT NOT NULL DEFAULT '',
    "doNotContact" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OutreachDraft" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "model" TEXT NOT NULL DEFAULT '',
    "promptVersion" TEXT NOT NULL DEFAULT '',
    "riskLevel" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutreachDraft_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL DEFAULT '',
    "contactName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "contactFormUrl" TEXT NOT NULL DEFAULT '',
    "industry" TEXT NOT NULL DEFAULT '',
    "area" TEXT NOT NULL DEFAULT '',
    "source" TEXT NOT NULL DEFAULT '',
    "memo" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'new',
    "priority" TEXT NOT NULL DEFAULT 'unknown',
    "score" INTEGER,
    "painHypothesis" TEXT NOT NULL DEFAULT '',
    "offerHypothesis" TEXT NOT NULL DEFAULT '',
    "lastContactedAt" DATETIME,
    "nextActionAt" DATETIME,
    "doNotContact" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AiOutput" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT NOT NULL DEFAULT '',
    "promptVersion" TEXT NOT NULL DEFAULT '',
    "riskLevel" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiOutput_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "OutreachDraft_opportunityId_idx" ON "OutreachDraft"("opportunityId");

-- CreateIndex
CREATE INDEX "AiOutput_leadId_idx" ON "AiOutput"("leadId");

-- CreateIndex
CREATE INDEX "Activity_leadId_idx" ON "Activity"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");
