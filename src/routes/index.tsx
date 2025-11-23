import { experimental_useObject as useObject } from '@ai-sdk/react';
import { createFileRoute } from '@tanstack/react-router';
import { Check as CheckIcon, Copy as CopyIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { AiPromptInput } from '@/components/ai-prompt-input';
import { AITextLoading } from '@/components/ai-text-loading';
import { TextFieldFocusLinear } from '@/components/icons/text-field-focus-linear';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { fixedTextSchema } from '@/schemas/fixed-text-schema';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useLocalStorage('model', 'GPT-4o');

  const { object, submit, isLoading } = useObject({
    api: '/api/fix',
    schema: fixedTextSchema,
  });

  const fixedText = object?.fixedText ?? '';
  const explanation = object?.explanation ?? '';

  const canCopy = useMemo(() => !!fixedText.trim(), [fixedText]);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    if (!canCopy) return;

    try {
      await navigator.clipboard.writeText(fixedText);
      setCopied(true);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = fixedText;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background to-muted/20 ">
      <div className="fixed top-0 left-0 z-40 p-4 md:p-6">
        <ThemeToggle />
      </div>
      <header className="fixed top-0 right-0 z-40 p-4 md:p-6">
        <a
          href="https://danzabrotski.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          By Dan Zabrotski
        </a>
      </header>
      <main className="flex-1 px-4 md:px-6 pt-20 pb-44 flex items-start justify-center">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AITextLoading
                  interval={4000}
                  texts={[
                    'Reviewing grammar…',
                    'Polishing phrasing…',
                    'Fixing spelling…',
                    'Improving clarity…',
                    'Checking punctuation…',
                    'Refining tone…',
                    'Finalizing edits…',
                  ]}
                />
              </motion.div>
            ) : fixedText ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="rounded-2xl border border-border bg-gradient-to-br from-card via-card to-muted/20 backdrop-blur-sm shadow-lg"
              >
                <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border ">
                  <div className="flex items-center gap-2">
                    <TextFieldFocusLinear className="w-4 h-4 text-muted-foreground " />
                    <h2 className="text-sm font-semibold tracking-tight text-foreground ">
                      Corrected Text
                    </h2>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 transition-all"
                    onClick={handleCopy}
                    disabled={!canCopy}
                    aria-label={copied ? 'Copied' : 'Copy to clipboard'}
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2"
                        >
                          <CheckIcon className="w-4 h-4" />
                          Copied
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-center gap-2"
                        >
                          <CopyIcon className="w-4 h-4" />
                          Copy
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
                <div className="px-6 py-7">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="whitespace-pre-wrap leading-[1.75] text-base tracking-[-0.011em] text-foreground "
                  >
                    {fixedText}
                  </motion.div>
                  {explanation ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="mt-5 pt-5 border-t border-border "
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 w-1 h-1 rounded-full bg-muted-foreground/30 " />
                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                          {explanation}
                        </p>
                      </div>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/50 to-muted mb-5 shadow-inner">
                    <TextFieldFocusLinear className="w-7 h-7 text-muted-foreground " />
                  </div>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-xl font-semibold tracking-tight text-foreground  mb-2"
                >
                  Professional Grammar & Spelling Correction
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed"
                >
                  Are you tired of chat apps? Do you primarily use chat to fix
                  spelling and grammar in your text? Welcome to
                  fixspellingandgrammar.com! We fix spelling and grammar:
                  nothing more!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="pointer-events-none bg-gradient-to-t from-background via-background/95 to-transparent">
          <div className="px-4 pb-4 pt-12 flex justify-center">
            <div className="pointer-events-auto w-full max-w-3xl">
              <AiPromptInput
                prompt={text}
                onPromptChange={setText}
                onSubmit={() => {
                  const model = selectedModel.toLowerCase();
                  submit({ text, model });
                }}
                placeholder="Paste or type text to fix spelling and grammar..."
                selectedModel={selectedModel}
                onSelectedModelChange={setSelectedModel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
