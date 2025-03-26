import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

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
  showLabels = true,
  labelClass = '',
  connectNulls = true,
}) => {
  // Apply category colors to data points
  const colorizedData = data.map(item => {
    // Get color based on category
    const category = item.category;
    let color = '#666';
    if (colorMap && category && colorMap[category]) {
      color = colorMap[category].color;
    }
    
    return {
      ...item,
      color
    };
  });
  
  // Custom renderer for PolarAngleAxis ticks
  const renderCustomAxisTick = (props: any) => {
    const { x, y, cx, cy, payload } = props;
    
    // Find the matching data item by name
    const dataItem = colorizedData.find(item => item.name === payload.value);
    if (!dataItem) return null;
    
    // Calculate the angle and radius for positioning
    const radius = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) * 1.15;
    const angle = Math.atan2(y - cy, x - cx);
    
    // Calculate the position with adjusted radius
    const nx = cx + radius * Math.cos(angle);
    const ny = cy + radius * Math.sin(angle);
    
    // Determine text anchor based on angle
    let textAnchor = 'middle';
    const angleDeg = angle * (180 / Math.PI);
    
    if (angleDeg > -45 && angleDeg < 45) {
      textAnchor = 'start';  // Right side
    } else if (angleDeg > 135 || angleDeg < -135) {
      textAnchor = 'end';    // Left side
    }
    
    return (
      <g>
        <text
          x={nx}
          y={ny}
          textAnchor={textAnchor}
          dominantBaseline="central"
          fill={dataItem.color}
          className={labelClass}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {payload.value}
        </text>
      </g>
    );
  };
  
  return (
    <div className={`w-full ${className}`}>
      <ResponsiveContainer width={width} height={height}>
        <RechartsRadarChart
          data={colorizedData}
          margin={{
            top: 50,
            right: 50,
            left: 50,
            bottom: 50,
          }}
        >
          {/* Show grid circles from center to outer edge */}
          <PolarGrid 
            gridType={showOuterGrid ? "circle" : "polygon"} 
            radialLines={true} 
            gridCount={gridCount} 
          />
          
          {/* Category labels around the perimeter */}
          {showLabels && (
            <PolarAngleAxis 
              dataKey="name"
              tick={renderCustomAxisTick}
              tickLine={false}
            />
          )}
          
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
              dot={colorByPoint ? 
                (props) => <CustomDot {...props} size={dotSize} /> : 
                { r: dotSize, fill: '#fff', stroke: dataKey.color }
              }
              activeDot={{ r: dotSize * 1.5, fill: '#fff', stroke: dataKey.color, strokeWidth: 2 }}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;