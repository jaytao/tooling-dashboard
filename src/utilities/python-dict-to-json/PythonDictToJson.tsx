import { useMemo, useState } from 'react';
import { CopyButton } from '../../components/CopyButton';
import { parsePythonLiteral } from './pythonLiteral';

const SAMPLE_INPUT =
  "{'name': 'Ada Lovelace', 'born': 1815, 'active': True, 'partner': None, 'tags': ('mathematician', 'writer')}";

export function PythonDictToJson() {
  const [input, setInput] = useState(SAMPLE_INPUT);

  const { output, error } = useMemo(() => {
    if (input.trim() === '') {
      return { output: '', error: null as string | null };
    }
    try {
      const parsed = parsePythonLiteral(input);
      return { output: JSON.stringify(parsed, null, 2), error: null as string | null };
    } catch (err) {
      return { output: '', error: (err as Error).message };
    }
  }, [input]);

  return (
    <div className="utility python-dict-to-json">
      <header className="utility-header">
        <h2>Python Dict to JSON</h2>
        <p>
          Convert the output of <code>print(some_dict)</code> (or <code>repr(...)</code>) into valid
          JSON.
        </p>
      </header>

      <section className="utility-section">
        <label className="field-label" htmlFor="python-dict-input">
          Python dict
        </label>
        <textarea
          id="python-dict-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />
      </section>

      <section className="utility-section">
        <span className="field-label">JSON output</span>
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
