import { Settings, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface HeaderProps {
  isSentencesVisible: boolean;
  progressPercentage: number;
  progressText: string;
  onSettingsClick: () => void;
  onListIconHover: () => void;
}

export const Header = ({
  isSentencesVisible,
  progressPercentage,
  progressText,
  onSettingsClick,
  onListIconHover,
}: HeaderProps) => {
  return (
    <header className={`fixed top-0 left-0 w-full transition-all duration-300 z-30 ${isSentencesVisible ? 'right-80' : 'right-0'}`}>
      <div className="bg-card border-b border-border p-4 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">English Dictation Training</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={onSettingsClick}
              >
                <Settings className="h-5 w-5" />
              </Button>
              {/* List Icon Button - Show when sentences list is hidden */}
              {!isSentencesVisible && (
                <Button
                  variant="outline"
                  size="icon"
                  className="transition-opacity duration-300"
                  onMouseEnter={onListIconHover}
                >
                  <List className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2">
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Progress</span>
              <span>{progressText}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};