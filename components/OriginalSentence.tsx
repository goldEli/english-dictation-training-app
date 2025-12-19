import { useState, useCallback } from 'react';
import useDictationStore from '@/src/store/dictationStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface OriginalSentenceProps {
  isSentencesVisible: boolean;
  currentSentence: string;
}

export const OriginalSentence = ({ isSentencesVisible, currentSentence }: OriginalSentenceProps) => {
  const { addSentence } = useDictationStore();
  const [selectedText, setSelectedText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle text selection
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const text = selection.toString().trim();
      if (text) {
        setSelectedText(text);
        setIsModalOpen(true);
      }
    }
  }, []);

  // Handle confirm action
  const handleConfirm = useCallback(() => {
    if (selectedText) {
      addSentence(selectedText);
      setSelectedText('');
      setIsModalOpen(false);
    }
  }, [selectedText, addSentence]);

  // Handle cancel action
  const handleCancel = useCallback(() => {
    setSelectedText('');
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <div 
        className={`fixed bottom-0 left-0 bg-card border-t border-border p-4 shadow-lg z-10 transition-all duration-300 ${isSentencesVisible ? 'right-80' : 'right-0'}`}
        onMouseUp={handleSelectionChange}
      >
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          Original Sentence
        </h3>
        <p className="text-lg font-medium">{currentSentence}</p>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add to Sentence List?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to add the selected text to your sentence list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">"{selectedText}"</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};