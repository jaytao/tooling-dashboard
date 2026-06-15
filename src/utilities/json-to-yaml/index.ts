import type { UtilityDefinition } from '../types';
import { JsonToYaml } from './JsonToYaml';

export const jsonToYaml: UtilityDefinition = {
  id: 'json-to-yaml',
  name: 'JSON to YAML',
  description: 'Convert JSON into YAML',
  component: JsonToYaml,
  group: 'JSON',
};
