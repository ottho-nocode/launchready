'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TextEditorProps {
  label: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  multiline?: boolean;
  placeholder?: string;
}

export function TextEditor({
  label,
  value,
  maxLength,
  onChange,
  onRegenerate,
  isRegenerating = false,
  multiline = false,
  placeholder,
}: TextEditorProps) {
  const [copied, setCopied] = useState(false);

  const charCount = value.length;
  const isOverLimit = charCount > maxLength;
  const percentage = Math.min((charCount / maxLength) * 100, 100);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className={cn('space-y-2', isRegenerating && 'opacity-70')}>
      <div className="flex items-center justify-between">
        <Label htmlFor={label}>{label}</Label>
        <div className="flex items-center gap-1">
          {onRegenerate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="h-7 px-2 text-xs"
            >
              {isRegenerating ? (
                <>
                  <span className="mr-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Regenerating...
                </>
              ) : (
                'Regenerate'
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={isRegenerating}
            className="h-7 px-2 text-xs"
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <InputComponent
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={isRegenerating}
        className={cn(
          multiline && 'min-h-[120px] resize-y',
          isOverLimit && 'border-destructive focus-visible:ring-destructive'
        )}
      />

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full transition-all',
                isOverLimit ? 'bg-destructive' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <span
          className={cn(
            'tabular-nums',
            isOverLimit ? 'font-medium text-destructive' : 'text-muted-foreground'
          )}
        >
          {charCount} / {maxLength}
        </span>
      </div>
    </div>
  );
}
