import type { UtilityDefinition } from '../types';
import { PythonDictToJson } from './PythonDictToJson';

export const pythonDictToJson: UtilityDefinition = {
  id: 'python-dict-to-json',
  name: 'Python Dict to JSON',
  description: 'Convert the output of print(dict) into valid JSON',
  component: PythonDictToJson,
  group: 'JSON',
};
