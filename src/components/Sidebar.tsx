import React, { useContext } from 'react';
import { Users, Briefcase, CheckSquare, LayoutDashboard, Bug, Code, Database } from 'lucide-react';
import { UserContext } from '../App';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { role } = useContext(UserContext);

  const getMenuItems = () => {
    const baseItems = [
      { icon: LayoutDashboard, name: 'Dashboard', active: true },
    ];

    switch (role) {
      case 'admin':
        return [
          ...baseItems,
          { icon: Users, name: 'Clients' },
          { icon: Briefcase, name: 'Projects' },
          { icon: CheckSquare, name: 'Tasks' },
        ];
      case 'qa':
        return [
          ...baseItems,
          { icon: Bug, name: 'Test Cases' },
          { icon: CheckSquare, name: 'Issues' },
        ];
      case 'developer':
        return [
          ...baseItems,
          { icon: Code, name: 'My Tasks' },
          { icon: Database, name: 'Projects' },
        ];
      default:
        return baseItems;
    }
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 bg-white border-r border-gray-200 lg:block w-64 h-screen`}
    >
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {getMenuItems().map((item) => (
            <li key={item.name}>
              <a
                href="#"
                className={`flex items-center p-2 rounded-lg ${
                  item.active
                    ? 'text-white bg-indigo-600 hover:bg-indigo-700'
                    : 'text-gray-900 hover:bg-gray-100'
                }`}
              >
                <item.icon className={`w-6 h-6 ${item.active ? 'text-white' : 'text-gray-500'}`} />
                <span className="ml-3">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;