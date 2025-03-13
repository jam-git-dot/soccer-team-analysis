import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
  TooltipProps
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface RadarChartProps {
  /**
   * Data for the chart
   * Each item must have a 'name' property and the keys specified in dataKeys
   */
  data: Record<string, any>[];
  
  /**
   * Keys from the data objects to be displayed as radar areas
   * Each dataKey will be rendered as a separate radar area with its own color
   */
  dataKeys: {
    key: string;
    name: string;
    color: string;
    fillOpacity?: number;
  }[];
  
  /**
   * Name key for the categories (points on the radar)
   */
  nameKey?: string;
  
  /**
   * Domain for the radius axis
   */
  radiusAxisDomain?: [number, number];
  
  /**
   * Custom formatter for the tooltip
   */
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string];
  
  /**
   * Custom tooltip component
   */
  CustomTooltip?: React.FC<TooltipProps<ValueType, NameType>>;
  
  /**
   * Whether to show the legend
   */
  showLegend?: boolean;
  
  /**
   * Whether to show the outer grid
   */
  showOuterGrid?: boolean;
  
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
   * Custom tick formatter for the angle axis
   */
  angleAxisTickFormatter?: (value: string) => string;
  
  /**
   * Custom tick formatter for the radius axis
   */
  radiusAxisTickFormatter?: (value: number) => string;
}

/**
 * Reusable radar chart component based on Recharts
 * Perfect for visualizing play style metrics across multiple categories
 */
const RadarChart: React.FC<RadarChartProps> = ({
  data,
  dataKeys,
  nameKey = 'name',
  radiusAxisDomain = [0, 100],
  tooltipFormatter,
  CustomTooltip,
  showLegend = true,
  showOuterGrid = true,
  height = 400,
  width = '100%',
  className = '',
  angleAxisTickFormatter,
  radiusAxisTickFormatter,
}) => {
  // Use either the custom tooltip component or the default one
  const tooltipContent = CustomTooltip ? (
    <Tooltip content={<CustomTooltip />} />
  ) : (
    <Tooltip formatter={tooltipFormatter} />
  );
  
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsRadarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          {/* Show grid circles from center to outer edge */}
          <PolarGrid gridType={showOuterGrid ? "circle" : "polygon"} />
          
          {/* The categories around the perimeter */}
          <PolarAngleAxis
            dataKey={nameKey}
            tickFormatter={angleAxisTickFormatter}
          />
          
          {/* The scale from center to edge */}
          <PolarRadiusAxis
            angle={90}
            domain={radiusAxisDomain}
            tickFormatter={radiusAxisTickFormatter}
          />
          
          {/* Show tooltips on hover */}
          {tooltipContent}
          
          {/* Add legend if enabled */}
          {showLegend && <Legend />}
          
          {/* Create a radar area for each data key */}
          {dataKeys.map((dataKey) => (
            <Radar
              key={dataKey.key}
              name={dataKey.name}
              dataKey={dataKey.key}
              stroke={dataKey.color}
              fill={dataKey.color}
              fillOpacity={dataKey.fillOpacity || 0.6}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;