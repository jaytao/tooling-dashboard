import type { UtilityDefinition } from '../types';
import { TimestampConverter } from './TimestampConverter';

export const timestampConverter: UtilityDefinition = {
  id: 'timestamp-converter',
  name: 'Timestamp Converter',
  description: 'Convert between Unix timestamps and human-readable dates',
  component: TimestampConverter,
  group: 'Timestamp',
};
