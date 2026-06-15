import type { UtilityDefinition } from '../types';
import { JsonFormatter } from './JsonFormatter';

export const jsonFormatter: UtilityDefinition = {
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Pretty-print or minify JSON',
  component: JsonFormatter,
  group: 'JSON',
};
