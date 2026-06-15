import type { UtilityDefinition } from './types';
import { timestampConverter } from './timestamp-converter';
import { timestampDiff } from './timestamp-diff';
import { jsonFormatter } from './json-formatter';
import { jsonToYaml } from './json-to-yaml';
import { pythonDictToJson } from './python-dict-to-json';

/**
 * Add new utilities here to make them available in the sidebar and routable
 * in the main area. Each entry must have a unique `id`, which is also used
 * as the route path (e.g. "/timestamp-converter"). Utilities sharing a
 * `group` and listed consecutively are clustered under a collapsible
 * section in the sidebar.
 */
export const utilities: UtilityDefinition[] = [
  timestampConverter,
  timestampDiff,
  jsonFormatter,
  jsonToYaml,
  pythonDictToJson,
];
