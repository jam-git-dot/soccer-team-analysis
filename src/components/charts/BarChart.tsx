import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  LabelList
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface BarChartProps {
  /**
   * Data for the chart
   * Each item must have the keys specified in dataKeys
   */
  data: Record<string, any>[];
  
  /**
   * Keys from the data objects to be displayed as bars
   * Each dataKey will be rendered as a separate bar with its own color
   */
  dataKeys: {
    key: string;
    name: string;
    color: string;
  }[];
  
  /**
   * Key for the X-axis categories
   */
  xAxisKey: string;
  
  /**
   * Label for the X-axis
   */
  xAxisLabel?: string;
  
  /**
   * Label for the Y-axis
   */
  yAxisLabel?: string;
  
  /**
   * Domain for the Y-axis
   */
  yAxisDomain?: [number, number];
  
  /**
   * Custom formatter for the Y-axis ticks
   */
  yAxisTickFormatter?: (value: any) => string;
  
  /**
   * Custom formatter for the tooltip
   */
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string];
  
  /**
   * Custom tooltip component
   */
  CustomTooltip?: React.FC<TooltipProps<ValueType, NameType>>;
  
  /**
   * Whether to stack the bars
   */
  stacked?: boolean;
  
  /**
   * Whether to show the grid lines
   */
  showGrid?: boolean;
  
  /**
   * Whether to show the legend
   */
  showLegend?: boolean;
  
  /**
   * Height of the chart
   */
  height?: number;
  
  /**
   * Width of the chart
   */
  width?: number | string;
  
  /**
   * Whether to show data labels on the bars
   */
  showDataLabels?: boolean;
  
  /**
   * Layout of the chart (vertical or horizontal)
   */
  layout?: 'vertical' | 'horizontal';
  
  /**
   * Class name for the container
   */
  className?: string;
}

/**
 * Reusable bar chart component based on Recharts
 */
const BarChart: React.FC<BarChartProps> = ({
  data,
  dataKeys,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  yAxisDomain,
  yAxisTickFormatter,
  tooltipFormatter,
  CustomTooltip,
  stacked = false,
  showGrid = true,
  showLegend = true,
  height = 400,
  width = '100%',
  showDataLabels = false,
  layout = 'horizontal',
  className = '',
}) => {
  // Apply default Y-axis domain if not provided
  const domain = yAxisDomain || ['auto', 'auto'];
  
  // Use either the custom tooltip component or the default one
  const tooltipContent = CustomTooltip ? (
    <Tooltip content={<CustomTooltip />} />
  ) : (
    <Tooltip formatter={tooltipFormatter} />
  );
  
  const isVertical = layout === 'vertical';
  
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          
          {isVertical ? (
            <>
              <XAxis 
                type="number" 
                domain={domain} 
                tickFormatter={yAxisTickFormatter}
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis 
                dataKey={xAxisKey} 
                type="category" 
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey={xAxisKey} 
                label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
              />
              <YAxis 
                domain={domain} 
                tickFormatter={yAxisTickFormatter}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              />
            </>
          )}
          
          {tooltipContent}
          
          {showLegend && <Legend />}
          
          {dataKeys.map((dataKey) => (
            <Bar
              key={dataKey.key}
              dataKey={dataKey.key}
              name={dataKey.name}
              fill={dataKey.color}
              stackId={stacked ? 'a' : undefined}
            >
              {showDataLabels && (
                <LabelList
                  dataKey={dataKey.key}
                  position={isVertical ? 'right' : 'top'}
                  formatter={yAxisTickFormatter}
                />
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;