
export function Card({ className = "", children, variant = "default", ...props }) {
  const variants = {
    default: "rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800",
    elevated: "rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800",
    outlined: "rounded-lg border border-gray-200 dark:border-gray-700",
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
