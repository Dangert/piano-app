import React from 'react';
import Dimensions from 'react-dimensions';

class DimensionsProvider extends React.Component {
  render() {
    const { containerWidth, containerHeight } = this.props;
    return (
      <div>
        {this.props.children({
          containerWidth: containerWidth,
          containerHeight: containerHeight,
        })}
      </div>
    );
  }
}

export default Dimensions()(DimensionsProvider);
