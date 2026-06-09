-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Opportunity" (
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
    "sentAt" DATETIME,
    "sentChannel" TEXT NOT NULL DEFAULT '',
    "sentTo" TEXT NOT NULL DEFAULT '',
    "sentUrl" TEXT NOT NULL DEFAULT '',
    "sentMessage" TEXT NOT NULL DEFAULT '',
    "replyStatus" TEXT NOT NULL DEFAULT 'none',
    "lastReplyAt" DATETIME,
    "replySummary" TEXT NOT NULL DEFAULT '',
    "replyBody" TEXT NOT NULL DEFAULT '',
    "nextActionDate" DATETIME,
    "lpSourceId" TEXT NOT NULL DEFAULT '',
    "lpUrl" TEXT NOT NULL DEFAULT '',
    "lpVisited" BOOLEAN NOT NULL DEFAULT false,
    "lpFormSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "difyOpened" BOOLEAN NOT NULL DEFAULT false,
    "memo" TEXT NOT NULL DEFAULT '',
    "doNotContact" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Opportunity" ("budgetHint", "candidateType", "companyName", "createdAt", "doNotContact", "fitScore", "id", "industry", "memo", "nextAction", "nextActionAt", "offerHypothesis", "painHypothesis", "painPoints", "personName", "priority", "rawText", "reason", "recommendedOffer", "referrerName", "sourceName", "sourceType", "status", "temperature", "tools", "updatedAt", "url") SELECT "budgetHint", "candidateType", "companyName", "createdAt", "doNotContact", "fitScore", "id", "industry", "memo", "nextAction", "nextActionAt", "offerHypothesis", "painHypothesis", "painPoints", "personName", "priority", "rawText", "reason", "recommendedOffer", "referrerName", "sourceName", "sourceType", "status", "temperature", "tools", "updatedAt", "url" FROM "Opportunity";
DROP TABLE "Opportunity";
ALTER TABLE "new_Opportunity" RENAME TO "Opportunity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
