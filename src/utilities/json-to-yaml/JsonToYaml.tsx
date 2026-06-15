import { useMemo, useState } from 'react';
import { dump } from 'js-yaml';
import { CopyButton } from '../../components/CopyButton';

const SAMPLE_INPUT = '{"name":"Ada Lovelace","born":1815,"tags":["mathematician","writer"]}';

export function JsonToYaml() {
  const [input, setInput] = useState(SAMPLE_INPUT);

  const { output, error } = useMemo(() => {
    if (input.trim() === '') {
      return { output: '', error: null as string | null };
    }
    try {
      const parsed = JSON.parse(input);
      return { output: dump(parsed), error: null as string | null };
    } catch (err) {
      return { output: '', error: (err as Error).message };
    }
  }, [input]);

  return (
    <div className="utility json-to-yaml">
      <header className="utility-header">
        <h2>JSON to YAML</h2>
        <p>Convert JSON into YAML.</p>
      </header>

      <section className="utility-section">
        <label className="field-label" htmlFor="json-to-yaml-input">
          JSON input
        </label>
        <textarea
          id="json-to-yaml-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />
      </section>

      <section className="utility-section">
        <span className="field-label">YAML output</span>
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
