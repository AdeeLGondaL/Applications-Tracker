import { motion } from "framer-motion";

export function ProgressCard({ progress, submitted, total }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-600">Submission progress</span>
        <span className="text-xs font-black text-slate-900">{progress}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
        <motion.div
          className="h-full rounded-full bg-slate-950"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        />
      </div>
      <p className="mt-2.5 text-[10px] leading-4 text-slate-400">
        {submitted} of {total} reached submitted or further.
      </p>
    </div>
  );
}
