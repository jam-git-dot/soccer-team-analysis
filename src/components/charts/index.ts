/**
 * Export all chart components from a central location
 * This allows importing chart components with a simpler syntax:
 * import { BarChart, LineChart, RadarChart } from '@/components/charts';
 */

export { default as BarChart } from './BarChart';
export { default as LineChart } from './LineChart';
export { default as RadarChart } from './RadarChart';
export { default as ChartContainer } from './ChartContainer';

/**
 * Also export interface types for components
 * This allows for proper type checking when using chart components
 */
export type { BarChartProps } from './BarChart';
export type { LineChartProps, ReferenceLineConfig } from './LineChart';
export type { RadarChartProps } from './RadarChart';
export type { ChartContainerProps } from './ChartContainer';