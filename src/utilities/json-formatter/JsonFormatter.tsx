import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/CopyButton';

const SAMPLE_INPUT = '{"name":"Ada Lovelace","born":1815,"tags":["mathematician","writer"]}';

const INDENT_OPTIONS = [
  { id: '2', label: '2 spaces', space: 2 },
  { id: '4', label: '4 spaces', space: 4 },
  { id: 'tab', label: 'Tab', space: '\t' },
  { id: 'minify', label: 'Minify', space: undefined },
] as const;

type IndentId = (typeof INDENT_OPTIONS)[number]['id'];

export function JsonFormatter() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [indentId, setIndentId] = useState<IndentId>('2');

  const { output, error } = useMemo(() => {
    if (input.trim() === '') {
      return { output: '', error: null as string | null };
    }
    try {
      const parsed = JSON.parse(input);
      const space = INDENT_OPTIONS.find((option) => option.id === indentId)?.space;
      return { output: JSON.stringify(parsed, null, space), error: null as string | null };
    } catch (err) {
      return { output: '', error: (err as Error).message };
    }
  }, [input, indentId]);

  return (
    <div className="utility json-formatter">
      <header className="utility-header">
        <h2>JSON Formatter</h2>
        <p>Pretty-print or minify JSON.</p>
      </header>

      <section className="utility-section">
        <label className="field-label" htmlFor="json-formatter-input">
          Input
        </label>
        <textarea
          id="json-formatter-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />
      </section>

      <section className="utility-section">
        <div className="field-row">
          <span className="field-label">Indent</span>
          <div className="unit-toggle" role="group" aria-label="Indent size">
            {INDENT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={indentId === option.id ? 'active' : ''}
                onClick={() => setIndentId(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="output-panel">
            <CopyButton text={output} />
            <pre>{output}</pre>
          </div>
        )}
      </section>
    </div>
  );
}
