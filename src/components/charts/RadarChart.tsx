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
  TooltipProps,
  Dot
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
   * Domain for the radius axis
   */
  radiusAxisDomain?: [number, number];
  
  /**
   * Custom formatter for the tooltip
   */
  tooltipFormatter?: (value: any, name: string, props: any) => [string, string];
  
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
   * Custom tick formatter for the radius axis
   */
  radiusAxisTickFormatter?: (value: number) => string;
  
  /**
   * Whether to color points by categories
   */
  colorByPoint?: boolean;
  
  /**
   * Size of the dots
   */
  dotSize?: number;
  
  /**
   * Number of grid circles
   */
  gridCount?: number;
  
  /**
   * Map of categories to colors
   */
  colorMap?: Record<string, any>;
  
  /**
   * Whether to show labels
   */
  showLabels?: boolean;
  
  /**
   * CSS class for labels
   */
  labelClass?: string;
  
  /**
   * Whether to connect null values
   */
  connectNulls?: boolean;
}

/**
 * Custom dot component for radar chart
 */
const CustomDot = (props: any) => {
  const { cx, cy, payload, color, size = 5 } = props;
  
  // Use point color if available, otherwise use default
  const dotColor = payload?.color || color || '#8884d8';
  
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={size} 
      fill={dotColor}
      stroke="#fff"
      strokeWidth={1}
    />
  );
};

/**
 * Custom label component for radar chart
 */
const CustomLabel = (props: any) => {
  const { 
    viewBox, 
    value, 
    index, 
    payload, 
    className = '', 
    colorMap
  } = props;
  
  const { cx, cy } = viewBox;
  if (!payload) return null;
  
  // Get text alignment based on position
  // We need to position text differently based on the angle to avoid overlapping
  const angle = (index / props.dataLength) * 360;
  let textAnchor = 'middle';
  let dx = 0;
  let dy = 0;
  
  if (angle <= 45 || angle > 315) {
    // Top
    textAnchor = 'middle';
    dy = -10;
  } else if (angle > 45 && angle <= 135) {
    // Right
    textAnchor = 'start';
    dx = 10;
  } else if (angle > 135 && angle <= 225) {
    // Bottom
    textAnchor = 'middle';
    dy = 15;
  } else if (angle > 225 && angle <= 315) {
    // Left
    textAnchor = 'end';
    dx = -10;
  }
  
  // Get color based on category
  let color = '#666';
  if (colorMap && payload.category && colorMap[payload.category]) {
    color = colorMap[payload.category].color;
  }
  
  return (
    <text
      x={cx}
      y={cy}
      dx={dx}
      dy={dy}
      textAnchor={textAnchor}
      fill={color}
      className={className}
      fontSize={12}
    >
      {value}
    </text>
  );
};

/**
 * Reusable radar chart component based on Recharts
 * Perfect for visualizing play style metrics across multiple categories
 */
const RadarChart: React.FC<RadarChartProps> = ({
  data,
  dataKeys,
  radiusAxisDomain = [0, 100],
  tooltipFormatter,
  showLegend = true,
  showOuterGrid = true,
  height = 400,
  width = '100%',
  className = '',
  radiusAxisTickFormatter,
  colorByPoint = false,
  dotSize = 5,
  gridCount = 5,
  colorMap = {},
  showLabels = false,
  labelClass = '',
  connectNulls = true,
}) => {
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsRadarChart
          data={data}
          margin={{
            top: 30,
            right: 30,
            left: 30,
            bottom: 30,
          }}
        >
          {/* Show grid circles from center to outer edge */}
          <PolarGrid gridType={showOuterGrid ? "circle" : "polygon"} radialLines={true} gridCount={gridCount} />
          
          {/* The categories around the perimeter */}
          <PolarAngleAxis 
            dataKey="name" 
            tick={false} // We'll use custom labels
            tickLine={false}
          />
          
          {/* Custom labels for metrics */}
          {showLabels && data.map((entry, index) => (
            <text
              key={`label-${index}`}
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="middle"
              className={labelClass}
              style={{
                transform: `translate(${Math.cos(((index / data.length) * 2 * Math.PI) - Math.PI/2) * (height/2 - 30) + height/2}px, ${Math.sin(((index / data.length) * 2 * Math.PI) - Math.PI/2) * (height/2 - 30) + height/2}px)`,
                fill: entry.color || '#666',
                fontSize: '12px'
              }}
            >
              {entry.name}
            </text>
          ))}
          
          {/* The scale from center to edge */}
          <PolarRadiusAxis 
            angle={90} 
            domain={radiusAxisDomain} 
            tickCount={5} 
            axisLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={radiusAxisTickFormatter}
          />
          
          {/* Show tooltips on hover */}
          <Tooltip formatter={tooltipFormatter} />
          
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
              connectNulls={connectNulls}
              dot={colorByPoint ? (props) => <CustomDot {...props} size={dotSize} /> : { r: dotSize }}
              activeDot={{ r: dotSize * 1.5, fill: '#fff', stroke: dataKey.color, strokeWidth: 2 }}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;