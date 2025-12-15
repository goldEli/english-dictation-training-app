'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import useDictationStore from '@/src/store/dictationStore';

export default function SentenceManagement() {
  const router = useRouter();
  const {
    sentences,
    addSentence,
    updateSentence,
    deleteSentence,
    deleteAllSentences,
    importSentences,
  } = useDictationStore();

  const [newSentence, setNewSentence] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleAddSentence = () => {
    if (newSentence.trim()) {
      addSentence(newSentence);
      setNewSentence('');
    }
  };

  const handleEditStart = (index: number, sentence: string) => {
    setEditIndex(index);
    setEditValue(sentence);
  };

  const handleEditSave = () => {
    if (editIndex !== null && editValue.trim()) {
      updateSentence(editIndex, editValue);
      setEditIndex(null);
      setEditValue('');
    }
  };

  const handleEditCancel = () => {
    setEditIndex(null);
    setEditValue('');
  };

  const handleBatchImport = () => {
    try {
      setIsImporting(true);
      const parsed = JSON.parse(batchInput);
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
        importSentences(parsed);
        setBatchInput('');
      } else {
        throw new Error('Invalid format. Please provide a JSON array of strings.');
      }
    } catch (error) {
      console.error('Failed to import sentences:', error);
      alert('Failed to import sentences. Please check the format.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Training
          </Button>
          <h1 className="text-3xl font-bold">Sentence Management</h1>
          <div className="w-24" />
        </div>

        {/* Add New Sentence */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Sentence</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a new sentence..."
              value={newSentence}
              onChange={(e) => setNewSentence(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSentence()}
              className="flex-1"
            />
            <Button onClick={handleAddSentence}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </Card>

        {/* Batch Import */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Batch Import Sentences</h2>
          <Textarea
            placeholder='Paste a JSON array of strings, e.g., ["sentence 1", "sentence 2"]'
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            rows={4}
            className="mb-4"
          />
          <Button
            onClick={handleBatchImport}
            disabled={isImporting}
            className="gap-2"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </Card>

        {/* Sentence List */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Sentences ({sentences.length})</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all sentences. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAllSentences}>
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {sentences.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No sentences available. Add a new sentence above.
            </div>
          ) : (
            <div className="space-y-3">
              {sentences.map((sentence, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md bg-secondary">
                  {editIndex === index ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                        className="flex-1"
                        autoFocus
                      />
                      <Button size="sm" onClick={handleEditSave}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 truncate whitespace-nowrap overflow-hidden">
                        {sentence}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditStart(index, sentence)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSentence(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}