import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = true,
}: SkeletonProps) {
  const baseClasses = 'bg-neutral-200';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  if (animation) {
    return (
      <motion.div
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={style}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function ProfileViewSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Skeleton width={80} height={32} />
            <div className="flex items-center gap-3">
              <Skeleton width={100} height={40} />
              <Skeleton width={120} height={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-6">
          <Skeleton width={200} height={48} className="rounded-full" />
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50 border-b border-neutral-100 px-8 py-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <Skeleton variant="circular" width={128} height={128} />
              </div>
              <Skeleton width={200} height={32} className="mx-auto mb-2" />
              <Skeleton width={150} height={24} className="mx-auto mb-4" />
              <Skeleton width={300} height={20} className="mx-auto" />
            </div>
          </div>

          <div className="px-6 py-8 space-y-8">
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-6">
              <Skeleton width={120} height={24} className="mb-3" />
              <Skeleton height={20} className="mb-2" />
              <Skeleton height={20} className="mb-2" />
              <Skeleton width="70%" height={20} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton height={80} />
              <Skeleton height={80} />
            </div>

            <Skeleton height={200} />

            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton height={80} />
              <Skeleton height={80} />
            </div>

            <div className="flex justify-center gap-4">
              <Skeleton variant="circular" width={48} height={48} />
              <Skeleton variant="circular" width={48} height={48} />
              <Skeleton variant="circular" width={48} height={48} />
            </div>

            <div className="flex justify-center">
              <Skeleton width={250} height={56} className="rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
