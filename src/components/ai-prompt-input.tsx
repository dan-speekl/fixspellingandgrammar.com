import { ArrowRight, Bot, Check, ChevronDown, Paperclip } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { cn } from '@/lib/utils';
import { OpenAiLogo } from './icons/openai-logo';

type Props = {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  uploadFileAllowed?: boolean;
};

export function AiPromptInput({
  prompt,
  onPromptChange,
  onSubmit,
  placeholder,
  uploadFileAllowed,
}: Props) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 72,
    maxHeight: 220,
  });
  const [selectedModel, setSelectedModel] = useState('GPT-5');

  const AI_MODELS = ['GPT-5'];

  const MODEL_ICONS: Record<string, React.ReactNode> = {
    'GPT-5': <OpenAiLogo className="w-5 h-5" />,
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
      onPromptChange('');
      adjustHeight(true);
    }
  };

  return (
    <div className="py-4">
      <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1.5 pt-4">
        <div className="flex items-center gap-2 mb-2.5 mx-2">
          <div className="flex-1 flex items-center gap-2">
            <h3 className="text-black dark:text-white/90 text-xs tracking-tighter"></h3>
          </div>
          <p className="text-black dark:text-white/90 text-xs tracking-tighter"></p>
        </div>
        <div className="relative">
          <div className="relative flex flex-col">
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              <Textarea
                id="ai-input-15"
                value={prompt}
                placeholder={placeholder}
                className={cn(
                  'w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0',
                  'min-h-[72px]',
                )}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  onPromptChange(e.target.value);
                  adjustHeight();
                }}
              />
            </div>

            <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md dark:text-white hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedModel}
                            initial={{
                              opacity: 0,
                              y: -5,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: 5,
                            }}
                            transition={{
                              duration: 0.15,
                            }}
                            className="flex items-center gap-1"
                          >
                            {MODEL_ICONS[selectedModel]}
                            {selectedModel}
                            <ChevronDown className="w-3 h-3 opacity-50" />
                          </motion.div>
                        </AnimatePresence>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={cn(
                        'min-w-[10rem]',
                        'border-black/10 dark:border-white/10',
                        'bg-gradient-to-b from-white via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800',
                      )}
                    >
                      {AI_MODELS.map((model) => (
                        <DropdownMenuItem
                          key={model}
                          onSelect={() => setSelectedModel(model)}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2">
                            {MODEL_ICONS[model] || (
                              <Bot className="w-4 h-4 opacity-50" />
                            )}{' '}
                            {/* Use mapped SVG or fallback */}
                            <span>{model}</span>
                          </div>
                          {selectedModel === model && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />
                  {uploadFileAllowed ? (
                    <label
                      className={cn(
                        'rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer',
                        'hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500',
                        'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white',
                      )}
                      aria-label="Attach file"
                    >
                      <input type="file" className="hidden" />
                      <Paperclip className="w-4 h-4 transition-colors" />
                    </label>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={cn(
                    'rounded-lg p-2 bg-black/5 dark:bg-white/5',
                    'hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500',
                  )}
                  aria-label="Fix Text"
                  disabled={!prompt.trim()}
                  onClick={onSubmit}
                >
                  <ArrowRight
                    className={cn(
                      'w-4 h-4 dark:text-white transition-opacity duration-200',
                      prompt.trim() ? 'opacity-100' : 'opacity-30',
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
