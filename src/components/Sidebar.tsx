import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { utilities } from '../utilities/registry';
import type { UtilityDefinition } from '../utilities/types';
import './Sidebar.css';

interface UtilityGroup {
  name: string | undefined;
  items: UtilityDefinition[];
}

function groupUtilities(): UtilityGroup[] {
  const groups: UtilityGroup[] = [];
  for (const utility of utilities) {
    const last = groups[groups.length - 1];
    if (last && last.name === utility.group) {
      last.items.push(utility);
    } else {
      groups.push({ name: utility.group, items: [utility] });
    }
  }
  return groups;
}

const groups = groupUtilities();

function UtilityLink({ utility }: { utility: UtilityDefinition }) {
  return (
    <li>
      <NavLink
        to={`/${utility.id}`}
        className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}
      >
        {utility.name}
      </NavLink>
    </li>
  );
}

export function Sidebar() {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-title">Dev Toolbox</div>
      <ul className="sidebar-list">
        {groups.map((group) => {
          if (!group.name) {
            return group.items.map((utility) => <UtilityLink key={utility.id} utility={utility} />);
          }

          const collapsed = collapsedGroups.has(group.name);
          return (
            <li key={group.name} className="sidebar-group">
              <button
                type="button"
                className="sidebar-group-header"
                aria-expanded={!collapsed}
                onClick={() => toggleGroup(group.name!)}
              >
                <span className={`chevron${collapsed ? ' collapsed' : ''}`} aria-hidden="true" />
                {group.name}
              </button>
              {!collapsed && (
                <ul className="sidebar-sublist">
                  {group.items.map((utility) => (
                    <UtilityLink key={utility.id} utility={utility} />
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
