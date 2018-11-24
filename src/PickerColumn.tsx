import * as React from "react";
import PickerItem from "./PickerItem";
import "./PickerColumn.scss";

export interface PickerColumnProps {
  options: number[];
  name: string;
  value: number;
  itemHeight: number;
  columnHeight: number;
  onChange(option: string, value: number): void;
  onClick(option: string, value: number): void;
}

interface PickerColumnState {
  isMoving: boolean;
  startTouchY: number;
  startScrollerTranslate: number;
  scrollerTranslate: number;
  minTranslate: number;
  maxTranslate: number;
}

class PickerColumn extends React.Component<
  PickerColumnProps,
  PickerColumnState
> {
  private touchY: number = 0;
  constructor(props: PickerColumnProps) {
    super(props);

    this.state = {
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      ...this.computeTranslate(props)
    };
  }

  public componentWillReceiveProps(nextProps: PickerColumnProps) {
    if (this.state.isMoving) {
      return;
    }
    this.setState(this.computeTranslate(nextProps));
  }

  public render() {
    const translateString = `translate3d(0, ${
      this.state.scrollerTranslate
    }px, 0)`;
    const style = {
      MsTransform: translateString,
      MozTransform: translateString,
      OTransform: translateString,
      WebkitTransform: translateString,
      transform: translateString,
      transitionDuration: "600ms" // 300 is the default value
    };
    // if (this.state.isMoving) {
    //   style.transitionDuration = "0ms";
    // }
    const items = this.props.options.map(option => {
      return (
        <PickerItem
          key={option}
          itemHeight={this.props.itemHeight}
          onClick={this.handleItemClick}
          option={option}
          value={this.props.value}
        />
      );
    });
    return (
      <div className="picker-column">
        <div
          className="picker-scroller"
          style={style}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onTouchCancel={this.handleTouchCancel}
        >
          {items}
        </div>
      </div>
    );
  }

  private computeTranslate = (props: PickerColumnProps) => {
    const { options, value, itemHeight, columnHeight } = props;
    let selectedIndex = options.indexOf(value);
    if (selectedIndex < 0) {
      // throw new ReferenceError();
      console.warn(
        'Warning: "' +
          this.props.name +
          '" doesn\'t contain an option of "' +
          value +
          '".'
      );
      this.onValueSelected(options[0]);
      selectedIndex = 0;
    }

    return {
      scrollerTranslate:
        columnHeight / 2 - itemHeight / 2 - selectedIndex * itemHeight,
      minTranslate:
        columnHeight / 2 - itemHeight * options.length + itemHeight / 2,
      maxTranslate: columnHeight / 2 - itemHeight / 2
    };
  };

  private onValueSelected = (newValue: number) => {
    this.props.onChange(this.props.name, newValue);
  };

  private handleTouchStart = (event: any) => {
    console.log("handleTouchStart");
    const startTouchY = event.targetTouches[0].pageY;
    console.log(`startTouchY: ${startTouchY}`);
    this.setState(({ scrollerTranslate }) => ({
      startTouchY,
      startScrollerTranslate: scrollerTranslate,
      isMoving: true
    }));
  };

  handleTouchMove = (event: any) => {
    this.touchY = event.targetTouches[0].pageY;
  };

  handleTouchEnd = (event: any) => {
    if (!this.state.isMoving) {
      return;
    }

    this.setState(
      (prevState: PickerColumnState) => {
        let nextScrollerTranslate =
          prevState.startScrollerTranslate +
          this.touchY -
          prevState.startTouchY;
        return {
          scrollerTranslate: nextScrollerTranslate,
          isMoving: false,
          startTouchY: 0,
          startScrollerTranslate: 0
        };
      },
      () => {
        const { options, itemHeight } = this.props;
        const { scrollerTranslate, minTranslate, maxTranslate } = this.state;
        let activeIndex;
        if (scrollerTranslate > maxTranslate) {
          activeIndex = 0;
        } else if (scrollerTranslate < minTranslate) {
          activeIndex = options.length - 1;
        } else {
          activeIndex = -Math.floor(
            (scrollerTranslate - maxTranslate) / itemHeight
          );
        }
        this.onValueSelected(options[activeIndex]);
      }
    );
  };

  handleTouchCancel = (event: any) => {
    console.log("handleTouchCancel");
    if (!this.state.isMoving) {
      return;
    }
    this.setState(prevProps => ({
      isMoving: false,
      startTouchY: 0,
      startScrollerTranslate: 0,
      scrollerTranslate: prevProps.startScrollerTranslate,
      maxTranslate: prevProps.maxTranslate,
      minTranslate: prevProps.minTranslate
    }));
  };

  handleItemClick = (option: any) => {
    if (option !== this.props.value) {
      this.onValueSelected(option);
    } else {
      this.props.onClick(this.props.name, this.props.value);
    }
  };
}

export default PickerColumn;
