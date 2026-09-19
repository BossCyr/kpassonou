interface StatusBadgeProps {
  status: 'safe' | 'warning' | 'alert';
}

const statusConfig = {
  safe: {
    label: 'Sûr',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    dotColor: 'bg-green-500',
  },
  warning: {
    label: 'Attention',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    dotColor: 'bg-yellow-500',
  },
  alert: {
    label: 'Alerte',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    dotColor: 'bg-red-500',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor} mr-1.5`}></span>
      {config.label}
    </span>
  );
}
