import * as React from "react";
import PickerColumn from "./PickerColumn";
import "./Picker.scss";

export interface PickerProps {
  optionGroups: { seconds: number[]; [index: string]: number[] };
  valueGroups: { seconds: number; [index: string]: number };
  itemHeight: number;
  height: number;
  onChange(option: string, value: number): void;
  onClick(option: string, value: number): void;
}

export default (props: PickerProps) => {
  const style = {
    height: props.height
  };
  const {
    optionGroups,
    valueGroups,
    itemHeight,
    height,
    onChange,
    onClick
  } = props;
  const highlightStyle = {
    height: itemHeight,
    marginTop: -(itemHeight / 2)
  };
  const columnNodes = [];
  for (let name in optionGroups) {
    columnNodes.push(
      <PickerColumn
        key={name}
        name={name}
        options={optionGroups[name]}
        value={valueGroups[name]}
        itemHeight={itemHeight}
        columnHeight={height}
        onChange={onChange}
        onClick={onClick}
      />
    );
  }
  return (
    <div className="picker-container" style={style}>
      <div className="picker-inner">
        {columnNodes}
        <div className="picker-highlight" style={highlightStyle} />
      </div>
    </div>
  );
};
