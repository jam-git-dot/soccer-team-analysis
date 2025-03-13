import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  ReferenceLine
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface ReferenceLineConfig {
  value: number;
  label?: string;
  color?: string;
  dashed?: boolean;
}

export interface LineChartProps {
  /**
   * Data for the chart
   * Each item must have the keys specified in dataKeys
   */
  data: Record<string, any>[];
  
  /**
   * Keys from the data objects to be displayed as lines
   * Each dataKey will be rendered as a separate line with its own color
   */
  dataKeys: {
    key: string;
    name: string;
    color: string;
    strokeWidth?: number;
    dot?: boolean | React.ReactNode;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter' | 'natural' | 'basis';
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
   * Custom formatter for the X-axis ticks
   */
  xAxisTickFormatter?: (value: any) => string;
  
  /**
   * Custom formatter for the tooltip
   */
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string];
  
  /**
   * Custom tooltip component
   */
  CustomTooltip?: React.FC<TooltipProps<ValueType, NameType>>;
  
  /**
   * Whether to connect null data points
   */
  connectNulls?: boolean;
  
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
   * Class name for the container
   */
  className?: string;
  
  /**
   * Reference lines for the Y-axis
   */
  yReferenceLines?: ReferenceLineConfig[];
  
  /**
   * Reference lines for the X-axis
   */
  xReferenceLines?: ReferenceLineConfig[];
}

/**
 * Reusable line chart component based on Recharts
 */
const LineChart: React.FC<LineChartProps> = ({
  data,
  dataKeys,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  yAxisDomain,
  yAxisTickFormatter,
  xAxisTickFormatter,
  tooltipFormatter,
  CustomTooltip,
  connectNulls = true,
  showGrid = true,
  showLegend = true,
  height = 400,
  width = '100%',
  className = '',
  yReferenceLines = [],
  xReferenceLines = [],
}) => {
  // Apply default Y-axis domain if not provided
  const domain = yAxisDomain || ['auto', 'auto'];
  
  // Use either the custom tooltip component or the default one
  const tooltipContent = CustomTooltip ? (
    <Tooltip content={<CustomTooltip />} />
  ) : (
    <Tooltip formatter={tooltipFormatter} />
  );
  
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          
          <XAxis 
            dataKey={xAxisKey} 
            tickFormatter={xAxisTickFormatter}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          
          <YAxis 
            domain={domain} 
            tickFormatter={yAxisTickFormatter}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          
          {tooltipContent}
          
          {showLegend && <Legend />}
          
          {/* Add Y-axis reference lines */}
          {yReferenceLines.map((refLine, index) => (
            <ReferenceLine
              key={`y-ref-${index}`}
              y={refLine.value}
              stroke={refLine.color || '#666'}
              strokeDasharray={refLine.dashed ? '3 3' : undefined}
              label={refLine.label}
            />
          ))}
          
          {/* Add X-axis reference lines */}
          {xReferenceLines.map((refLine, index) => (
            <ReferenceLine
              key={`x-ref-${index}`}
              x={refLine.value}
              stroke={refLine.color || '#666'}
              strokeDasharray={refLine.dashed ? '3 3' : undefined}
              label={refLine.label}
            />
          ))}
          
          {/* Create a line for each data key */}
          {dataKeys.map((dataKey) => (
            <Line
              key={dataKey.key}
              type={dataKey.type || 'monotone'}
              dataKey={dataKey.key}
              name={dataKey.name}
              stroke={dataKey.color}
              strokeWidth={dataKey.strokeWidth || 2}
              dot={dataKey.dot !== undefined ? dataKey.dot : true}
              activeDot={{ r: 8 }}
              connectNulls={connectNulls}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;