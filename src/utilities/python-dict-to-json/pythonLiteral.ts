/**
 * Parses a Python literal (as produced by `print(some_dict)` /
 * `repr(some_dict)`) into a JSON-compatible JS value. Supports dicts, lists,
 * tuples, strings (single or double quoted, with escapes), numbers, and the
 * `True` / `False` / `None` constants. Tuples and sets are treated as arrays.
 */

type Token =
  | { type: 'punct'; value: string }
  | { type: 'string'; value: string }
  | { type: 'number'; value: number }
  | { type: 'name'; value: string };

const ESCAPES: Record<string, string> = {
  n: '\n',
  t: '\t',
  r: '\r',
  b: '\b',
  f: '\f',
  '\\': '\\',
  "'": "'",
  '"': '"',
};

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const n = input.length;
  let i = 0;

  while (i < n) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if ('{}[]():,'.includes(ch)) {
      tokens.push({ type: 'punct', value: ch });
      i++;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let value = '';
      i++;
      while (i < n && input[i] !== quote) {
        if (input[i] === '\\' && i + 1 < n) {
          const escaped = ESCAPES[input[i + 1]] ?? input[i + 1];
          value += escaped;
          i += 2;
          continue;
        }
        value += input[i];
        i++;
      }
      if (i >= n) {
        throw new Error('Unterminated string literal');
      }
      i++; // closing quote
      tokens.push({ type: 'string', value });
      continue;
    }

    if (/[-+0-9.]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[0-9.]/.test(input[j])) j++;
      if (j < n && (input[j] === 'e' || input[j] === 'E')) {
        let k = j + 1;
        if (input[k] === '+' || input[k] === '-') k++;
        if (/[0-9]/.test(input[k])) {
          j = k;
          while (j < n && /[0-9]/.test(input[j])) j++;
        }
      }
      const text = input.slice(i, j);
      const value = Number(text);
      if (Number.isNaN(value)) {
        throw new Error(`Invalid number literal '${text}'`);
      }
      tokens.push({ type: 'number', value });
      i = j;
      continue;
    }

    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(input[j])) j++;
      tokens.push({ type: 'name', value: input.slice(i, j) });
      i = j;
      continue;
    }

    throw new Error(`Unexpected character '${ch}' at position ${i}`);
  }

  return tokens;
}

class Parser {
  private pos = 0;

  constructor(private tokens: Token[]) {}

  parse(): unknown {
    const value = this.parseValue();
    if (this.pos < this.tokens.length) {
      throw new Error('Unexpected trailing content after value');
    }
    return value;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token {
    const token = this.tokens[this.pos];
    if (!token) throw new Error('Unexpected end of input');
    this.pos++;
    return token;
  }

  private isPunct(token: Token | undefined, value: string): boolean {
    return !!token && token.type === 'punct' && token.value === value;
  }

  private parseValue(): unknown {
    const token = this.peek();
    if (!token) throw new Error('Unexpected end of input');

    if (token.type === 'string') {
      this.pos++;
      return token.value;
    }
    if (token.type === 'number') {
      this.pos++;
      return token.value;
    }
    if (token.type === 'name') {
      this.pos++;
      switch (token.value) {
        case 'True':
          return true;
        case 'False':
          return false;
        case 'None':
          return null;
        default:
          throw new Error(`Unsupported identifier '${token.value}'`);
      }
    }
    if (this.isPunct(token, '{')) return this.parseObject();
    if (this.isPunct(token, '[')) return this.parseSequence(']');
    if (this.isPunct(token, '(')) return this.parseSequence(')');

    throw new Error(`Unexpected token '${token.value}'`);
  }

  private parseObject(): Record<string, unknown> {
    this.pos++; // '{'
    const result: Record<string, unknown> = {};

    if (this.isPunct(this.peek(), '}')) {
      this.pos++;
      return result;
    }

    while (true) {
      const key = this.parseValue();
      const colon = this.next();
      if (!this.isPunct(colon, ':')) {
        throw new Error("Expected ':' in dict entry");
      }
      const value = this.parseValue();
      result[typeof key === 'string' ? key : JSON.stringify(key)] = value;

      const separator = this.next();
      if (this.isPunct(separator, ',')) {
        if (this.isPunct(this.peek(), '}')) {
          this.pos++;
          break;
        }
        continue;
      }
      if (this.isPunct(separator, '}')) break;
      throw new Error("Expected ',' or '}' in dict");
    }

    return result;
  }

  private parseSequence(closing: string): unknown[] {
    this.pos++; // opening bracket
    const result: unknown[] = [];

    if (this.isPunct(this.peek(), closing)) {
      this.pos++;
      return result;
    }

    while (true) {
      result.push(this.parseValue());

      const separator = this.next();
      if (this.isPunct(separator, ',')) {
        if (this.isPunct(this.peek(), closing)) {
          this.pos++;
          break;
        }
        continue;
      }
      if (this.isPunct(separator, closing)) break;
      throw new Error(`Expected ',' or '${closing}'`);
    }

    return result;
  }
}

export function parsePythonLiteral(input: string): unknown {
  const tokens = tokenize(input);
  if (tokens.length === 0) {
    throw new Error('Empty input');
  }
  return new Parser(tokens).parse();
}
