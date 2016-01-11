import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import multireducerBind from './multireducerBind';

function getDisplayName(Comp) {
  return Comp.displayName || Comp.name || 'Component';
}

export default function connectMultireducer(mapStateToProps, actions = {}) {
  return DecoratedComponent => {
    class ConnectMultireducer extends Component {
      static displayName = `ConnectMultireducer(${getDisplayName(DecoratedComponent)})`;
      static propTypes = {
        multireducerKey: PropTypes.string.isRequired
      };

      componentWillMount() {
        this.generateConnectedComponent(this.props);
      }

      componentWillReceiveProps(nextProps) {
        if (this.props.multireducerKey !== nextProps.multireducerKey) {
          this.generateConnectedComponent(nextProps);
        }
      }
      static DecoratedComponent = DecoratedComponent;

      generateConnectedComponent({multireducerKey}) {
        const doStatePropsDependOnOwnProps = mapStateToProps.length !== 1
        let finalMapStateToProps;
        if (doStatePropsDependOnOwnProps) {
          finalMapStateToProps = (state, ownProps) => mapStateToProps(multireducerKey, state, ownProps)
        } else {
          finalMapStateToProps = (state) => mapStateToProps(multireducerKey, state)
        }
        this.ConnectedComponent =
          connect(
            finalMapStateToProps,
            multireducerBind(actions, multireducerKey)
          )(DecoratedComponent);
      }

      render() {
        const {multireducerKey, ...props} = this.props;
        const {ConnectedComponent} = this;
        return <ConnectedComponent {...props}/>;
      }
    }
    return ConnectMultireducer;
  };
}
