import React from 'react';

export interface MacroMetric {
  key: string;
  title: string;
  value: string;
  percentage: string | number | undefined;
  badgeClassName?: string;
}

interface MacroMetricsProps {
  metrics: readonly MacroMetric[];
  containerClassName?: string;
  itemClassName: string;
  titleClassName?: string;
  valueClassName: string;
  percentageClassName: string;
  titleTag?: 'div' | 'h3' | 'span';
  showTitleBadges?: boolean;
}

const MacroMetrics: React.FC<MacroMetricsProps> = ({
  metrics,
  containerClassName,
  itemClassName,
  titleClassName,
  valueClassName,
  percentageClassName,
  titleTag = 'div',
  showTitleBadges = false,
}) => {
  const TitleTag = titleTag;

  const content = metrics.map((metric) => (
    <div key={metric.key} className={itemClassName}>
      <TitleTag className={titleClassName}>
        {showTitleBadges && metric.badgeClassName && (
          <span className={metric.badgeClassName} style={{ marginRight: '5px' }}></span>
        )}
        {metric.title}
      </TitleTag>
      <div className={valueClassName}>{metric.value}</div>
      <div className={percentageClassName}>{`${String(metric.percentage)}%`}</div>
    </div>
  ));

  if (!containerClassName) {
    return <>{content}</>;
  }

  return <div className={containerClassName}>{content}</div>;
};

export default MacroMetrics;
