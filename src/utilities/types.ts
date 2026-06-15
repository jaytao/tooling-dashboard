import type { ComponentType } from 'react';

export interface UtilityDefinition {
  /** Unique identifier, also used as the route path (e.g. "timestamp-converter") */
  id: string;
  /** Display name shown in the sidebar and page header */
  name: string;
  /** Short description shown in the page header */
  description: string;
  /** Component rendered in the main area when this utility is selected */
  component: ComponentType;
  /** Optional group name used to cluster related utilities in the sidebar */
  group?: string;
}
