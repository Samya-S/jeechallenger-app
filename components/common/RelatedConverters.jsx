import Link from 'next/link';
import { Beaker, Calculator, Atom } from 'lucide-react';

const converters = {
  physics: {
    title: 'Physics Unit Converter',
    desc: 'Force, Energy, Pressure, and more',
    icon: Atom,
    href: '/physics/unit-converter',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800',
    textColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  chemistry: {
    title: 'Chemistry Unit Converter',
    desc: 'Molarity, Volume, Mass, and more',
    icon: Beaker,
    href: '/chemistry/unit-converter',
    hoverBg: 'hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-200 dark:hover:border-green-800',
    textColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30'
  },
  mathematics: {
    title: 'Mathematics Unit Converter',
    desc: 'Length, Area, Volume, Time',
    icon: Calculator,
    href: '/mathematics/unit-converter',
    hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800',
    textColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30'
  }
};

export default function RelatedConverters({ currentSubject }) {
  const others = Object.entries(converters).filter(([key]) => key !== currentSubject.toLowerCase());

  return (
    <div className="mt-12 pb-8">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px bg-gray-200 dark:bg-gray-700 w-16"></div>
        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Also Check Out</h3>
        <div className="h-px bg-gray-200 dark:bg-gray-700 w-16"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {others.map(([key, data]) => {
          const Icon = data.icon;
          return (
            <Link
              key={key}
              href={data.href}
              className={`group flex items-center p-5 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 ${data.hoverBg}`}
            >
              <div className={`p-4 rounded-2xl ${data.iconBg} mr-5 transition-transform group-hover:scale-110`}>
                <Icon className={`w-7 h-7 ${data.textColor}`} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{data.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{data.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
