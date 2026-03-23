import { twMerge } from 'tailwind-merge';

export const Input = ({ label, id, className, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label htmlFor={id} className="text-sm text-gray-400 font-medium">{label}</label>}
      <input
        id={id}
        className={twMerge(
          "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neonCyan focus:ring-1 focus:ring-neonCyan transition-all duration-300",
          className
        )}
        {...props}
      />
    </div>
  );
};
