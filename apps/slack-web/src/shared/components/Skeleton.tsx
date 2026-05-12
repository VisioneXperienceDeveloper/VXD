import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'pulse' | 'shine';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'shine',
}) => {
  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
  };

  const variantClass = variant === 'pulse' ? styles.pulse : styles.skeleton;

  return (
    <div 
      className={`${variantClass} ${className}`} 
      style={style}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
