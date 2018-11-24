import React from "react";
import "./App.scss";
import Picker from "./Picker";

export interface AppProps {}
interface AppState {
  seconds: number;
  isPickerVisible: boolean;
  valueGroups: { seconds: number; [index: string]: number };
  optionGroups: { seconds: number[]; [index: string]: number[] };
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    const seconds = [];
    for (let i = 0; i < 60; i++) {
      seconds.push(i);
    }
    const optionGroups = { seconds };
    const valueGroups = { seconds: 0 };

    this.state = {
      seconds: 0,
      isPickerVisible: false,
      valueGroups,
      optionGroups
    };
  }

  public render() {
    const { isPickerVisible, optionGroups, valueGroups } = this.state;

    const maskStyle = {
      display: isPickerVisible ? "block" : "none"
    };
    const pickerModalClass = `picker-modal${
      isPickerVisible ? " picker-modal-toggle" : ""
    }`;

    return (
      <div className="app-container">
        <div className="app-input" onClick={this.togglePicker}>
          {this.state.seconds}
        </div>
        <div className="picker-modal-container">
          <div
            className="picker-modal-mask"
            style={maskStyle}
            onClick={this.togglePicker}
          />
          <div className={pickerModalClass}>
            <header>
              <button onClick={this.togglePicker}>Done</button>
            </header>
            <Picker
              optionGroups={optionGroups}
              valueGroups={valueGroups}
              onChange={this.handleChange}
              height={216}
              itemHeight={36}
              onClick={this.handleClick}
            />
          </div>
        </div>
      </div>
    );
  }

  private handleChange = (option: string, value: number) => {
    this.setState(({ valueGroups, optionGroups }) => {
      const nextState = {
        valueGroups: {
          ...valueGroups,
          [option]: value
        },
        seconds: value
      };
      return nextState;
    });
  };

  private handleClick = (option: string, value: number) => {
    console.log(`CLICK: option: ${option}, value ${value}`);
  };

  private togglePicker = () => {
    this.setState(({ isPickerVisible }) => ({
      isPickerVisible: !isPickerVisible
    }));
  };
}

export default App;
