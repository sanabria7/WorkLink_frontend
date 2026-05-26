import { Pie, PieChart, Sector, type PieSectorDataItem, Tooltip, type TooltipIndex } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import {  useState } from 'react';

interface propsData{
    name: string;
    value: number
}
type ActiveShapeProps = PieSectorDataItem & {totalReservas : number | undefined}
// #region Sample data

// #endregion
const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
  totalReservas
}: ActiveShapeProps) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={"#000"} style={{zIndex: "100"}}>
        {payload.name.length > 19 ?  (payload.name.substring(0,19)+"...") : payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{` ${value.toFixed(1)} %`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${(totalReservas ?? 1) * value /100} reservas de ${totalReservas}`}
      </text>
    </g>
  );
};

export default function CustomActivePieChart({
  data,
  totalReservas,
  setTitleService,
  isAnimationActive = true,
 
  
}: {
  data : propsData[] | undefined;
  totalReservas : number | undefined;
  setTitleService : React.Dispatch<React.SetStateAction<string>> | undefined
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}) {
    const [activeIndex, setActiveIndex] = useState(0);

  return (
    
    <PieChart
      style={{ width: '76%', maxWidth: '600px', maxHeight: '80vh', aspectRatio: 1 }}
      responsive
      margin={{
        top: 50,
        right: 120,
        bottom: 40,
        left: 120,
      }}
    >
      <Pie
        shape={(props : PieSectorDataItem & {index? : number}) =>
            props.index === activeIndex ?  renderActiveShape({...props, totalReservas  }) : <Sector {...props}/>
        }
        data={data}
        onMouseEnter={(_, index) => {
          setActiveIndex(index)
          setTitleService && data && setTitleService(data[index].name)
        }}
        cx="50%"
        cy="50%"
        innerRadius="60%"
        outerRadius="80%"
        fill="#60b5ff"
        dataKey="value"
        isAnimationActive={isAnimationActive}
      />
      <Tooltip content={() => null} defaultIndex={activeIndex} />
      <RechartsDevtools />
    </PieChart>
  );
}