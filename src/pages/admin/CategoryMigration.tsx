import { useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getCategoryMapping } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const CategoryMigrationTool = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    updated: number;
    skipped: number;
    errors: number;
    logs: string[];
  } | null>(null);

  const runMigration = async () => {
    setIsRunning(true);
    setResults(null);

    const logs: string[] = [];
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    try {
      logs.push('Starting migration...');
      const propertiesRef = collection(db, 'properties');
      const snapshot = await getDocs(propertiesRef);
      const total = snapshot.docs.length;

      logs.push(`Found ${total} properties`);

      for (const propertyDoc of snapshot.docs) {
        const propertyId = propertyDoc.id;
        const propertyData = propertyDoc.data();

        // Check if already migrated
        if (propertyData.mainCategory && propertyData.categorySlug) {
          logs.push(`⏭️ Skipped ${propertyId} - already migrated`);
          skipped++;
          continue;
        }

        try {
          const category = propertyData.category;

          if (!category) {
            logs.push(`❌ Property ${propertyId} has no category field`);
            errors++;
            continue;
          }

          const mapping = getCategoryMapping(category);

          // Update the property
          await updateDoc(doc(db, 'properties', propertyId), {
            categorySlug: mapping.categorySlug,
            mainCategory: mapping.mainCategory,
            listingType: mapping.listingType,
          });

          logs.push(`✅ Updated ${propertyId}: ${category} → ${mapping.mainCategory}/${mapping.categorySlug}`);
          updated++;

        } catch (error: any) {
          logs.push(`❌ Error updating ${propertyId}: ${error.message}`);
          errors++;
        }
      }

      logs.push('');
      logs.push('=== Migration Complete ===');
      logs.push(`Total: ${total}, Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`);

      setResults({ total, updated, skipped, errors, logs });

    } catch (error: any) {
      logs.push(`❌ Migration failed: ${error.message}`);
      setResults({ total: 0, updated: 0, skipped: 0, errors: 1, logs });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Category Migration Tool</CardTitle>
          <CardDescription>
            This tool adds mainCategory and categorySlug fields to existing properties.
            Run this ONCE after deploying the category filtering system.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This migration will update all properties in the database.
              Make sure you have a backup before proceeding.
            </AlertDescription>
          </Alert>

          <Button
            onClick={runMigration}
            disabled={isRunning}
            className="w-full"
            size="lg"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running Migration...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Run Migration
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-4 mt-6">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{results.total}</div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{results.updated}</div>
                      <div className="text-sm text-gray-600">Updated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{results.skipped}</div>
                      <div className="text-sm text-gray-600">Skipped</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">{results.errors}</div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Migration Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
                    {results.logs.map((log, index) => (
                      <div key={index} className="py-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryMigrationTool;
