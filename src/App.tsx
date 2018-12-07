import React from "react";
import "./App.scss";
import Picker from "./Picker";

export interface AppProps {}
interface AppState {
  seconds: number;
  valueGroups: { seconds: number; minutes: number; [index: string]: number };
  optionGroups: {
    seconds: number[];
    minutes: number[];
    [index: string]: number[];
  };
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    const seconds = [];
    for (let i = 0; i < 60; i++) {
      seconds.push(i);
    }
    const optionGroups = { seconds, minutes: seconds, hours: seconds };
    const valueGroups = { seconds: 0, minutes: 0, hours: 0 };

    this.state = {
      seconds: 0,
      valueGroups,
      optionGroups
    };
  }

  public render() {
    const { optionGroups, valueGroups } = this.state;

    return (
      <div className="app-container">
        <Picker
          optionGroups={optionGroups}
          valueGroups={valueGroups}
          onChange={this.handleChange}
          height={216}
          itemHeight={36}
          onClick={this.handleClick}
        />
      </div>
    );
  }

  private handleChange = (option: string, value: number) => {
    this.setState(({ valueGroups }) => {
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
}

export default App;
