package com.yb.SyncERPal.model;

public class ItemImportResult {

    private final int importedCount;
    private final int skippedCount;

    public ItemImportResult(
            int importedCount,
            int skippedCount
    ) {
        this.importedCount = importedCount;
        this.skippedCount = skippedCount;
    }

    public int getImportedCount() {
        return importedCount;
    }

    public int getSkippedCount() {
        return skippedCount;
    }
}
