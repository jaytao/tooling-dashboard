import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button type="button" className="copy-button" onClick={handleCopy} disabled={!text}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
