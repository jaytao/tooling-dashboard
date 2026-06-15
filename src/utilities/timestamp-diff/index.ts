import type { UtilityDefinition } from '../types';
import { TimestampDiff } from './TimestampDiff';

export const timestampDiff: UtilityDefinition = {
  id: 'timestamp-diff',
  name: 'Timestamp Diff',
  description: 'Calculate the difference between two timestamps or dates',
  component: TimestampDiff,
  group: 'Timestamp',
};
