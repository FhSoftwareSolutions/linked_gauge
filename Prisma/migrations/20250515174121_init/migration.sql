-- CreateTable
CREATE TABLE "Leitura" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pulsos" INTEGER NOT NULL,
    "mm_de_chuva" REAL NOT NULL,
    "dataRecebida" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
